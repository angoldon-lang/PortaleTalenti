# I quattro moduli, file per file

---

## Modulo 1 — Autenticazione e accesso

| File | Ruolo |
| --- | --- |
| `src/auth.ts` | Auth.js: provider Credentials + Google, adapter Prisma, promozione automatica ad ADMIN |
| `src/auth.config.ts` | configurazione **Edge-safe** condivisa con il middleware (nessun accesso al DB) |
| `src/middleware.ts` | gate di autorizzazione su `/dashboard`, `/questionario`, `/admin` |
| `src/server/auth-actions.ts` | Server Actions di registrazione, login, login Google, logout |
| `src/server/guards.ts` | `requireUser()` / `requireAdmin()` usate dalle pagine e dalle azioni |
| `src/app/login`, `src/app/registrazione` | pagine con form accessibili e messaggi di errore per campo |

**Sessione.** Strategia **JWT** (cookie `httpOnly`, `sameSite=lax`, `secure` in
produzione, scadenza 30 giorni). Il ruolo viaggia dentro il token, così il
middleware può decidere sull'Edge senza interrogare il database a ogni
navigazione. L'adapter Prisma resta necessario per l'account linking di Google.

**Perché due file di configurazione.** Il middleware gira su Edge runtime, dove
bcrypt e il client Prisma non sono disponibili. `auth.config.ts` contiene solo
ciò che è Edge-safe; `auth.ts` vi aggiunge Credentials e l'adapter per il
runtime Node.

**Doppia barriera.** Il middleware è la prima linea, ma ogni pagina protetta
richiama comunque `requireUser()` / `requireAdmin()`: un errore nel `matcher` non
espone i dati. Le Server Actions non si fidano mai del client — ricavano
l'identità dalla sessione, mai dai parametri.

**Scelte di sicurezza.**

- password con bcrypt a 12 round; policy minima 10 caratteri con lettera e cifra
  (si privilegia la lunghezza, linea guida NIST 800-63B);
- login a tempo costante: se l'account non esiste si confronta comunque la
  password contro un hash fittizio, per non rivelare quali email sono registrate;
- `callbackUrl` accettata solo se path relativo — niente open redirect;
- un Admin non può togliere il ruolo a se stesso, per non restare chiuso fuori.

**Ruoli.** `USER` compila il test e vede il proprio report. `ADMIN` vede in più
`/admin` (metriche aggregate, elenco utenti, gestione item). Un Admin **non**
accede ai report altrui: `getReportById()` filtra sempre per `userId`.

---

## Modulo 2 — Il questionario

| File | Ruolo |
| --- | --- |
| `src/app/questionario/page.tsx` | schermata introduttiva e avvio/ripresa della sessione |
| `src/components/questionnaire/questionnaire-runner.tsx` | il client component che gestisce l'esecuzione |
| `src/components/questionnaire/likert-scale.tsx` | scala a 7 punti come radiogroup nativo |
| `src/components/questionnaire/timer-ring.tsx` | anello di countdown |
| `src/server/test-service.ts` | creazione/ripresa sessione, salvataggio risposta, completamento |
| `src/server/test-actions.ts` | Server Actions chiamate dal client |

**Un item alla volta**, due affermazioni contrapposte e la scala Likert in mezzo.
La dimensione dei pallini cresce verso gli estremi: la scala si legge a colpo
d'occhio anche senza etichette.

**Timer.** Countdown visivo di 20 secondi. Allo scadere l'item viene salvato come
neutro con `timedOut = true` e si prosegue. Un `useRef` impedisce che il timeout
scatti due volte sullo stesso item. Il timer è mettibile in pausa e
disattivabile via variabile d'ambiente.

**Salvataggio in tempo reale.** Ogni risposta è un `upsert` immediato su
`responses` (chiave `[testSessionId, questionId]`), quindi rispondere di nuovo a
un item corregge invece di duplicare. La UI è ottimistica: aggiorna subito lo
stato e mostra l'esito del salvataggio in una regione `aria-live`.

**Ripresa.** Lo stato vive nel database, non nel browser: `answeredCount` sulla
sessione e le risposte già date. Al rientro `getOrCreateTestSession()` calcola
`resumeIndex` come primo item senza risposta. Chiudere il browser, cambiare
dispositivo o perdere la connessione non costa nulla.

**Accessibilità.** La scala è un `<fieldset>` di radio nativi, quindi navigabile
con le frecce; le scorciatoie `1`-`7` rispondono da tastiera; l'avanzamento è un
`role="progressbar"` con valori ARIA; ogni pallino ha un'etichetta testuale
completa per gli screen reader.

---

## Modulo 3 — Database e motore di calcolo

Schema completo in `prisma/schema.prisma`.

```
users ──┬── accounts / sessions            (Auth.js)
        ├── test_sessions ──── responses ──── questions ──┬── talent_themes (lato sinistro)
        │         │                                       └── talent_themes (lato destro)
        │         └── test_results ──── theme_scores ──────── talent_themes
        └── test_results
```

