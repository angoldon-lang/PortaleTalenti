/**
 * Simulazione end-to-end del motore di calcolo.
 *
 * Crea un profilo "atteso" (alcuni temi forti, altri deboli), genera risposte
 * coerenti con quel profilo e verifica che l'algoritmo li riporti in cima alla
 * classifica. Serve come test di validità dell'algoritmo prima di somministrare
 * il questionario a persone vere.
 */
import { loadEnvFile } from 'node:process';

import { PrismaClient, type Domain } from '@prisma/client';
import { computeScores, reliabilityIndex } from '../src/lib/scoring';

try {
  loadEnvFile('.env');
} catch {}

const prisma = new PrismaClient();

// "Verità" da recuperare: intensità reale di ciascun tema, da 0 a 1.
const TRUE_PROFILE: Record<string, number> = {
  ideazione: 0.95,
  analitico: 0.9,
  apprendimento: 0.85,
  comunicazione: 0.7,
  attivatore: 0.6,
  'fiducia-in-se': 0.5,
  realizzatore: 0.45,
  empatia: 0.4,
  sviluppatore: 0.35,
  armonia: 0.25,
  responsabilita: 0.2,
  organizzazione: 0.1,
};

function likertFromPreference(left: number, right: number, noise: number): number {
  // Differenza di intensità -> posizione sulla scala, con un po' di rumore.
  const diff = right - left + (Math.random() - 0.5) * noise;
  const raw = 4 + diff * 6; // diff in [-1,1] -> [1,7] circa
  return Math.min(7, Math.max(1, Math.round(raw)));
}

async function main() {
  const questions = await prisma.question.findMany({
    where: { isActive: true },
    orderBy: { position: 'asc' },
    include: {
      leftTheme: { select: { slug: true } },
      rightTheme: { select: { slug: true } },
    },
  });

  const themes = await prisma.talentTheme.findMany({ select: { slug: true, domain: true } });
  const themeDomains: Record<string, Domain> = {};
  for (const t of themes) themeDomains[t.slug] = t.domain;

  const responses = questions.map((q) => {
    const timedOut = Math.random() < 0.05;
    return {
      value: timedOut
        ? 4
        : likertFromPreference(
            TRUE_PROFILE[q.leftTheme.slug]!,
            TRUE_PROFILE[q.rightTheme.slug]!,
            0.5,
          ),
      timedOut,
      leftThemeSlug: q.leftTheme.slug,
      rightThemeSlug: q.rightTheme.slug,
      leftWeight: q.leftWeight,
      rightWeight: q.rightWeight,
    };
  });

  const outcome = computeScores(responses, themeDomains);

  console.log(`Item somministrati: ${responses.length}`);
  console.log(`Indice di affidabilità: ${reliabilityIndex(responses)}/100`);
  console.log(`Timeout: ${(outcome.timeoutRatio * 100).toFixed(1)}%\n`);

  console.log('Classifica calcolata (atteso → ottenuto):');
  const expected = Object.entries(TRUE_PROFILE)
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => slug);

  for (const t of outcome.themeScores) {
    const expectedRank = expected.indexOf(t.slug) + 1;
    const flag = Math.abs(expectedRank - t.rank) <= 2 ? '  ' : '!!';
    console.log(
      `${flag} #${String(t.rank).padStart(2)}  ${t.slug.padEnd(16)} grezzo ${t.rawScore
        .toFixed(1)
        .padStart(5)}  norm ${t.normalizedScore.toFixed(1).padStart(5)}  (atteso #${expectedRank})`,
    );
  }

  console.log('\nBilanciamento macro-aree:');
  for (const [domain, value] of Object.entries(outcome.domainScores)) {
    console.log(`  ${domain.padEnd(14)} ${value.toFixed(1)}%`);
  }
  const sum = Object.values(outcome.domainScores).reduce((a, b) => a + b, 0);
  console.log(`  somma: ${sum.toFixed(1)}% (deve essere 100)`);

  console.log(`\nTop 5: ${outcome.topThemeSlugs.join(', ')}`);

  // Verifica: quanti dei 5 temi realmente più forti finiscono nella Top 5?
  const hits = outcome.topThemeSlugs.filter((s) => expected.slice(0, 5).includes(s)).length;
  console.log(`Recupero della Top 5 reale: ${hits}/5`);

  const spearman = spearmanRho(
    outcome.themeScores.map((t) => t.rank),
    outcome.themeScores.map((t) => expected.indexOf(t.slug) + 1),
  );
  console.log(`Correlazione di rango (Spearman) con il profilo vero: ${spearman.toFixed(3)}`);

  if (hits < 4 || spearman < 0.8) {
    console.error('\n✗ L’algoritmo non recupera il profilo atteso.');
    process.exit(1);
  }
  console.log('\n✓ L’algoritmo recupera il profilo atteso.');
}

function spearmanRho(a: number[], b: number[]): number {
  const n = a.length;
  const d2 = a.reduce((acc, v, i) => acc + (v - b[i]!) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
