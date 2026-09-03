import type { ReportLens } from '@prisma/client';

import { MPF_BLOCK_BANKS, type MpfBankKey } from './blocks';

export type MpfAssessmentSeed = {
  slug: MpfBankKey;
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
 * I quattro questionari della Mappa dei Punti di Forza.
 *
 * Ricalcano la scala dei percorsi già presenti nel portale — uno breve, uno
 * completo, uno per chi guida, uno per chi gestisce un team — ma con la
 * tassonomia e il formato di risposta nuovi. I questionari storici restano
 * attivi e con i loro report: chi li ha già compilati non perde nulla.
 *
 * Il tempo per blocco è più largo di quello degli item a coppie: qui vanno
 * lette quattro affermazioni e prese due decisioni, non una.
 */
const SECONDS_PER_BLOCK = 35;

function minutes(bank: MpfBankKey): number {
  // Stima prudente: la maggior parte dei blocchi si risolve in una ventina di
  // secondi, ben prima che il timer scada.
  return Math.round((MPF_BLOCK_BANKS[bank].length * 22) / 60);
}

export const MPF_ASSESSMENTS: MpfAssessmentSeed[] = [
  {
    slug: 'mpf_essenziale',
    name: 'Mappa dei Punti di Forza — Essenziale',
    subtitle: `${MPF_BLOCK_BANKS.mpf_essenziale.length} blocchi · ~${minutes('mpf_essenziale')} minuti`,
    description:
      'Il percorso più breve per avere un primo profilo con il nuovo modello. Ogni blocco propone quattro affermazioni fra cui indicare quella che ti descrive di più e quella che ti descrive di meno: nessuna scala da tarare, solo confronti. Restituisce i tuoi 5 tratti dominanti e l’equilibrio fra le cinque macro-aree.',
    lens: 'STANDARD',
    topCount: 5,
    timerSeconds: SECONDS_PER_BLOCK,
    estimatedMinutes: minutes('mpf_essenziale'),
    sortOrder: 1,
  },
  {
    slug: 'mpf_completa',
    name: 'Mappa dei Punti di Forza — Completa',
    subtitle: `${MPF_BLOCK_BANKS.mpf_completa.length} blocchi · ~${minutes('mpf_completa')} minuti`,
    description:
      'Il profilo di riferimento: tutti e 30 i tratti ordinati dal primo all’ultimo, con la fascia dominante in evidenza. Più confronti per tratto significano una classifica più stabile, soprattutto nella zona centrale, e la coda diventa leggibile — sono i tratti su cui conviene appoggiarsi ad altri invece di investire energie.',
    lens: 'FULL_RANKING',
    topCount: 10,
    timerSeconds: SECONDS_PER_BLOCK,
    estimatedMinutes: minutes('mpf_completa'),
    sortOrder: 2,
  },
  {
    slug: 'mpf_leadership',
    name: 'Mappa dei Punti di Forza — Leadership',
    subtitle: `${MPF_BLOCK_BANKS.mpf_leadership.length} blocchi · ~${minutes('mpf_leadership')} minuti`,
    description:
      'Gli stessi 30 tratti, ma osservati mentre guidi: le affermazioni parlano di direzione, decisioni difficili, dissenso e fiducia. Il report spiega come ciascun tratto dominante si esprime nel ruolo di chi guida e quale rovescio della medaglia presidiare.',
    lens: 'LEADERS',
    topCount: 7,
    timerSeconds: SECONDS_PER_BLOCK,
    estimatedMinutes: minutes('mpf_leadership'),
    sortOrder: 3,
  },
  {
    slug: 'mpf_gestione',
    name: 'Mappa dei Punti di Forza — Gestione del Team',
    subtitle: `${MPF_BLOCK_BANKS.mpf_gestione.length} blocchi · ~${minutes('mpf_gestione')} minuti`,
    description:
      'Centrato sulla gestione quotidiana di un team: assegnazioni, feedback, carichi di lavoro, crescita delle persone. Il report traduce i tuoi tratti dominanti in indicazioni pratiche su come far rendere al meglio ciascun collaboratore.',
    lens: 'MANAGERS',
    topCount: 7,
    timerSeconds: SECONDS_PER_BLOCK,
    estimatedMinutes: minutes('mpf_gestione'),
    sortOrder: 4,
  },
];
