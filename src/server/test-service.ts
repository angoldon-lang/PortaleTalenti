import 'server-only';

import type { Assessment, Domain, Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { computeScores, LIKERT_NEUTRAL } from '@/lib/scoring';

/** Questionario non abilitato per il ruolo organizzativo dell'utente. */
export class AssessmentNotAllowedError extends Error {
  constructor() {
    super('Questo questionario non è abilitato per il tuo ruolo.');
    this.name = 'AssessmentNotAllowedError';
  }
}

export const DEFAULT_TIMER_SECONDS = Number(
  process.env.NEXT_PUBLIC_QUESTION_TIMER_SECONDS ?? 20,
);

export type QuestionForClient = {
  id: string;
  position: number;
  leftStatement: string;
  rightStatement: string;
};

export type TestSessionState = {
  sessionId: string;
  assessment: Pick<Assessment, 'id' | 'slug' | 'name' | 'subtitle' | 'lens' | 'estimatedMinutes'>;
  timerSeconds: number;
  totalQuestions: number;
  answeredCount: number;
  questions: QuestionForClient[];
  /** Risposte già date, per questionId: permette di riprendere e correggere. */
  answers: Record<string, number>;
  /** Indice (0-based) del primo item senza risposta. */
  resumeIndex: number;
};

export async function getAssessmentBySlug(slug: string) {
  return prisma.assessment.findFirst({ where: { slug, isActive: true } });
}

export type AllowedAssessment = { slug: string; isRequired: boolean };

/**
 * Quali questionari può compilare una persona.
 *
 * La regola arriva dal suo ruolo organizzativo; chi non ne ha uno assegnato
 * ricade sul ruolo marcato come predefinito. Se non esiste alcun ruolo — per
 * esempio prima del primo seed — non si blocca nessuno: meglio un portale
 * permissivo che uno inutilizzabile.
 *
 * Gli amministratori vedono tutto, perché devono poter provare i questionari
 * che assegnano agli altri.
 */
export async function getAllowedAssessments(
  userId: string,
  isAdmin = false,
): Promise<AllowedAssessment[] | null> {
  if (isAdmin) return null; // null = nessuna restrizione

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { orgRoleId: true },
  });

  const role = user?.orgRoleId
    ? await prisma.orgRole.findUnique({
        where: { id: user.orgRoleId },
        select: { assessments: { select: { isRequired: true, assessment: { select: { slug: true } } } } },
      })
    : await prisma.orgRole.findFirst({
        where: { isDefault: true },
        select: { assessments: { select: { isRequired: true, assessment: { select: { slug: true } } } } },
      });

  if (!role) return null;

  return role.assessments.map((a) => ({ slug: a.assessment.slug, isRequired: a.isRequired }));
}

/**
 * Catalogo degli assessment abilitati per l'utente, con il suo avanzamento e
 * l'indicazione di quali sono richiesti dal suo ruolo.
 */
export async function listAssessmentsForUser(userId: string, isAdmin = false) {
  const allowed = await getAllowedAssessments(userId, isAdmin);
  const allowedBySlug = allowed ? new Map(allowed.map((a) => [a.slug, a])) : null;

  const [assessments, sessions, results] = await Promise.all([
    prisma.assessment.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            questions: { where: { isActive: true } },
            blocks: { where: { isActive: true } },
          },
        },
      },
    }),
    prisma.testSession.findMany({
      where: { userId, status: 'IN_PROGRESS' },
      select: { assessmentId: true, answeredCount: true, totalQuestions: true },
    }),
    prisma.testResult.findMany({
      where: { userId },
      orderBy: { computedAt: 'desc' },
      select: { id: true, assessmentId: true, computedAt: true },
    }),
  ]);

  const inProgress = new Map(sessions.map((s) => [s.assessmentId, s]));
  const latestResult = new Map<string, (typeof results)[number]>();
  for (const r of results) if (!latestResult.has(r.assessmentId)) latestResult.set(r.assessmentId, r);

  return assessments
    .filter((a) => !allowedBySlug || allowedBySlug.has(a.slug))
    .map((a) => ({
      ...a,
      // Il conteggio mostrato in copertina è quello degli item del formato che
      // l'assessment usa davvero: domande o blocchi.
      questionCount:
        a.itemFormat === 'FORCED_CHOICE_QUARTET' ? a._count.blocks : a._count.questions,
      progress: inProgress.get(a.id) ?? null,
      result: latestResult.get(a.id) ?? null,
      isRequired: allowedBySlug?.get(a.slug)?.isRequired ?? false,
    }));
}

/**
 * Restituisce la sessione aperta dell'utente per un assessment, creandone una
 * nuova se non esiste. È la funzione che rende possibile la ripresa: lo stato
 * vive nel database, non nel browser.
 */
