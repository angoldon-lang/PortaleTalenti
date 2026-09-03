import { z } from 'zod';
import { LIKERT_MAX, LIKERT_MIN } from './scoring';

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'L’email è obbligatoria')
  .email('Inserisci un indirizzo email valido')
  .max(254)
  .toLowerCase();

/**
 * Policy password: minimo 10 caratteri con almeno una lettera e una cifra.
 * Preferiamo la lunghezza alla complessità simbolica (linea guida NIST 800-63B).
 */
export const passwordSchema = z
  .string()
  .min(10, 'La password deve avere almeno 10 caratteri')
  .max(128, 'La password è troppo lunga')
  .regex(/[a-zA-Z]/, 'La password deve contenere almeno una lettera')
  .regex(/[0-9]/, 'La password deve contenere almeno un numero');

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Inserisci il tuo nome').max(80),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Le password non coincidono',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Inserisci la password'),
});

/** Creazione di un utente dal pannello Admin. */
export const adminCreateUserSchema = z.object({
  name: z.string().trim().min(2, 'Inserisci nome e cognome').max(80),
  email: emailSchema,
  role: z.enum(['USER', 'ADMIN']),
  /** Vuota: il portale genera una password temporanea da consegnare a mano. */
  password: z.union([passwordSchema, z.literal('')]).optional(),
  /** Vuoto: si applica il ruolo organizzativo predefinito. */
  orgRoleId: z.string().optional(),
});

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>;

export const answerSchema = z.object({
  questionId: z.string().min(1),
  value: z.number().int().min(LIKERT_MIN).max(LIKERT_MAX),
  timedOut: z.boolean().default(false),
  latencyMs: z.number().int().min(0).max(1000 * 60 * 30).optional(),
});

/**
 * Risposta a un blocco quartetto. Le due scelte possono essere nulle — è il
 * caso del blocco scaduto — ma quando ci sono devono essere distinte: indicare
 * la stessa affermazione come quella che descrive di più e di meno non è un
 * ordinamento.
 */
export const blockAnswerSchema = z
  .object({
    blockId: z.string().min(1),
    mostOptionId: z.string().min(1).nullable(),
    leastOptionId: z.string().min(1).nullable(),
    timedOut: z.boolean().default(false),
    latencyMs: z.number().int().min(0).max(1000 * 60 * 30).optional(),
  })
  .refine((d) => d.mostOptionId === null || d.mostOptionId !== d.leastOptionId, {
    message: 'Le due scelte devono ricadere su affermazioni diverse',
    path: ['leastOptionId'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AnswerInput = z.infer<typeof answerSchema>;
