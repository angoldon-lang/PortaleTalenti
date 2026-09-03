import type { Metadata } from 'next';
import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LENS_META } from '@/content/assessments';
import { requireUser } from '@/server/guards';
import { listAssessmentsForUser, listUserResults } from '@/server/test-service';
import { formatDate, formatDuration } from '@/lib/utils';

export const metadata: Metadata = { title: 'Il mio profilo' };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ nuovo?: string }>;
}) {
  const user = await requireUser('/dashboard');
  const [params, assessments, results] = await Promise.all([
    searchParams,
    listAssessmentsForUser(user.id, user.role === 'ADMIN'),
    listUserResults(user.id),
  ]);

  const shellUser = { ...user, role: user.role ?? ('USER' as const) };
  const latest = results[0];

  return (
    <AppShell user={shellUser}>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {params.nuovo === '1' && latest && (
          <div
            role="status"
            className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900"
          >
            <strong className="font-semibold">Profilo pronto.</strong>{' '}
            <Link href={`/report/${latest.id}`} className="underline underline-offset-2">
              Apri il tuo report {latest.assessment.name}
            </Link>
            .
          </div>
        )}

        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
            Ciao {user.name?.split(' ')[0] ?? ''}
          </h1>
          <p className="mt-2 text-ink-600">
            {results.length === 0
              ? 'Scegli un questionario per iniziare a costruire il tuo profilo.'
              : 'I tuoi report e i questionari ancora disponibili.'}
          </p>
        </header>

        {/* ---------------- Report completati ---------------- */}
        {results.length > 0 && (
          <section className="mt-8" aria-labelledby="report">
            <h2 id="report" className="text-lg font-semibold text-ink-900">
              I tuoi report
            </h2>
            <div className="mt-4 space-y-3">
              {results.map((r) => (
                <Link
                  key={r.id}
                  href={`/report/${r.id}`}
                  className="card flex flex-wrap items-center gap-4 p-5 transition hover:border-brand-300 hover:shadow"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink-900">{r.assessment.name}</p>
                    <p className="mt-0.5 text-sm text-ink-500">
                      {LENS_META[r.assessment.lens].label} · {formatDate(r.computedAt)} ·{' '}
                      {formatDuration(r.durationSeconds)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-brand-700">Apri il report →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ---------------- Catalogo questionari ---------------- */}
        <section className="mt-10" aria-labelledby="questionari">
          <h2 id="questionari" className="text-lg font-semibold text-ink-900">
            I questionari
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            Ogni questionario ha domande proprie: i profili non si sovrappongono.
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {assessments.map((a) => {
              const inProgress = a.progress;
              const done = Boolean(a.result);
              return (
                <Card key={a.id} className="flex flex-col">
                  <CardHeader>
                    <span className="flex flex-wrap items-center gap-2">
                      <CardTitle>{a.name}</CardTitle>
                      {a.isRequired && !done && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
                          Richiesto
                        </span>
                      )}
                    </span>
                    <p className="mt-1 text-sm text-ink-500">{a.subtitle}</p>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col pt-0">
                    <p className="flex-1 text-sm leading-relaxed text-ink-600">{a.description}</p>

                    {inProgress && (
                      <div className="mt-4">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-ink-200">
                          <div
                            className="h-full rounded-full bg-brand-600"
                            style={{
                              width: `${Math.round(
                                (inProgress.answeredCount / inProgress.totalQuestions) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="mt-1.5 text-xs text-ink-500">
                          {inProgress.answeredCount} risposte su {inProgress.totalQuestions}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      <ButtonLink
                        href={`/questionario/${a.slug}${inProgress ? '?start=1' : ''}`}
                        variant={done && !inProgress ? 'secondary' : 'primary'}
                        size="sm"
                      >
                        {inProgress ? 'Riprendi' : done ? 'Rifai il test' : 'Inizia'}
                      </ButtonLink>
                      {a.result && (
                        <ButtonLink href={`/report/${a.result.id}`} variant="secondary" size="sm">
                          Vedi il report
                        </ButtonLink>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
