import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

// In sviluppo Next non si limita ad avvisare: risponde 403 alle richieste
// delle risorse interne (/_next/*) che arrivano da un'origine diversa da
// quella di avvio. Aprendo l'app dall'IP di rete — un server di prova
// raggiunto da un altro computer — l'HTML arriva con 200 ma CSS e JavaScript
// no, quindi la pagina resta senza stile e senza interazioni. DEV_ORIGINS
// elenca gli host aggiuntivi da autorizzare, separati da virgola:
//   DEV_ORIGINS="10.254.254.90,portale.local"
// Vanno indicati **senza porta e senza schema**: con "10.254.254.90:3000" il
// confronto non combacia e la richiesta viene comunque rifiutata.
const devOrigins = (process.env.DEV_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Se il progetto è annidato dentro un'altra cartella che contiene un
  // package-lock.json, Next sceglie quella come radice del workspace e avvisa.
  // Fissandola qui il file tracing è sempre corretto e l'avviso sparisce.
  outputFileTracingRoot: projectRoot,
  ...(devOrigins.length > 0 ? { allowedDevOrigins: devOrigins } : {}),
  serverExternalPackages: ['@react-pdf/renderer', 'bcryptjs'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'lh3.googleusercontent.com' }],
  },
};

export default nextConfig;
