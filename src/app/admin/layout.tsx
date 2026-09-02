import type { Metadata } from 'next';
import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { requireAdmin } from '@/server/guards';

export const metadata: Metadata = { title: 'Amministrazione' };

const adminNav = [
  { href: '/admin', label: 'Metriche' },
  { href: '/admin/utenti', label: 'Utenti' },
  { href: '/admin/domande', label: 'Domande' },
  { href: '/dashboard', label: 'Il mio profilo' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <AppShell user={{ ...user, role: 'ADMIN' }} nav={adminNav}>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <nav aria-label="Sezioni amministrazione" className="mb-8 flex flex-wrap gap-2">
          {adminNav.slice(0, 3).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-ink-200 bg-white px-4 py-1.5 text-sm font-medium text-ink-700 transition hover:border-ink-300 hover:bg-ink-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </AppShell>
  );
}
