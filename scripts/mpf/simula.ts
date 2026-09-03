/**
 * ===========================================================================
 * VALIDAZIONE DEL MOTORE — Mappa dei Punti di Forza
 * ===========================================================================
 *
 * Verifica che il disegno dei blocchi e l'algoritmo di calcolo ricostruiscano
 * il profilo di una persona di cui conosciamo la "verità". Si simulano
 * rispondenti con un livello reale noto per ciascun tratto; il rispondente
 * sceglie in ogni blocco l'affermazione dal valore percepito più alto e quella
 * dal valore più basso, dove il valore percepito è il livello reale più un
 * disturbo casuale (attenzione, umore, ambiguità dell'item).
 *
 * Si misurano due cose:
 *
 *   - RECUPERO DEI TOP 5: quanti dei cinque tratti realmente dominanti finiscono
 *     nei primi cinque del report. È ciò che la persona legge per primo, quindi
 *     è il criterio che conta di più.
 *   - CORRELAZIONE DI RANGO: quanto l'intera classifica dei 30 tratti somiglia
 *     a quella vera (rho di Spearman).
 *
 * Le soglie sono diverse per scenario, perché il compito non ha la stessa
 * difficoltà: se i cinque tratti dominanti staccano nettamente gli altri il
 * recupero deve essere quasi perfetto; se il profilo è piatto, distinguere il
 * quinto dal sesto è intrinsecamente ambiguo e pretendere precisione
 * significherebbe misurare il rumore.
 */
import { computeMpfScores, type MpfBlockResponse } from '../../src/lib/mpf-scoring';
import { MPF_BLOCK_BANKS, type MpfBankKey } from '../../src/content/mpf/blocks';
import { MPF_TRAITS } from '../../src/content/mpf/model';

const TRAIT_AREAS: Record<string, string> = {};
for (const t of MPF_TRAITS) TRAIT_AREAS[t.slug] = t.area;
const SLUGS = MPF_TRAITS.map((t) => t.slug);

const REPLICATIONS = Number(process.env.MPF_REPLICATIONS ?? 40);
const RESPONDENTS = 30;

