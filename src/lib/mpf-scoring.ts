/**
 * ===========================================================================
 * MOTORE DI CALCOLO — blocchi quartetto a scelta forzata
 * ===========================================================================
 *
 * Formato di risposta. Ogni blocco presenta quattro affermazioni appartenenti
 * a quattro tratti diversi. Chi risponde indica quella che lo descrive DI PIÙ
 * e quella che lo descrive DI MENO. Non esiste una via di mezzo: la scelta è
 * forzata, e questo riduce due distorsioni tipiche delle scale Likert —
 * la tendenza ad accordarsi con qualunque affermazione (acquiescenza) e quella
 * a usare sempre la stessa zona della scala (response set).
 *
 * Da most/least a preferenze. La risposta produce un ordinamento parziale:
 *
 *     scelto come "più"  >  i due non scelti  >  scelto come "meno"
 *
 * cioè cinque confronti a coppie informativi per blocco (il confronto fra i
 * due intermedi resta indeterminato, e non viene inventato). Ne segue una
 * quota di preferenza per ciascuno dei quattro tratti del blocco:
 *
 *     "più" = 1.0     intermedi = 0.5     "meno" = 0.0
 *
 * Punteggio del tratto. Media delle quote ricevute nei blocchi in cui compare,
 * riportata su 0-100. Il disegno dei blocchi garantisce che ogni tratto compaia
 * lo stesso numero di volte, quindi le medie sono confrontabili fra loro.
 *
 * Normalizzazione. Come ogni strumento a scelta forzata il punteggio è
 * ipsativo: ciò che un tratto guadagna lo perde un altro. I punteggi grezzi
 * vanno perciò letti in rapporto fra loro, e la classifica usa uno z-score
 * calcolato sui tratti della stessa persona, riscalato su media 50 e
 * deviazione standard 15.
 *
 * Indice di coerenza. Alcuni blocchi ripropongono più avanti la stessa
 * quartina di tratti già incontrata, con affermazioni diverse: se la scelta era
 * meditata la persona indica di nuovo lo stesso tratto come "più" e lo stesso
 * come "meno". Il tasso di disaccordo su questi controlli misura quanto la
 * compilazione è stata attenta. Vale 0 se le risposte coincidono sempre e
 * tende a 0,75 se si risponde a caso (una scelta su quattro coincide per
 * effetto del caso). I blocchi di controllo non entrano nei punteggi: se ci
 * entrassero, i tratti che vi compaiono avrebbero più occasioni di essere
 * scelti degli altri.
 *
 * Il controllo esplicito serve perché in un disegno a scelta forzata la
 * maggior parte delle coppie di tratti viene confrontata una volta sola: un
 * indice ricavato dalle sole ripetizioni spontanee sarebbe quasi sempre
 * indefinito, e uno ricavato dalle terne di preferenze cicliche misurerebbe
 * soprattutto quanto è piatto il profilo, non quanto è attenta la persona.
 */

export type MpfBlockResponse = {
  /** Posizione del blocco nel questionario. */
  position: number;
  /** Slug dei tratti delle quattro affermazioni, nell'ordine mostrato. */
  traitSlugs: [string, string, string, string];
  /** Indice (0-3) dell'affermazione scelta come "più mi descrive". */
  mostIndex: number;
  /** Indice (0-3) dell'affermazione scelta come "meno mi descrive". */
  leastIndex: number;
  /**
   * Se valorizzato, il blocco ripropone i tratti del blocco indicato: conta
   * solo per la coerenza, non per i punteggi.
   */
  controlForPosition?: number;
};

export type MpfTraitScore = {
  slug: string;
  /** Media delle quote di preferenza, 0-100. */
  rawScore: number;
  /** z-score intra-individuo riscalato (media 50, sd 15), troncato a 0-100. */
  normalizedScore: number;
  /** Quante volte il tratto è stato scelto come "più mi descrive". */
  timesMost: number;
  /** Quante volte è stato scelto come "meno mi descrive". */
  timesLeast: number;
  /** 1 = tratto dominante. */
  rank: number;
};

