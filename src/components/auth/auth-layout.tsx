import Link from 'next/link';

import { BrandMark } from '@/components/brand-mark';

export async function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main id="contenuto" className="flex min-h-dvh flex-col lg:flex-row">
      {/* Colonna narrativa: nascosta su mobile per non allungare la pagina */}
      <aside className="hidden bg-ink-950 p-12 text-white lg:flex lg:w-2/5 lg:flex-col lg:justify-between">
        <BrandMark href="/" invert />
        <div className="max-w-sm">
          <p className="text-2xl font-semibold leading-snug">
            Non serve correggere le tue debolezze. Serve capire dove sei già forte.
          </p>
          <p className="mt-4 text-ink-300">
            Un questionario a confronto di affermazioni, 66 scelte istintive e un report che
            trasforma i tuoi talenti in comportamenti concreti.
          </p>
        </div>
        <p className="text-sm text-ink-400">
          I tuoi risultati sono personali e visibili solo a te.
        </p>
      </aside>

      <section className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <span className="mb-8 block lg:hidden">
            <BrandMark href="/" />
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{title}</h1>
          <p className="mt-2 text-ink-600">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
