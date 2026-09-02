import 'server-only';

import type { Domain, Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { computeScores, LIKERT_NEUTRAL } from '@/lib/scoring';

export const TIMER_SECONDS = Number(process.env.NEXT_PUBLIC_QUESTION_TIMER_SECONDS ?? 20);

export type QuestionForClient = {
  id: string;
  position: number;
  leftStatement: string;
  rightStatement: string;
};

export type TestSessionState = {
  sessionId: string;
  timerSeconds: number;
  totalQuestions: number;
  answeredCount: number;
  questions: QuestionForClient[];
  /** Risposte già date, per questionId: permette di riprendere e correggere. */
  answers: Record<string, number>;
  /** Indice (0-based) del primo item senza risposta. */
  resumeIndex: number;
};

/**
 * Restituisce la sessione di test aperta dell'utente, creandone una nuova se
 * non esiste. È la funzione che rende possibile la ripresa del questionario:
 * lo stato vive nel database, non nel browser.
 */
export async function getOrCreateTestSession(userId: string): Promise<TestSessionState> {
  const questions = await prisma.question.findMany({
    where: { isActive: true },
    orderBy: { position: 'asc' },
    select: { id: true, position: true, leftStatement: true, rightStatement: true },
  });

  if (questions.length === 0) {
    throw new Error('Nessuna domanda attiva: esegui il seed del database (npm run db:seed).');
  }

  let session = await prisma.testSession.findFirst({
    where: { userId, status: 'IN_PROGRESS' },
    orderBy: { startedAt: 'desc' },
    include: { responses: { select: { questionId: true, value: true } } },
  });

  if (!session) {
    session = await prisma.testSession.create({
      data: {
        userId,
        totalQuestions: questions.length,
        timerSeconds: TIMER_SECONDS,
      },
      include: { responses: { select: { questionId: true, value: true } } },
    });
  }

  const answers: Record<string, number> = {};
  for (const r of session.responses) answers[r.questionId] = r.value;

  const resumeIndex = Math.min(
    questions.findIndex((q) => answers[q.id] === undefined) === -1
      ? questions.length - 1
      : questions.findIndex((q) => answers[q.id] === undefined),
    questions.length - 1,
  );

  return {
    sessionId: session.id,
    timerSeconds: session.timerSeconds,
    totalQuestions: questions.length,
    answeredCount: session.responses.length,
    questions,
    answers,
    resumeIndex,
  };
}

/**
 * Salva (o aggiorna) una risposta. Il salvataggio è per singolo item: se
 * l'utente chiude il browser, non perde nulla.
 */
export async function saveAnswer(params: {
  userId: string;
  testSessionId: string;
  questionId: string;
  value: number;
  timedOut: boolean;
  latencyMs?: number;
}): Promise<{ answeredCount: number }> {
  const { userId, testSessionId, questionId, value, timedOut, latencyMs } = params;

  // Verifica di proprietà: una sessione può essere scritta solo dal suo utente.
  const session = await prisma.testSession.findFirst({
    where: { id: testSessionId, userId },
    select: { id: true, status: true },
  });
  if (!session) throw new Error('Sessione di test non trovata.');
  if (session.status !== 'IN_PROGRESS') throw new Error('Questa sessione è già stata completata.');

  const question = await prisma.question.findFirst({
    where: { id: questionId, isActive: true },
    select: { id: true },
  });
  if (!question) throw new Error('Domanda non valida.');

  const storedValue = timedOut ? LIKERT_NEUTRAL : value;

  await prisma.response.upsert({
    where: { testSessionId_questionId: { testSessionId, questionId } },
    update: { value: storedValue, timedOut, latencyMs },
    create: { testSessionId, questionId, value: storedValue, timedOut, latencyMs },
  });

  const answeredCount = await prisma.response.count({ where: { testSessionId } });
  await prisma.testSession.update({
    where: { id: testSessionId },
    data: { answeredCount },
  });

  return { answeredCount };
}

/**
 * Chiude la sessione, esegue il motore di calcolo e persiste il risultato.
 * Idempotente: se il risultato esiste già, restituisce quello.
 */
export async function completeTest(params: {
  userId: string;
  testSessionId: string;
}): Promise<{ resultId: string }> {
  const { userId, testSessionId } = params;

  const session = await prisma.testSession.findFirst({
    where: { id: testSessionId, userId },
    include: {
      result: { select: { id: true } },
      responses: {
        include: {
          question: {
            select: {
              leftWeight: true,
              rightWeight: true,
              leftTheme: { select: { slug: true } },
              rightTheme: { select: { slug: true } },
            },
          },
        },
      },
    },
  });

  if (!session) throw new Error('Sessione di test non trovata.');
  if (session.result) return { resultId: session.result.id };

  if (session.responses.length < session.totalQuestions) {
    throw new Error(
      `Questionario incompleto: ${session.responses.length}/${session.totalQuestions} risposte.`,
    );
  }

  const themes = await prisma.talentTheme.findMany({ select: { id: true, slug: true, domain: true } });
  const themeDomains: Record<string, Domain> = {};
  const themeIdBySlug = new Map<string, string>();
  for (const t of themes) {
    themeDomains[t.slug] = t.domain;
    themeIdBySlug.set(t.slug, t.id);
  }

  const outcome = computeScores(
    session.responses.map((r) => ({
      value: r.value,
      timedOut: r.timedOut,
      leftThemeSlug: r.question.leftTheme.slug,
      rightThemeSlug: r.question.rightTheme.slug,
      leftWeight: r.question.leftWeight,
      rightWeight: r.question.rightWeight,
    })),
    themeDomains,
  );

  const completedAt = new Date();
  const durationSeconds = Math.round(
    (completedAt.getTime() - session.startedAt.getTime()) / 1000,
  );

  const result = await prisma.$transaction(async (tx) => {
    const created = await tx.testResult.create({
      data: {
        testSessionId: session.id,
        userId,
        executingScore: outcome.domainScores.EXECUTING,
        influencingScore: outcome.domainScores.INFLUENCING,
        relationshipScore: outcome.domainScores.RELATIONSHIP,
        strategicScore: outcome.domainScores.STRATEGIC,
        topThemeSlugs: outcome.topThemeSlugs,
        timeoutRatio: outcome.timeoutRatio,
        durationSeconds,
        themeScores: {
          create: outcome.themeScores.map((t) => ({
            themeId: themeIdBySlug.get(t.slug)!,
            rawScore: t.rawScore,
            normalizedScore: t.normalizedScore,
            rank: t.rank,
          })),
        },
      },
      select: { id: true },
    });

    await tx.testSession.update({
      where: { id: session.id },
      data: { status: 'COMPLETED', completedAt },
    });

    return created;
  });

  return { resultId: result.id };
}

const reportInclude = {
  themeScores: {
    include: { theme: true },
    orderBy: { rank: 'asc' },
  },
  testSession: {
    select: { startedAt: true, completedAt: true, totalQuestions: true, timerSeconds: true },
  },
  user: { select: { name: true, email: true } },
} satisfies Prisma.TestResultInclude;

export type FullReport = Prisma.TestResultGetPayload<{ include: typeof reportInclude }>;

/** Ultimo report disponibile dell'utente (null se non ha ancora completato il test). */
export async function getLatestReport(userId: string): Promise<FullReport | null> {
  return prisma.testResult.findFirst({
    where: { userId },
    orderBy: { computedAt: 'desc' },
    include: reportInclude,
  });
}

export async function getReportById(resultId: string, userId: string): Promise<FullReport | null> {
  return prisma.testResult.findFirst({
    where: { id: resultId, userId },
    include: reportInclude,
  });
}

/** Storico delle compilazioni, per confrontare l'evoluzione nel tempo. */
export async function listUserResults(userId: string) {
  return prisma.testResult.findMany({
    where: { userId },
    orderBy: { computedAt: 'desc' },
    select: {
      id: true,
      computedAt: true,
      topThemeSlugs: true,
      durationSeconds: true,
    },
  });
}

/** Elimina la sessione in corso: usata dal pulsante "ricomincia da capo". */
export async function resetInProgressSession(userId: string) {
  await prisma.testSession.deleteMany({ where: { userId, status: 'IN_PROGRESS' } });
}
