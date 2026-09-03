import type { Metadata } from 'next';

import { AppShell } from '@/components/app-shell';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LENS_META } from '@/content/assessments';
import { requireUser } from '@/server/guards';
import { listAssessmentsForUser } from '@/server/test-service';

export const metadata: Metadata = { title: 'Questionari' };

export default async function AssessmentPickerPage() {
  const user = await requireUser('/questionario');
  const assessments = await listAssessmentsForUser(user.id, user.role === 'ADMIN');

  return (
    <AppShell user={{ ...user, role: user.role ?? 'USER' }}>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">Scegli il questionario</h1>
        <p className="mt-2 max-w-2xl text-ink-600">
          Questi sono i questionari abilitati per il tuo ruolo. Se è la prima volta, parti da
          Talenti Essenziale; se vuoi la classifica completa dei 34 temi, scegli CliftonStrengths 34.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {assessments.map((a) => {
            const inProgress = a.progress;
            return (
              <Card key={a.id} className="flex flex-col">
                <CardHeader>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-brand-700">
                      {LENS_META[a.lens].label}
                    </span>
                    {a.isRequired && !a.result && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900">
                        Richiesto
                      </span>
                    )}
                  </span>
                  <CardTitle className="mt-1">{a.name}</CardTitle>
                  <p className="mt-1 text-sm text-ink-500">{a.subtitle}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col pt-0">
                  <p className="flex-1 text-sm leading-relaxed text-ink-600">{a.description}</p>

                  {inProgress && (
                    <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-900">
                      Compilazione in corso: {inProgress.answeredCount}/{inProgress.totalQuestions}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <ButtonLink href={`/questionario/${a.slug}${inProgress ? '?start=1' : ''}`}>
                      {inProgress ? 'Riprendi' : a.result ? 'Rifai il test' : 'Inizia'}
                    </ButtonLink>
                    {a.result && (
                      <ButtonLink href={`/report/${a.result.id}`} variant="secondary">
                        Vedi il report
                      </ButtonLink>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
