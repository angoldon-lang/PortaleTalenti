import Link from 'next/link';
import type { Metadata } from 'next';

import { AuthForm } from '@/components/auth/auth-form';
import { GoogleButton } from '@/components/auth/google-button';
import { loginAction } from '@/server/auth-actions';
import { AuthLayout } from '@/components/auth/auth-layout';

export const metadata: Metadata = { title: 'Accedi' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl =
    params.callbackUrl?.startsWith('/') && !params.callbackUrl.startsWith('//')
      ? params.callbackUrl
      : '/dashboard';

  return (
    <AuthLayout
      title="Bentornato"
      subtitle="Accedi per riprendere il questionario o consultare il tuo report."
    >
      {params.error && (
        <div role="alert" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Accesso non riuscito. Riprova o usa un altro metodo.
        </div>
      )}

      <AuthForm mode="login" action={loginAction} callbackUrl={callbackUrl} />

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-ink-200" />
        <span className="text-xs uppercase tracking-wide text-ink-400">oppure</span>
        <span className="h-px flex-1 bg-ink-200" />
      </div>

      <GoogleButton callbackUrl={callbackUrl} />

      <p className="mt-6 text-center text-sm text-ink-600">
        Non hai un account?{' '}
        <Link href="/registrazione" className="font-medium text-brand-700 underline underline-offset-2">
          Registrati
        </Link>
      </p>
    </AuthLayout>
  );
}
