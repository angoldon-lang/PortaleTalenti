import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DomainBadge } from '@/components/ui/domain-badge';
import { listQuestionsForAdmin } from '@/server/admin-service';
import { toggleQuestionAction } from '@/server/admin-actions';
import { ASSESSMENTS } from '@/content/assessments';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ assessment?: string }>;
}) {
  const { assessment } = await searchParams;
  const questions = await listQuestionsForAdmin(assessment);
  const active = questions.filter((q) => q.isActive).length;

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Domande</h1>
      <p className="mt-2 max-w-3xl text-ink-600">
        {active} item attivi su {questions.length}
        {assessment ? ' nel questionario selezionato' : ' in tutti i questionari'}. Ogni banca è
        bilanciata: tutti i temi compaiono lo stesso numero di volte. Disattivare un item riduce la
        copertura dei due temi coinvolti, quindi conviene intervenire a gruppi omogenei.
      </p>

      <nav aria-label="Filtra per questionario" className="mt-5 flex flex-wrap gap-2">
        <FilterLink href="/admin/domande" active={!assessment} label="Tutti" />
        {ASSESSMENTS.map((a) => (
          <FilterLink
            key={a.slug}
            href={`/admin/domande?assessment=${a.slug}`}
            active={assessment === a.slug}
            label={a.name}
          />
        ))}
      </nav>

      <Card className="mt-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-xs uppercase tracking-wide text-ink-500">
                  <th scope="col" className="px-5 py-3">#</th>
                  <th scope="col" className="px-3 py-3">Questionario</th>
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
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-ink-500">
                      {q.assessment.name}
                    </td>
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

function FilterLink({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm font-medium transition',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50',
      )}
    >
      {label}
    </Link>
  );
}
