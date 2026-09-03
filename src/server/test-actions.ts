'use server';

import { revalidatePath } from 'next/cache';

import { requireUser } from './guards';
import { answerSchema, blockAnswerSchema } from '@/lib/validation';
import { completeTest, resetInProgressSession, saveAnswer } from './test-service';
import { completeBlockTest, saveBlockAnswer } from './mpf-service';

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

export async function restartTestAction(formData: FormData) {
  const user = await requireUser('/questionario');
  const slug = String(formData.get('assessment') ?? '');
  if (!slug) return;
  await resetInProgressSession(user.id, slug);
  revalidatePath(`/questionario/${slug}`);
}

// ---------------------------------------------------------------------------
// Questionari a blocchi quartetto
// ---------------------------------------------------------------------------

/** Salvataggio in tempo reale della scelta su un blocco. */
export async function saveBlockAnswerAction(
  testSessionId: string,
  input: unknown,
): Promise<SaveAnswerResult> {
  const user = await requireUser('/questionario');

  const parsed = blockAnswerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: 'Risposta non valida.' };

  try {
    const { answeredCount } = await saveBlockAnswer({
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

export async function completeBlockTestAction(
  testSessionId: string,
): Promise<CompleteTestResult> {
  const user = await requireUser('/questionario');

  try {
    const { resultId } = await completeBlockTest({ userId: user.id, testSessionId });
    revalidatePath('/dashboard');
    return { ok: true, resultId };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Calcolo del profilo non riuscito.',
    };
  }
}
