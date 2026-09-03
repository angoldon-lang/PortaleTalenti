import Link from 'next/link';

import { getBranding } from '@/server/settings-service';
import { cn } from '@/lib/utils';

/**
 * Il marchio del portale: logo caricato dall'amministratore se c'è, altrimenti
 * il nome dell'organizzazione come testo. Usato in intestazione, home e pagine
 * di accesso, così la personalizzazione si applica ovunque da un punto solo.
 */
export async function BrandMark({
  href = '/',
  className,
  imageClassName,
  invert = false,
}: {
  href?: string | null;
  className?: string;
  imageClassName?: string;
  /** Su fondo scuro il logo va schiarito e il testo diventa bianco. */
  invert?: boolean;
}) {
  const branding = await getBranding();

  const content = branding.logoVersion ? (
    // Immagine servita da una route dinamica: <img> è corretto qui, next/image
    // non porterebbe vantaggi su un file di pochi KB già ottimizzato.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/api/branding/logo?v=${branding.logoVersion}`}
      alt={branding.organizationName}
      className={cn('h-8 w-auto max-w-[200px] object-contain', invert && 'brightness-0 invert', imageClassName)}
    />
  ) : (
    <span className={cn('text-base font-semibold tracking-tight', invert && 'text-white')}>
      {branding.organizationName}
    </span>
  );

  if (!href) return <span className={cn('inline-flex items-center', className)}>{content}</span>;

  return (
    <Link href={href} className={cn('inline-flex items-center', className)}>
      {content}
    </Link>
  );
}
