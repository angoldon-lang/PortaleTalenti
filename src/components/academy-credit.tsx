import { getBranding } from '@/server/settings-service';
import { cn } from '@/lib/utils';

/** Sito dell'Academy per cui il modello è stato sviluppato. */
export const ACADEMY_URL = 'https://adacademy.it/';

/**
 * La riga di attribuzione in fondo alla home: il logo dell'Academy, cliccabile,
 * e la frase che dice per chi è stato sviluppato il modello.
 *
 * Il logo è quello caricato da Personalizzazione, la stessa immagine che
 * compare in intestazione e nei PDF: così resta un punto solo da aggiornare.
 * Finché non ne è stato caricato nessuno mostra la parola «Academy», per non
 * lasciare un buco nel layout né un'immagine rotta.
 */
export async function AcademyCredit({ className }: { className?: string }) {
  const branding = await getBranding();

  return (
    <a
      href={ACADEMY_URL}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-lg transition hover:text-ink-700',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-600',
        className,
      )}
    >
      {branding.logoVersion ? (
        // Immagine servita da una route dinamica: <img> è corretto qui, come
        // in BrandMark, perché next/image non aggiunge nulla su pochi KB.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/branding/logo?v=${branding.logoVersion}`}
          alt=""
          aria-hidden="true"
          className="h-7 w-auto max-w-[140px] object-contain"
        />
      ) : null}
      <span>
        Modello proprietario, sviluppato per{' '}
        <span className="font-medium text-ink-700">Academy</span>
      </span>
    </a>
  );
}
