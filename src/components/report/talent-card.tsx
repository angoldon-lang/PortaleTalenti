'use client';

import { useId, useState } from 'react';
import type { Domain } from '@prisma/client';

import { DomainBadge } from '@/components/ui/domain-badge';
import { DOMAIN_META } from '@/content/themes';
import { cn } from '@/lib/utils';

export type TalentCardData = {
  rank: number;
  slug: string;
  name: string;
  domain: Domain;
  tagline: string;
  fullDescription: string;
  strengths: string[];
  blindSpots: string[];
  actionTips: string[];
  thrivesIn: string[];
  score: number;
};

/**
 * Scheda espandibile di un talento. Usa il pattern disclosure accessibile
 * (button + aria-expanded + aria-controls) invece di un accordion custom.
 */
export function TalentCard({ talent, defaultOpen = false }: { talent: TalentCardData; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const color = DOMAIN_META[talent.domain].color;

  return (
    <article className="card overflow-hidden">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-ink-50 sm:p-6"
        >
          <span
            aria-hidden="true"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-base font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {talent.rank}
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold text-ink-900">{talent.name}</span>
              <DomainBadge domain={talent.domain} />
            </span>
            <span className="mt-1 block text-sm text-ink-600">{talent.tagline}</span>
          </span>

          <span className="flex shrink-0 items-center gap-3">
            <span className="hidden text-right sm:block">
              <span className="block text-lg font-semibold tabular-nums text-ink-900">
                {Math.round(talent.score)}
              </span>
              <span className="block text-[11px] uppercase tracking-wide text-ink-400">
                intensità
              </span>
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className={cn('h-5 w-5 text-ink-400 transition-transform', open && 'rotate-180')}
            >
              <path
                fill="currentColor"
                d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.58l3.3-3.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.42Z"
              />
            </svg>
          </span>
        </button>
      </h3>

      <div id={panelId} hidden={!open} className="border-t border-ink-200/70">
        <div className="space-y-6 p-5 sm:p-6">
          <div className="space-y-3 text-[15px] leading-relaxed text-ink-700">
            {talent.fullDescription.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailList
              title="Quando lavora al meglio"
              items={talent.strengths}
              tone="positive"
            />
            <DetailList
              title="Punti ciechi da presidiare"
              items={talent.blindSpots}
              tone="warning"
            />
          </div>

          <DetailList title="Come allenarlo" items={talent.actionTips} tone="neutral" />

          <div>
            <h4 className="text-sm font-semibold text-ink-900">Contesti in cui rende di più</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {talent.thrivesIn.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function DetailList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'positive' | 'warning' | 'neutral';
}) {
  const marker = {
    positive: 'text-emerald-600',
    warning: 'text-amber-600',
    neutral: 'text-brand-600',
  }[tone];

  return (
    <section>
      <h4 className="text-sm font-semibold text-ink-900">{title}</h4>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink-700">
            <span aria-hidden="true" className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current', marker)} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
