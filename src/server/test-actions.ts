'use server';

import { revalidatePath } from 'next/cache';

import { requireUser } from './guards';
import { answerSchema } from '@/lib/validation';
import { completeTest, resetInProgressSession, saveAnswer } from './test-service';

export type SaveAnswerResult =
  | { ok: true; answeredCount: number }
  | { ok: false; error: string };

/** Salvataggio in tempo reale di una singola risposta. */
export async function saveAnswerAction(
  testSessionId: string,
  input: unknown,
): Promise<SaveAnswerResult> {
  const user = await requireUser('/questionario');

  const parsed = answerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Risposta non valida.' };

  try {
    const { answeredCount } = await saveAnswer({
      userId: user.id,
      testSessionId,
      ...parsed.data,
    });
    return { ok: true, answeredCount };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Salvataggio non riuscito.',
    };
  }
}

export type CompleteTestResult =
  | { ok: true; resultId: string }
  | { ok: false; error: string };

export async function completeTestAction(testSessionId: string): Promise<CompleteTestResult> {
  const user = await requireUser('/questionario');

  try {
    const { resultId } = await completeTest({ userId: user.id, testSessionId });
    revalidatePath('/dashboard');
    return { ok: true, resultId };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Calcolo del profilo non riuscito.',
    };
  }
}

export async function restartTestAction() {
  const user = await requireUser('/questionario');
  await resetInProgressSession(user.id);
  revalidatePath('/questionario');
}
