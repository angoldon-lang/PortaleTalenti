import { Card, CardContent } from '@/components/ui/card';
import { Button, ButtonLink } from '@/components/ui/button';
import { LENS_META } from '@/content/assessments';
import { listAuditLog, listReportsForAdmin } from '@/server/admin-service';
import { formatDate, formatDuration } from '@/lib/utils';

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [reports, audit] = await Promise.all([
    listReportsForAdmin(q?.trim() || undefined),
    listAuditLog(20),
  ]);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Report</h1>
      <p className="mt-2 max-w-3xl text-ink-600">
        Da qui puoi scaricare il PDF di qualunque profilo compilato. I report descrivono
        preferenze e stile di lavoro di una persona: ogni download viene registrato nel
        tracciato in fondo alla pagina, con chi lo ha effettuato e quando.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-3">
        <form className="flex max-w-md flex-1 gap-2" role="search">
          <label htmlFor="q" className="sr-only">
            Cerca per nome o email
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q ?? ''}
            placeholder="Cerca per nome o email…"
            className="input mt-0 flex-1"
          />
          <Button type="submit" variant="secondary">
            Cerca
          </Button>
        </form>
        <ButtonLink href="/api/admin/export" prefetch={false} variant="secondary">
          Esporta tutti i risultati (CSV)
        </ButtonLink>
      </div>

      <Card className="mt-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-500">
                  <th scope="col" className="px-5 py-3">Persona</th>
                  <th scope="col" className="px-3 py-3">Questionario</th>
                  <th scope="col" className="px-3 py-3">Data</th>
                  <th scope="col" className="px-3 py-3">Durata</th>
                  <th scope="col" className="px-3 py-3">Download</th>
                  <th scope="col" className="px-3 py-3">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-3">
                      <span className="block font-medium text-ink-900">{r.user.name ?? '—'}</span>
                      <span className="block text-xs text-ink-500">{r.user.email}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="block text-ink-800">{r.assessment.name}</span>
                      <span className="block text-xs text-ink-500">
                        {LENS_META[r.assessment.lens].label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-ink-600">
                      {formatDate(r.computedAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-ink-600">
                      {formatDuration(r.durationSeconds)}
                    </td>
                    <td className="px-3 py-3 tabular-nums text-ink-600">{r._count.downloads}</td>
                    <td className="px-3 py-3">
                      <ButtonLink
                        href={`/api/report/${r.id}/pdf`}
                        prefetch={false}
                        variant="secondary"
                        size="sm"
                      >
                        Scarica
                      </ButtonLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reports.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-ink-500">Nessun report trovato.</p>
          )}
        </CardContent>
      </Card>

      <section className="mt-10" aria-labelledby="tracciato">
        <h2 id="tracciato" className="text-lg font-semibold text-ink-900">
          Registro degli accessi
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-ink-600">
          Ultime 20 azioni amministrative su dati personali. Il registro serve a poter dire, se
          qualcuno lo chiede, chi ha visto il suo profilo.
        </p>

        <Card className="mt-4 overflow-hidden">
          <CardContent className="p-0">
            {audit.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-ink-500">
                Nessuna azione registrata finora.
              </p>
            ) : (
              <ul className="divide-y divide-ink-100 text-sm">
                {audit.map((entry) => (
                  <li key={entry.id} className="flex flex-wrap gap-x-3 gap-y-1 px-5 py-3">
                    <span className="font-mono text-xs text-ink-500">
                      {entry.createdAt.toLocaleString('it-IT')}
                    </span>
                    <span className="font-medium text-ink-900">{ACTION_LABEL[entry.action]}</span>
                    <span className="text-ink-600">
                      {entry.actorEmail}
                      {entry.subjectEmail ? ` → ${entry.subjectEmail}` : ''}
                      {entry.detail ? ` · ${entry.detail}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}

const ACTION_LABEL: Record<string, string> = {
  REPORT_DOWNLOAD: 'Download report',
  RESULTS_EXPORT: 'Export risultati',
  USER_CREATED: 'Utente creato',
  ROLE_CHANGED: 'Ruolo modificato',
};
