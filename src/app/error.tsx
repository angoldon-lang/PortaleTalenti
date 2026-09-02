'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="contenuto" className="grid min-h-dvh place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">
          Qualcosa è andato storto
        </h1>
        <p className="mt-3 text-ink-600">
          Si è verificato un errore imprevisto. Le tue risposte al questionario restano salvate.
        </p>
        <Button onClick={reset} className="mt-8">
          Riprova
        </Button>
      </div>
    </main>
  );
}
