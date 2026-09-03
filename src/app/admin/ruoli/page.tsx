import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LENS_META } from '@/content/assessments';
import { listOrgRoles } from '@/server/admin-service';
import { saveOrgRoleAssessmentsAction } from '@/server/admin-actions';
import { prisma } from '@/lib/prisma';

export default async function AdminOrgRolesPage() {
  const [roles, assessments] = await Promise.all([
    listOrgRoles(),
    prisma.assessment.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, subtitle: true, lens: true },
    }),
  ]);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Ruoli e questionari</h1>
      <p className="mt-2 max-w-3xl text-ink-600">
        Ogni persona vede solo i questionari abilitati per il suo ruolo organizzativo. Spunta
        <strong> Abilitato</strong> per renderlo disponibile e <strong>Richiesto</strong> per
        segnalarlo come da compilare: la persona lo vedrà evidenziato nella sua dashboard.
      </p>
      <p className="mt-2 max-w-3xl text-sm text-ink-500">
        Chi non ha un ruolo assegnato ricade su quello predefinito. Gli amministratori vedono
        comunque tutti i questionari, per poterli provare prima di assegnarli.
      </p>

      <div className="mt-8 space-y-6">
        {roles.map((role) => {
          const enabled = new Map(role.assessments.map((a) => [a.assessmentId, a.isRequired]));

          return (
            <Card key={role.id}>
              <CardHeader>
                <span className="flex flex-wrap items-center gap-2">
                  <CardTitle>{role.name}</CardTitle>
                  {role.isDefault && (
                    <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-800">
                      Predefinito
                    </span>
                  )}
                  <span className="text-xs text-ink-500">
                    {role._count.users} {role._count.users === 1 ? 'persona' : 'persone'}
                  </span>
                </span>
                <p className="mt-1.5 text-sm text-ink-600">{role.description}</p>
              </CardHeader>

              <CardContent className="pt-0">
                <form action={saveOrgRoleAssessmentsAction}>
                  <input type="hidden" name="orgRoleId" value={role.id} />

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-500">
                          <th scope="col" className="py-2">Questionario</th>
                          <th scope="col" className="w-28 py-2">Abilitato</th>
                          <th scope="col" className="w-28 py-2">Richiesto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink-100">
                        {assessments.map((a) => (
                          <tr key={a.id}>
                            <td className="py-2.5">
                              <span className="block font-medium text-ink-900">{a.name}</span>
                              <span className="block text-xs text-ink-500">
                                {a.subtitle} · {LENS_META[a.lens].label}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  name={`enabled:${a.id}`}
                                  defaultChecked={enabled.has(a.id)}
                                  className="h-4 w-4 rounded border-ink-300"
                                />
                                <span className="sr-only">
                                  Abilita {a.name} per {role.name}
                                </span>
                              </label>
                            </td>
                            <td className="py-2.5">
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  name={`required:${a.id}`}
                                  defaultChecked={enabled.get(a.id) === true}
                                  className="h-4 w-4 rounded border-ink-300"
                                />
                                <span className="sr-only">
                                  Rendi {a.name} richiesto per {role.name}
                                </span>
                              </label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Button type="submit" size="sm" className="mt-4">
                    Salva {role.name}
                  </Button>
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
