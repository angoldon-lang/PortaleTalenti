import type { Metadata } from 'next';
import type { Domain } from '@prisma/client';

import { AppShell } from '@/components/app-shell';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DomainDonut, ThemeRadar, type DomainDatum } from '@/components/report/domain-charts';
import { TalentCard, type TalentCardData } from '@/components/report/talent-card';
import { DomainBadge } from '@/components/ui/domain-badge';
import { DOMAIN_META, DOMAIN_ORDER } from '@/content/themes';
import { requireUser } from '@/server/guards';
import { getLatestReport, getOrCreateTestSession } from '@/server/test-service';
import { formatDate, formatDuration } from '@/lib/utils';

export const metadata: Metadata = { title: 'Il mio profilo' };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ nuovo?: string }>;
}) {
  const user = await requireUser('/dashboard');
  const [params, report] = await Promise.all([searchParams, getLatestReport(user.id)]);
  const shellUser = { ...user, role: user.role ?? ('USER' as const) };

  if (!report) return <EmptyState user={shellUser} />;

  const domainData: DomainDatum[] = DOMAIN_ORDER.map((domain) => ({
    key: domain,
    label: DOMAIN_META[domain].label,
    short: DOMAIN_META[domain].short,
    color: DOMAIN_META[domain].color,
    value: {
      EXECUTING: report.executingScore,
      INFLUENCING: report.influencingScore,
      RELATIONSHIP: report.relationshipScore,
      STRATEGIC: report.strategicScore,
    }[domain],
  }));

  const topFive: TalentCardData[] = report.themeScores.slice(0, 5).map((s) => ({
    rank: s.rank,
    slug: s.theme.slug,
    name: s.theme.name,
    domain: s.theme.domain,
    tagline: s.theme.tagline,
    fullDescription: s.theme.fullDescription,
    strengths: s.theme.strengths,
    blindSpots: s.theme.blindSpots,
    actionTips: s.theme.actionTips,
    thrivesIn: s.theme.thrivesIn,
    score: s.normalizedScore,
  }));

  const dominantDomain = domainData.reduce((a, b) => (b.value > a.value ? b : a));
  const supportingThemes = report.themeScores.slice(5);

  return (
    <AppShell user={shellUser}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {params.nuovo === '1' && (
          <div
            role="status"
            className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900"
          >
            <strong className="font-semibold">Profilo pronto.</strong> Ecco i cinque talenti che
            emergono con più forza dalle tue risposte.
          </div>
        )}

        {/* ---------------- Intestazione del report ---------------- */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand-700">Report dei talenti</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              {user.name ?? 'Il tuo profilo'}
            </h1>
            <p className="mt-2 text-ink-600">
              Compilato il {formatDate(report.computedAt)} · {report.testSession.totalQuestions}{' '}
              domande · {formatDuration(report.durationSeconds)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ButtonLink href={`/api/report/${report.id}/pdf`} prefetch={false}>
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
                <path
                  fill="currentColor"
                  d="M10 2a1 1 0 0 1 1 1v7.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.42L9 10.6V3a1 1 0 0 1 1-1ZM3 15a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 2 17.5V16a1 1 0 0 1 1-1Z"
                />
              </svg>
              Scarica il PDF
            </ButtonLink>
            <ButtonLink href="/questionario" variant="secondary">
              Rifai il test
            </ButtonLink>
          </div>
        </header>

        {/* ---------------- Sintesi ---------------- */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Talento dominante" value={topFive[0]!.name}>
            <DomainBadge domain={topFive[0]!.domain} />
          </StatCard>
          <StatCard label="Macro-area prevalente" value={dominantDomain.label}>
            <span className="text-sm text-ink-500">{dominantDomain.value.toFixed(1)}% del profilo</span>
          </StatCard>
          <StatCard
            label="Distanza dal 2° talento"
            value={`${Math.round(topFive[0]!.score - topFive[1]!.score)} pt`}
          >
            <span className="text-sm text-ink-500">
              {topFive[0]!.score - topFive[1]!.score > 8 ? 'Profilo molto marcato' : 'Profilo equilibrato'}
            </span>
          </StatCard>
          <StatCard label="Risposte istintive" value={`${Math.round((1 - report.timeoutRatio) * 100)}%`}>
            <span className="text-sm text-ink-500">date entro il tempo</span>
          </StatCard>
        </section>

        {/* ---------------- Grafici ---------------- */}
        <section className="mt-8 grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Bilanciamento fra le macro-aree</CardTitle>
              <CardDescription>
                Come si distribuisce la tua energia fra i quattro modi di contribuire a un gruppo.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <DomainDonut data={domainData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>La forma del tuo profilo</CardTitle>
              <CardDescription>
                Intensità dei 12 temi. Un profilo appuntito indica una specializzazione netta; uno
                regolare, versatilità.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ThemeRadar
                data={report.themeScores.map((s) => ({
                  slug: s.theme.slug,
                  name: s.theme.name,
                  domain: s.theme.domain,
                  score: s.normalizedScore,
                  rank: s.rank,
                }))}
              />
            </CardContent>
          </Card>
        </section>

        <section className="mt-5">
          <Card>
            <CardHeader>
              <CardTitle>Cosa significa il tuo bilanciamento</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 pt-0 sm:grid-cols-2">
              {domainData
                .slice()
                .sort((a, b) => b.value - a.value)
                .map((d) => (
                  <div key={d.key} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1 h-full w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <div>
                      <p className="font-medium text-ink-900">
                        {d.label} · {d.value.toFixed(1)}%
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-600">
                        {DOMAIN_META[d.key as Domain].description}
                      </p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </section>

        {/* ---------------- Top 5 ---------------- */}
        <section className="mt-10" aria-labelledby="top5">
          <h2 id="top5" className="text-2xl font-semibold tracking-tight text-ink-900">
            I tuoi 5 talenti dominanti
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Apri ciascuna scheda per leggere la descrizione completa, i punti di forza associati e i
            punti ciechi da tenere sotto controllo.
          </p>

          <div className="mt-6 space-y-4">
            {topFive.map((talent, i) => (
              <TalentCard key={talent.slug} talent={talent} defaultOpen={i === 0} />
            ))}
          </div>
        </section>

        {/* ---------------- Classifica completa ---------------- */}
        <section className="mt-10" aria-labelledby="completa">
          <h2 id="completa" className="text-2xl font-semibold tracking-tight text-ink-900">
            La classifica completa
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            I temi in fondo alla lista non sono difetti: sono aree in cui conviene appoggiarsi ad
            altri invece di investire energie per colmare un divario.
          </p>

          <Card className="mt-6 overflow-hidden">
            <ul className="divide-y divide-ink-200/70">
              {report.themeScores.map((s) => (
                <li key={s.id} className="flex items-center gap-4 px-5 py-3 sm:px-6">
                  <span className="w-6 shrink-0 text-sm font-semibold tabular-nums text-ink-400">
                    {s.rank}
                  </span>
                  <span className="w-40 shrink-0 truncate font-medium text-ink-900 sm:w-52">
                    {s.theme.name}
                  </span>
                  <span className="hidden sm:block">
                    <DomainBadge domain={s.theme.domain} />
                  </span>
                  <span className="ml-auto flex flex-1 items-center gap-3">
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${Math.max(2, s.normalizedScore)}%`,
                          backgroundColor: DOMAIN_META[s.theme.domain].color,
                          opacity: s.rank <= 5 ? 1 : 0.45,
                        }}
                      />
                    </span>
                    <span className="w-9 shrink-0 text-right text-sm tabular-nums text-ink-600">
                      {Math.round(s.normalizedScore)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {supportingThemes.length > 0 && (
            <p className="mt-4 text-sm text-ink-500">
              Punteggi normalizzati sul tuo profilo (media 50): indicano quanto ciascun tema si
              stacca dalla tua media personale, non un confronto con altre persone.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1.5 text-xl font-semibold text-ink-900">{value}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

async function EmptyState({
  user,
}: {
  user: { name?: string | null; email?: string | null; role: 'USER' | 'ADMIN' };
}) {
  const state = await getOrCreateTestSession((await requireUser()).id);
  const started = state.answeredCount > 0;

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
          {started ? 'Il tuo questionario è a metà' : 'Il tuo profilo ti aspetta'}
        </h1>
        <p className="mt-3 text-ink-600">
          {started
            ? `Hai risposto a ${state.answeredCount} domande su ${state.totalQuestions}. Riprendi da dove
               eri rimasto: le tue risposte sono al sicuro.`
            : `Rispondi a ${state.totalQuestions} coppie di affermazioni e scopri i cinque talenti che
               ti descrivono meglio.`}
        </p>

        {started && (
          <div className="mx-auto mt-6 h-2 w-full max-w-sm overflow-hidden rounded-full bg-ink-200">
            <div
              className="h-full rounded-full bg-brand-600"
              style={{ width: `${Math.round((state.answeredCount / state.totalQuestions) * 100)}%` }}
            />
          </div>
        )}

        <ButtonLink href={started ? '/questionario?start=1' : '/questionario'} size="lg" className="mt-8">
          {started ? 'Riprendi il questionario' : 'Inizia il questionario'}
        </ButtonLink>
      </div>
    </AppShell>
  );
}
