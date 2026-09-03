import type { QuestionBankKey } from './questions';

export type OrgRoleSeed = {
  slug: string;
  name: string;
  description: string;
  isDefault: boolean;
  sortOrder: number;
  /** Questionari abilitati: `required` distingue "deve farlo" da "può farlo". */
  assessments: { slug: QuestionBankKey; required: boolean }[];
};

/**
 * Ruoli organizzativi predefiniti. Sono un punto di partenza modificabile dal
 * pannello: nomi, descrizioni e questionari abilitati si cambiano da
 * /admin/ruoli senza toccare il codice.
 *
 * Il criterio: tutti partono dal profilo personale; le lenti Leaders e Managers
 * hanno senso solo per chi guida o gestisce persone, e somministrarle a chi non
 * lo fa produrrebbe risposte immaginate invece che osservate.
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
      { slug: 'core12', required: true },
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
      { slug: 'core12', required: false },
      { slug: 'full34', required: true },
      { slug: 'managers', required: true },
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
      { slug: 'core12', required: false },
      { slug: 'full34', required: true },
      { slug: 'leaders', required: true },
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
      { slug: 'core12', required: false },
      { slug: 'full34', required: true },
      { slug: 'leaders', required: true },
      { slug: 'managers', required: true },
    ],
  },
];
