# Messa in produzione

## 1. Database

Serve un PostgreSQL gestito (Neon, Supabase, RDS, Cloud SQL…). Prendi la
connection string e applica lo schema:

```bash
DATABASE_URL="postgresql://…" npx prisma migrate deploy
DATABASE_URL="postgresql://…" SEED_DEMO_USERS=false npm run db:seed
```

Il seed è idempotente (`upsert` su `slug` e `position`): rilanciarlo dopo una
modifica ai contenuti aggiorna temi e item senza toccare le risposte raccolte.

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

**Modificare gli item.** Il banco è generato: intervieni sulle affermazioni in
`scripts/gen_questions.py`, rigenera con `python3 scripts/gen_questions.py` e
rilancia il seed. L'upsert avviene su `position`, quindi le risposte già raccolte
restano collegate. Se cambi il *significato* di un item, considera che i report
precedenti sono stati calcolati su una versione diversa: `test_results` conserva
comunque il profilo consegnato all'utente.

**Aggiungere un tema.** Un tredicesimo tema porterebbe le coppie da 66 a 78 item.
Aggiungi il tema in `src/content/themes.ts`, le sue 12 affermazioni nel
generatore, rigenera e riesegui il seed. Verifica poi con
`npx tsx scripts/simulate.ts` che l'algoritmo continui a ricostruire un profilo
noto.

**Retention.** Le sessioni abbandonate restano in stato `IN_PROGRESS`. Una pulizia
periodica di quelle inattive da oltre 90 giorni tiene ordinata la tabella:

```sql
DELETE FROM test_sessions
WHERE status = 'IN_PROGRESS' AND "lastActivityAt" < now() - interval '90 days';
```
