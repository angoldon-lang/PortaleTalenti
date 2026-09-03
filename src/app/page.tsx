import Link from 'next/link';

import { ButtonLink } from '@/components/ui/button';
import { DOMAIN_META, DOMAIN_ORDER, THEMES } from '@/content/themes';
import { ASSESSMENTS } from '@/content/assessments';
import { getCurrentUser } from '@/server/guards';

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-dvh bg-white">
      <header className="border-b border-ink-200/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="text-base font-semibold tracking-tight">
            Portale<span className="text-brand-600">Talenti</span>
          </span>
          <nav className="flex items-center gap-2">
            {user ? (
              <ButtonLink href="/dashboard" size="sm">
                Vai al mio profilo
              </ButtonLink>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
                >
                  Accedi
                </Link>
                <ButtonLink href="/registrazione" size="sm">
                  Inizia gratis
                </ButtonLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="contenuto">
        {/* ---------------- Hero ---------------- */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-brand-700">
              {ASSESSMENTS.length} questionari psicometrici · da 22 a 45 minuti
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-ink-900 sm:text-5xl">
              Scopri dove sei già forte, invece di rincorrere ciò che ti manca.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-600">
              Un percorso ispirato al modello delle quattro macro-aree di Gallup
              CliftonStrengths: coppie di affermazioni contrapposte, risposte
              d’istinto e un report che traduce i tuoi talenti in comportamenti concreti.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={user ? '/questionario' : '/registrazione'} size="lg">
                {user ? 'Vai al questionario' : 'Inizia il questionario'}
              </ButtonLink>
              <ButtonLink href="/login" variant="secondary" size="lg">
                Ho già un account
              </ButtonLink>
            </div>
          </div>
        </section>

        {/* ---------------- Come funziona ---------------- */}
        <section className="border-y border-ink-200/70 bg-ink-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900">Come funziona</h2>
            <ol className="mt-8 grid gap-6 sm:grid-cols-3">
              <Step
                number={1}
                title="Rispondi d’istinto"
                text="Coppie di affermazioni opposte, con un timer di 20 secondi per item. Il tempo serve a far emergere la reazione spontanea invece della risposta costruita."
              />
              <Step
                number={2}
                title="Il motore calcola il profilo"
                text="Ogni scelta distribuisce un peso fra i due temi in gioco. I punteggi vengono poi normalizzati sul tuo profilo e messi in classifica."
              />
              <Step
                number={3}
                title="Leggi e scarica il report"
                text="Top 5 dei talenti, bilanciamento fra le macro-aree, punti di forza e punti ciechi di ciascun tema. Esportabile in PDF."
              />
            </ol>
          </div>
        </section>

        {/* ---------------- I questionari ---------------- */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">I questionari</h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            Quattro strumenti distinti, ciascuno con la propria banca di domande e la propria
            lente di lettura del report.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {ASSESSMENTS.map((a) => (
              <div key={a.slug} className="card p-6">
                <h3 className="font-semibold text-ink-900">{a.name}</h3>
                <p className="mt-1 text-sm text-ink-500">{a.subtitle}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{a.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- Macro-aree ---------------- */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            Le quattro macro-aree
          </h2>
          <p className="mt-2 max-w-2xl text-ink-600">
            {THEMES.length} temi di talento distribuiti su quattro modi diversi di contribuire al
            lavoro di un gruppo. Nessuna area vale più delle altre.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DOMAIN_ORDER.map((domain) => {
              const meta = DOMAIN_META[domain];
              const themes = THEMES.filter((t) => t.domain === domain);
              return (
                <div key={domain} className="card p-5">
                  <span
                    aria-hidden="true"
                    className="block h-1 w-10 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <h3 className="mt-4 font-semibold text-ink-900">{meta.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{meta.description}</p>
                  <ul className="mt-4 space-y-1">
                    {themes.map((t) => (
                      <li key={t.slug} className="text-sm text-ink-700">
                        {t.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---------------- Nota etica ---------------- */}
        <section className="border-t border-ink-200/70 bg-ink-50">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
            <h2 className="text-xl font-semibold text-ink-900">Uno strumento di sviluppo, non un giudizio</h2>
            <p className="mt-3 text-ink-600">
              Il questionario è pensato per l’autoconsapevolezza e la crescita professionale. Non è
              un test clinico e non va usato come unico criterio in processi di selezione o
              valutazione. I risultati restano visibili solo a te.
            </p>
            <ButtonLink href={user ? '/questionario' : '/registrazione'} size="lg" className="mt-8">
              {user ? 'Continua il questionario' : 'Crea il tuo account'}
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-200/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-ink-500 sm:px-6">
          <p>Portale Talenti — progetto dimostrativo di assessment dei punti di forza.</p>
          <p>
            Modello ispirato a Gallup CliftonStrengths®, senza alcuna affiliazione con Gallup, Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Step({ number, title, text }: { number: number; title: string; text: string }) {
  return (
    <li className="card p-6">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">
        {number}
      </span>
      <h3 className="mt-4 font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{text}</p>
    </li>
  );
}
