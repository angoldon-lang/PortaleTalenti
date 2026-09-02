'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { loginSchema, registerSchema } from '@/lib/validation';

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function safeCallback(raw: FormDataEntryValue | null): string {
  const value = typeof raw === 'string' ? raw : '';
  // Accettiamo solo path relativi: evita open-redirect verso domini esterni.
  return value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard';
}

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return { fieldErrors: { email: ['Esiste già un account con questa email'] } };
  }

  const admins = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: admins.includes(email) ? 'ADMIN' : 'USER',
    },
  });

  try {
    await signIn('credentials', { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Account creato. Effettua l’accesso per continuare.' };
    }
    throw error;
  }

  // redirect() lancia un'eccezione di controllo: deve stare fuori dal try.
  redirect(safeCallback(formData.get('callbackUrl')));
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  try {
    await signIn('credentials', { ...parsed.data, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Email o password non corretti.' };
    }
    throw error;
  }

  redirect(safeCallback(formData.get('callbackUrl')));
}

export async function googleSignInAction(formData: FormData) {
  await signIn('google', { redirectTo: safeCallback(formData.get('callbackUrl')) });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
