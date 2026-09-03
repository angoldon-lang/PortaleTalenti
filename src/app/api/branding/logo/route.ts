import { NextResponse } from 'next/server';

import { getLogo } from '@/server/settings-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serve il logo caricato dall'amministratore. È pubblico di proposito: compare
 * nell'intestazione e nella pagina di accesso, prima che l'utente si autentichi.
 *
 * La cache è validata con un ETag derivato dal momento del caricamento, così il
 * browser riusa l'immagine ma un logo nuovo si vede subito.
 */
export async function GET(request: Request) {
  const logo = await getLogo();
  if (!logo) {
    return new NextResponse(null, { status: 404 });
  }

  const etag = `"logo-${logo.version}"`;
  if (request.headers.get('if-none-match') === etag) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag } });
  }

  return new NextResponse(new Uint8Array(logo.data), {
    headers: {
      'Content-Type': logo.mimeType,
      'Content-Length': String(logo.data.byteLength),
      ETag: etag,
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