export type MpfOutcome = {
  traitScores: MpfTraitScore[];
  /** Percentuali per area, normalizzate a somma 100. */
  areaScores: Record<string, number>;
  topTraitSlugs: string[];
  /** Quota di blocchi lasciati senza risposta. */
  skippedRatio: number;
  /**
   * Quota di scelte non confermate nei blocchi di controllo. Circa 0,5 è il
   * livello di chi risponde con attenzione, circa 0,75 quello di chi risponde
   * a caso: si legge in rapporto a questi due estremi, non allo zero.
   */
  inconsistencyRate: number;
  /** Confronti di controllo effettivamente valutati (0 = indice non calcolabile). */
  controlChecks: number;
  /** Indice di attendibilità 0-100 derivato da coerenza e completezza. */
  reliabilityIndex: number;
  /**
   * Lettura della sola coerenza, nella precisione che i controlli consentono.
   * `non_valutabile` quando i blocchi di controllo sono stati saltati.
   */
  reliabilityBand: 'buona' | 'da_verificare' | 'bassa' | 'non_valutabile';
};

/**
 * Ancoraggi dell'indice di attendibilità, ricavati per simulazione
 * (`scripts/mpf/simula.ts`).
 *
 * Chi risponde a caso conferma una scelta su quattro, quindi ne cambia tre su
 * quattro. Chi risponde con attenzione NON arriva a zero: metà circa dei
 * confronti di controllo cade fra tratti che la persona possiede in misura
 * simile, e lì la scelta è legittimamente instabile. Il livello che un
 * rispondente attento raggiunge davvero è intorno a 0,5, ed è quello — non lo
 * zero teorico — l'estremo alto della scala.
 */
const RANDOM_DISAGREEMENT_RATE = 0.75;
const ATTENTIVE_DISAGREEMENT_RATE = 0.5;

/**
 * Soglie della fascia di attendibilità. I confronti di controllo sono sedici:
 * abbastanza per dire se una compilazione è nella norma, troppo pochi perché il
 * numero puntuale sia preciso sul singolo profilo. Il report mostra perciò una
 * fascia, e le soglie sono tarate perché chi ha risposto con attenzione non
 * finisca quasi mai in quella bassa (`scripts/mpf/simula.ts` ne stampa la
 * distribuzione).
 */
