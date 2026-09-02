import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listUsersForAdmin } from '@/server/admin-service';
import { setUserRoleAction } from '@/server/admin-actions';
import { requireAdmin } from '@/server/guards';
import { formatDate } from '@/lib/utils';

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [admin, { q }] = await Promise.all([requireAdmin(), searchParams]);
  const users = await listUsersForAdmin(q?.trim() || undefined);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Utenti</h1>
      <p className="mt-2 text-ink-600">
        Stato delle compilazioni e gestione dei ruoli. Vengono mostrati i 50 utenti più recenti.
      </p>

      <form className="mt-6 flex max-w-md gap-2" role="search">
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

      <Card className="mt-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-500">
                  <th scope="col" className="px-5 py-3">Utente</th>
                  <th scope="col" className="px-3 py-3">Registrato</th>
                  <th scope="col" className="px-3 py-3">Stato test</th>
                  <th scope="col" className="px-3 py-3">Report</th>
                  <th scope="col" className="px-3 py-3">Ruolo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {users.map((u) => {
                  const session = u.testSessions[0];
                  return (
                    <tr key={u.id}>
                      <td className="px-5 py-3">
                        <span className="block font-medium text-ink-900">{u.name ?? '—'}</span>
                        <span className="block text-xs text-ink-500">{u.email}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-ink-600">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-3 py-3 text-ink-600">
                        {!session
                          ? 'Mai iniziato'
                          : session.status === 'COMPLETED'
                            ? 'Completato'
                            : `In corso · ${session.answeredCount}/${session.totalQuestions}`}
                      </td>
                      <td className="px-3 py-3 tabular-nums text-ink-600">{u._count.results}</td>
                      <td className="px-3 py-3">
                        {u.id === admin.id ? (
                          <span className="text-xs text-ink-500">Amministratore (tu)</span>
                        ) : (
                          <form action={setUserRoleAction} className="flex items-center gap-2">
                            <input type="hidden" name="userId" value={u.id} />
                            <input
                              type="hidden"
                              name="role"
                              value={u.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                            />
                            <span className="text-xs font-medium text-ink-700">
                              {u.role === 'ADMIN' ? 'Admin' : 'Utente'}
                            </span>
                            <Button type="submit" variant="secondary" size="sm">
                              {u.role === 'ADMIN' ? 'Rendi utente' : 'Rendi admin'}
                            </Button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-ink-500">Nessun utente trovato.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
