'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { LikertScale } from './likert-scale';
import { TimerRing } from './timer-ring';
import { completeTestAction, saveAnswerAction } from '@/server/test-actions';
import { LIKERT_NEUTRAL } from '@/lib/scoring';
import type { TestSessionState } from '@/server/test-service';
import { cn } from '@/lib/utils';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function QuestionnaireRunner({ state }: { state: TestSessionState }) {
  const router = useRouter();
  const { sessionId, questions, timerSeconds, totalQuestions } = state;

  const [index, setIndex] = useState(state.resumeIndex);
  const [answers, setAnswers] = useState<Record<string, number>>(state.answers);
  const [remaining, setRemaining] = useState(timerSeconds);
  const [paused, setPaused] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompleting, startCompleting] = useTransition();

  const question = questions[index]!;
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = Math.round((answeredCount / totalQuestions) * 100);
  const timerEnabled = timerSeconds > 0;

  const questionStartedAt = useRef<number>(Date.now());
  // Evita che il timeout scatti due volte sullo stesso item (StrictMode / rerender).
  const handledTimeout = useRef<string | null>(null);

  /** Persiste la risposta e avanza. Il salvataggio è ottimistico: la UI non attende. */
  const submit = useCallback(
    (value: number, timedOut: boolean) => {
      const questionId = question.id;
      const latencyMs = Math.min(Date.now() - questionStartedAt.current, 30 * 60 * 1000);

      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      setSaveState('saving');
      setErrorMessage(null);

      void saveAnswerAction(sessionId, { questionId, value, timedOut, latencyMs }).then((res) => {
        if (res.ok) {
          setSaveState('saved');
        } else {
          setSaveState('error');
          setErrorMessage(res.error);
        }
      });

      setIndex((prev) => Math.min(prev + 1, questions.length - 1));
    },
    [question.id, questions.length, sessionId],
  );

  // Reset del timer a ogni cambio di item.
  useEffect(() => {
    setRemaining(timerSeconds);
    questionStartedAt.current = Date.now();
  }, [index, timerSeconds]);

  // Countdown: allo scadere salva "neutro" e prosegue (MODULO 2).
  useEffect(() => {
    if (!timerEnabled || paused) return;

    if (remaining <= 0) {
      if (handledTimeout.current !== question.id && answers[question.id] === undefined) {
        handledTimeout.current = question.id;
        submit(LIKERT_NEUTRAL, true);
      }
      return;
    }

    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining, paused, timerEnabled, question.id, answers, submit]);

  // Navigazione da tastiera: 1-7 per rispondere, frecce per muoversi.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (event.key >= '1' && event.key <= '7') {
        event.preventDefault();
        submit(Number(event.key), false);
      } else if (event.key === 'ArrowLeft' && index > 0) {
        setIndex(index - 1);
      } else if (event.key === 'ArrowRight' && answers[question.id] !== undefined) {
        setIndex(Math.min(index + 1, questions.length - 1));
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, answers, question.id, questions.length, submit]);

  const allAnswered = answeredCount >= totalQuestions;

  function finish() {
    startCompleting(async () => {
      const res = await completeTestAction(sessionId);
      if (res.ok) {
        router.push(`/dashboard?nuovo=1`);
      } else {
        setErrorMessage(res.error);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-24 pt-6 sm:px-6">
      {/* --- Intestazione: avanzamento, timer, stato salvataggio ------------ */}
      <header className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-500">
              Domanda {index + 1} di {totalQuestions}
            </p>
            <p aria-live="polite" className="mt-0.5 text-xs text-ink-400">
              {saveState === 'saving' && 'Salvataggio…'}
              {saveState === 'saved' && 'Risposte salvate'}
              {saveState === 'error' && 'Salvataggio non riuscito'}
              {saveState === 'idle' && 'Le risposte si salvano da sole'}
            </p>
          </div>

          {timerEnabled && (
            <div className="flex items-center gap-3">
              <TimerRing remaining={remaining} total={timerSeconds} paused={paused} />
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="rounded-lg px-2 py-1 text-xs font-medium text-ink-600 hover:bg-ink-100"
              >
                {paused ? 'Riprendi' : 'Pausa'}
              </button>
            </div>
          )}
        </div>

        <div
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink-200"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Avanzamento del questionario"
        >
          <div
            className="h-full rounded-full bg-brand-600 transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {errorMessage && (
        <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </div>
      )}

      {/* --- Item: due affermazioni contrapposte ---------------------------- */}
      <div key={question.id} className="animate-fade-in-up">
        <p className="mb-6 text-center text-sm text-ink-500">
          Quale delle due affermazioni ti descrive meglio? Rispondi d’istinto.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Statement side="left" text={question.leftStatement} />
          <Statement side="right" text={question.rightStatement} />
        </div>

        <div className="mt-8">
          <LikertScale
            name={`q-${question.id}`}
            value={answers[question.id] ?? null}
            onChange={(value) => submit(value, false)}
          />
        </div>
      </div>

      {/* --- Navigazione ---------------------------------------------------- */}
      <nav className="mt-10 flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Indietro
        </Button>

        <p className="text-xs text-ink-400">
          Usa i tasti <kbd className="rounded border border-ink-300 px-1">1</kbd>–
          <kbd className="rounded border border-ink-300 px-1">7</kbd>
        </p>

        {index < questions.length - 1 ? (
          <Button
            variant="secondary"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={answers[question.id] === undefined}
          >
            Avanti
          </Button>
        ) : (
          <Button onClick={finish} disabled={!allAnswered || isCompleting}>
            {isCompleting ? 'Calcolo del profilo…' : 'Vedi il mio profilo'}
          </Button>
        )}
      </nav>

      {allAnswered && index < questions.length - 1 && (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <p className="text-sm text-emerald-900">
            Hai risposto a tutte le {totalQuestions} domande.
          </p>
          <Button className="mt-3" onClick={finish} disabled={isCompleting}>
            {isCompleting ? 'Calcolo del profilo…' : 'Calcola i miei talenti'}
          </Button>
        </div>
      )}
    </div>
  );
}

function Statement({ side, text }: { side: 'left' | 'right'; text: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border-2 bg-white p-5 text-center sm:text-left',
        side === 'left' ? 'border-brand-200' : 'border-emerald-200',
      )}
    >
      <p
        className={cn(
          'mb-2 text-xs font-semibold uppercase tracking-wide',
          side === 'left' ? 'text-brand-700' : 'text-emerald-700',
        )}
      >
        {side === 'left' ? 'Affermazione A' : 'Affermazione B'}
      </p>
      <p className="text-base font-medium leading-snug text-ink-900 sm:text-lg">{text}</p>
    </div>
  );
}
