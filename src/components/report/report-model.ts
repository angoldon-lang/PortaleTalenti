import { LENS_META } from '@/content/assessments';
import { DOMAIN_META, DOMAIN_ORDER } from '@/content/themes';
import type { FullReport } from '@/server/test-service';

/**
 * ===========================================================================
 * MODELLO DI VISTA DEL REPORT
 * ===========================================================================
 *
 * Il portale somministra due metodologie: quella storica, con quattro domini e
 * trentaquattro temi, e la Mappa dei Punti di Forza, con cinque aree e trenta
 * tratti. I report che ne escono hanno però la stessa forma — un bilanciamento
 * fra macro-aree, una classifica, delle schede di dettaglio — e quella forma
 * merita un solo modo di essere disegnata.
 *
 * Qui i due risultati vengono ricondotti a una struttura comune. La distinzione
 * fra le due metodologie si esaurisce in questo file: da qui in avanti i
 * componenti ricevono aree e voci, senza sapere da quale modello arrivino.
 */

/** Una macro-area, di una tassonomia o dell'altra. */
export type ReportGroup = {
  key: string;
  label: string;
  short: string;
  color: string;
  value: number;
  description: string;
};

/** Una voce della classifica: un tema o un tratto. */
export type ReportItem = {
  id: string;
  rank: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  blindSpots: string[];
  actionTips: string[];
  thrivesIn: string[];
  score: number;
  groupKey: string;
  groupLabel: string;
  groupColor: string;
  /** Sezione aggiuntiva dettata dalla lente del report. */
  lensNote: { heading: string; body: string } | null;
  /**
   * Quante volte il tratto è stato indicato come "mi descrive di più" e come
   * "di meno". Solo per i questionari a scelta forzata, dove sono i numeri da
   * cui il punteggio è ricavato.
   */
  choiceCounts: { most: number; least: number } | null;
};

/**
 * Indicatori di qualità della compilazione. La quota di risposte date entro il
 * tempo esiste per entrambe le metodologie; la coerenza solo per la scelta
 * forzata, che ha blocchi di controllo con cui misurarla.
 */
export type ReportQuality = {
  inTimeRatio: number;
  consistency: {
    band: 'buona' | 'da_verificare' | 'bassa' | 'non_valutabile';
    label: string;
    note: string;
  } | null;
};

export type ReportModel = {
  /** Come chiamare le voci della classifica in questo report. */
  itemNoun: { singular: string; plural: string };
  /** Come chiamare gli item somministrati. */
  unitNoun: { singular: string; plural: string };
  groupsHeading: string;
  groupsDescription: string;
  groups: ReportGroup[];
  items: ReportItem[];
  topCount: number;
  quality: ReportQuality;
};

const CONSISTENCY_META = {
  buona: {
    label: 'Coerenza buona',
    note: 'Le scelte rifatte sui blocchi di controllo sono state confermate: il profilo è da leggere con fiducia.',
  },
  da_verificare: {
    label: 'Coerenza da verificare',
    note: 'Alcune scelte di controllo sono cambiate. Può dipendere da tratti che possiedi in misura simile, oppure da un calo di attenzione: se il profilo non ti somiglia, vale la pena rifarlo con calma.',
  },
  bassa: {
    label: 'Coerenza bassa',
    note: 'Le scelte rifatte sui blocchi di controllo sono cambiate spesso. Il profilo va preso con cautela: conviene ricompilare il questionario in un momento di maggiore concentrazione.',
  },
  non_valutabile: {
    label: 'Coerenza non valutabile',
    note: 'I blocchi di controllo non sono stati completati, quindi non è stato possibile misurare la coerenza delle scelte.',
  },
} as const;

function isConsistencyBand(value: string): value is keyof typeof CONSISTENCY_META {
  return value in CONSISTENCY_META;
}

