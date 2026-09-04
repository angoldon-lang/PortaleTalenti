import type { ReportLens } from '@prisma/client';
import type { QuestionBankKey } from './questions';

export type AssessmentSeed = {
  slug: QuestionBankKey;
  name: string;
  subtitle: string;
  description: string;
  lens: ReportLens;
  topCount: number;
  timerSeconds: number;
  estimatedMinutes: number;
  sortOrder: number;
};

/**
 * I quattro questionari storici. Lo `slug` coincide con la chiave della banca
 * di item in `questions.ts`: ogni assessment ha item propri, non è lo stesso
 * questionario con etichette diverse.
 *
 * Restano attivi accanto ai quattro della Mappa dei Punti di Forza
 * (`mpf/assessments.ts`), che usano tassonomia e formato nuovi. L'ordinamento
 * li colloca dopo — da 11 in poi — perché il modello proprietario è quello che
 * il portale propone per primo, non perché questi siano dismessi: le
 * compilazioni già fatte e i loro report continuano a funzionare.
 */
export const ASSESSMENTS: AssessmentSeed[] = [
  {
    slug: 'core12',
    name: 'Inventario dei Talenti — Essenziale',
    subtitle: '12 temi · 66 domande · ~22 minuti',
    description:
      'Il percorso più breve per avere un primo profilo. Confronta i 12 temi fondamentali, tre per ciascuna macro-area, e restituisce i tuoi 5 talenti dominanti. È il punto di partenza consigliato se non hai mai fatto un assessment di questo tipo.',
    lens: 'STANDARD',
    topCount: 5,
    timerSeconds: 20,
    estimatedMinutes: 22,
    sortOrder: 11,
  },
  {
    slug: 'full34',
    name: 'Inventario dei Talenti — Completo',
    subtitle: '34 temi · 136 domande · ~45 minuti',
    description:
      'Il profilo completo: tutti i 34 temi di talento ordinati dal primo all’ultimo. Oltre alla Top 10 in evidenza, vedi anche i temi di coda — quelli su cui conviene appoggiarsi ad altri invece di investire energie. È l’assessment di riferimento del portale.',
    lens: 'FULL_34',
    topCount: 10,
    timerSeconds: 20,
    estimatedMinutes: 45,
    sortOrder: 12,
  },
  {
    slug: 'leaders',
    name: 'Inventario dei Talenti — Leadership',
    subtitle: '34 temi · 136 domande · ~45 minuti',
    description:
      'Le stesse 34 dimensioni, ma osservate mentre guidi: le affermazioni parlano di direzione, decisioni difficili, dissenso e fiducia. Il report spiega come ciascun talento dominante si esprime nel ruolo di chi guida, e quale rovescio della medaglia presidiare.',
    lens: 'LEADERS',
    topCount: 7,
    timerSeconds: 20,
    estimatedMinutes: 45,
    sortOrder: 13,
  },
  {
    slug: 'managers',
    name: 'Inventario dei Talenti — Gestione del Team',
    subtitle: '34 temi · 136 domande · ~45 minuti',
    description:
      'Centrato sulla gestione quotidiana di un team: deleghe, feedback, carichi di lavoro, crescita delle persone. Il report traduce i tuoi talenti in indicazioni pratiche su come far rendere al meglio ciascun collaboratore.',
    lens: 'MANAGERS',
    topCount: 7,
    timerSeconds: 20,
    estimatedMinutes: 45,
    sortOrder: 14,
  },
];

export const LENS_META: Record<
  ReportLens,
  { label: string; detailHeading: string; detailIntro: string }
> = {
  STANDARD: {
    label: 'Profilo personale',
    detailHeading: 'Le tue schede di dettaglio',
    detailIntro:
      'Apri ciascuna scheda per la descrizione completa, i punti di forza associati e i punti ciechi da tenere sotto controllo.',
  },
  FULL_34: {
    label: 'Profilo completo',
    detailHeading: 'I tuoi talenti dominanti',
    detailIntro:
      'I temi in evidenza sono quelli su cui costruire. Più in basso trovi l’ordinamento completo di tutti i 34.',
  },
  LEADERS: {
    label: 'Lente leadership',
    detailHeading: 'I tuoi talenti quando guidi',
    detailIntro:
      'Per ciascun tema dominante trovi come si esprime nel ruolo di chi guida, e il rovescio della medaglia da presidiare.',
  },
  MANAGERS: {
    label: 'Lente gestione del team',
    detailHeading: 'I tuoi talenti nella gestione del team',
    detailIntro:
      'Per ciascun tema dominante trovi indicazioni pratiche su come usarlo nella gestione quotidiana dei collaboratori.',
  },
  FULL_RANKING: {
    label: 'Profilo completo',
    detailHeading: 'I tuoi tratti dominanti',
    detailIntro:
      'I tratti in evidenza sono quelli su cui costruire. Più in basso trovi l’ordinamento completo di tutti e 30.',
  },
};
