import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main id="contenuto" className="grid min-h-dvh place-items-center px-4">
      <div className="text-center">
        <p className="text-sm font-medium text-brand-700">Errore 404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-900">
          Questa pagina non esiste
        </h1>
        <p className="mt-3 text-ink-600">
          Il link potrebbe essere scaduto o la pagina è stata spostata.
        </p>
        <ButtonLink href="/" className="mt-8">
          Torna alla home
        </ButtonLink>
      </div>
    </main>
  );
}
