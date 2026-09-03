# Portale Talenti

Portale web per l'assessment dei punti di forza, ispirato al modello delle quattro
macro-aree di Gallup CliftonStrengths®. L'utente sceglie fra **quattro
questionari distinti**, li compila e riceve un report con i talenti dominanti, il
bilanciamento fra le macro-aree e le schede di dettaglio, esportabile in PDF.

| Questionario | Temi | Item | Durata | Report |
| --- | --- | --- | --- | --- |
| Talenti Essenziale | 12 | 66 | ~22 min | Top 5 |
| CliftonStrengths 34 | 34 | 136 | ~45 min | Top 10 + classifica 1-34 |
| CliftonStrengths for Leaders | 34 | 102 | ~34 min | Top 7, lente leadership |
| CliftonStrengths for Managers | 34 | 102 | ~34 min | Top 7, lente gestione team |

Ogni questionario ha la **propria banca di item**: le affermazioni di *for
Leaders* parlano di direzione e decisioni difficili, quelle di *for Managers* di
deleghe, feedback e carichi di lavoro. Non è lo stesso test con etichette diverse.

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
  │     /api/admin/export ────────────────► CSV dei risultati (solo ADMIN)
  │
  └─ Middleware (Edge) ──────────► gate su /dashboard, /questionario, /report,
        src/middleware.ts               /admin (nessun accesso al DB: solo il JWT)
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
    themes.ts           i 34 temi di talento (contenuto redazionale)
    assessments.ts      i quattro questionari e le lenti di report
    questions.ts        le 4 banche di item — GENERATO da gen_questions.py
  lib/
    scoring.ts          il motore di calcolo (puro, testabile, senza I/O)
    pdf-report.tsx      il documento PDF
    validation.ts       schemi Zod condivisi
  server/               accesso ai dati e Server Actions
  auth.ts               Auth.js: provider, adapter, callback
  auth.config.ts        configurazione Edge-safe usata dal middleware
scripts/
  statements/*.json     le affermazioni, per banca (dati versionati)
  gen_questions.py      assembla le affermazioni in item bilanciati
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

## Aggiornare un'installazione esistente

```bash
git pull
npm install                   # nuove dipendenze, se ce ne sono
npx prisma generate           # riallinea il client Prisma allo schema
npx prisma migrate deploy     # applica le migrazioni mancanti
npm run db:seed               # aggiorna temi, questionari e item
npm run build && npm start    # oppure npm run dev
```

`prisma generate` è il passo che si dimentica più facilmente: `migrate deploy`
aggiorna il **database** ma non il **client** TypeScript, e se i due divergono
l'app parte e poi fallisce a runtime con `Cannot read properties of undefined
(reading 'findMany')`. Per questo `npm run dev`, `npm run build` e
`npm run db:seed` lo eseguono già da soli: la riga qui sopra serve solo se
lanci i comandi in un altro modo.

Le migrazioni **preservano i dati**: le compilazioni e i report già esistenti
restano al loro posto. Se aggiorni da una versione precedente all'introduzione
dei questionari multipli, le vecchie compilazioni vengono ricollegate
automaticamente a *Talenti Essenziale*, che è il questionario che avevano
effettivamente usato — verificato su un database con report reali.

Il seed è idempotente (`upsert` su `slug` e su `assessment + posizione`):
rilanciarlo aggiorna i contenuti senza duplicare né cancellare risposte.

Se il server era già avviato, riavvialo: i contenuti dei temi sono letti dal
database a ogni richiesta, ma il codice no.

### Se una migrazione si interrompe

Prisma segna la migrazione come fallita e blocca le successive (`P3018`).
Risolvi la causa e poi:

```bash
npx prisma migrate resolve --rolled-back <nome_migrazione>
npx prisma migrate deploy
```

Fai un backup prima di aggiornare un database che contiene dati reali:

```bash
pg_dump -Fc "$DATABASE_URL" > backup-$(date +%F).dump
```

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
| `python3 scripts/gen_questions.py` | rigenera le quattro banche di item |
| `node scripts/e2e.mjs` | smoke test end-to-end (richiede il server avviato) |

---

## Personalizzazione

Da **Amministrazione → Personalizzazione** puoi impostare logo, nome
dell'organizzazione, colore principale e la riga in fondo al PDF. Tutto viene
applicato al sito (intestazione, home, pagina di accesso, report a schermo) e al
PDF scaricabile.

- **Logo**: PNG, JPEG o SVG, massimo 512 KB. Viene conservato nel database,
  quindi non servono volumi persistenti e il backup se lo porta dietro. Un logo
  SVG si vede nel sito ma non nel PDF, perché il generatore di PDF non disegna
  gli SVG: per avere il logo anche nei report usa un PNG o un JPEG.
- **Colore**: dal singolo colore che scegli viene generata l'intera scala di
  tinte dell'interfaccia. Il colore indicato è esattamente quello dei pulsanti
  principali.

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
| `Cannot read properties of undefined (reading 'findMany')` oppure `Unknown field ... for select statement` | il client Prisma è più vecchio dello schema: hai applicato le migrazioni senza rigenerarlo. `npx prisma generate`, poi riavvia il server |
| `Detected additional lockfiles` | hai due checkout annidati (es. `PortaleTalenti/PortaleTalenti`): è solo un avviso di Next, ma assicurati di lanciare i comandi nella cartella giusta |
| `Cross origin request detected` in sviluppo | stai aprendo l'app dall'IP di rete invece che da `localhost`: è un avviso innocuo, oppure aggiungi `allowedDevOrigins` in `next.config.mjs` |
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

## Nota etica e visibilità dei dati

Lo strumento è pensato per l'autoconsapevolezza e lo sviluppo professionale.
Non è un test clinico e non è validato per l'uso in selezione o valutazione del
personale: i punteggi sono ipsativi, cioè confrontano i temi *all'interno* della
stessa persona e non fra persone diverse.

**Chi vede cosa.** Un utente standard vede solo i propri report: chiedere il PDF
di un altro utente restituisce 404, non un 403 che ne confermerebbe l'esistenza.
Un **amministratore può scaricare il report di chiunque** e può esportare tutti i
risultati in CSV.

Poiché un report descrive preferenze e stile di lavoro di una persona reale, ogni
azione amministrativa su dati personali — download di un report, export CSV,
creazione di un utente, cambio di ruolo — viene scritta in `admin_audit_logs` con
autore, interessato e momento, ed è consultabile in `/admin/report`. Il registro
serve a poter rispondere, se qualcuno lo chiede, alla domanda «chi ha visto il mio
profilo?».

Se distribuisci il portale in un'organizzazione, dichiara questa visibilità
nell'informativa privacy prima di somministrare il primo questionario.
