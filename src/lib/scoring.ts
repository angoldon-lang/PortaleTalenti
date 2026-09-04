import type { Domain } from '@prisma/client';

/**
 * ===========================================================================
 * MOTORE DI CALCOLO DEI TALENTI
 * ===========================================================================
 *
 * Il questionario usa un design a confronto a coppie (paired comparison):
 * ogni item contrappone due temi e chiede all'utente di posizionarsi su una
 * scala Likert a 7 punti.
 *
 *   1 ─────── 2 ─────── 3 ─────── 4 ─────── 5 ─────── 6 ─────── 7
 *   pienamente        neutro                     pienamente
 *   affermazione                                 affermazione
 *   di SINISTRA                                  di DESTRA
 *
 * Per ogni risposta si ricava la quota di preferenza assegnata a ciascun lato:
 *
 *   preferenzaSinistra = (7 - v) / 6      preferenzaDestra = (v - 1) / 6
 *
 * v = 4 (neutro, anche in caso di timeout) assegna 0.5 a entrambi i temi.
 *
 * Il punteggio grezzo di un tema è la media ponderata delle preferenze che ha
 * ricevuto negli 11 item in cui compare, riportata su scala 0-100.
 *
 * Poiché il design è ipsativo (ogni preferenza tolta a un tema è data a un
 * altro), i punteggi grezzi vanno letti in rapporto fra loro e non come
 * misure assolute. Per questo si calcola anche un punteggio normalizzato
 * intra-individuo (z-score sui 12 temi della persona, riscalato su 0-100 con
 * media 50 e deviazione standard 15): è questo il valore usato per la
 * classifica e per il grafico, perché rende leggibile quanto un tema si
 * stacca dal profilo medio della persona.
 */

export const LIKERT_MIN = 1;
export const LIKERT_MAX = 7;
export const LIKERT_NEUTRAL = 4;

/** Etichette della scala, dal punto di vista di chi risponde. */
export const LIKERT_LABELS: { value: number; label: string; short: string }[] = [
  { value: 1, label: 'Mi descrive pienamente l’affermazione a sinistra', short: 'Molto' },
  { value: 2, label: 'Mi descrive bene l’affermazione a sinistra', short: 'Abbastanza' },
  { value: 3, label: 'Mi descrive un po’ di più l’affermazione a sinistra', short: 'Un po’' },
  { value: 4, label: 'Le due affermazioni mi descrivono allo stesso modo', short: 'Neutro' },
  { value: 5, label: 'Mi descrive un po’ di più l’affermazione a destra', short: 'Un po’' },
  { value: 6, label: 'Mi descrive bene l’affermazione a destra', short: 'Abbastanza' },
  { value: 7, label: 'Mi descrive pienamente l’affermazione a destra', short: 'Molto' },
];

export type ScoringResponse = {
  value: number;
  timedOut: boolean;
  leftThemeSlug: string;
  rightThemeSlug: string;
  leftWeight: number;
  rightWeight: number;
};

export type ThemeScoreResult = {
  slug: string;
  /** Media ponderata delle preferenze, 0-100. */
  rawScore: number;
  /** z-score intra-individuo riscalato (media 50, sd 15), troncato a 0-100. */
  normalizedScore: number;
  /** 1 = talento dominante. */
  rank: number;
};

export type DomainScoreResult = Record<Domain, number>;

export type ScoringOutcome = {
  themeScores: ThemeScoreResult[];
  domainScores: DomainScoreResult;
  topThemeSlugs: string[];
  timeoutRatio: number;
};

/** Quota di preferenza attribuita al lato sinistro da una risposta Likert. */
export function leftPreference(value: number): number {
  const v = clamp(value, LIKERT_MIN, LIKERT_MAX);
  return (LIKERT_MAX - v) / (LIKERT_MAX - LIKERT_MIN);
}

