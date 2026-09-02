'use client';

import { cn } from '@/lib/utils';
import { LIKERT_LABELS } from '@/lib/scoring';

/**
 * Scala Likert a 7 punti fra due affermazioni contrapposte.
 *
 * Accessibilità: è un radiogroup nativo. Ogni pallino è un <input type="radio">
 * con etichetta testuale per screen reader, quindi funziona con tastiera
 * (frecce) senza JavaScript aggiuntivo.
 */
export function LikertScale({
  name,
  value,
  onChange,
  disabled,
}: {
  name: string;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset disabled={disabled} className="w-full">
      <legend className="sr-only">
        Scegli quanto ti descrive ciascuna delle due affermazioni
      </legend>

      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {LIKERT_LABELS.map((option) => {
          const distance = Math.abs(option.value - 4); // 0 = neutro, 3 = estremo
          const side = option.value < 4 ? 'left' : option.value > 4 ? 'right' : 'center';
          const size = ['h-9 w-9', 'h-11 w-11', 'h-12 w-12', 'h-14 w-14'][distance];
          const checked = value === option.value;

          return (
            <label
              key={option.value}
              className={cn(
                'group relative flex cursor-pointer items-center justify-center rounded-full border-2 transition',
                size,
                checked
                  ? side === 'left'
                    ? 'border-brand-600 bg-brand-600'
                    : side === 'right'
                      ? 'border-emerald-600 bg-emerald-600'
                      : 'border-ink-500 bg-ink-500'
                  : cn(
                      'bg-white hover:scale-105',
                      side === 'left'
                        ? 'border-brand-300 hover:border-brand-500'
                        : side === 'right'
                          ? 'border-emerald-300 hover:border-emerald-500'
                          : 'border-ink-300 hover:border-ink-400',
                    ),
                'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-600 has-[:focus-visible]:ring-offset-2',
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="sr-only">{option.label}</span>
              {checked && (
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-1/2 w-1/2 text-white">
                  <path
                    fill="currentColor"
                    d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                  />
                </svg>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between text-xs text-ink-500" aria-hidden="true">
        <span>Mi descrive di più</span>
        <span>Uguali</span>
        <span>Mi descrive di più</span>
      </div>
    </fieldset>
  );
}
