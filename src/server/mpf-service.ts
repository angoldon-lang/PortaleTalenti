import 'server-only';

import type { Assessment } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { computeMpfScores, isValidBlockResponse, type MpfBlockResponse } from '@/lib/mpf-scoring';

import { AssessmentNotAllowedError, getAllowedAssessments, getAssessmentBySlug } from './test-service';

/**
 * ===========================================================================
 * SOMMINISTRAZIONE DEI QUESTIONARI A SCELTA FORZATA
 * ===========================================================================
 *
 * Modulo separato da `test-service.ts` invece che una serie di rami dentro di
 * esso: i due formati hanno item, risposte e punteggi diversi, e un'unica
 * funzione che si biforca a ogni passaggio sarebbe più difficile da leggere di
 * due funzioni ciascuna coerente con sé. Restano in comune le regole che non
 * dipendono dal formato — chi può compilare che cosa — e vengono importate.
 *
 * Anche "ricomincia da capo" resta condiviso: cancella la sessione in corso, e
 * le risposte di entrambi i formati se ne vanno con lei per vincolo di chiave
 * esterna. Vedi `resetInProgressSession` in `test-service.ts`.
 */

export type BlockOptionForClient = {
  id: string;
  position: number;
  statement: string;
};

export type BlockForClient = {
  id: string;
  position: number;
  options: BlockOptionForClient[];
};

/** Scelta salvata per un blocco: null finché non è stata espressa. */
export type BlockAnswer = {
  mostOptionId: string | null;
  leastOptionId: string | null;
};

export type BlockSessionState = {
  sessionId: string;
  assessment: Pick<Assessment, 'id' | 'slug' | 'name' | 'subtitle' | 'lens' | 'estimatedMinutes'>;
  timerSeconds: number;
  totalBlocks: number;
  answeredCount: number;
  blocks: BlockForClient[];
  /** Risposte già date, per blockId: permette di riprendere e correggere. */
  answers: Record<string, BlockAnswer>;
  /** Indice (0-based) del primo blocco senza risposta completa. */
  resumeIndex: number;
};

/** Una risposta è completa solo quando entrambe le scelte sono state espresse. */
function isComplete(answer: BlockAnswer | undefined): boolean {
  return !!answer && answer.mostOptionId !== null && answer.leastOptionId !== null;
}

/**
 * Restituisce la sessione aperta dell'utente per un questionario a blocchi,
 * creandone una nuova se non esiste.
 */
export async function getOrCreateBlockSession(
  userId: string,
  assessmentSlug: string,
  isAdmin = false,
): Promise<BlockSessionState> {
  const assessment = await getAssessmentBySlug(assessmentSlug);
  if (!assessment) throw new Error('Questionario non trovato.');
  if (assessment.itemFormat !== 'FORCED_CHOICE_QUARTET') {
    throw new Error('Questo questionario non usa blocchi a scelta forzata.');
  }

  // Come per gli altri questionari il controllo sta qui e non solo nella
  // pagina: nascondere una card non impedisce di digitare l'URL.
  const allowed = await getAllowedAssessments(userId, isAdmin);
  if (allowed && !allowed.some((a) => a.slug === assessmentSlug)) {
    throw new AssessmentNotAllowedError();
  }

  const blocks = await prisma.choiceBlock.findMany({
    where: { assessmentId: assessment.id, isActive: true },
    orderBy: { position: 'asc' },
    select: {
      id: true,
      position: true,
      options: {
        orderBy: { position: 'asc' },
        select: { id: true, position: true, statement: true },
      },
    },
  });

  if (blocks.length === 0) {
    throw new Error('Nessun blocco attivo: esegui il seed del database (npm run db:seed).');
  }

  let session = await prisma.testSession.findFirst({
    where: { userId, assessmentId: assessment.id, status: 'IN_PROGRESS' },
    orderBy: { startedAt: 'desc' },
    include: {
      blockResponses: { select: { blockId: true, mostOptionId: true, leastOptionId: true } },
    },
  });

  if (!session) {
    session = await prisma.testSession.create({
      data: {
        userId,
        assessmentId: assessment.id,
        totalQuestions: blocks.length,
        timerSeconds: assessment.timerSeconds,
      },
      include: {
        blockResponses: { select: { blockId: true, mostOptionId: true, leastOptionId: true } },
      },
    });
  }

  const answers: Record<string, BlockAnswer> = {};
  for (const r of session.blockResponses) {
    answers[r.blockId] = { mostOptionId: r.mostOptionId, leastOptionId: r.leastOptionId };
  }

  const firstUnanswered = blocks.findIndex((b) => !isComplete(answers[b.id]));

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
    totalBlocks: blocks.length,
    answeredCount: Object.values(answers).filter(isComplete).length,
    blocks,
    answers,
    resumeIndex: firstUnanswered === -1 ? blocks.length - 1 : firstUnanswered,
  };
}

