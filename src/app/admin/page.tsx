import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DomainBadge } from '@/components/ui/domain-badge';
import { DOMAIN_META, DOMAIN_ORDER } from '@/content/themes';
import { getAdminMetrics } from '@/server/admin-service';
import { formatDate, formatDuration } from '@/lib/utils';

export default async function AdminMetricsPage() {
  const m = await getAdminMetrics();
  const maxTopFive = Math.max(1, ...m.themeLeaderboard.map((t) => t.topFiveCount));

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Metriche del portale</h1>
      <p className="mt-2 text-ink-600">
        Andamento delle compilazioni e distribuzione dei talenti sulla popolazione.
      </p>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Utenti registrati" value={m.totalUsers} hint={`+${m.newUsers30d} negli ultimi 30 giorni`} />
        <Metric label="Test completati" value={m.testsCompleted} hint={`${m.completionRate}% di completamento`} />
        <Metric label="Test in corso" value={m.testsInProgress} hint="sessioni non ancora concluse" />
        <Metric
          label="Durata media"
          value={formatDuration(m.avgDurationSeconds)}
          hint={`${m.avgTimeoutRatio}% di risposte scadute`}
        />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bilanciamento medio della popolazione</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {DOMAIN_ORDER.map((d) => (
              <div key={d} className="flex items-center gap-3">
                <span className="w-40 shrink-0 text-sm text-ink-700">{DOMAIN_META[d].label}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${Math.min(100, m.domainAverages[d] * 2)}%`,
                      backgroundColor: DOMAIN_META[d].color,
                    }}
                  />
                </span>
                <span className="w-12 shrink-0 text-right text-sm tabular-nums text-ink-600">
                  {m.domainAverages[d]}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temi più frequenti nelle Top 5</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {m.themeLeaderboard.slice(0, 8).map((t) => (
              <div key={t.slug} className="flex items-center gap-3">
                <span className="w-36 shrink-0 truncate text-sm text-ink-800">{t.name}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${(t.topFiveCount / maxTopFive) * 100}%`,
                      backgroundColor: DOMAIN_META[t.domain].color,
                    }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right text-sm tabular-nums text-ink-600">
                  {t.topFiveCount}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Ultime compilazioni</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {m.recentResults.length === 0 ? (
              <p className="text-sm text-ink-500">Nessun test completato finora.</p>
            ) : (
              <div className="-mx-5 overflow-x-auto sm:-mx-6">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-500">
                      <th scope="col" className="px-5 py-2 sm:px-6">Utente</th>
                      <th scope="col" className="px-3 py-2">Data</th>
                      <th scope="col" className="px-3 py-2">Durata</th>
                      <th scope="col" className="px-3 py-2">Top 5</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {m.recentResults.map((r) => (
                      <tr key={r.id}>
                        <td className="px-5 py-2.5 sm:px-6">
                          <span className="block font-medium text-ink-900">{r.userName ?? '—'}</span>
                          <span className="block text-xs text-ink-500">{r.userEmail}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-ink-600">
                          {formatDate(r.computedAt)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-ink-600">
                          {formatDuration(r.durationSeconds)}
                        </td>
                        <td className="px-3 py-2.5 text-ink-600">{r.topThemeNames.join(' · ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Catalogo dei temi</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="grid gap-2 sm:grid-cols-2">
              {m.themeLeaderboard.map((t) => (
                <li key={t.slug} className="flex items-center justify-between gap-3 rounded-xl bg-ink-50 px-3 py-2">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink-900">{t.name}</span>
                    <DomainBadge domain={t.domain} />
                  </span>
                  <span className="text-xs text-ink-500">media {t.avgScore}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function Metric({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
