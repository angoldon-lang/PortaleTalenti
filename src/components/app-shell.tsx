import Link from 'next/link';
import { signOutAction } from '@/server/auth-actions';
import { initials } from '@/lib/utils';

type NavItem = { href: string; label: string };

export function AppShell({
  user,
  children,
  nav,
}: {
  user: { name?: string | null; email?: string | null; role: 'USER' | 'ADMIN' };
  children: React.ReactNode;
  nav?: NavItem[];
}) {
  const items: NavItem[] =
    nav ??
    [
      { href: '/dashboard', label: 'Il mio profilo' },
      { href: '/questionario', label: 'Questionario' },
      ...(user.role === 'ADMIN' ? [{ href: '/admin', label: 'Amministrazione' }] : []),
    ];

  return (
    <div className="min-h-dvh bg-ink-50">
      <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-base font-semibold tracking-tight">
              Portale<span className="text-brand-600">Talenti</span>
            </Link>
            <nav aria-label="Navigazione principale" className="hidden gap-1 sm:flex">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight text-ink-900">
                {user.name ?? 'Utente'}
              </p>
              <p className="text-xs leading-tight text-ink-500">{user.email}</p>
            </div>
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800"
            >
              {initials(user.name, user.email)}
            </span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg px-2.5 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100 hover:text-ink-900"
              >
                Esci
              </button>
            </form>
          </div>
        </div>

        {/* Navigazione mobile */}
        <nav aria-label="Navigazione principale" className="flex gap-1 overflow-x-auto border-t border-ink-100 px-4 py-2 sm:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main id="contenuto">{children}</main>
    </div>
  );
}
