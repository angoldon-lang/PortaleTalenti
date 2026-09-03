import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Se il progetto è annidato dentro un'altra cartella che contiene un
  // package-lock.json, Next sceglie quella come radice del workspace e avvisa.
  // Fissandola qui il file tracing è sempre corretto e l'avviso sparisce.
  outputFileTracingRoot: projectRoot,
  serverExternalPackages: ['@react-pdf/renderer', 'bcryptjs'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'lh3.googleusercontent.com' }],
  },
};

export default nextConfig;
