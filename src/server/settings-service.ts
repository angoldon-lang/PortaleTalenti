import 'server-only';

import { cache } from 'react';

import { prisma } from '@/lib/prisma';
import { DEFAULT_PRIMARY_COLOR } from '@/lib/branding';

export const SETTINGS_ID = 'singleton';

export type AppBranding = {
  organizationName: string;
  primaryColor: string;
  reportFooter: string | null;
  /** Timestamp dell'ultimo logo caricato: serve a invalidare la cache. */
  logoVersion: string | null;
  logoMimeType: string | null;
};

const FALLBACK: AppBranding = {
  organizationName: 'Portale Talenti',
  primaryColor: DEFAULT_PRIMARY_COLOR,
  reportFooter: null,
  logoVersion: null,
  logoMimeType: null,
};

/**
 * Personalizzazione corrente. `cache` la memorizza per la durata della
 * richiesta: viene letta da layout, header e PDF senza moltiplicare le query.
 *
 * Se la tabella non esiste ancora (migrazione non applicata) si ricade sui
 * valori di default invece di far fallire l'intera pagina.
 */
export const getBranding = cache(async (): Promise<AppBranding> => {
  try {
    const settings = await prisma.appSettings.findUnique({
      where: { id: SETTINGS_ID },
      select: {
        organizationName: true,
        primaryColor: true,
        reportFooter: true,
        logoUpdatedAt: true,
        logoMimeType: true,
      },
    });
    if (!settings) return FALLBACK;

    return {
      organizationName: settings.organizationName,
      primaryColor: settings.primaryColor,
      reportFooter: settings.reportFooter,
      logoVersion: settings.logoUpdatedAt?.getTime().toString() ?? null,
      logoMimeType: settings.logoMimeType,
    };
  } catch {
    return FALLBACK;
  }
});

/** Il logo in byte, per l'endpoint che lo serve e per il PDF. */
export async function getLogo(): Promise<{ data: Buffer; mimeType: string; version: string } | null> {
  try {
    const settings = await prisma.appSettings.findUnique({
      where: { id: SETTINGS_ID },
      select: { logoData: true, logoMimeType: true, logoUpdatedAt: true },
    });
    if (!settings?.logoData || !settings.logoMimeType) return null;
    return {
      data: Buffer.from(settings.logoData),
      mimeType: settings.logoMimeType,
      version: settings.logoUpdatedAt?.getTime().toString() ?? '0',
    };
  } catch {
    return null;
  }
}

/**
 * Logo come data URI, formato richiesto dal renderer PDF.
 * `@react-pdf/renderer` non sa disegnare SVG dentro <Image>: in quel caso si
 * restituisce null e il PDF usa il nome dell'organizzazione come intestazione.
 */
export async function getLogoDataUri(): Promise<string | null> {
  const logo = await getLogo();
  if (!logo) return null;
  if (!['image/png', 'image/jpeg'].includes(logo.mimeType)) return null;
  return `data:${logo.mimeType};base64,${logo.data.toString('base64')}`;
}
