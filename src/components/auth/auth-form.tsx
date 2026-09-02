'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { buttonClasses } from '@/components/ui/button';
import type { FormState } from '@/server/auth-actions';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClasses('primary', 'md', 'w-full')}>
      {pending ? 'Attendi…' : label}
    </button>
  );
}

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {errors[0]}
    </p>
  );
}

type Props = {
  mode: 'login' | 'register';
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  callbackUrl: string;
};

export function AuthForm({ mode, action, callbackUrl }: Props) {
  const [state, formAction] = useActionState<FormState, FormData>(action, {});
  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state.error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      {mode === 'register' && (
        <div>
          <label htmlFor="name" className="label">
            Nome e cognome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(fe.name)}
            aria-describedby={fe.name ? 'name-error' : undefined}
            className={cn('input', fe.name && 'input-error')}
            placeholder="Maria Rossi"
          />
          <FieldError id="name-error" errors={fe.name} />
        </div>
      )}

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(fe.email)}
          aria-describedby={fe.email ? 'email-error' : undefined}
          className={cn('input', fe.email && 'input-error')}
          placeholder="nome@azienda.it"
        />
        <FieldError id="email-error" errors={fe.email} />
      </div>

      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          required
          aria-invalid={Boolean(fe.password)}
          aria-describedby={mode === 'register' ? 'password-hint' : fe.password ? 'password-error' : undefined}
          className={cn('input', fe.password && 'input-error')}
          placeholder="••••••••••"
        />
        {mode === 'register' && (
          <p id="password-hint" className="mt-1.5 text-xs text-ink-500">
            Almeno 10 caratteri, con una lettera e un numero.
          </p>
        )}
        <FieldError id="password-error" errors={fe.password} />
      </div>

      {mode === 'register' && (
        <div>
          <label htmlFor="confirmPassword" className="label">
            Conferma password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            aria-invalid={Boolean(fe.confirmPassword)}
            aria-describedby={fe.confirmPassword ? 'confirm-error' : undefined}
            className={cn('input', fe.confirmPassword && 'input-error')}
            placeholder="••••••••••"
          />
          <FieldError id="confirm-error" errors={fe.confirmPassword} />
        </div>
      )}

      <SubmitButton label={mode === 'register' ? 'Crea il mio account' : 'Accedi'} />
    </form>
  );
}
