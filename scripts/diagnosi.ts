/**
 * Perché non vedo un questionario?
 *
 * Stampa lo stato dell'installazione e, se qualcosa manca, dice quale comando
 * lo sistema. Nasce da una domanda concreta — «ho aggiornato ma i questionari
 * nuovi non compaiono» — che ha tre cause possibili: la migrazione non
 * applicata, il seed non eseguito, o il ruolo organizzativo dell'utente che non
 * li abilita.
 *
 *   npm run db:diagnosi              stato generale
 *   npm run db:diagnosi -- mario@x.it   che cosa vede quella persona
 */
import { loadEnvFile } from 'node:process';

import { PrismaClient } from '@prisma/client';

try {
  loadEnvFile('.env');
} catch {
  // In produzione le variabili arrivano dall'ambiente.
}

const prisma = new PrismaClient();

const ok = (s: string) => console.log(`  ✓ ${s}`);
const ko = (s: string, fix: string) => {
  console.log(`  ✗ ${s}`);
  console.log(`      → ${fix}`);
  problems += 1;
};
let problems = 0;

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  console.log('\nDiagnosi dell’installazione\n');

  // --- 1. Lo schema è aggiornato? -------------------------------------------
  console.log('1. Schema del database');
  let schemaReady = true;
  try {
    await prisma.strengthTrait.count();
    ok('le tabelle della Mappa dei Punti di Forza esistono');
  } catch {
    schemaReady = false;
    ko(
      'le tabelle della Mappa dei Punti di Forza non esistono',
      'npx prisma migrate deploy && npx prisma generate',
    );
  }

  if (!schemaReady) {
    console.log('\nSenza schema il resto non è verificabile. Applica la migrazione e rilancia.');
    return;
  }

  // --- 2. I contenuti sono stati caricati? ----------------------------------
  console.log('\n2. Contenuti');
  const [areas, traits] = await Promise.all([
    prisma.strengthArea.count(),
    prisma.strengthTrait.count(),
  ]);
  if (areas === 5 && traits === 30) {
    ok(`${areas} aree e ${traits} tratti`);
  } else {
    ko(`trovate ${areas} aree e ${traits} tratti (attesi 5 e 30)`, 'npm run db:seed');
  }

  const assessments = await prisma.assessment.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { questions: { where: { isActive: true } }, blocks: { where: { isActive: true } } },
      },
    },
  });

  const quartet = assessments.filter((a) => a.itemFormat === 'FORCED_CHOICE_QUARTET');
  if (quartet.length === 4) {
    ok('i quattro questionari della Mappa dei Punti di Forza sono presenti');
  } else {
    ko(
      `questionari a scelta forzata trovati: ${quartet.length} su 4`,
      'npm run db:seed',
    );
  }

  console.log('\n   Questionari nel database:');
  for (const a of assessments) {
    const items =
      a.itemFormat === 'FORCED_CHOICE_QUARTET'
        ? `${a._count.blocks} blocchi`
        : `${a._count.questions} item`;
    const flag = a.isActive ? ' ' : ' (disattivato)';
    console.log(`     ${a.slug.padEnd(16)} ${items.padEnd(12)}${flag}`);
    if (a.isActive && a.itemFormat === 'FORCED_CHOICE_QUARTET' && a._count.blocks === 0) {
      ko(`«${a.slug}» non ha blocchi: non è compilabile`, 'npm run db:seed');
    }
  }

  // --- 3. Chi li vede? ------------------------------------------------------
  console.log('\n3. Abilitazione per ruolo');
  const roles = await prisma.orgRole.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { assessments: { include: { assessment: { select: { slug: true } } } } },
  });

  if (roles.length === 0) {
    console.log('   Nessun ruolo definito: tutti vedono tutto.');
  } else {
    for (const r of roles) {
      const enabled = r.assessments.map((a) => a.assessment.slug);
      const withMpf = enabled.filter((s) => s.startsWith('mpf_'));
      const label = `${r.name}${r.isDefault ? ' (predefinito)' : ''}`;
      if (withMpf.length > 0) {
        ok(`${label}: ${withMpf.join(', ')}`);
      } else {
        ko(
          `${label} non abilita nessun questionario della Mappa dei Punti di Forza`,
          'abilitali da /admin/ruoli, oppure rilancia npm run db:seed per ripristinare i ruoli predefiniti',
        );
      }
    }
  }

  // --- 4. Una persona in particolare ---------------------------------------
  if (email) {
    console.log(`\n4. Che cosa vede ${email}`);
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        orgRole: {
          include: { assessments: { include: { assessment: { select: { slug: true, name: true } } } } },
        },
      },
    });

    if (!user) {
      ko(`nessun utente con questa email`, 'controlla l’indirizzo, o crealo da /admin/nuovo-utente');
    } else if (user.role === 'ADMIN') {
      ok('è amministratore: vede tutti i questionari attivi, senza restrizioni di ruolo');
    } else {
      const role =
        user.orgRole ??
        (await prisma.orgRole.findFirst({
          where: { isDefault: true },
          include: {
            assessments: { include: { assessment: { select: { slug: true, name: true } } } },
          },
        }));

      if (!role) {
        ok('nessun ruolo assegnato né predefinito: vede tutti i questionari attivi');
      } else {
        const source = user.orgRole ? 'assegnato' : 'predefinito';
        console.log(`   Ruolo ${source}: ${role.name}`);
        for (const a of role.assessments) {
          console.log(
            `     ${a.assessment.slug.padEnd(16)} ${a.isRequired ? 'richiesto' : 'facoltativo'}`,
          );
        }
        if (!role.assessments.some((a) => a.assessment.slug.startsWith('mpf_'))) {
          ko(
            'questo ruolo non abilita i questionari nuovi',
            'aprili per il ruolo da /admin/ruoli',
          );
        }
      }
    }
  } else {
    console.log(
      '\n4. Per sapere che cosa vede una persona: npm run db:diagnosi -- indirizzo@email.it',
    );
  }

  console.log(
    problems === 0
      ? '\n✓ Tutto a posto. Se il browser mostra ancora la lista vecchia, riavvia il server e ricarica.'
      : `\n✗ ${problems} problema/i da sistemare (vedi le frecce qui sopra).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