const BAND_UNCERTAIN = 0.58;
const BAND_LOW = 0.66;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function round(n: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/** Valida una risposta: gli indici devono essere distinti e nel campo 0-3. */
export function isValidBlockResponse(mostIndex: number, leastIndex: number): boolean {
  const inRange = (i: number) => Number.isInteger(i) && i >= 0 && i <= 3;
  return inRange(mostIndex) && inRange(leastIndex) && mostIndex !== leastIndex;
}

/**
 * Confronti a coppie derivati da un blocco: cinque coppie ordinate
 * (preferito, non preferito).
 */
export function pairwiseFromBlock(r: MpfBlockResponse): [string, string][] {
  const most = r.traitSlugs[r.mostIndex]!;
  const least = r.traitSlugs[r.leastIndex]!;
  const middles = r.traitSlugs.filter((_, i) => i !== r.mostIndex && i !== r.leastIndex);

  return [
    [most, least],
    ...middles.map((m) => [most, m] as [string, string]),
    ...middles.map((m) => [m, least] as [string, string]),
  ];
}

/**
 * Calcola il profilo a partire dalle risposte ai blocchi.
 *
 * @param responses    risposte valide, controlli compresi (i blocchi saltati non
 *                     vanno inclusi: la funzione li tratta come mancanti)
 * @param traitAreas   mappa slug tratto -> slug area, per tutti i tratti misurati
 * @param totalBlocks  blocchi somministrati, per calcolare la quota di salti
 * @param topCount     quanti tratti dominanti restituire
 */
export function computeMpfScores(
  responses: MpfBlockResponse[],
  traitAreas: Record<string, string>,
  totalBlocks: number,
  topCount = 5,
): MpfOutcome {
  const slugs = Object.keys(traitAreas);
  // I controlli restano fuori dai punteggi: vedi la nota in testa al file.
  const scored = responses.filter((r) => r.controlForPosition === undefined);

  // --- 1. Quote di preferenza per tratto ------------------------------------
  const totals: Record<string, { sum: number; count: number; most: number; least: number }> = {};
  for (const slug of slugs) totals[slug] = { sum: 0, count: 0, most: 0, least: 0 };

  for (const r of scored) {
    r.traitSlugs.forEach((slug, index) => {
      const t = totals[slug];
      if (!t) return;
      const preference = index === r.mostIndex ? 1 : index === r.leastIndex ? 0 : 0.5;
      t.sum += preference;
      t.count += 1;
      if (index === r.mostIndex) t.most += 1;
      if (index === r.leastIndex) t.least += 1;
    });
  }

  const raw: Record<string, number> = {};
  for (const slug of slugs) {
    const { sum, count } = totals[slug]!;
    // Un tratto mai somministrato (tutti i suoi blocchi saltati) resta al centro.
    raw[slug] = count > 0 ? (sum / count) * 100 : 50;
  }

  // --- 2. Normalizzazione ipsativa intra-individuo --------------------------
  const values = slugs.map((s) => raw[s]!);
  const mean = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const sd = Math.sqrt(
    values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (values.length || 1),
  );

  const normalized: Record<string, number> = {};
  for (const slug of slugs) {
    const z = sd > 0.0001 ? (raw[slug]! - mean) / sd : 0;
    normalized[slug] = clamp(50 + z * 15, 0, 100);
  }

  // --- 3. Classifica --------------------------------------------------------
  const traitScores = slugs
    .slice()
    .sort((a, b) => normalized[b]! - normalized[a]! || a.localeCompare(b))
    .map<MpfTraitScore>((slug, index) => ({
      slug,
      rawScore: round(raw[slug]!),
      normalizedScore: round(normalized[slug]!),
      timesMost: totals[slug]!.most,
      timesLeast: totals[slug]!.least,
      rank: index + 1,
    }));

  // --- 4. Bilanciamento fra le aree ----------------------------------------
  const areaTotals: Record<string, number> = {};
  for (const slug of slugs) {
    const area = traitAreas[slug]!;
    areaTotals[area] = (areaTotals[area] ?? 0) + raw[slug]!;
  }
  const grandTotal = Object.values(areaTotals).reduce((a, b) => a + b, 0);
  const areaScores: Record<string, number> = {};
  const areaKeys = Object.keys(areaTotals);
  for (const area of areaKeys) {
    areaScores[area] =
      grandTotal > 0 ? round((areaTotals[area]! / grandTotal) * 100, 1) : round(100 / areaKeys.length, 1);
  }

  // --- 5. Coerenza: blocchi di controllo ------------------------------------
  const byPosition = new Map(responses.map((r) => [r.position, r]));
  let disagreements = 0;
  let controlChecks = 0;

  for (const control of responses) {
    if (control.controlForPosition === undefined) continue;
    const source = byPosition.get(control.controlForPosition);
    // Se il blocco di origine è stato saltato non c'è nulla da confrontare.
    if (!source) continue;
    // Il confronto è fra tratti, non fra posizioni: nel controllo le
    // affermazioni sono rimescolate.
    if (control.traitSlugs[control.mostIndex] !== source.traitSlugs[source.mostIndex]) {
      disagreements += 1;
    }
    if (control.traitSlugs[control.leastIndex] !== source.traitSlugs[source.leastIndex]) {
      disagreements += 1;
    }
    controlChecks += 2;
  }

  const inconsistencyRate = controlChecks > 0 ? round(disagreements / controlChecks, 3) : 0;

  const skippedRatio =
    totalBlocks > 0 ? round((totalBlocks - responses.length) / totalBlocks, 3) : 0;

  // Attendibilità: penalizza i salti e l'incoerenza. Senza controlli valutabili
  // (per esempio se sono stati saltati) l'indice riflette la sola completezza.
  const consistency = clamp(
    (RANDOM_DISAGREEMENT_RATE - inconsistencyRate) /
      (RANDOM_DISAGREEMENT_RATE - ATTENTIVE_DISAGREEMENT_RATE),
    0,
    1,
  );
  const reliability = 100 * (1 - skippedRatio) * (controlChecks > 0 ? consistency : 1);

  const reliabilityBand: MpfOutcome['reliabilityBand'] =
    controlChecks === 0
      ? 'non_valutabile'
      : inconsistencyRate >= BAND_LOW
        ? 'bassa'
        : inconsistencyRate >= BAND_UNCERTAIN
          ? 'da_verificare'
          : 'buona';

  return {
    traitScores,
    areaScores,
    topTraitSlugs: traitScores.slice(0, topCount).map((t) => t.slug),
    skippedRatio,
    inconsistencyRate,
    controlChecks,
    reliabilityIndex: Math.round(clamp(reliability, 0, 100)),
    reliabilityBand,
  };
}
