import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DomainBadge } from '@/components/ui/domain-badge';
import { listQuestionsForAdmin } from '@/server/admin-service';
import { toggleQuestionAction } from '@/server/admin-actions';

export default async function AdminQuestionsPage() {
  const questions = await listQuestionsForAdmin();
  const active = questions.filter((q) => q.isActive).length;

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Domande</h1>
      <p className="mt-2 max-w-3xl text-ink-600">
        {active} item attivi su {questions.length}. Il banco segue un design a confronto a coppie
        completo: ogni coppia di temi è confrontata esattamente una volta. Disattivare un item
        riduce la copertura dei due temi coinvolti, quindi conviene disattivarli a gruppi omogenei.
      </p>

      <Card className="mt-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-500">
                  <th scope="col" className="px-5 py-3">#</th>
                  <th scope="col" className="px-3 py-3">Affermazione A</th>
                  <th scope="col" className="px-3 py-3">Affermazione B</th>
                  <th scope="col" className="px-3 py-3">Risposte</th>
                  <th scope="col" className="px-3 py-3">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {questions.map((q) => (
                  <tr key={q.id} className={q.isActive ? undefined : 'bg-ink-50/70'}>
                    <td className="px-5 py-3 tabular-nums text-ink-500">{q.position}</td>
                    <td className="px-3 py-3">
                      <span className="block text-ink-900">{q.leftStatement}</span>
                      <span className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                        {q.leftTheme.name}
                        <DomainBadge domain={q.leftTheme.domain} />
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="block text-ink-900">{q.rightStatement}</span>
                      <span className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                        {q.rightTheme.name}
                        <DomainBadge domain={q.rightTheme.domain} />
                      </span>
                    </td>
                    <td className="px-3 py-3 tabular-nums text-ink-600">{q._count.responses}</td>
                    <td className="px-3 py-3">
                      <form action={toggleQuestionAction}>
                        <input type="hidden" name="questionId" value={q.id} />
                        <Button type="submit" variant="secondary" size="sm">
                          {q.isActive ? 'Disattiva' : 'Riattiva'}
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