| Tabella | Contenuto | Note di modellazione |
| --- | --- | --- |
| `users` | account e ruolo | `passwordHash` nullable: gli utenti solo-Google non ne hanno |
| `talent_themes` | i 12 temi | array PostgreSQL per punti di forza, punti ciechi, azioni, contesti |
| `questions` | i 66 item | due FK verso i temi + i pesi per lato; `isActive` ritira un item senza perdere lo storico |
| `test_sessions` | una compilazione | `answeredCount` e `totalQuestions` rendono la ripresa una lettura sola |
| `responses` | una risposta | unique su `[testSessionId, questionId]`; `timedOut` e `latencyMs` per la qualità del dato |
| `test_results` | il profilo calcolato | quote delle 4 aree, Top 5, `timeoutRatio`, durata |
| `theme_scores` | punteggio per tema | denormalizzato per le query aggregate dell'Admin |

**Perché salvare i risultati e non ricalcolarli.** Il report è un documento
consegnato alla persona: deve restare identico nel tempo anche se il banco item
cambia. `test_results` fotografa il profilo; `test_sessions` conserva le risposte
che l'hanno prodotto.

**Motore di calcolo.** `src/lib/scoring.ts`, funzione pura senza I/O — vedi
[`MODELLO.md`](MODELLO.md) §4 per le formule. `completeTest()` la orchestra:
verifica che tutti gli item abbiano risposta, calcola, e scrive risultato e
punteggi in **una transazione**. È idempotente: se il risultato esiste già lo
restituisce invece di ricalcolarlo, quindi un doppio click non genera due report.

---

## Modulo 4 — Report e dashboard

| File | Ruolo |
| --- | --- |
| `src/app/dashboard/page.tsx` | il report completo (e lo stato vuoto per chi non ha ancora finito) |
| `src/components/report/domain-charts.tsx` | ciambella delle macro-aree e radar dei 12 temi |
| `src/components/report/talent-card.tsx` | scheda espandibile di un talento |
| `src/lib/pdf-report.tsx` | il documento PDF |
| `src/app/api/report/[id]/pdf/route.tsx` | endpoint di download |

**Cosa mostra la dashboard**

1. **Sintesi** — talento dominante, macro-area prevalente, distanza dal secondo
   talento (profilo marcato o equilibrato), quota di risposte date entro il tempo.
2. **Ciambella** delle 4 macro-aree: le quote sommano a 100, quindi la
   composizione è la lettura corretta.
3. **Radar** dei 12 temi: la "forma" del profilo. Un radar sulle sole 4 aree
   sarebbe piatto, perché quei valori restano sempre attorno al 25%.
4. **Top 5** — schede espandibili con descrizione estesa, punti di forza, punti
   ciechi, azioni di allenamento e contesti.
5. **Classifica completa** dei 12 temi, con i temi dal 6° in poi in tono
   attenuato: non sono difetti, sono aree in cui conviene appoggiarsi ad altri.

**Punti ciechi in evidenza.** Ogni scheda affianca "quando lavora al meglio" e
"punti ciechi da presidiare". Un report che elenca solo pregi non è utilizzabile
in un percorso di sviluppo: il valore sta nel riconoscere il costo del talento
quando è sovra-utilizzato.

**Accessibilità dei grafici.** Ogni grafico è accompagnato da una tabella dati
`sr-only`: chi usa uno screen reader ottiene gli stessi numeri. Le schede usano
il pattern disclosure (`aria-expanded` + `aria-controls`) e sono `<article>` con
titolo di livello corretto.

**Export PDF.** `GET /api/report/[id]/pdf` genera il documento server-side con
`@react-pdf/renderer` (runtime Node): copertina con ciambella disegnata in SVG,
Top 5, classifica completa, disclaimer metodologico, e una pagina per ciascuno
dei cinque talenti. Il download è protetto: `getReportById()` filtra per
`userId`, quindi un id indovinato non restituisce il report di un altro utente.
La risposta ha `Cache-Control: private, no-store`.

> Nota tecnica: nella versione di `@react-pdf/renderer` in uso la prop `render`
> (contenuto dinamico, es. numero di pagina) non produce output. Il piè di pagina
> usa `Text` con `fixed`, che funziona correttamente su tutte le pagine.

---

## Pannello Admin

`/admin` — metriche: utenti registrati e nuovi a 30 giorni, test completati e in
corso, tasso di completamento, durata media, quota di risposte scadute,
bilanciamento medio della popolazione, temi più frequenti nelle Top 5, ultime
compilazioni.

`/admin/utenti` — ricerca per nome o email, stato della compilazione, numero di
report, promozione/rimozione del ruolo Admin.

`/admin/domande` — elenco dei 66 item con i temi collegati e il numero di
risposte raccolte; attivazione/disattivazione. La pagina avverte che
disattivare item riduce la copertura dei due temi coinvolti e che conviene
intervenire a gruppi omogenei, per non rompere l'equilibrio del design a
confronto completo.
