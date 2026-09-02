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

Servono **Node 20.12+** (verificato su Node 22 LTS) e un PostgreSQL
raggiungibile. La soglia 20.12 è imposta da `process.loadEnvFile()`, usato dallo
script di seed.

**1. Il database.** Se non hai già un PostgreSQL locale, con Docker:

```bash
docker run --name pt-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
docker exec -it pt-db createdb -U postgres portale_talenti
```

**2. Il progetto.**

```bash
git clone https://github.com/angoldon-lang/PortaleTalenti.git
cd PortaleTalenti
git checkout claude/cliftonstrengths-portal-gnrawh
npm install                   # genera anche il client Prisma
cp .env.example .env
```

> **Se npm mostra `install-scripts ... not yet covered by allowScripts`**
> il tuo npm sta bloccando gli script di installazione, quindi il client
> Prisma **non** è stato generato e l'app partirebbe con
> `Cannot find module '.prisma/client/default'`. Rimedio:
>
> ```bash
> npx prisma generate
> ```
>
> In alternativa autorizza gli script una volta per tutte con
> `npm install-scripts approve @prisma/client` (e `prisma`, `@prisma/engines`,
> `esbuild`, `unrs-resolver`).

**3. Le variabili.** Apri `.env` e compila almeno:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portale_talenti?schema=public"
AUTH_SECRET="<incolla qui l'output di: openssl rand -base64 32>"
```

**4. Tabelle, dati e avvio.**

```bash
npx prisma migrate deploy     # applica la migrazione esistente
npm run db:seed               # 12 temi, 66 item, utenti demo
npm run dev                   # http://localhost:3000
```

In sviluppo, se modifichi lo schema, usa `npx prisma migrate dev` al posto di
`migrate deploy` per generare una nuova migrazione.

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

## Nota sulle dipendenze

`package.json` contiene due `overrides`, entrambi necessari per avere
`npm audit` pulito senza upgrade breaking:

| Override | Perché |
| --- | --- |
| `postcss: ^8.5.26` | Next 15 pinna internamente `postcss@8.4.31`, colpito da quattro advisory (XSS nello stringify, letture arbitrarie via `sourceMappingURL`). L'unico fix ufficiale sarebbe Next 16, un major: l'override porta la copia annidata alla 8.5.26, un salto di patch dentro la stessa minor |
| `deepmerge-ts: ^8.0.2` | `@prisma/config` pinna `deepmerge-ts@7.1.5` (stack exhaustion su grafi ricorsivi). Nessuna versione di Prisma lo risolve: anche l'ultima `@prisma/config` resta sulla 7.1.5 |

Dopo gli override: **0 vulnerabilità**, con build, typecheck, `prisma generate`,
`migrate status`, seed e flusso end-to-end verificati.

Se aggiorni Next alla 16 o Prisma a una versione che adotta `deepmerge-ts` 8,
rimuovi il rispettivo override e riesegui `npm audit`.

Durante la build Prisma segnala che `package.json#prisma` è deprecato e sarà
rimosso in Prisma 7: è solo un avviso, la migrazione a `prisma.config.ts` andrà
fatta insieme all'upgrade a Prisma 7.

---

## Se qualcosa non parte

| Sintomo | Causa e rimedio |
| --- | --- |
| `Environment variable not found: DATABASE_URL` | manca il file `.env` (non `.env.example`) nella radice del progetto, oppure la riga è commentata |
| `Can't reach database server at localhost:5432` | PostgreSQL non è avviato, o la porta è diversa da quella in `DATABASE_URL` |
| `database "portale_talenti" does not exist` | il server c'è ma il database no: crealo con `createdb portale_talenti` |
| `Nessuna domanda attiva: esegui il seed del database` | migrazione applicata ma seed non eseguito: `npm run db:seed` |
| `MissingSecret` / errore su `/login` | `AUTH_SECRET` vuoto in `.env`: genera con `openssl rand -base64 32` |
| Il pulsante Google non completa l'accesso | `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` non compilati. L'accesso con email e password funziona comunque |
| `Cannot find module '.prisma/client/default'` | il postinstall di `@prisma/client` non è stato eseguito (npm con `allowScripts` attivo): lancia `npx prisma generate` |
| `process.loadEnvFile is not a function` durante il seed | Node più vecchio di 20.12: aggiorna Node |
| Porta 3000 occupata | `npm run dev -- -p 3001` (e allinea `AUTH_URL`) |

Per ripartire da zero sul database:

```bash
npx prisma migrate reset     # cancella i dati, riapplica lo schema, riesegue il seed
```

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
