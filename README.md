# Portale Talenti

Portale web per l'assessment dei punti di forza, ispirato al modello delle quattro
macro-aree di Gallup CliftonStrengths®. L'utente compila un questionario
psicometrico a confronto di affermazioni e riceve un report con i suoi cinque
talenti dominanti, il bilanciamento fra le macro-aree e le schede di dettaglio,
esportabile in PDF.

> Progetto dimostrativo, senza alcuna affiliazione con Gallup, Inc. Temi e item
> sono contenuti originali costruiti sul modello concettuale, non una riproduzione
> dello strumento Gallup.

---

## Stack tecnico

| Livello | Scelta | Perché |
| --- | --- | --- |
| Framework | **Next.js 15** (App Router, React 19) | Server Components e Server Actions: la logica di scoring resta sul server, il client riceve solo ciò che serve |
| Linguaggio | **TypeScript** in strict mode | Il motore di calcolo è la parte critica: i tipi lo proteggono |
| Stile | **Tailwind CSS 3** | Design system minimale, mobile-first, senza CSS morto |
| Database | **PostgreSQL** + **Prisma 6** | Relazioni forti fra item, temi e risposte; array nativi per gli elenchi testuali dei temi |
| Auth | **Auth.js v5** (NextAuth) | Credentials (email/password, bcrypt) + Google OAuth nella stessa sessione JWT |
| Grafici | **Recharts** | Ciambella e radar, con tabella equivalente per gli screen reader |
| PDF | **@react-pdf/renderer** | Report generato lato server, senza screenshot del browser |
| Validazione | **Zod** | Stesso schema per form e Server Actions |

### Perché Server Actions e non API REST

Il questionario fa una scrittura per ogni risposta: con le Server Actions non
serve un layer REST parallelo, la validazione Zod è condivisa e l'identità
dell'utente arriva dalla sessione invece che da un token passato dal client.
Resta un endpoint REST dove serve davvero uno stream binario:
`GET /api/report/[id]/pdf`.

---

## Architettura

```
Browser
  │
  ├─ Server Components ──────────► lettura dati (Prisma) e rendering HTML
  │
  ├─ Server Actions ─────────────► scrittura risposte, calcolo profilo, ruoli
  │     src/server/*-actions.ts        (validazione Zod + guardie di ruolo)
  │
  ├─ Route Handler /api/report/[id]/pdf ─► @react-pdf/renderer → application/pdf
  │
  └─ Middleware (Edge) ──────────► gate su /dashboard, /questionario, /admin
        src/middleware.ts               (nessun accesso al DB: solo il JWT)
```

Struttura delle cartelle:

```
prisma/
  schema.prisma         schema del database
  seed.ts               popolamento temi, item e utenti demo
src/
  app/                  pagine (App Router) e route handler
  components/           UI: primitive, questionario, report
  content/
    themes.ts           i 12 temi di talento (contenuto redazionale)
    questions.ts        i 66 item — GENERATO da scripts/gen_questions.py
  lib/
    scoring.ts          il motore di calcolo (puro, testabile, senza I/O)
    pdf-report.tsx      il documento PDF
    validation.ts       schemi Zod condivisi
  server/               accesso ai dati e Server Actions
  auth.ts               Auth.js: provider, adapter, callback
  auth.config.ts        configurazione Edge-safe usata dal middleware
scripts/
  gen_questions.py      genera il banco di item bilanciato
  simulate.ts           valida l'algoritmo su un profilo noto
  e2e.mjs               smoke test end-to-end con Playwright
```

---

## Avvio in locale

Servono Node 20+ e un PostgreSQL raggiungibile.

```bash
git clone <repo> && cd PortaleTalenti
npm install
cp .env.example .env          # poi compila DATABASE_URL e AUTH_SECRET
npx prisma migrate dev        # crea le tabelle
npm run db:seed               # 12 temi, 66 item, utenti demo
npm run dev                   # http://localhost:3000
```

Genera il segreto con `openssl rand -base64 32`.

### Utenti creati dal seed

| Email | Password | Ruolo |
| --- | --- | --- |
| `admin@portaletalenti.it` | `Password123` | ADMIN |
| `demo@portaletalenti.it` | `Password123` | USER |

Sono utenti di sviluppo: disattivali in produzione con `SEED_DEMO_USERS=false`.

### Google OAuth

1. Google Cloud Console → *API e servizi* → *Credenziali* → ID client OAuth (app web).
2. URI di reindirizzamento autorizzato: `http://localhost:3000/api/auth/callback/google`.
3. Copia client id e secret in `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

Senza queste variabili il pulsante Google resta visibile ma il provider non
completa l'accesso: l'app funziona comunque con email e password.

### Variabili d'ambiente

| Variabile | Obbligatoria | Note |
| --- | --- | --- |
| `DATABASE_URL` | sì | stringa di connessione PostgreSQL |
| `AUTH_SECRET` | sì | firma dei JWT di sessione |
| `AUTH_URL` | in produzione | URL pubblico dell'applicazione |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | no | abilitano l'accesso con Google |
| `NEXT_PUBLIC_QUESTION_TIMER_SECONDS` | no | secondi per item; `0` disattiva il timer |
| `ADMIN_EMAILS` | no | email promosse ad ADMIN al primo accesso |
| `SEED_DEMO_USERS` | no | `false` per non creare gli utenti demo |

---

## Comandi

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | server di sviluppo |
| `npm run build` / `npm start` | build e avvio di produzione |
| `npm run typecheck` | TypeScript in strict mode |
| `npm run db:migrate` | crea/applica una migrazione |
| `npm run db:seed` | popola temi, item e utenti demo |
| `npm run db:studio` | Prisma Studio |
| `npx tsx scripts/simulate.ts` | valida l'algoritmo su un profilo noto |
| `node scripts/e2e.mjs` | smoke test end-to-end (richiede il server avviato) |

---

## Documentazione

- [`docs/MODELLO.md`](docs/MODELLO.md) — i 12 temi, le 4 macro-aree, il design del questionario e l'algoritmo di calcolo
- [`docs/MODULI.md`](docs/MODULI.md) — i quattro moduli funzionali, file per file
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — messa in produzione e checklist

---

## Nota etica

Lo strumento è pensato per l'autoconsapevolezza e lo sviluppo professionale.
Non è un test clinico e non è validato per l'uso in selezione o valutazione del
personale: i punteggi sono ipsativi, cioè confrontano i temi *all'interno* della
stessa persona e non fra persone diverse. Il report è visibile solo al suo
proprietario; l'Admin vede metriche aggregate e stato delle compilazioni, non i
report altrui.
