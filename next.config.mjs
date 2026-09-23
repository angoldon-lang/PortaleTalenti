import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

// allowedDevOrigins e' un elenco di permessi, e finche' resta assente il
// server di sviluppo serve le risorse interne (/_next/*) a qualunque origine:
// verificato su Next 15.5.25, dove un host estraneo riceve comunque 200. Non
// va quindi impostato per aprire l'app dall'IP di rete, che gia' funziona.
// Serve quando l'app sta dietro a un proxy o dentro un container e l'indirizzo
// usato dal browser non e' un indirizzo della macchina che esegue Next, e
// servira' con le versioni di Next che renderanno il controllo obbligatorio.
//
// Attenzione: valorizzarlo attiva il controllo in modo stretto, e da quel
// momento ogni origine non elencata riceve 403. Vanno quindi indicati tutti
// gli host usati, come host soli, senza schema e senza porta:
//   DEV_ORIGINS="10.254.254.90,portale.local"
// Con "10.254.254.90:3000" il confronto non combacia e la richiesta e'
// rifiutata lo stesso.
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
