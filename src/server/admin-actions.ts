'use server';

import { randomBytes } from 'node:crypto';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { adminCreateUserSchema } from '@/lib/validation';
import { requireAdmin } from './guards';

const roleSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['USER', 'ADMIN']),
});

export async function setUserRoleAction(formData: FormData) {
  const admin = await requireAdmin();

  const parsed = roleSchema.safeParse({
    userId: formData.get('userId'),
    role: formData.get('role'),
  });
  if (!parsed.success) return;

  // Un admin non può togliere il ruolo a se stesso: evita di restare
  // chiusi fuori dal pannello.
  if (parsed.data.userId === admin.id) return;

  const updated = await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
    select: { id: true, email: true },
  });

  await prisma.adminAuditLog.create({
    data: {
      action: 'ROLE_CHANGED',
      actorId: admin.id,
      actorEmail: admin.email ?? '',
      subjectId: updated.id,
      subjectEmail: updated.email,
      detail: `nuovo ruolo ${parsed.data.role}`,
    },
  });

  revalidatePath('/admin/utenti');
}

export async function toggleQuestionAction(formData: FormData) {
  await requireAdmin();

  const questionId = String(formData.get('questionId') ?? '');
  if (!questionId) return;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { isActive: true },
  });
  if (!question) return;

  await prisma.question.update({
    where: { id: questionId },
    data: { isActive: !question.isActive },
  });
  revalidatePath('/admin/domande');
}

// ===========================================================================
// Creazione utenti
// ===========================================================================

export type CreateUserState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  created?: { name: string; email: string; role: 'USER' | 'ADMIN'; password: string | null };
};

/**
 * Genera una password temporanea leggibile ma con entropia sufficiente
 * (~62 bit): 4 gruppi da 4 caratteri di un alfabeto senza simboli ambigui.
 */
function generateTemporaryPassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = randomBytes(16);
  const chars = Array.from(bytes, (b) => alphabet[b % alphabet.length]);
  return [0, 4, 8, 12].map((i) => chars.slice(i, i + 4).join('')).join('-');
}

export async function createUserAction(
  _prev: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
  const admin = await requireAdmin();

  const parsed = adminCreateUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    role: formData.get('role'),
    password: formData.get('password') ?? '',
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { name, email, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return { fieldErrors: { email: ['Esiste già un account con questa email'] } };
  }

  // Se l'admin non indica una password, il portale ne genera una temporanea e
  // la mostra una sola volta: va consegnata alla persona per un altro canale.
  const chosen = parsed.data.password?.trim();
  const generated = chosen ? null : generateTemporaryPassword();
  const plainPassword = chosen || generated!;

  const user = await prisma.user.create({
    data: { name, email, role, passwordHash: await bcrypt.hash(plainPassword, 12) },
    select: { id: true, email: true },
  });

  await prisma.adminAuditLog.create({
    data: {
      action: 'USER_CREATED',
      actorId: admin.id,
      actorEmail: admin.email ?? '',
      subjectId: user.id,
      subjectEmail: user.email,
      detail: `ruolo ${role}`,
    },
  });

  revalidatePath('/admin/utenti');

  // La password in chiaro torna solo se generata dal portale: se l'ha scelta
  // l'amministratore, la conosce già e non ha senso rimandargliela indietro.
  return { created: { name, email, role, password: generated } };
}