/**
 * Salva la scelta su un blocco. Come per gli altri questionari il salvataggio è
 * per singolo item: chiudere il browser non costa nulla.
 *
 * Un blocco scaduto viene registrato senza scelte. La scelta forzata non ha un
 * valore neutro da mettere al suo posto: inventarne uno significherebbe
 * attribuire alla persona una preferenza che non ha espresso.
 */
export async function saveBlockAnswer(params: {
  userId: string;
  testSessionId: string;
  blockId: string;
  mostOptionId: string | null;
  leastOptionId: string | null;
  timedOut: boolean;
  latencyMs?: number;
}): Promise<{ answeredCount: number }> {
  const { userId, testSessionId, blockId, timedOut, latencyMs } = params;

  const session = await prisma.testSession.findFirst({
    where: { id: testSessionId, userId },
    select: { id: true, status: true, assessmentId: true },
  });
  if (!session) throw new Error('Sessione di test non trovata.');
  if (session.status !== 'IN_PROGRESS') throw new Error('Questa sessione è già stata completata.');

  const block = await prisma.choiceBlock.findFirst({
    where: { id: blockId, assessmentId: session.assessmentId, isActive: true },
    select: { id: true, options: { select: { id: true, position: true } } },
  });
  if (!block) throw new Error('Blocco non valido per questo questionario.');

  const mostOptionId = timedOut ? null : params.mostOptionId;
  const leastOptionId = timedOut ? null : params.leastOptionId;

  if (mostOptionId !== null || leastOptionId !== null) {
    // Le due scelte devono appartenere a questo blocco ed essere distinte:
    // "più" e "meno" sulla stessa affermazione non è un ordinamento.
    const byId = new Map(block.options.map((o) => [o.id, o.position]));
    const mostPosition = mostOptionId === null ? null : byId.get(mostOptionId);
    const leastPosition = leastOptionId === null ? null : byId.get(leastOptionId);

    if ((mostOptionId !== null && mostPosition === undefined) ||
        (leastOptionId !== null && leastPosition === undefined)) {
      throw new Error('Affermazione non appartenente a questo blocco.');
    }
    if (
      mostPosition != null &&
      leastPosition != null &&
      !isValidBlockResponse(mostPosition - 1, leastPosition - 1)
    ) {
      throw new Error('Le due scelte devono ricadere su affermazioni diverse.');
    }
  }

  const data = { mostOptionId, leastOptionId, timedOut, latencyMs };
  await prisma.blockResponse.upsert({
    where: { testSessionId_blockId: { testSessionId, blockId } },
    update: data,
    create: { testSessionId, blockId, ...data },
  });

  // Contano solo le risposte complete: un blocco scaduto è registrato, ma non
  // è "risposto", e l'avanzamento mostrato deve dire la verità.
  const answeredCount = await prisma.blockResponse.count({
    where: { testSessionId, mostOptionId: { not: null }, leastOptionId: { not: null } },
  });
  await prisma.testSession.update({ where: { id: testSessionId }, data: { answeredCount } });

  return { answeredCount };
}