/** Generatore riproducibile: la validazione deve dare lo stesso esito ogni volta. */
function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function gaussian(rnd: () => number): number {
  const u = Math.max(rnd(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
}

type Scenario = {
  name: string;
  description: string;
  /** Livelli reali dei 30 tratti, dal dominante all'ultimo. */
  levels: (i: number) => number;
  /** Disturbo di risposta: quanto la scelta è instabile. */
  noise: number;
  minRecall: number;
  minRho: number;
};

const SCENARIOS: Scenario[] = [
  {
    name: 'profilo netto',
    description:
      'cinque tratti staccano nettamente gli altri: il caso in cui il report deve essere preciso',
    levels: (i) => (i < 5 ? 3 - i * 0.05 : 1.2 - (i - 5) * 0.04),
    noise: 0.5,
    minRecall: 4.7,
    // La coda è compressa di proposito (quattro centesimi fra una posizione e
    // la successiva, contro un disturbo dieci volte più grande): il suo ordine
    // non è recuperabile e la soglia di rho non pretende che lo sia.
    minRho: 0.75,
  },
  {
    name: 'profilo graduale',
    description: 'i livelli calano di poco a ogni posizione, senza salti fra il quinto e il sesto',
    levels: (i) => 3 - i * 0.1,
    noise: 0.5,
    minRecall: 3.5,
    minRho: 0.9,
  },
  {
    name: 'profilo piatto',
    description:
      'differenze minime fra tutti i tratti: caso volutamente sfavorevole, dove distinguere il quinto dal sesto è ambiguo per costruzione',
    levels: (i) => 3 - i * 0.03,
    noise: 0.5,
    minRecall: 2.0,
    minRho: 0.6,
  },
  {
    name: 'profilo concentrato',
    description:
      'i cinque tratti dominanti appartengono tutti alla stessa area, che i blocchi non confrontano mai fra loro',
    levels: (i) => (i < 5 ? 3 - i * 0.05 : 1.2 - (i - 5) * 0.04),
    noise: 0.5,
    minRecall: 4.7,
    minRho: 0.75,
  },
];

/**
 * Rispondente che tira a indovinare su una quota `share` dei blocchi e risponde
 * davvero sugli altri. Serve a controllare che l'indice di coerenza li
 * distingua, e che lo faccia in modo graduale.
 */
function respondCarelessly(
  bank: MpfBankKey,
  truth: Map<string, number>,
  noise: number,
  share: number,
  rnd: () => number,
): MpfBlockResponse[] {
  return MPF_BLOCK_BANKS[bank].map((block) => {
    const slugs = block.options.map((o) => o.trait) as [string, string, string, string];
    let most: number;
    let least: number;
    if (rnd() < share) {
      most = Math.floor(rnd() * 4);
      least = Math.floor(rnd() * 3);
      if (least >= most) least += 1;
    } else {
      const perceived = slugs.map((x) => truth.get(x)! + gaussian(rnd) * noise);
      most = 0;
      least = 0;
      perceived.forEach((v, i) => {
        if (v > perceived[most]!) most = i;
        if (v < perceived[least]!) least = i;
      });
    }
    return {
      position: block.position,
      traitSlugs: slugs,
      mostIndex: most,
      leastIndex: least,
      ...(block.controlFor === undefined ? {} : { controlForPosition: block.controlFor }),
    };
  });
}

/** Assegna i livelli ai tratti: di norma a caso, concentrati in un'area nell'ultimo scenario. */
function assignTruth(scenario: Scenario, rnd: () => number): Map<string, number> {
  let order: string[];
  if (scenario.name === 'profilo concentrato') {
    const area = MPF_TRAITS[Math.floor(rnd() * MPF_TRAITS.length)]!.area;
    const inside = SLUGS.filter((s) => TRAIT_AREAS[s] === area);
    const outside = SLUGS.filter((s) => TRAIT_AREAS[s] !== area);
    order = [...inside.slice(0, 5), ...shuffle(outside, rnd), ...inside.slice(5)];
  } else {
    order = shuffle(SLUGS, rnd);
  }
  return new Map(order.map((slug, i) => [slug, scenario.levels(i)]));
}

function shuffle<T>(xs: T[], rnd: () => number): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function respond(bank: MpfBankKey, truth: Map<string, number>, noise: number, rnd: () => number) {
  return MPF_BLOCK_BANKS[bank].map<MpfBlockResponse>((block) => {
    const slugs = block.options.map((o) => o.trait) as [string, string, string, string];
    const perceived = slugs.map((s) => truth.get(s)! + gaussian(rnd) * noise);
    let most = 0;
    let least = 0;
    perceived.forEach((v, i) => {
      if (v > perceived[most]!) most = i;
      if (v < perceived[least]!) least = i;
    });
    return {
      position: block.position,
      traitSlugs: slugs,
      mostIndex: most,
      leastIndex: least,
      ...(block.controlFor === undefined ? {} : { controlForPosition: block.controlFor }),
    };
  });
}

function spearman(a: string[], b: string[]): number {
  const rankB = new Map(b.map((s, i) => [s, i]));
  const n = a.length;
  let d2 = 0;
  a.forEach((s, i) => {
    const d = i - rankB.get(s)!;
    d2 += d * d;
  });
  return 1 - (6 * d2) / (n * (n * n - 1));
}

const banks = Object.keys(MPF_BLOCK_BANKS) as MpfBankKey[];
let failures = 0;

for (const bank of banks) {
  const nBlocks = MPF_BLOCK_BANKS[bank].length;
  console.log(`\n${bank}  (${nBlocks} blocchi, ${nBlocks * 5} confronti a coppie)`);

  for (const scenario of SCENARIOS) {
    let recall = 0;
    let rho = 0;
    let inconsistency = 0;
    let reliability = 0;

    for (let rep = 0; rep < REPLICATIONS; rep += 1) {
      const rnd = makeRandom(1000 + rep * 97);
      for (let p = 0; p < RESPONDENTS; p += 1) {
        const truth = assignTruth(scenario, rnd);
        const trueOrder = SLUGS.slice().sort((x, y) => truth.get(y)! - truth.get(x)!);
        const out = computeMpfScores(respond(bank, truth, scenario.noise, rnd), TRAIT_AREAS, nBlocks);
        const top5 = new Set(out.topTraitSlugs);
        recall += trueOrder.slice(0, 5).filter((s) => top5.has(s)).length;
        rho += spearman(
          out.traitScores.map((t) => t.slug),
          trueOrder,
        );
        inconsistency += out.inconsistencyRate;
        reliability += out.reliabilityIndex;
      }
    }

    const n = REPLICATIONS * RESPONDENTS;
    const avgRecall = recall / n;
    const avgRho = rho / n;
    const ok = avgRecall >= scenario.minRecall && avgRho >= scenario.minRho;
    if (!ok) failures += 1;
    console.log(
      `  ${ok ? 'OK  ' : 'FAIL'} ${scenario.name.padEnd(22)} ` +
        `top5 ${avgRecall.toFixed(2)}/5 (min ${scenario.minRecall})  ` +
        `rho ${avgRho.toFixed(3)} (min ${scenario.minRho})  ` +
        `incoerenza ${(inconsistency / n).toFixed(3)}  affidabilità ${(reliability / n).toFixed(0)}`,
    );
  }
}

// --- Controllo dell'indice di coerenza --------------------------------------
// Non basta che l'indice sia buono per chi risponde con attenzione: deve anche
// peggiorare in modo ordinato via via che le risposte diventano casuali,
// altrimenti non distingue nulla.
const CARELESSNESS = [0, 0.25, 0.5, 0.75, 1];
console.log('\nAffidabilità al crescere della quota di risposte tirate a caso');
for (const bank of banks) {
  const nBlocks = MPF_BLOCK_BANKS[bank].length;
  const n = REPLICATIONS * RESPONDENTS;
  const measured = CARELESSNESS.map(() => ({
    inc: 0,
    rel: 0,
    bands: { buona: 0, da_verificare: 0, bassa: 0, non_valutabile: 0 },
  }));

  for (let rep = 0; rep < REPLICATIONS; rep += 1) {
    const rnd = makeRandom(5000 + rep * 131);
    for (let p = 0; p < RESPONDENTS; p += 1) {
      const truth = assignTruth(SCENARIOS[0]!, rnd);
      CARELESSNESS.forEach((share, i) => {
        const out = computeMpfScores(
          respondCarelessly(bank, truth, SCENARIOS[0]!.noise, share, rnd),
          TRAIT_AREAS,
          nBlocks,
        );
        measured[i]!.inc += out.inconsistencyRate;
        measured[i]!.rel += out.reliabilityIndex;
        measured[i]!.bands[out.reliabilityBand] += 1;
      });
    }
  }

  const rel = measured.map((m) => m.rel / n);
  const monotone = rel.every((v, i) => i === 0 || v <= rel[i - 1]! + 1);
  const attentiveFlagged = measured[0]!.bands.bassa / n;
  const carelessCaught = (measured[4]!.bands.bassa + measured[4]!.bands.da_verificare) / n;
  const ok = monotone && rel[0]! >= 70 && attentiveFlagged <= 0.1 && carelessCaught >= 0.75;
  if (!ok) failures += 1;
  console.log(
    `  ${ok ? 'OK  ' : 'FAIL'} ${bank.padEnd(15)} ` +
      CARELESSNESS.map((share, i) => `${(share * 100).toFixed(0)}%→${rel[i]!.toFixed(0)}`).join('  ') +
      `   attenti in fascia bassa ${(attentiveFlagged * 100).toFixed(1)}% (max 10)` +
      `   casuali segnalati ${(carelessCaught * 100).toFixed(1)}% (min 75)`,
  );
}

console.log(
  `\n${failures === 0 ? 'Tutti i criteri soddisfatti.' : `${failures} criteri non soddisfatti.`}`,
);
process.exit(failures === 0 ? 0 : 1);
