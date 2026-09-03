# Messa in produzione

## 1. Database

Serve un PostgreSQL gestito (Neon, Supabase, RDS, Cloud SQL…). Prendi la
connection string e applica lo schema:

```bash
DATABASE_URL="postgresql://…" npx prisma migrate deploy
DATABASE_URL="postgresql://…" SEED_DEMO_USERS=false npm run db:seed
```

Il seed è idempotente (`upsert` su `slug` e su `assessment + posizione`):
rilanciarlo dopo una modifica ai contenuti aggiorna temi, questionari e item
senza toccare le risposte raccolte.

**Aggiornamento di un'istanza già in esercizio.** Le migrazioni sono scritte per
preservare i dati: quella che introduce i questionari multipli aggiunge le
colonne come nullable, ricollega le compilazioni preesistenti a *Talenti
Essenziale* e solo dopo impone il vincolo. Un `migrate deploy` su un database
popolato è stato verificato su una copia con report reali: le compilazioni, le
risposte e i punteggi per tema restano intatti.

Fai comunque un backup prima:

```bash
pg_dump -Fc "$DATABASE_URL" > backup-$(date +%F).dump
```

Se una migrazione si interrompe a metà, Prisma la segna come fallita e blocca le
successive (`P3018`): risolvi la causa, poi
`npx prisma migrate resolve --rolled-back <nome>` e ripeti `migrate deploy`.

`SEED_DEMO_USERS=false` evita di creare gli account demo in produzione.

## 2. Variabili d'ambiente

```
DATABASE_URL=postgresql://…
AUTH_SECRET=<openssl rand -base64 32>
AUTH_URL=https://portaletalenti.example.com
AUTH_TRUST_HOST=true
AUTH_GOOGLE_ID=…
AUTH_GOOGLE_SECRET=…
ADMIN_EMAILS=tua.email@azienda.it
NEXT_PUBLIC_QUESTION_TIMER_SECONDS=20
```

Aggiungi l'URI di callback di produzione fra quelli autorizzati nella console
Google: `https://<dominio>/api/auth/callback/google`.

## 3. Build

```bash
npm ci
npm run build     # esegue prisma generate e poi next build
npm start
```

`prisma generate` è dentro `build` (e anche dentro `dev` e `db:seed`) proprio
perché `migrate deploy` aggiorna il database ma non il client: se i due
divergono l'app parte e fallisce a runtime con
`Cannot read properties of undefined (reading 'findMany')`. Se nella tua
pipeline esegui `next build` direttamente, aggiungi `npx prisma generate`
prima.

Su Vercel il comando di build predefinito va già bene. Il route handler del PDF
richiede il runtime Node: è dichiarato `export const runtime = 'nodejs'` e
`@react-pdf/renderer` è in `serverExternalPackages`, quindi non serve altra
configurazione.

## 4. Checklist prima del lancio

- [ ] `AUTH_SECRET` generato a caso e diverso da quello di sviluppo
- [ ] `SEED_DEMO_USERS=false`, oppure account demo rimossi
- [ ] `ADMIN_EMAILS` contiene solo indirizzi che devono davvero vedere le metriche
- [ ] HTTPS attivo (i cookie di sessione sono `secure` in produzione)
- [ ] URI di callback Google aggiornato sul dominio di produzione
- [ ] `npm run typecheck` e `npx tsx scripts/simulate.ts` verdi
- [ ] backup automatico del database configurato
- [ ] informativa privacy pubblicata: si trattano dati che descrivono
      preferenze e stili di lavoro della persona

## 5. Dopo il lancio

**Modificare i contenuti dei temi.** Aggiorna `src/content/themes.ts` e rilancia
`npm run db:seed`: l'upsert su `slug` aggiorna descrizioni, punti di forza e
punti ciechi senza toccare i punteggi già calcolati.

**Modificare gli item.** Le affermazioni stanno in `scripts/statements/*.json`
(una per banca). Modificale, rigenera con `python3 scripts/gen_questions.py` e
rilancia il seed. L'upsert avviene su `position`, quindi le risposte già raccolte
restano collegate. Se cambi il *significato* di un item, considera che i report
precedenti sono stati calcolati su una versione diversa: `test_results` conserva
comunque il profilo consegnato all'utente.

**Aggiungere un tema.** Aggiungilo in `src/content/themes.ts` (con i testi delle
lenti Leaders e Managers) e inserisci le sue affermazioni in ciascun file di
`scripts/statements/`, tante quante ne servono alla banca: 11 per `core12`, 8 per
le banche a 34 temi. Poi rigenera e riesegui il seed. Il generatore fallisce con
un messaggio esplicito se le affermazioni non bastano.

Attenzione: cambiando il numero di temi cambia anche il vincolo sugli scarti del
disegno circolante (vedi [`MODELLO.md`](MODELLO.md) §3.3). Verifica sempre con
`npx tsx scripts/simulate.ts` che l'algoritmo continui a ricostruire un profilo
noto su tutti e quattro i questionari.

**Aggiungere un questionario.** Definiscilo in `src/content/assessments.ts`,
aggiungi la sua banca in `scripts/gen_questions.py` e il file di affermazioni
corrispondente. Il seed crea l'assessment e i suoi item; la UI lo mostra
automaticamente nel catalogo.

**Retention.** Le sessioni abbandonate restano in stato `IN_PROGRESS`. Una pulizia
periodica di quelle inattive da oltre 90 giorni tiene ordinata la tabella:

```sql
DELETE FROM test_sessions
WHERE status = 'IN_PROGRESS' AND "lastActivityAt" < now() - interval '90 days';
```
