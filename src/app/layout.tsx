import type { Metadata, Viewport } from 'next';
import './globals.css';

import { brandScaleToCss } from '@/lib/branding';
import { getBranding } from '@/server/settings-service';

export async function generateMetadata(): Promise<Metadata> {
  const { organizationName } = await getBranding();
  return {
    title: {
      default: `${organizationName} — scopri i tuoi punti di forza`,
      template: `%s · ${organizationName}`,
    },
    description:
      'Questionario psicometrico e report personalizzato sui tuoi punti di forza dominanti, basato su un modello proprietario a cinque macro-aree e trenta tratti.',
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: '#1d63f1',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { primaryColor } = await getBranding();

  return (
    <html lang="it">
      <head>
        {/* La palette del marchio è generata dal colore scelto in
            /admin/personalizzazione e sovrascrive i default di globals.css. */}
        <style dangerouslySetInnerHTML={{ __html: brandScaleToCss(primaryColor) }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#contenuto"
          className="sr-only-focusable absolute left-4 top-4 z-50 rounded-lg bg-brand-700 px-4 py-2 text-white"
        >
          Vai al contenuto principale
        </a>
        {children}
      </body>
    </html>
  );
}
