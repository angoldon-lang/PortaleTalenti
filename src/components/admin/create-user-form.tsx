'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { buttonClasses } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createUserAction, type CreateUserState } from '@/server/admin-actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClasses('primary', 'md')}>
      {pending ? 'Creazione…' : 'Crea utente'}
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

export function CreateUserForm() {
  const [state, formAction] = useActionState<CreateUserState, FormData>(createUserAction, {});
  const fe = state.fieldErrors ?? {};

  if (state.created) {
    const { name, email, role, password } = state.created;
    return (
      <div
        role="status"
        className="max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900"
      >
        <p className="font-semibold">Utente creato.</p>
        <p className="mt-1">
          {name} · {email} · ruolo {role === 'ADMIN' ? 'Amministratore' : 'Utente standard'}
        </p>

        {password ? (
          <>
            <p className="mt-4">
              Password temporanea, mostrata <strong>una sola volta</strong>. Consegnala alla
              persona su un canale diverso da questo schermo e chiedile di cambiarla al primo
              accesso.
            </p>
            <p className="mt-2 select-all rounded-lg border border-emerald-300 bg-white px-3 py-2 font-mono text-base tracking-wide text-ink-900">
              {password}
            </p>
          </>
        ) : (
          <p className="mt-3">La persona può accedere con la password che hai impostato.</p>
        )}

        <a href="/admin/nuovo-utente" className={buttonClasses('secondary', 'sm', 'mt-5')}>
          Crea un altro utente
        </a>
      </div>
    );
  }

  return (
    <form action={formAction} className="max-w-md space-y-4" noValidate>
      {state.error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="label">
          Nome e cognome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          aria-invalid={Boolean(fe.name)}
          aria-describedby={fe.name ? 'name-error' : undefined}
          className={cn('input', fe.name && 'input-error')}
          placeholder="Maria Rossi"
        />
        <FieldError id="name-error" errors={fe.name} />
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          aria-invalid={Boolean(fe.email)}
          aria-describedby={fe.email ? 'email-error' : undefined}
          className={cn('input', fe.email && 'input-error')}
          placeholder="nome@azienda.it"
        />
        <FieldError id="email-error" errors={fe.email} />
      </div>

      <div>
        <label htmlFor="role" className="label">
          Ruolo
        </label>
        <select id="role" name="role" defaultValue="USER" className="input">
          <option value="USER">Utente standard</option>
          <option value="ADMIN">Amministratore</option>
        </select>
      </div>

      <div>
        <label htmlFor="password" className="label">
          Password <span className="font-normal text-ink-500">(opzionale)</span>
        </label>
        <input
          id="password"
          name="password"
          type="text"
          autoComplete="off"
          aria-invalid={Boolean(fe.password)}
          aria-describedby="password-hint"
          className={cn('input', fe.password && 'input-error')}
          placeholder="Lascia vuoto per generarla"
        />
        <p id="password-hint" className="mt-1.5 text-xs text-ink-500">
          Se lasci il campo vuoto il portale genera una password temporanea e te la mostra una
          sola volta. Minimo 10 caratteri, con una lettera e un numero.
        </p>
        <FieldError id="password-error" errors={fe.password} />
      </div>

      <SubmitButton />
    </form>
  );
}
