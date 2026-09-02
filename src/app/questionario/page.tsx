import type { Metadata } from 'next';
import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { Button, ButtonLink } from '@/components/ui/button';
import { QuestionnaireRunner } from '@/components/questionnaire/questionnaire-runner';
import { requireUser } from '@/server/guards';
import { getLatestReport, getOrCreateTestSession } from '@/server/test-service';
import { restartTestAction } from '@/server/test-actions';

export const metadata: Metadata = { title: 'Questionario' };

export default async function QuestionnairePage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>;
}) {
  const user = await requireUser('/questionario');
  const [{ start }, state, existingReport] = await Promise.all([
    searchParams,
    getOrCreateTestSession(user.id),
    getLatestReport(user.id),
  ]);

  const showIntro = start !== '1' && state.answeredCount === 0;
  const estimatedMinutes = Math.ceil((state.totalQuestions * (state.timerSeconds || 15)) / 60);

  return (
    <AppShell user={{ ...user, role: user.role ?? 'USER' }}>
      {showIntro ? (
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
            Prima di iniziare
          </h1>
          <p className="mt-3 text-ink-600">
            Ti mostreremo {state.totalQuestions} coppie di affermazioni. Per ciascuna scegli
            quanto ti descrive l’una rispetto all’altra. Servono circa {estimatedMinutes} minuti.
          </p>

          <ul className="mt-8 space-y-4">
            <Tip title="Rispondi d’istinto">
              {state.timerSeconds > 0
                ? `Hai ${state.timerSeconds} secondi per domanda. La prima reazione è quasi sempre la più
                   fedele: il tempo serve proprio a impedire la risposta "giusta" costruita a tavolino.`
                : 'La prima reazione è quasi sempre la più fedele. Non ragionare troppo su ogni item.'}
            </Tip>
            <Tip title="Non esistono risposte migliori">
              Nessun profilo vale più di un altro. Il report descrive come funzioni, non quanto vali.
            </Tip>
            <Tip title="Puoi interrompere quando vuoi">
              Ogni risposta viene salvata subito. Se chiudi la pagina, riprendi dallo stesso punto.
            </Tip>
            <Tip title="Pensa al tuo comportamento reale">
              Non a come vorresti essere o a ciò che il tuo ruolo richiede: a ciò che fai davvero.
            </Tip>
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/questionario?start=1" size="lg">
              Inizia il questionario
            </ButtonLink>
            {existingReport && (
              <ButtonLink href="/dashboard" variant="secondary" size="lg">
                Torna al mio report
              </ButtonLink>
            )}
          </div>
        </div>
      ) : (
        <>
          <QuestionnaireRunner state={state} />
          <div className="mx-auto max-w-3xl px-4 pb-16 text-center sm:px-6">
            <form action={restartTestAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-ink-400 hover:text-ink-700"
              >
                Ricomincia il questionario da capo
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