export async function getOrCreateTestSession(
  userId: string,
  assessmentSlug: string,
  isAdmin = false,
): Promise<TestSessionState> {
  const assessment = await getAssessmentBySlug(assessmentSlug);
  if (!assessment) throw new Error('Questionario non trovato.');

  // Il controllo sta qui, non solo nella pagina: nascondere una card non
  // impedisce di digitare l'URL del questionario.
  const allowed = await getAllowedAssessments(userId, isAdmin);
  if (allowed && !allowed.some((a) => a.slug === assessmentSlug)) {
    throw new AssessmentNotAllowedError();
  }

  const questions = await prisma.question.findMany({
    where: { assessmentId: assessment.id, isActive: true },
    orderBy: { position: 'asc' },
    select: { id: true, position: true, leftStatement: true, rightStatement: true },
  });

  if (questions.length === 0) {
    throw new Error('Nessuna domanda attiva: esegui il seed del database (npm run db:seed).');
  }

  let session = await prisma.testSession.findFirst({
    where: { userId, assessmentId: assessment.id, status: 'IN_PROGRESS' },
    orderBy: { startedAt: 'desc' },
    include: { responses: { select: { questionId: true, value: true } } },
  });

  if (!session) {
    session = await prisma.testSession.create({
      data: {
        userId,
        assessmentId: assessment.id,
        totalQuestions: questions.length,
        timerSeconds: assessment.timerSeconds,
      },
      include: { responses: { select: { questionId: true, value: true } } },
    });
  }

  const answers: Record<string, number> = {};
  for (const r of session.responses) answers[r.questionId] = r.value;

  const firstUnanswered = questions.findIndex((q) => answers[q.id] === undefined);

  return {
    sessionId: session.id,
    assessment: {
      id: assessment.id,
      slug: assessment.slug,
      name: assessment.name,
      subtitle: assessment.subtitle,
      lens: assessment.lens,
      estimatedMinutes: assessment.estimatedMinutes,
    },
    timerSeconds: session.timerSeconds,
    totalQuestions: questions.length,
    answeredCount: session.responses.length,
    questions,
    answers,
    resumeIndex: firstUnanswered === -1 ? questions.length - 1 : firstUnanswered,
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
    select: { id: true, status: true, assessmentId: true },
  });
  if (!session) throw new Error('Sessione di test non trovata.');
  if (session.status !== 'IN_PROGRESS') throw new Error('Questa sessione è già stata completata.');

  // L'item deve appartenere all'assessment della sessione.
  const question = await prisma.question.findFirst({
    where: { id: questionId, assessmentId: session.assessmentId, isActive: true },
    select: { id: true },
  });
  if (!question) throw new Error('Domanda non valida per questo questionario.');

  const storedValue = timedOut ? LIKERT_NEUTRAL : value;

  await prisma.response.upsert({
    where: { testSessionId_questionId: { testSessionId, questionId } },
    update: { value: storedValue, timedOut, latencyMs },
    create: { testSessionId, questionId, value: storedValue, timedOut, latencyMs },
  });

  const answeredCount = await prisma.response.count({ where: { testSessionId } });
  await prisma.testSession.update({ where: { id: testSessionId }, data: { answeredCount } });

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
      assessment: { select: { id: true, topCount: true } },
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

  // Solo i temi effettivamente misurati da questo assessment entrano nel calcolo.
  const measured = new Set<string>();
  for (const r of session.responses) {
    measured.add(r.question.leftTheme.slug);
    measured.add(r.question.rightTheme.slug);
  }

  const themes = await prisma.talentTheme.findMany({
    where: { slug: { in: [...measured] } },
    select: { id: true, slug: true, domain: true },
  });
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
    session.assessment.topCount,
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
        assessmentId: session.assessment.id,
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
  assessment: true,
  // Un report porta con sé i punteggi della metodologia con cui è stato
  // prodotto: quelli dell'altra restano semplicemente vuoti. `itemFormat`
  // dell'assessment dice quale delle due leggere.
  themeScores: { include: { theme: true }, orderBy: { rank: 'asc' } },
  traitScores: { include: { trait: { include: { area: true } } }, orderBy: { rank: 'asc' } },
  areaScores: { include: { area: true } },
  testSession: {
    select: { startedAt: true, completedAt: true, totalQuestions: true, timerSeconds: true },
  },
  user: { select: { name: true, email: true } },
} satisfies Prisma.TestResultInclude;

export type FullReport = Prisma.TestResultGetPayload<{ include: typeof reportInclude }>;

/** Ultimo report dell'utente, eventualmente filtrato per assessment. */
export async function getLatestReport(
  userId: string,
  assessmentSlug?: string,
): Promise<FullReport | null> {
  return prisma.testResult.findFirst({
    where: { userId, ...(assessmentSlug ? { assessment: { slug: assessmentSlug } } : {}) },
    orderBy: { computedAt: 'desc' },
    include: reportInclude,
  });
}

/**
 * Un report per id. Senza `userId` non applica il filtro di proprietà: usarlo
 * solo dopo un controllo di autorizzazione esplicito (vedi il download Admin).
 */
export async function getReportById(
  resultId: string,
  userId?: string,
): Promise<FullReport | null> {
  return prisma.testResult.findFirst({
    where: { id: resultId, ...(userId ? { userId } : {}) },
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
      assessment: { select: { slug: true, name: true, lens: true, itemFormat: true } },
    },
  });
}

/** Elimina la sessione in corso: usata dal pulsante "ricomincia da capo". */
export async function resetInProgressSession(userId: string, assessmentSlug: string) {
  const assessment = await getAssessmentBySlug(assessmentSlug);
  if (!assessment) return;
  await prisma.testSession.deleteMany({
    where: { userId, assessmentId: assessment.id, status: 'IN_PROGRESS' },
  });
}
