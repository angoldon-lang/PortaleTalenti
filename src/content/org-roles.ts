import type { QuestionBankKey } from './questions';
import type { MpfBankKey } from './mpf/blocks';

/** Slug di un questionario somministrabile, di una metodologia o dell'altra. */
export type AssessmentKey = QuestionBankKey | MpfBankKey;

export type OrgRoleSeed = {
  slug: string;
  name: string;
  description: string;
  isDefault: boolean;
  sortOrder: number;
  /** Questionari abilitati: `required` distingue "deve farlo" da "può farlo". */
  assessments: { slug: AssessmentKey; required: boolean }[];
};

/**
 * Ruoli organizzativi predefiniti. Sono un punto di partenza modificabile dal
 * pannello: nomi, descrizioni e questionari abilitati si cambiano da
 * /admin/ruoli senza toccare il codice.
 *
 * Il criterio: tutti partono dal profilo personale; le lenti di leadership e di
 * gestione hanno senso solo per chi guida o gestisce persone, e somministrarle a
 * chi non lo fa produrrebbe risposte immaginate invece che osservate.
 *
 * Da richiedere sono i questionari della Mappa dei Punti di Forza, che è la
 * metodologia corrente. Quelli storici restano abilitati ma facoltativi: chi li
 * ha già compilati conserva il suo report, e chi vuole confrontare le due
 * letture può farlo, senza che a nessuno venga chiesto di compilare due volte
 * lo stesso profilo.
 */
export const ORG_ROLES: OrgRoleSeed[] = [
  {
    slug: 'collaboratore',
    name: 'Collaboratore',
    description:
      'Chi non ha responsabilità dirette su altre persone. Riceve il profilo personale dei talenti.',
    isDefault: true,
    sortOrder: 1,
    assessments: [
      { slug: 'mpf_essenziale', required: true },
      { slug: 'mpf_completa', required: false },
      { slug: 'core12', required: false },
      { slug: 'full34', required: false },
    ],
  },
  {
    slug: 'manager',
    name: 'Manager',
    description:
      'Chi gestisce quotidianamente un team: deleghe, feedback, carichi di lavoro, crescita delle persone.',
    isDefault: false,
    sortOrder: 2,
    assessments: [
      { slug: 'mpf_completa', required: true },
      { slug: 'mpf_gestione', required: true },
      { slug: 'mpf_essenziale', required: false },
      { slug: 'core12', required: false },
      { slug: 'full34', required: false },
      { slug: 'managers', required: false },
    ],
  },
  {
    slug: 'leader',
    name: 'Leader',
    description:
      'Chi dà direzione: decisioni difficili, dissenso, fiducia, visione di lungo periodo.',
    isDefault: false,
    sortOrder: 3,
    assessments: [
      { slug: 'mpf_completa', required: true },
      { slug: 'mpf_leadership', required: true },
      { slug: 'mpf_essenziale', required: false },
      { slug: 'core12', required: false },
      { slug: 'full34', required: false },
      { slug: 'leaders', required: false },
    ],
  },
  {
    slug: 'direzione',
    name: 'Direzione',
    description:
      'Chi guida e gestisce insieme: accede a tutti i questionari del portale.',
    isDefault: false,
    sortOrder: 4,
    assessments: [
      { slug: 'mpf_completa', required: true },
      { slug: 'mpf_leadership', required: true },
      { slug: 'mpf_gestione', required: true },
      { slug: 'mpf_essenziale', required: false },
      { slug: 'core12', required: false },
      { slug: 'full34', required: false },
      { slug: 'leaders', required: false },
      { slug: 'managers', required: false },
    ],
  },
];