/** Costruisce il modello di vista a partire dal report salvato. */
export function buildReportModel(report: FullReport): ReportModel {
  const lens = report.assessment.lens;
  const inTimeRatio = 1 - report.timeoutRatio;

  if (report.assessment.itemFormat === 'FORCED_CHOICE_QUARTET') {
    const scoreByArea = new Map(report.areaScores.map((a) => [a.area.slug, a.score]));

    const groups: ReportGroup[] = report.areaScores
      .map((a) => a.area)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((area) => ({
        key: area.slug,
        label: area.name,
        short: area.short,
        color: area.color,
        value: scoreByArea.get(area.slug) ?? 0,
        description: area.claim,
      }));

    const items: ReportItem[] = report.traitScores.map((s) => ({
      id: s.id,
      rank: s.rank,
      slug: s.trait.slug,
      name: s.trait.name,
      tagline: s.trait.tagline,
      description: s.trait.definition,
      strengths: s.trait.strengths,
      blindSpots: s.trait.blindSpots,
      actionTips: s.trait.actionTips,
      thrivesIn: s.trait.thrivesIn,
      score: s.normalizedScore,
      groupKey: s.trait.area.slug,
      groupLabel: s.trait.area.name,
      groupColor: s.trait.area.color,
      lensNote:
        lens === 'LEADERS' && s.trait.leaderApplication
          ? { heading: 'Quando guidi', body: s.trait.leaderApplication }
          : lens === 'MANAGERS' && s.trait.managerApplication
            ? { heading: 'Nella gestione del team', body: s.trait.managerApplication }
            : null,
      choiceCounts: { most: s.timesMost, least: s.timesLeast },
    }));

    const band = report.reliabilityBand;
    return {
      itemNoun: { singular: 'tratto', plural: 'tratti' },
      unitNoun: { singular: 'blocco', plural: 'blocchi' },
      groupsHeading: 'Bilanciamento fra le macro-aree',
      groupsDescription:
        'Come si distribuisce la tua energia fra i cinque momenti del lavorare: ciò che ti orienta, ciò che ti mette in moto, ciò che ti dà struttura, ciò che passa dalle persone, ciò che ti fa adattare.',
      groups,
      items,
      topCount: report.assessment.topCount,
      quality: {
        inTimeRatio,
        consistency:
          band && isConsistencyBand(band)
            ? { band, ...CONSISTENCY_META[band] }
            : null,
      },
    };
  }

  const legacyValues: Record<string, number | null> = {
    EXECUTING: report.executingScore,
    INFLUENCING: report.influencingScore,
    RELATIONSHIP: report.relationshipScore,
    STRATEGIC: report.strategicScore,
  };

  const groups: ReportGroup[] = DOMAIN_ORDER.map((domain) => ({
    key: domain,
    label: DOMAIN_META[domain].label,
    short: DOMAIN_META[domain].short,
    color: DOMAIN_META[domain].color,
    // I quattro punteggi d'area sono nullabili nello schema perché i report a
    // scelta forzata non li usano; su un report legacy sono sempre valorizzati.
    value: legacyValues[domain] ?? 0,
    description: DOMAIN_META[domain].description,
  }));

  const items: ReportItem[] = report.themeScores.map((s) => ({
    id: s.id,
    rank: s.rank,
    slug: s.theme.slug,
    name: s.theme.name,
    tagline: s.theme.tagline,
    description: s.theme.fullDescription,
    strengths: s.theme.strengths,
    blindSpots: s.theme.blindSpots,
    actionTips: s.theme.actionTips,
    thrivesIn: s.theme.thrivesIn,
    score: s.normalizedScore,
    groupKey: s.theme.domain,
    groupLabel: DOMAIN_META[s.theme.domain].label,
    groupColor: DOMAIN_META[s.theme.domain].color,
    lensNote:
      lens === 'LEADERS' && s.theme.leaderApplication
        ? { heading: 'Quando guidi', body: s.theme.leaderApplication }
        : lens === 'MANAGERS' && s.theme.managerApplication
          ? { heading: 'Nella gestione del team', body: s.theme.managerApplication }
          : null,
    choiceCounts: null,
  }));

  return {
    itemNoun: { singular: 'tema', plural: 'temi' },
    unitNoun: { singular: 'domanda', plural: 'domande' },
    groupsHeading: 'Bilanciamento fra le macro-aree',
    groupsDescription:
      'Come si distribuisce la tua energia fra i quattro modi di contribuire a un gruppo.',
    groups,
    items,
    topCount: report.assessment.topCount,
    quality: { inTimeRatio, consistency: null },
  };
}

export function lensMetaFor(report: FullReport) {
  return LENS_META[report.assessment.lens];
}
