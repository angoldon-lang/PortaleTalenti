/**
 * Verifica di validità del motore di calcolo, su ogni questionario.
 *
 * Per ciascun assessment: si assegna a ogni tema misurato una "vera" intensità
 * nota, si generano risposte coerenti con quel profilo (con rumore e un 5% di
 * timeout) e si controlla che l'algoritmo ricostruisca la classifica.
 *
 *   npx tsx scripts/simulate.ts            # tutti i questionari
 *   npx tsx scripts/simulate.ts full34     # uno solo
 */
import { loadEnvFile } from 'node:process';

import { PrismaClient, type Domain } from '@prisma/client';
import { computeScores, reliabilityIndex } from '../src/lib/scoring';

try {
  loadEnvFile('.env');
} catch {
  // In CI le variabili arrivano dall'ambiente.
}

const prisma = new PrismaClient();

/**
 * Si simulano due profili diversi, perché misurano cose diverse.
 *
 *  - DIFFERENZIATO: la persona ha talenti chiaramente dominanti, una massa
 *    centrale e alcune aree deboli. È il caso reale su cui il report fonda la
 *    sua promessa ("questi sono i tuoi talenti dominanti"), quindi qui si
 *    pretende che la Top K venga recuperata.
 *
 *  - PIATTO: 34 temi equispaziati fra 0 e 1. I temi adiacenti distano meno del
 *    rumore di risposta, quindi il confine della Top K NON è recuperabile — e
 *    non deve esserlo: con un profilo indifferenziato, dire "il tuo 7° talento"
 *    sarebbe arbitrario. Qui si verifica solo la qualità dell'ordinamento
 *    complessivo, che resta alta.
 */
type Scenario = {
  label: string;
  /** Intervallo di intensità della fascia dominante; null = profilo uniforme. */
  tiers: { top: [number, number]; middle: [number, number]; bottom: [number, number] } | null;
  minSpearman: number;
  /** Quota minima della Top K da recuperare; null = non pretesa in questo scenario. */
  minRecall: number | null;
  note: string;
};

const SCENARIOS: Scenario[] = [
  {
    label: 'profilo con talenti nettamente dominanti',
    tiers: { top: [0.9, 1.0], middle: [0.25, 0.55], bottom: [0.0, 0.15] },
    minSpearman: 0.85,
    minRecall: 0.85,
    note: 'la fascia dominante è separata dal resto molto più del rumore: il report deve trovarla',
  },
  {
    label: 'profilo moderatamente differenziato',
    tiers: { top: [0.8, 1.0], middle: [0.35, 0.65], bottom: [0.0, 0.2] },
    minSpearman: 0.85,
    minRecall: null,
    note: 'il salto fra fascia alta e media è dell’ordine del rumore: il confine della Top K è per costruzione incerto',
  },
  {
    label: 'profilo piatto',
    tiers: null,
    minSpearman: 0.8,
    minRecall: null,
    note: 'temi equispaziati: senza talenti dominanti la Top K non è, e non deve essere, recuperabile',
  },
];

function lerp(range: [number, number], t: number): number {
  return range[1] - (range[1] - range[0]) * t;
}

function trueIntensity(
  scenario: Scenario,
  index: number,
  total: number,
  topCount: number,
): number {
  if (!scenario.tiers) return 1 - index / Math.max(1, total - 1);

  const { top, middle, bottom } = scenario.tiers;
  const bottomStart = total - topCount;
  if (index < topCount) return lerp(top, index / Math.max(1, topCount - 1));
  if (index >= bottomStart) {
    return lerp(bottom, (index - bottomStart) / Math.max(1, topCount - 1));
  }
  return lerp(middle, (index - topCount) / Math.max(1, bottomStart - topCount - 1));
}

function likert(left: number, right: number, noise: number): number {
  const diff = right - left + (Math.random() - 0.5) * noise;
  return Math.min(7, Math.max(1, Math.round(4 + diff * 6)));
}

