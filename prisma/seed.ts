import { loadEnvFile } from 'node:process';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { THEMES } from '../src/content/themes';
import { QUESTIONS } from '../src/content/questions';

// `tsx prisma/seed.ts` non carica .env da solo (a differenza della CLI Prisma).
try {
  loadEnvFile('.env');
} catch {
  // In produzione le variabili arrivano dall'ambiente: nessun file da leggere.
}

const prisma = new PrismaClient();

async function seedThemes() {
  for (const theme of THEMES) {
    await prisma.talentTheme.upsert({
      where: { slug: theme.slug },
      update: { ...theme },
      create: { ...theme },
    });
  }
  console.log(`✓ ${THEMES.length} temi di talento`);
}

async function seedQuestions() {
  const themes = await prisma.talentTheme.findMany({ select: { id: true, slug: true } });
  const idBySlug = new Map(themes.map((t) => [t.slug, t.id]));

  for (const q of QUESTIONS) {
    const leftThemeId = idBySlug.get(q.leftTheme);
    const rightThemeId = idBySlug.get(q.rightTheme);
    if (!leftThemeId || !rightThemeId) {
      throw new Error(`Item ${q.position}: tema non trovato (${q.leftTheme} / ${q.rightTheme})`);
    }

    const data = {
      leftStatement: q.leftStatement,
      rightStatement: q.rightStatement,
      leftThemeId,
      rightThemeId,
      leftWeight: q.leftWeight ?? 1,
      rightWeight: q.rightWeight ?? 1,
      isActive: true,
    };

    await prisma.question.upsert({
      where: { position: q.position },
      update: data,
      create: { position: q.position, ...data },
    });
  }
  console.log(`✓ ${QUESTIONS.length} item del questionario`);
}

async function seedUsers() {
  if (process.env.SEED_DEMO_USERS === 'false') return;

  const password = await bcrypt.hash('Password123', 12);
  const adminEmail = (process.env.ADMIN_EMAILS ?? 'admin@portaletalenti.it')
    .split(',')[0]!
    .trim()
    .toLowerCase();

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Amministratore',
      passwordHash: password,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { email: 'demo@portaletalenti.it' },
    update: {},
    create: {
      email: 'demo@portaletalenti.it',
      name: 'Utente Demo',
      passwordHash: password,
      role: 'USER',
      emailVerified: new Date(),
    },
  });

  console.log(`✓ utenti demo: ${adminEmail} / demo@portaletalenti.it (password: Password123)`);
}

async function main() {
  console.log('Seed del Portale Talenti…');
  await seedThemes();
  await seedQuestions();
  await seedUsers();
  console.log('Fatto.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
