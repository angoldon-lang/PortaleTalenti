import Link from 'next/link';
import type { Metadata } from 'next';

import { AuthForm } from '@/components/auth/auth-form';
import { GoogleButton } from '@/components/auth/google-button';
import { registerAction } from '@/server/auth-actions';
import { AuthLayout } from '@/components/auth/auth-layout';

export const metadata: Metadata = { title: 'Registrati' };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl =
    params.callbackUrl?.startsWith('/') && !params.callbackUrl.startsWith('//')
      ? params.callbackUrl
      : '/questionario';

  return (
    <AuthLayout
      title="Crea il tuo account"
      subtitle="Ti bastano 20 minuti per scoprire i tuoi 5 talenti dominanti."
    >
      <AuthForm mode="register" action={registerAction} callbackUrl={callbackUrl} />

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-ink-200" />
        <span className="text-xs uppercase tracking-wide text-ink-400">oppure</span>
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <GoogleButton callbackUrl={callbackUrl} />

      <p className="mt-6 text-center text-sm text-ink-600">
        Hai già un account?{' '}
        <Link href="/login" className="font-medium text-brand-700 underline underline-offset-2">
          Accedi
        </Link>
      </p>
    </AuthLayout>
  );
}