/**
 * Chiude la sessione, esegue il motore di calcolo e persiste il risultato.
 * Idempotente: se il risultato esiste già, restituisce quello.
 */
export async function completeBlockTest(params: {
  userId: string;
  testSessionId: string;
}): Promise<{ resultId: string }> {
  const { userId, testSessionId } = params;

  const session = await prisma.testSession.findFirst({
    where: { id: testSessionId, userId },
    include: {
      assessment: { select: { id: true, topCount: true, itemFormat: true } },
      result: { select: { id: true } },
      blockResponses: {
        include: {
          block: {
            select: {
              position: true,
              controlForPosition: true,
              options: {
                orderBy: { position: 'asc' },
                select: { id: true, trait: { select: { slug: true } } },
              },
            },
          },
        },
      },
    },
  });

  if (!session) throw new Error('Sessione di test non trovata.');
  if (session.result) return { resultId: session.result.id };
  if (session.assessment.itemFormat !== 'FORCED_CHOICE_QUARTET') {
    throw new Error('Questo questionario non usa blocchi a scelta forzata.');
  }

  const seen = session.blockResponses.length;
  if (seen < session.totalQuestions) {
    throw new Error(`Questionario incompleto: ${seen}/${session.totalQuestions} blocchi.`);
  }

  // I blocchi scaduti restano senza scelte e non entrano nel calcolo: la loro
  // quota finisce in `skippedRatio` e pesa sull'indice di attendibilità.
  const responses: MpfBlockResponse[] = [];
  let timedOut = 0;

  for (const r of session.blockResponses) {
    if (r.timedOut) timedOut += 1;
    if (!r.mostOptionId || !r.leastOptionId) continue;

    const options = r.block.options;
    const mostIndex = options.findIndex((o) => o.id === r.mostOptionId);
    const leastIndex = options.findIndex((o) => o.id === r.leastOptionId);
    if (!isValidBlockResponse(mostIndex, leastIndex)) continue;

    responses.push({
      position: r.block.position,
      traitSlugs: options.map((o) => o.trait.slug) as [string, string, string, string],
      mostIndex,
      leastIndex,
      ...(r.block.controlForPosition === null
        ? {}
        : { controlForPosition: r.block.controlForPosition }),
    });
  }

  const traits = await prisma.strengthTrait.findMany({
    select: { id: true, slug: true, area: { select: { id: true, slug: true } } },
  });
  const traitAreas: Record<string, string> = {};
  const traitIdBySlug = new Map<string, string>();
  const areaIdBySlug = new Map<string, string>();
  for (const t of traits) {
    traitAreas[t.slug] = t.area.slug;
    traitIdBySlug.set(t.slug, t.id);
    areaIdBySlug.set(t.area.slug, t.area.id);
  }

  const outcome = computeMpfScores(
    responses,
    traitAreas,
    session.totalQuestions,
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
        topThemeSlugs: outcome.topTraitSlugs,
        timeoutRatio: session.totalQuestions > 0 ? timedOut / session.totalQuestions : 0,
        durationSeconds,
        inconsistencyRate: outcome.inconsistencyRate,
        reliabilityIndex: outcome.reliabilityIndex,
        reliabilityBand: outcome.reliabilityBand,
        traitScores: {
          create: outcome.traitScores.map((t) => ({
            traitId: traitIdBySlug.get(t.slug)!,
            rawScore: t.rawScore,
            normalizedScore: t.normalizedScore,
            rank: t.rank,
            timesMost: t.timesMost,
            timesLeast: t.timesLeast,
          })),
        },
        areaScores: {
          create: Object.entries(outcome.areaScores).map(([slug, score]) => ({
            areaId: areaIdBySlug.get(slug)!,
            score,
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
