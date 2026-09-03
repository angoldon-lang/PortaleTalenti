import { ButtonLink } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DomainDonut, ThemeRadar } from '@/components/report/domain-charts';
import { TalentCard } from '@/components/report/talent-card';
import { GroupBadge } from '@/components/ui/group-badge';
import { buildReportModel, lensMetaFor } from '@/components/report/report-model';
import type { FullReport } from '@/server/test-service';
import { formatDate, formatDuration } from '@/lib/utils';

/**
 * Il report completo. Legge un modello di vista comune alle due metodologie
 * del portale (vedi `report-model.ts`), così questa pagina non deve sapere se
 * il questionario compilato fosse a coppie di affermazioni o a blocchi.
 *
 * La "lente" dell'assessment decide quante voci mettere in evidenza e quale
 * sezione aggiuntiva mostrare in ciascuna scheda.
 */
export function ReportView({
  report,
  title,
  /** Intestazione mostrata a un amministratore che consulta il report altrui. */
  adminNotice,
}: {
  report: FullReport;
  title: string;
  adminNotice?: React.ReactNode;
}) {
  const lensMeta = lensMetaFor(report);
  const model = buildReportModel(report);
  const { groups, items, itemNoun, unitNoun, quality } = model;

  const topCount = model.topCount;
  const top = items.slice(0, topCount);
  const dominantGroup = groups.reduce((a, b) => (b.value > a.value ? b : a));
  const totalItems = items.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {adminNotice}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-700">
            {report.assessment.name} · {lensMeta.label}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-ink-600">
            Compilato il {formatDate(report.computedAt)} · {report.testSession.totalQuestions}{' '}
            {unitNoun.plural} · {totalItems} {itemNoun.plural} ·{' '}
            {formatDuration(report.durationSeconds)}
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
          <ButtonLink href="/dashboard" variant="secondary">
            Tutti i miei report
          </ButtonLink>
        </div>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={`${capitalize(itemNoun.singular)} dominante`} value={top[0]!.name}>
          <GroupBadge label={top[0]!.groupLabel} color={top[0]!.groupColor} />
        </StatCard>
        <StatCard label="Macro-area prevalente" value={dominantGroup.label}>
          <span className="text-sm text-ink-500">{dominantGroup.value.toFixed(1)}% del profilo</span>
        </StatCard>
        <StatCard
          label={`Distanza dal 2° ${itemNoun.singular}`}
          value={`${Math.round(top[0]!.score - top[1]!.score)} pt`}
        >
          <span className="text-sm text-ink-500">
            {top[0]!.score - top[1]!.score > 8 ? 'Profilo molto marcato' : 'Profilo equilibrato'}
          </span>
        </StatCard>
        {quality.consistency ? (
          <StatCard label="Attendibilità" value={quality.consistency.label}>
            <span className="text-sm text-ink-500">
              {Math.round(quality.inTimeRatio * 100)}% dei {unitNoun.plural} completati in tempo
            </span>
          </StatCard>
        ) : (
          <StatCard
            label="Risposte istintive"
            value={`${Math.round(quality.inTimeRatio * 100)}%`}
          >
            <span className="text-sm text-ink-500">date entro il tempo</span>
          </StatCard>
        )}
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{model.groupsHeading}</CardTitle>
            <CardDescription>{model.groupsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <DomainDonut data={groups} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>La forma del tuo profilo</CardTitle>
            <CardDescription>
              Intensità dei {totalItems} {itemNoun.plural}. Un profilo appuntito indica una
              specializzazione netta; uno regolare, versatilità.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ThemeRadar
              groupOrder={groups.map((g) => g.key)}
              data={items.map((item) => ({
                slug: item.slug,
                name: item.name,
                groupKey: item.groupKey,
                groupColor: item.groupColor,
                score: item.score,
                rank: item.rank,
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
            {groups
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
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-600">{d.description}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-10" aria-labelledby="dominanti">
        <h2 id="dominanti" className="text-2xl font-semibold tracking-tight text-ink-900">
          {lensMeta.detailHeading}
        </h2>
        <p className="mt-2 max-w-2xl text-ink-600">{lensMeta.detailIntro}</p>

        <div className="mt-6 space-y-4">
          {top.map((item, i) => (
            <TalentCard key={item.slug} talent={item} defaultOpen={i === 0} />
          ))}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="completa">
        <h2 id="completa" className="text-2xl font-semibold tracking-tight text-ink-900">
          La classifica completa
        </h2>
        <p className="mt-2 max-w-2xl text-ink-600">
          I {itemNoun.plural} in fondo alla lista non sono difetti: sono aree in cui conviene
          appoggiarsi ad altri invece di investire energie per colmare un divario.
        </p>

        <Card className="mt-6 overflow-hidden">
          <ul className="divide-y divide-ink-200/70">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 px-5 py-3 sm:px-6">
                <span className="w-6 shrink-0 text-sm font-semibold tabular-nums text-ink-400">
                  {item.rank}
                </span>
                <span className="w-40 shrink-0 truncate font-medium text-ink-900 sm:w-52">
                  {item.name}
                </span>
                <span className="hidden sm:block">
                  <GroupBadge label={item.groupLabel} color={item.groupColor} />
                </span>
                <span className="ml-auto flex flex-1 items-center gap-3">
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${Math.max(2, item.score)}%`,
                        backgroundColor: item.groupColor,
                        opacity: item.rank <= topCount ? 1 : 0.45,
                      }}
                    />
                  </span>
                  <span className="w-9 shrink-0 text-right text-sm tabular-nums text-ink-600">
                    {Math.round(item.score)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <p className="mt-4 text-sm text-ink-500">
          Punteggi normalizzati sul tuo profilo (media 50): indicano quanto ciascun{' '}
          {itemNoun.singular} si stacca dalla tua media personale, non un confronto con altre
          persone.
        </p>

        {quality.consistency && (
          <Card className="mt-5">
            <CardHeader>
              <CardTitle>Come è andata la compilazione</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-[15px] leading-relaxed text-ink-700">
              <p className="font-medium text-ink-900">{quality.consistency.label}</p>
              <p className="mt-1">{quality.consistency.note}</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

/** "tratto" → "Tratto": serve solo per le etichette delle statistiche. */
function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
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
