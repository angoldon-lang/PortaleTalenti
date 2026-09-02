'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
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

  await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
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
