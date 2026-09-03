import { loadEnvFile } from 'node:process';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import { THEMES } from '../src/content/themes';
import { QUESTION_BANKS } from '../src/content/questions';
import { ASSESSMENTS } from '../src/content/assessments';
import { ORG_ROLES } from '../src/content/org-roles';
import { MPF_AREAS, MPF_TRAITS } from '../src/content/mpf/model';
import { MPF_BLOCK_BANKS } from '../src/content/mpf/blocks';
import { MPF_ASSESSMENTS } from '../src/content/mpf/assessments';

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

async function seedAssessmentsAndQuestions() {
  const themes = await prisma.talentTheme.findMany({ select: { id: true, slug: true } });
  const idBySlug = new Map(themes.map((t) => [t.slug, t.id]));

  for (const seed of ASSESSMENTS) {
    const bank = QUESTION_BANKS[seed.slug];
    if (!bank) throw new Error(`Banca di item mancante per l'assessment "${seed.slug}"`);

    const assessment = await prisma.assessment.upsert({
      where: { slug: seed.slug },
      update: { ...seed },
      create: { ...seed },
      select: { id: true },
    });

    for (const q of bank) {
      const leftThemeId = idBySlug.get(q.leftTheme);
      const rightThemeId = idBySlug.get(q.rightTheme);
      if (!leftThemeId || !rightThemeId) {
        throw new Error(
          `${seed.slug} item ${q.position}: tema non trovato (${q.leftTheme} / ${q.rightTheme})`,
        );
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
        where: { assessmentId_position: { assessmentId: assessment.id, position: q.position } },
        update: data,
        create: { assessmentId: assessment.id, position: q.position, ...data },
      });
    }

    console.log(`✓ ${seed.name}: ${bank.length} item`);
  }
}

/**
 * Tassonomia della Mappa dei Punti di Forza: cinque aree e trenta tratti.
 * Vive in tabelle proprie, accanto ai temi del modello storico.
 */
async function seedStrengthModel() {
  for (const area of MPF_AREAS) {
    await prisma.strengthArea.upsert({
      where: { slug: area.slug },
      update: { ...area },
      create: { ...area },
    });
  }

  const areas = await prisma.strengthArea.findMany({ select: { id: true, slug: true } });
  const areaIdBySlug = new Map(areas.map((a) => [a.slug, a.id]));

  for (const trait of MPF_TRAITS) {
    const { area, ...rest } = trait;
    const areaId = areaIdBySlug.get(area);
    if (!areaId) throw new Error(`Tratto ${trait.slug}: area "${area}" non trovata`);
    await prisma.strengthTrait.upsert({
      where: { slug: trait.slug },
      update: { ...rest, areaId },
      create: { ...rest, areaId },
    });
  }

  console.log(`✓ ${MPF_AREAS.length} aree e ${MPF_TRAITS.length} tratti`);
}

async function seedMpfAssessmentsAndBlocks() {
  const traits = await prisma.strengthTrait.findMany({ select: { id: true, slug: true } });
  const traitIdBySlug = new Map(traits.map((t) => [t.slug, t.id]));

  for (const seed of MPF_ASSESSMENTS) {
    const bank = MPF_BLOCK_BANKS[seed.slug];
    if (!bank) throw new Error(`Banca di blocchi mancante per "${seed.slug}"`);

    const assessment = await prisma.assessment.upsert({
      where: { slug: seed.slug },
      update: { ...seed, itemFormat: 'FORCED_CHOICE_QUARTET' },
      create: { ...seed, itemFormat: 'FORCED_CHOICE_QUARTET' },
      select: { id: true },
    });

    for (const item of bank) {
      const block = await prisma.choiceBlock.upsert({
        where: {
          assessmentId_position: { assessmentId: assessment.id, position: item.position },
        },
        update: { controlForPosition: item.controlFor ?? null, isActive: true },
        create: {
          assessmentId: assessment.id,
          position: item.position,
          controlForPosition: item.controlFor ?? null,
          isActive: true,
        },
        select: { id: true },
      });

      for (const option of item.options) {
        const traitId = traitIdBySlug.get(option.trait);
        if (!traitId) {
          throw new Error(`${seed.slug} blocco ${item.position}: tratto "${option.trait}" non trovato`);
        }
        await prisma.choiceOption.upsert({
          where: { blockId_position: { blockId: block.id, position: option.position } },
          update: { traitId, statement: option.statement },
          create: {
            blockId: block.id,
            position: option.position,
            traitId,
            statement: option.statement,
          },
        });
      }
    }

    const controls = bank.filter((b) => b.controlFor !== undefined).length;
    console.log(`✓ ${seed.name}: ${bank.length} blocchi (${controls} di controllo)`);
  }
}

async function seedOrgRoles() {
  const assessments = await prisma.assessment.findMany({ select: { id: true, slug: true } });
  const idBySlug = new Map(assessments.map((a) => [a.slug, a.id]));

  for (const seed of ORG_ROLES) {
    const { assessments: enabled, ...role } = seed;

    const orgRole = await prisma.orgRole.upsert({
      where: { slug: role.slug },
      update: role,
      create: role,
      select: { id: true },
    });

    for (const entry of enabled) {
      const assessmentId = idBySlug.get(entry.slug);
      if (!assessmentId) throw new Error(`Ruolo ${role.slug}: questionario ${entry.slug} non trovato`);

      await prisma.orgRoleAssessment.upsert({
        where: { orgRoleId_assessmentId: { orgRoleId: orgRole.id, assessmentId } },
        update: { isRequired: entry.required },
        create: { orgRoleId: orgRole.id, assessmentId, isRequired: entry.required },
      });
    }
  }
  console.log(`✓ ${ORG_ROLES.length} ruoli organizzativi`);
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
  await seedAssessmentsAndQuestions();
  await seedStrengthModel();
  await seedMpfAssessmentsAndBlocks();
  await seedOrgRoles();
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
