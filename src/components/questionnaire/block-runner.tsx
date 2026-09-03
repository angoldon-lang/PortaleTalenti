'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { TimerRing } from './timer-ring';
import { completeBlockTestAction, saveBlockAnswerAction } from '@/server/test-actions';
import type { BlockAnswer, BlockSessionState } from '@/server/mpf-service';
import { cn } from '@/lib/utils';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const EMPTY: BlockAnswer = { mostOptionId: null, leastOptionId: null };

function isComplete(answer: BlockAnswer | undefined): boolean {
  return !!answer && answer.mostOptionId !== null && answer.leastOptionId !== null;
}

/**
 * Somministrazione dei questionari a blocchi quartetto.
 *
 * Per ogni blocco vanno espresse due scelte: l'affermazione che descrive di
 * più e quella che descrive di meno. Il blocco si chiude — e si avanza — solo
 * quando ci sono entrambe: una sola scelta non ordina nulla.
 *
 * Le due scelte sono due gruppi di radio distinti, uno per colonna. Non è un
 * dettaglio di implementazione: chi naviga da tastiera o con uno screen reader
 * incontra così due domande separate e chiare ("quale ti descrive di più",
 * "quale di meno"), invece di una griglia da interpretare.
 */
export function BlockRunner({ state }: { state: BlockSessionState }) {
  const router = useRouter();
  const { sessionId, blocks, timerSeconds, totalBlocks } = state;

  const [index, setIndex] = useState(state.resumeIndex);
  const [answers, setAnswers] = useState<Record<string, BlockAnswer>>(state.answers);
  const [remaining, setRemaining] = useState(timerSeconds);
  const [paused, setPaused] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompleting, startCompleting] = useTransition();

  const block = blocks[index]!;
  const answer = answers[block.id] ?? EMPTY;

  const answeredCount = useMemo(
    () => Object.values(answers).filter(isComplete).length,
    [answers],
  );
  const progress = Math.round((answeredCount / totalBlocks) * 100);
  const timerEnabled = timerSeconds > 0;
  // Un blocco scaduto resta senza scelte: va comunque contato come "visto",
  // altrimenti il questionario non si chiuderebbe mai.
  const seenCount = useMemo(() => Object.keys(answers).length, [answers]);

  const blockStartedAt = useRef<number>(Date.now());
  // Evita che il timeout scatti due volte sullo stesso blocco (StrictMode).
  const handledTimeout = useRef<string | null>(null);

  const persist = useCallback(
    (blockId: string, next: BlockAnswer, timedOut: boolean) => {
      const latencyMs = Math.min(Date.now() - blockStartedAt.current, 30 * 60 * 1000);
      setSaveState('saving');
      setErrorMessage(null);

      void saveBlockAnswerAction(sessionId, { blockId, ...next, timedOut, latencyMs }).then(
        (res) => {
          if (res.ok) {
            setSaveState('saved');
          } else {
            setSaveState('error');
            setErrorMessage(res.error);
          }
        },
      );
    },
    [sessionId],
  );

  /**
   * Registra una delle due scelte. Indicare la stessa affermazione nell'altra
   * colonna libera quella precedente invece di rifiutare il clic: chi cambia
   * idea non deve prima disfare.
   */
  const choose = useCallback(
    (kind: 'most' | 'least', optionId: string) => {
      const current = answers[block.id] ?? EMPTY;
      const next: BlockAnswer =
        kind === 'most'
          ? {
              mostOptionId: optionId,
              leastOptionId: current.leastOptionId === optionId ? null : current.leastOptionId,
            }
          : {
              mostOptionId: current.mostOptionId === optionId ? null : current.mostOptionId,
              leastOptionId: optionId,
            };

      setAnswers((prev) => ({ ...prev, [block.id]: next }));
      persist(block.id, next, false);

      // Si avanza solo quando il blocco è completo.
      if (isComplete(next)) {
        setIndex((prev) => Math.min(prev + 1, blocks.length - 1));
      }
    },
    [answers, block.id, blocks.length, persist],
  );

  // Reset del timer a ogni cambio di blocco.
  useEffect(() => {
    setRemaining(timerSeconds);
    blockStartedAt.current = Date.now();
  }, [index, timerSeconds]);

  // Countdown. Allo scadere il blocco viene registrato senza scelte: nella
  // scelta forzata non esiste un valore neutro da mettere al loro posto.
  useEffect(() => {
    if (!timerEnabled || paused) return;

    if (remaining <= 0) {
      if (handledTimeout.current !== block.id && !isComplete(answers[block.id])) {
        handledTimeout.current = block.id;
        setAnswers((prev) => ({ ...prev, [block.id]: EMPTY }));
        persist(block.id, EMPTY, true);
        setIndex((prev) => Math.min(prev + 1, blocks.length - 1));
      }
      return;
    }

    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining, paused, timerEnabled, block.id, answers, blocks.length, persist]);

  // Tasti 1-4: assegnano la scelta ancora mancante, prima "di più" poi "di
  // meno". È l'ordine in cui la pagina chiede le due cose.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (event.key >= '1' && event.key <= '4') {
        const option = block.options[Number(event.key) - 1];
        if (!option) return;
        event.preventDefault();
        const current = answers[block.id] ?? EMPTY;
        choose(current.mostOptionId === null ? 'most' : 'least', option.id);
      } else if (event.key === 'ArrowLeft' && index > 0) {
        setIndex(index - 1);
      } else if (event.key === 'ArrowRight' && isComplete(answers[block.id])) {
        setIndex(Math.min(index + 1, blocks.length - 1));
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, answers, block, blocks.length, choose]);

  const allSeen = seenCount >= totalBlocks;

  function finish() {
    startCompleting(async () => {
      const res = await completeBlockTestAction(sessionId);
      if (res.ok) {
        router.push('/dashboard?nuovo=1');
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
              Blocco {index + 1} di {totalBlocks}
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
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMessage}
        </div>
      )}

      {/* --- Blocco: quattro affermazioni, due scelte ----------------------- */}
      <div key={block.id} className="animate-fade-in-up">
        <p className="mb-6 text-center text-sm text-ink-500">
          Fra queste quattro, indica quella che ti descrive <strong>di più</strong> e quella che ti
          descrive <strong>di meno</strong>. Rispondi d’istinto.
        </p>

        <div
          className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-2 sm:gap-x-5"
          role="group"
          aria-label={`Blocco ${index + 1}`}
        >
          <span className="text-center text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
            Di più
          </span>
          <span aria-hidden="true" />
          <span className="text-center text-[11px] font-semibold uppercase tracking-wide text-amber-700">
            Di meno
          </span>

          {block.options.map((option, i) => {
            const isMost = answer.mostOptionId === option.id;
            const isLeast = answer.leastOptionId === option.id;
            return (
              <div key={option.id} className="contents">
                <ChoiceRadio
                  name={`most-${block.id}`}
                  checked={isMost}
                  tone="most"
                  label={`Mi descrive di più: ${option.statement}`}
                  onChange={() => choose('most', option.id)}
                />

                <p
                  className={cn(
                    'rounded-xl border-2 bg-white px-4 py-3 text-[15px] font-medium leading-snug text-ink-900 transition sm:text-base',
                    isMost
                      ? 'border-emerald-300 bg-emerald-50/60'
                      : isLeast
                        ? 'border-amber-300 bg-amber-50/60'
                        : 'border-ink-200',
                  )}
                >
                  <span className="mr-2 text-xs font-semibold text-ink-400">{i + 1}</span>
                  {option.statement}
                </p>

                <ChoiceRadio
                  name={`least-${block.id}`}
                  checked={isLeast}
                  tone="least"
                  label={`Mi descrive di meno: ${option.statement}`}
                  onChange={() => choose('least', option.id)}
                />
              </div>
            );
          })}
        </div>

        <p aria-live="polite" className="mt-5 text-center text-sm text-ink-500">
          {answer.mostOptionId === null
            ? 'Scegli l’affermazione che ti descrive di più.'
            : answer.leastOptionId === null
              ? 'Ora scegli quella che ti descrive di meno.'
              : 'Blocco completato.'}
        </p>
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
          <kbd className="rounded border border-ink-300 px-1">4</kbd>
        </p>

        {index < blocks.length - 1 ? (
          <Button
            variant="secondary"
            onClick={() => setIndex((i) => Math.min(blocks.length - 1, i + 1))}
            disabled={!isComplete(answers[block.id])}
          >
            Avanti
          </Button>
        ) : (
          <Button onClick={finish} disabled={!allSeen || isCompleting}>
            {isCompleting ? 'Calcolo del profilo…' : 'Vedi il mio profilo'}
          </Button>
        )}
      </nav>

      {allSeen && index < blocks.length - 1 && (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <p className="text-sm text-emerald-900">
            Hai completato tutti i {totalBlocks} blocchi.
          </p>
          <Button className="mt-3" onClick={finish} disabled={isCompleting}>
            {isCompleting ? 'Calcolo del profilo…' : 'Calcola i miei punti di forza'}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Un radio grande abbastanza da essere colpito col pollice. L'etichetta
 * accessibile ripete l'affermazione, perché un radio che dice solo "di più" non
 * direbbe a chi usa uno screen reader di più di che cosa.
 */
function ChoiceRadio({
  name,
  checked,
  tone,
  label,
  onChange,
}: {
  name: string;
  checked: boolean;
  tone: 'most' | 'least';
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        'grid h-11 w-11 cursor-pointer place-items-center rounded-full border-2 transition',
        checked
          ? tone === 'most'
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-amber-500 bg-amber-500'
          : 'border-ink-300 bg-white hover:border-ink-400',
      )}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        aria-label={label}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'h-3.5 w-3.5 rounded-full transition',
          checked ? 'bg-white' : 'bg-transparent',
        )}
      />
    </label>
  );
}
