import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { Button, ButtonLink } from '@/components/ui/button';
import { QuestionnaireRunner } from '@/components/questionnaire/questionnaire-runner';
import { BlockRunner } from '@/components/questionnaire/block-runner';
import { requireUser } from '@/server/guards';
import {
  AssessmentNotAllowedError,
  getAssessmentBySlug,
  getLatestReport,
  getOrCreateTestSession,
} from '@/server/test-service';
import { getOrCreateBlockSession } from '@/server/mpf-service';
import { restartTestAction } from '@/server/test-actions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const assessment = await getAssessmentBySlug(slug);
  return { title: assessment?.name ?? 'Questionario' };
}

export default async function QuestionnairePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ start?: string }>;
}) {
  const user = await requireUser('/questionario');
  const [{ slug }, { start }] = await Promise.all([params, searchParams]);

  const assessment = await getAssessmentBySlug(slug);
  if (!assessment) notFound();

  const isAdmin = user.role === 'ADMIN';
  // I due formati hanno sessione e componente propri; il resto della pagina —
  // avviso di ruolo, introduzione, ripresa — è lo stesso.
  const isQuartet = assessment.itemFormat === 'FORCED_CHOICE_QUARTET';

  let likertState: Awaited<ReturnType<typeof getOrCreateTestSession>> | null = null;
  let blockState: Awaited<ReturnType<typeof getOrCreateBlockSession>> | null = null;
  try {
    if (isQuartet) {
      blockState = await getOrCreateBlockSession(user.id, slug, isAdmin);
    } else {
      likertState = await getOrCreateTestSession(user.id, slug, isAdmin);
    }
  } catch (error) {
    if (error instanceof AssessmentNotAllowedError) {
      return (
        <AppShell user={{ ...user, role: user.role ?? 'USER' }}>
          <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
            <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
              Questionario non disponibile
            </h1>
            <p className="mt-3 text-ink-600">
              «{assessment.name}» non è fra i questionari previsti per il tuo ruolo. Se pensi che
              debba esserlo, parlane con chi amministra il portale.
            </p>
            <ButtonLink href="/questionario" className="mt-8">
              Vedi i questionari disponibili
            </ButtonLink>
          </div>
        </AppShell>
      );
    }
    throw error;
  }

  const existingReport = await getLatestReport(user.id, slug);

  const answeredCount = blockState?.answeredCount ?? likertState!.answeredCount;
  const timerSeconds = blockState?.timerSeconds ?? likertState!.timerSeconds;
  const itemCount = blockState?.totalBlocks ?? likertState!.totalQuestions;
  const showIntro = start !== '1' && answeredCount === 0;

  return (
    <AppShell user={{ ...user, role: user.role ?? 'USER' }}>
      {showIntro ? (
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <Link href="/questionario" className="text-sm text-brand-700 underline underline-offset-2">
            ← Tutti i questionari
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900">
            {assessment.name}
          </h1>
          <p className="mt-3 text-ink-600">
            {isQuartet ? (
              <>
                {itemCount} blocchi da quattro affermazioni, circa {assessment.estimatedMinutes}{' '}
                minuti. In ciascuno indichi quella che ti descrive di più e quella che ti descrive
                di meno.
              </>
            ) : (
              <>
                {itemCount} coppie di affermazioni, circa {assessment.estimatedMinutes} minuti. Per
                ciascuna scegli quanto ti descrive l’una rispetto all’altra.
              </>
            )}
          </p>

          <ul className="mt-8 space-y-4">
            <Tip title="Rispondi d’istinto">
              {timerSeconds > 0
                ? `Hai ${timerSeconds} secondi per ${isQuartet ? 'blocco' : 'domanda'}. La prima
                   reazione è quasi sempre la più fedele: il tempo serve proprio a impedire la
                   risposta "giusta" costruita a tavolino.`
                : 'La prima reazione è quasi sempre la più fedele. Non ragionare troppo su ogni item.'}
            </Tip>
            {isQuartet ? (
              <Tip title="Sceglierai fra affermazioni tutte plausibili">
                Le quattro frasi di ogni blocco descrivono qualità diverse e nessuna è sbagliata.
                Doverne scegliere una sola è il punto: è il confronto a dire che cosa conta di più
                per te.
              </Tip>
            ) : (
              <Tip title="Non esistono risposte migliori">
                Nessun profilo vale più di un altro. Il report descrive come funzioni, non quanto
                vali.
              </Tip>
            )}
            <Tip title="Puoi interrompere quando vuoi">
              Ogni risposta viene salvata subito. Se chiudi la pagina, riprendi dallo stesso punto.
            </Tip>
            <Tip title="Pensa al tuo comportamento reale">
              {assessment.lens === 'LEADERS'
                ? 'Rispondi pensando a come ti comporti davvero quando guidi, non a come vorresti comportarti.'
                : assessment.lens === 'MANAGERS'
                  ? 'Rispondi pensando a come gestisci davvero i tuoi collaboratori, non a come dovresti farlo.'
                  : 'Non a come vorresti essere o a ciò che il tuo ruolo richiede: a ciò che fai davvero.'}
            </Tip>
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`/questionario/${slug}?start=1`} size="lg">
              Inizia il questionario
            </ButtonLink>
            {existingReport && (
              <ButtonLink href={`/report/${existingReport.id}`} variant="secondary" size="lg">
                Vedi il report precedente
              </ButtonLink>
            )}
          </div>
        </div>
      ) : (
        <>
          {blockState ? (
            <BlockRunner state={blockState} />
          ) : (
            <QuestionnaireRunner state={likertState!} />
          )}
          <div className="mx-auto max-w-3xl px-4 pb-16 text-center sm:px-6">
            <form action={restartTestAction}>
              <input type="hidden" name="assessment" value={slug} />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-ink-400 hover:text-ink-700"
              >
                Ricomincia questo questionario da capo
              </Button>
            </form>
            <p className="mt-2 text-xs text-ink-400">
              Le risposte già date verranno eliminate.{' '}
              <Link href="/dashboard" className="underline underline-offset-2">
                Torna alla dashboard
              </Link>
            </p>
          </div>
        </>
      )}
    </AppShell>
  );
}

function Tip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="rounded-2xl border border-ink-200/70 bg-white p-5">
      <h2 className="font-semibold text-ink-900">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{children}</p>
    </li>
  );
}