function spearmanRho(a: number[], b: number[]): number {
  const n = a.length;
  const d2 = a.reduce((acc, v, i) => acc + (v - b[i]!) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
}

/** Repliche per combinazione questionario × scenario: le risposte sono
 *  stocastiche, quindi un singolo run non è una misura. Si valuta la media. */
const REPLICATIONS = Number(process.env.SIM_REPLICATIONS ?? 20);

async function simulate(slug: string, scenario: Scenario): Promise<boolean> {
  const found = await prisma.assessment.findUnique({ where: { slug } });
  if (!found) throw new Error(`Assessment "${slug}" non trovato.`);
  const assessment = found;

  const questions = await prisma.question.findMany({
    where: { assessmentId: assessment.id, isActive: true },
    orderBy: { position: 'asc' },
    include: {
      leftTheme: { select: { slug: true } },
      rightTheme: { select: { slug: true } },
    },
  });

  const measured = [
    ...new Set(questions.flatMap((q) => [q.leftTheme.slug, q.rightTheme.slug])),
  ].sort();

  // Ordine "vero" mescolato in modo deterministico, così la classifica attesa
  // non coincide con l'ordine alfabetico degli slug.
  const trueOrder = measured
    .map((s, i) => ({ s, k: (i * 7919) % measured.length }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.s);
  const intensity = new Map(
    trueOrder.map((s, i) => [
      s,
      trueIntensity(scenario, i, trueOrder.length, assessment.topCount),
    ]),
  );

  const themes = await prisma.talentTheme.findMany({
    where: { slug: { in: measured } },
    select: { slug: true, domain: true },
  });
  const themeDomains: Record<string, Domain> = {};
  for (const t of themes) themeDomains[t.slug] = t.domain;

  function replicate() {
  const responses = questions.map((q) => {
    const timedOut = Math.random() < 0.05;
    return {
      value: timedOut
        ? 4
        : likert(intensity.get(q.leftTheme.slug)!, intensity.get(q.rightTheme.slug)!, 0.5),
      timedOut,
      leftThemeSlug: q.leftTheme.slug,
      rightThemeSlug: q.rightTheme.slug,
      leftWeight: q.leftWeight,
      rightWeight: q.rightWeight,
    };
  });

  const outcome = computeScores(responses, themeDomains, assessment.topCount);

  const expectedRank = new Map(trueOrder.map((s, i) => [s, i + 1]));
  const spearman = spearmanRho(
    outcome.themeScores.map((t) => t.rank),
    outcome.themeScores.map((t) => expectedRank.get(t.slug)!),
  );
  const expectedTop = new Set(trueOrder.slice(0, assessment.topCount));
  const hits = outcome.topThemeSlugs.filter((s) => expectedTop.has(s)).length;
  const recall = hits / assessment.topCount;

  const domainSum = Object.values(outcome.domainScores).reduce((a, b) => a + b, 0);
  return { recall, spearman, domainSum, reliability: reliabilityIndex(responses) };
  }

  const runs = Array.from({ length: REPLICATIONS }, replicate);
  const mean = (pick: (r: ReturnType<typeof replicate>) => number) =>
    runs.reduce((a, r) => a + pick(r), 0) / runs.length;

  const avgRecall = mean((r) => r.recall);
  const avgSpearman = mean((r) => r.spearman);
  const minSpearmanSeen = Math.min(...runs.map((r) => r.spearman));
  const worstDomainSum = Math.max(...runs.map((r) => Math.abs(r.domainSum - 100)));

  const ok =
    avgSpearman >= scenario.minSpearman &&
    (scenario.minRecall === null || avgRecall >= scenario.minRecall) &&
    worstDomainSum < 0.5;

  console.log(
    `  ${ok ? '✓' : '✗'} ${assessment.name.padEnd(30)} ` +
      `${String(questions.length).padStart(3)} item · ${String(measured.length).padStart(2)} temi · ` +
      `Top ${assessment.topCount} media ${(avgRecall * assessment.topCount).toFixed(1)}/${assessment.topCount}` +
      `${scenario.minRecall === null ? ' (non richiesta)' : ''} · ` +
      `Spearman medio ${avgSpearman.toFixed(3)} (peggiore ${minSpearmanSeen.toFixed(3)}) · ` +
      `affidabilità ${Math.round(mean((r) => r.reliability))}`,
  );
  return ok;
}

async function main() {
  const only = process.argv[2];
  const slugs = only
    ? [only]
    : (await prisma.assessment.findMany({ orderBy: { sortOrder: 'asc' }, select: { slug: true } }))
        .map((a) => a.slug);

  console.log(`Verifica del motore di calcolo · ${REPLICATIONS} repliche per combinazione`);
  const outcomes: boolean[] = [];
  for (const scenario of SCENARIOS) {
    console.log(`\n${scenario.label}`);
    console.log(`  (${scenario.note})`);
    for (const slug of slugs) outcomes.push(await simulate(slug, scenario));
  }

  if (outcomes.some((ok) => !ok)) {
    console.error('\n✗ L’algoritmo non recupera il profilo atteso in almeno uno scenario.');
    process.exit(1);
  }
  console.log('\n✓ L’algoritmo recupera il profilo atteso in tutti gli scenari.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
