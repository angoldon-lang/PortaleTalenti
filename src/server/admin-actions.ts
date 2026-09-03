'use server';

import { randomBytes } from 'node:crypto';

import { revalidatePath } from 'next/cache';
import type { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { adminCreateUserSchema } from '@/lib/validation';
import { isValidHexColor } from '@/lib/branding';
import { requireAdmin } from './guards';
import { SETTINGS_ID } from './settings-service';

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
    orgRoleId: formData.get('orgRoleId') ?? '',
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const { name, email, role } = parsed.data;

  const orgRoleId = parsed.data.orgRoleId?.trim() || null;
  if (orgRoleId) {
    const exists = await prisma.orgRole.findUnique({
      where: { id: orgRoleId },
      select: { id: true },
    });
    if (!exists) return { fieldErrors: { orgRoleId: ['Ruolo organizzativo non valido'] } };
  }

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    return { fieldErrors: { email: ['Esiste già un account con questa email'] } };
  }

  // Se l'admin non indica una password, il portale ne genera una temporanea e
  // la mostra una sola volta: va consegnata alla persona per un altro canale.
  const chosen = parsed.data.password?.trim();
  const generated = chosen ? null : generateTemporaryPassword();
  const plainPassword = chosen || generated!;

  // Un errore qui (client Prisma disallineato, database non migrato, vincolo
  // violato) deve arrivare all'amministratore come messaggio leggibile: senza
  // questo blocco l'azione fallirebbe in silenzio e il form resterebbe fermo.
  try {
    const user = await prisma.user.create({
      data: { name, email, role, orgRoleId, passwordHash: await bcrypt.hash(plainPassword, 12) },
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
  } catch (error) {
    console.error('createUserAction:', error);
    const detail = error instanceof Error ? error.message.split('\n')[0] : String(error);
    return { error: `Creazione non riuscita: ${detail}` };
  }

  revalidatePath('/admin/utenti');

  // La password in chiaro torna solo se generata dal portale: se l'ha scelta
  // l'amministratore, la conosce già e non ha senso rimandargliela indietro.
  return { created: { name, email, role, password: generated } };
}

// ===========================================================================
// Personalizzazione (logo, nome, colore)
// ===========================================================================

/** Formati accettati per il logo. SVG è ammesso ma non finisce nel PDF. */
const LOGO_MIME_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
const LOGO_MAX_BYTES = 512 * 1024;

export type BrandingState = { error?: string; success?: string };

export async function saveBrandingAction(
  _prev: BrandingState,
  formData: FormData,
): Promise<BrandingState> {
  const admin = await requireAdmin();

  const organizationName = String(formData.get('organizationName') ?? '').trim();
  if (organizationName.length < 2 || organizationName.length > 60) {
    return { error: 'Il nome deve avere fra 2 e 60 caratteri.' };
  }

  const primaryColor = String(formData.get('primaryColor') ?? '').trim();
  if (!isValidHexColor(primaryColor)) {
    return { error: 'Il colore deve essere un esadecimale, es. #164ede.' };
  }

  const reportFooterRaw = String(formData.get('reportFooter') ?? '').trim();
  if (reportFooterRaw.length > 120) {
    return { error: 'La riga in fondo al PDF non può superare i 120 caratteri.' };
  }

  const data: Prisma.AppSettingsUncheckedCreateInput = {
    organizationName,
    primaryColor,
    reportFooter: reportFooterRaw || null,
  };

  if (formData.get('removeLogo') === 'on') {
    data.logoData = null;
    data.logoMimeType = null;
    data.logoUpdatedAt = null;
  } else {
    const file = formData.get('logo');
    if (file instanceof File && file.size > 0) {
      if (!LOGO_MIME_TYPES.includes(file.type)) {
        return { error: 'Formato non supportato: usa PNG, JPEG o SVG.' };
      }
      if (file.size > LOGO_MAX_BYTES) {
        return { error: `Il logo supera i ${LOGO_MAX_BYTES / 1024} KB.` };
      }
      data.logoData = Buffer.from(await file.arrayBuffer());
      data.logoMimeType = file.type;
      data.logoUpdatedAt = new Date();
    }
  }

  await prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    update: data,
    create: { id: SETTINGS_ID, ...data },
  });

  await prisma.adminAuditLog.create({
    data: {
      action: 'BRANDING_UPDATED',
      actorId: admin.id,
      actorEmail: admin.email ?? '',
      detail: `nome "${organizationName}", colore ${primaryColor}`,
    },
  });

  // Nome, colore e logo compaiono nell'intestazione di ogni pagina.
  revalidatePath('/', 'layout');

  return { success: 'Personalizzazione salvata.' };
}

// ===========================================================================
// Ruoli organizzativi: quali questionari vede chi
// ===========================================================================

/**
 * Salva le abilitazioni di un ruolo. Il form invia, per ogni questionario,
 * `enabled:<id>` e `required:<id>`: si riscrive l'intero insieme invece di
 * calcolare differenze, perché è una manciata di righe e la logica resta
 * leggibile.
 */
export async function saveOrgRoleAssessmentsAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const orgRoleId = String(formData.get('orgRoleId') ?? '');
  if (!orgRoleId) return;

  const role = await prisma.orgRole.findUnique({
    where: { id: orgRoleId },
    select: { id: true, name: true },
  });
  if (!role) return;

  const assessments = await prisma.assessment.findMany({ select: { id: true } });

  const enabled = assessments
    .filter((a) => formData.get(`enabled:${a.id}`) === 'on')
    .map((a) => ({ assessmentId: a.id, isRequired: formData.get(`required:${a.id}`) === 'on' }));

  await prisma.$transaction([
    prisma.orgRoleAssessment.deleteMany({ where: { orgRoleId } }),
    prisma.orgRoleAssessment.createMany({
      data: enabled.map((e) => ({ orgRoleId, ...e })),
    }),
  ]);

  await prisma.adminAuditLog.create({
    data: {
      action: 'ORG_ROLE_UPDATED',
      actorId: admin.id,
      actorEmail: admin.email ?? '',
      detail: `${role.name}: ${enabled.length} questionari abilitati`,
    },
  });

  revalidatePath('/admin/ruoli');
}

const assignRoleSchema = z.object({
  userId: z.string().min(1),
  /** Stringa vuota = nessun ruolo, quindi si applica quello predefinito. */
  orgRoleId: z.string(),
});

export async function assignOrgRoleAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();

  const parsed = assignRoleSchema.safeParse({
    userId: formData.get('userId'),
    orgRoleId: formData.get('orgRoleId') ?? '',
  });
  if (!parsed.success) return;

  const orgRoleId = parsed.data.orgRoleId || null;
  if (orgRoleId) {
    const exists = await prisma.orgRole.findUnique({ where: { id: orgRoleId }, select: { id: true } });
    if (!exists) return;
  }

  const updated = await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { orgRoleId },
    select: { id: true, email: true, orgRole: { select: { name: true } } },
  });

  await prisma.adminAuditLog.create({
    data: {
      action: 'ORG_ROLE_ASSIGNED',
      actorId: admin.id,
      actorEmail: admin.email ?? '',
      subjectId: updated.id,
      subjectEmail: updated.email,
      detail: updated.orgRole?.name ?? 'ruolo predefinito',
    },
  });

  revalidatePath('/admin/utenti');
}
