'use client';

import { cn } from '@/lib/utils';

/**
 * Anello di countdown. È puramente decorativo: il tempo residuo è comunicato
 * anche testualmente e via aria-live nel componente padre.
 */
export function TimerRing({
  remaining,
  total,
  paused,
}: {
  remaining: number;
  total: number;
  paused?: boolean;
}) {
  const ratio = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const urgent = remaining <= 5;

  return (
    <div className="relative h-12 w-12 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 44 44" className="h-full w-full -rotate-90">
        <circle cx="22" cy="22" r={radius} fill="none" strokeWidth="3" className="stroke-ink-200" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className={cn(
            'transition-[stroke-dashoffset] duration-1000 ease-linear',
            paused ? 'stroke-ink-400' : urgent ? 'stroke-amber-500' : 'stroke-brand-600',
          )}
        />
      </svg>
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums',
          paused ? 'text-ink-400' : urgent ? 'text-amber-600' : 'text-ink-700',
        )}
      >
        {paused ? '‖' : remaining}
      </span>
    </div>
  );
}