/** Quota di preferenza attribuita al lato destro da una risposta Likert. */
export function rightPreference(value: number): number {
  return 1 - leftPreference(value);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function round(n: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(n * f) / f;
}

/**
 * Calcola punteggi per tema e per macro-area a partire dalle risposte grezze.
 *
 * @param responses     risposte dell'utente, già arricchite con i temi dell'item
 * @param themeDomains  mappa slug tema -> macro-area (tutti i temi del catalogo)
 * @param topCount      quanti temi dominanti restituire (default 5)
 */
export function computeScores(
  responses: ScoringResponse[],
  themeDomains: Record<string, Domain>,
  topCount = 5,
): ScoringOutcome {
  const slugs = Object.keys(themeDomains);

  // --- 1. Somma ponderata delle preferenze per tema -------------------------
  const weighted: Record<string, { sum: number; weight: number }> = {};
  for (const slug of slugs) weighted[slug] = { sum: 0, weight: 0 };

  let timedOutCount = 0;

  for (const r of responses) {
    if (r.timedOut) timedOutCount += 1;

    // Una risposta scaduta per timeout vale come neutra: non sposta il
    // rapporto fra i due temi, ma continua a contribuire al denominatore.
    const value = r.timedOut ? LIKERT_NEUTRAL : r.value;
    const left = leftPreference(value);
    const right = rightPreference(value);

    const l = weighted[r.leftThemeSlug];
    if (l) {
      l.sum += left * r.leftWeight;
      l.weight += r.leftWeight;
    }
    const rr = weighted[r.rightThemeSlug];
    if (rr) {
      rr.sum += right * r.rightWeight;
      rr.weight += r.rightWeight;
    }
  }

  // --- 2. Punteggio grezzo 0-100 -------------------------------------------
  const raw: Record<string, number> = {};
  for (const slug of slugs) {
    const { sum, weight } = weighted[slug];
    raw[slug] = weight > 0 ? (sum / weight) * 100 : 50;
  }

  // --- 3. Normalizzazione ipsativa intra-individuo --------------------------
  const values = slugs.map((s) => raw[s]);
  const mean = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const variance =
    values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (values.length || 1);
  const sd = Math.sqrt(variance);

  const normalized: Record<string, number> = {};
  for (const slug of slugs) {
    // Con sd ~ 0 il profilo è piatto: nessun tema si stacca, tutti a 50.
    const z = sd > 0.0001 ? (raw[slug] - mean) / sd : 0;
    normalized[slug] = clamp(50 + z * 15, 0, 100);
  }

  // --- 4. Classifica --------------------------------------------------------
  const ranked = slugs
    .slice()
    .sort((a, b) => normalized[b] - normalized[a] || a.localeCompare(b))
    .map<ThemeScoreResult>((slug, index) => ({
      slug,
      rawScore: round(raw[slug]),
      normalizedScore: round(normalized[slug]),
      rank: index + 1,
    }));

  // --- 5. Bilanciamento fra le 4 macro-aree ---------------------------------
  // Si sommano i punteggi grezzi dei temi di ciascuna area e si riportano a
  // percentuale sul totale: le 4 quote sommano sempre a 100.
  const domainTotals: Record<string, number> = {
    OPERATIONAL: 0,
    INTERPERSONAL: 0,
    SUPPORTIVE: 0,
    COGNITIVE: 0,
  };
  for (const slug of slugs) {
    const domain = themeDomains[slug];
    domainTotals[domain] += raw[slug];
  }
  const grandTotal = Object.values(domainTotals).reduce((a, b) => a + b, 0);
  const domainScores = {
    OPERATIONAL: 0,
    INTERPERSONAL: 0,
    SUPPORTIVE: 0,
    COGNITIVE: 0,
  } as DomainScoreResult;
  for (const key of Object.keys(domainTotals) as Domain[]) {
    domainScores[key] = grandTotal > 0 ? round((domainTotals[key] / grandTotal) * 100, 1) : 25;
  }

  return {
    themeScores: ranked,
    domainScores,
    topThemeSlugs: ranked.slice(0, topCount).map((t) => t.slug),
    timeoutRatio: responses.length > 0 ? round(timedOutCount / responses.length, 3) : 0,
  };
}

/**
 * Indice di affidabilità della compilazione (0-100), utile all'Admin per
 * distinguere i profili validi da quelli compilati distrattamente.
 *
 * Penalizza due pattern noti nei questionari autosomministrati:
 *  - troppe risposte scadute per timeout (disimpegno);
 *  - risposte tutte uguali o quasi (response set / straight-lining).
 */
export function reliabilityIndex(
  responses: { value: number; timedOut: boolean }[],
): number {
  if (responses.length === 0) return 0;

  const timeoutRatio = responses.filter((r) => r.timedOut).length / responses.length;

  const counts = new Map<number, number>();
  for (const r of responses) counts.set(r.value, (counts.get(r.value) ?? 0) + 1);
  const modeShare = Math.max(...counts.values()) / responses.length;

  // Varianza delle risposte: un profilo differenziato usa tutta la scala.
  const mean = responses.reduce((a, r) => a + r.value, 0) / responses.length;
  const sd = Math.sqrt(
    responses.reduce((a, r) => a + (r.value - mean) ** 2, 0) / responses.length,
  );
  const spread = Math.min(sd / 1.8, 1); // 1.8 ≈ sd attesa su scala 1-7 ben usata

  const score = 100 * (1 - timeoutRatio) * (1 - Math.max(0, modeShare - 0.4)) * (0.4 + 0.6 * spread);
  return Math.round(clamp(score, 0, 100));
}
