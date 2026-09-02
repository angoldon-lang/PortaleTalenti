import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Richiede un utente autenticato; altrimenti reindirizza al login. */
export async function requireUser(callbackUrl = '/dashboard') {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}

/** Richiede il ruolo ADMIN; gli utenti standard tornano alla loro dashboard. */
export async function requireAdmin() {
  const user = await requireUser('/admin');
  if (user.role !== 'ADMIN') redirect('/dashboard');
  return user;
}
