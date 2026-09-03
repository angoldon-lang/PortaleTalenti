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
| `src/app/questionario/page.tsx` | catalogo dei questionari abilitati, con lo stato di avanzamento |
| `src/app/questionario/[slug]/page.tsx` | schermata introduttiva e avvio/ripresa; sceglie il componente in base al formato |
| `src/components/questionnaire/questionnaire-runner.tsx` | esecuzione dei questionari a coppie di affermazioni |
| `src/components/questionnaire/block-runner.tsx` | esecuzione dei questionari a blocchi quartetto |
| `src/components/questionnaire/likert-scale.tsx` | scala a 7 punti come radiogroup nativo |
| `src/components/questionnaire/timer-ring.tsx` | anello di countdown, comune ai due formati |
| `src/server/test-service.ts` | sessione, risposta e completamento per il formato a coppie |
| `src/server/mpf-service.ts` | gli stessi passaggi per il formato a scelta forzata |
| `src/server/test-actions.ts` | Server Actions chiamate dal client, per entrambi i formati |

**Due formati di item.** `Assessment.itemFormat` distingue i questionari a
coppie di affermazioni su scala (`PAIRED_LIKERT`) da quelli a blocchi quartetto
con scelta «di più» / «di meno» (`FORCED_CHOICE_QUARTET`). Sono due servizi
separati e non due rami dentro lo stesso: item, risposte e punteggi sono
diversi, e un'unica funzione che si biforca a ogni passaggio sarebbe più
difficile da leggere di due funzioni ciascuna coerente con sé. Restano condivise
le regole che dal formato non dipendono — chi può compilare che cosa, e
"ricomincia da capo", che cancella la sessione e con essa, per vincolo di chiave
esterna, le risposte di qualunque formato.

**Otto questionari.** Il catalogo vive nella tabella `assessments`: ciascuno
ha la propria banca di item (`questions.assessmentId`), il proprio `topCount` e la
propria lente di report. Una persona può compilarli tutti: le sessioni e i
risultati sono per assessment, quindi i profili non si sovrappongono.

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

**Accessibilità.** Nel formato a coppie la scala è un `<fieldset>` di radio
nativi, quindi navigabile con le frecce; le scorciatoie `1`-`7` rispondono da
tastiera. Nel formato a blocchi le due scelte sono due gruppi di radio distinti,
uno per colonna: chi naviga da tastiera o con uno screen reader incontra così
due domande separate e chiare — «quale ti descrive di più», «quale di meno» —
invece di una griglia da interpretare, e ogni radio porta l'affermazione per
intero nella propria etichetta. I tasti `1`-`4` assegnano la scelta ancora
mancante, nell'ordine in cui la pagina le chiede. In entrambi i formati
l'avanzamento è un `role="progressbar"` con valori ARIA.

**Il tempo scaduto.** I due formati lo trattano in modo diverso, e
intenzionalmente. Sulla scala il valore neutro esiste ed è il centro, quindi un
item scaduto viene salvato lì. Nella scelta forzata un valore neutro non c'è:
il blocco resta senza scelte, pesa sull'indice di attendibilità e non sui
punteggi. Riempirlo significherebbe attribuire alla persona una preferenza che
non ha espresso.

---

## Modulo 3 — Database e motore di calcolo

Schema completo in `prisma/schema.prisma`.

```
                             ┌── questions ──┬── talent_themes (lato sinistro)
assessments ─────────────────┤               └── talent_themes (lato destro)
     │                       └── choice_blocks ──── choice_options ──── strength_traits
     │                                                                        │
     │                                                          strength_areas┘
     │
users ──┬── accounts / sessions            (Auth.js)
        ├── test_sessions ──┬── responses ──── questions
        │                   ├── block_responses ──── choice_blocks
        │                   └── test_results ──┬── theme_scores ──── talent_themes
        │                                      ├── trait_scores ──── strength_traits
        │                                      └── area_scores  ──── strength_areas
        └── admin_audit_logs (come attore o come interessato)
```

| Tabella | Contenuto | Note di modellazione |
| --- | --- | --- |
| `users` | account e ruolo | `passwordHash` nullable: gli utenti solo-Google non ne hanno |
| `assessments` | i 4 questionari | lente di report, `topCount`, timer e durata stimata |
| `talent_themes` | i 34 temi | array PostgreSQL per punti di forza, punti ciechi, azioni, contesti; più i testi delle lenti Leaders e Managers |
| `questions` | i 406 item | FK verso l'assessment e verso i due temi, più i pesi per lato; `isActive` ritira un item senza perdere lo storico |
| `test_sessions` | una compilazione | legata a un assessment; `answeredCount` e `totalQuestions` rendono la ripresa una lettura sola |
| `responses` | una risposta | unique su `[testSessionId, questionId]`; `timedOut` e `latencyMs` per la qualità del dato |
| `test_results` | il profilo calcolato | quote delle 4 aree, temi dominanti, `timeoutRatio`, durata |
| `theme_scores` | punteggio per tema | denormalizzato per le query aggregate dell'Admin |
| `admin_audit_logs` | azioni amministrative su dati personali | autore, interessato, momento; vedi Pannello Admin |

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
| `src/app/dashboard/page.tsx` | hub personale: i report completati e i questionari disponibili |
| `src/app/report/[id]/page.tsx` | un report, con la lente del suo assessment |
| `src/components/report/report-model.ts` | riconduce i risultati delle due metodologie a un modello di vista comune |
| `src/components/report/report-view.tsx` | il corpo del report, condiviso fra le lenti e fra le metodologie |
| `src/components/report/domain-charts.tsx` | ciambella delle macro-aree e radar delle singole voci |
| `src/components/report/talent-card.tsx` | scheda espandibile di un tema o di un tratto |
| `src/components/ui/group-badge.tsx` | etichetta di macro-area, colorata a partire dal colore dell'area |
| `src/lib/pdf-report.tsx` | il documento PDF |
| `src/app/api/report/[id]/pdf/route.tsx` | endpoint di download |

**Una sola strada di disegno.** I due modelli del portale producono report della
stessa forma — un bilanciamento fra macro-aree, una classifica, delle schede di
dettaglio — e quella forma merita un solo modo di essere disegnata.
`report-model.ts` riconduce entrambi i risultati a una struttura comune; da lì
in avanti pagina e PDF ricevono aree e voci, e non sanno più da quale
metodologia arrivino. Anche i grafici prendono le macro-aree dai dati, quante
che siano, invece che da un elenco fisso di quattro.

**Le lenti.** L'`Assessment.lens` decide quanti temi mettere in evidenza
e quale sezione aggiuntiva compare in ciascuna scheda: *for Leaders* mostra
«Quando guidi», *for Managers* «Nella gestione del team». Gli stessi testi
finiscono nel PDF, in un riquadro dedicato.

**Cosa mostra il report**

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
La risposta ha `Cache-Control: private, no-store`. Un amministratore può invece
scaricare qualunque report, e in quel caso l'accesso viene registrato (sotto).

> Nota tecnica: nella versione di `@react-pdf/renderer` in uso la prop `render`
> (contenuto dinamico, es. numero di pagina) non produce output. Il piè di pagina
> usa `Text` con `fixed`, che funziona correttamente su tutte le pagine.

---

## Pannello Admin

`/admin` — metriche: utenti registrati e nuovi a 30 giorni, test completati e in
corso, tasso di completamento, durata media, quota di risposte scadute,
bilanciamento medio della popolazione, temi più frequenti nelle Top 5, ultime
compilazioni.

`/admin/report` — elenco di tutti i profili compilati, con ricerca per nome o
email, download del PDF di chiunque, export CSV di tutti i risultati e, in fondo
alla pagina, il **registro degli accessi**.

`/admin/nuovo-utente` — crea un account senza passare dalla registrazione
pubblica. Se non si indica una password, il portale ne genera una temporanea
(quattro gruppi da quattro caratteri, ~62 bit di entropia) e la mostra **una sola
volta**: va consegnata alla persona su un altro canale. La password scelta
dall'amministratore non viene invece rimandata a schermo, perché la conosce già.

`/admin/utenti` — ricerca per nome o email, stato della compilazione, numero di
report, promozione/rimozione del ruolo Admin.

`/admin/ruoli` — per ciascun ruolo organizzativo, quali questionari sono
abilitati e quali richiesti. Vedi *Ruoli organizzativi* più sotto.

`/admin/personalizzazione` — logo, nome dell'organizzazione, colore principale
e riga in fondo al PDF. Vedi *Personalizzazione* più sotto.

`/admin/domande` — elenco degli item con i temi collegati e il numero di risposte
raccolte, filtrabile per questionario; attivazione/disattivazione. La pagina
avverte che disattivare item riduce la copertura dei due temi coinvolti e che
conviene intervenire a gruppi omogenei, per non rompere l'equilibrio del disegno.

### Tracciabilità

Un report descrive preferenze e stile di lavoro di una persona reale. Dare a un
amministratore la possibilità di scaricarlo è una scelta esplicita del prodotto,
e va accompagnata da una contropartita: ogni azione amministrativa su dati
personali — download di un report, export CSV, creazione di un utente, cambio di
ruolo — viene scritta in `admin_audit_logs` con autore, interessato e momento.

Il registro è visibile in fondo a `/admin/report`. Serve a poter rispondere, se
qualcuno lo chiede, alla domanda «chi ha visto il mio profilo?». Se distribuisci
il portale in un'organizzazione, dichiara questa visibilità nell'informativa
privacy prima di somministrare il primo questionario.

**Export CSV.** `GET /api/admin/export` (solo ADMIN) produce una riga per
profilo. I valori che iniziano con `=`, `+`, `-` o `@` vengono neutralizzati con
un apice: aprire il file in un foglio di calcolo non deve poter eseguire nulla
(*CSV injection*).


---

## Personalizzazione

| File | Ruolo |
| --- | --- |
| `src/lib/branding.ts` | genera l'intera scala di tinte da un solo colore |
| `src/server/settings-service.ts` | lettura della configurazione, con cache per richiesta |
| `src/app/admin/personalizzazione/page.tsx` | il pannello |
| `src/components/brand-mark.tsx` | logo o nome, usato in intestazione, home e accesso |
| `src/app/api/branding/logo/route.ts` | serve il logo caricato |

**Dove finisce il logo.** Conservato nel database come `Bytes`, non su
filesystem: non servono volumi persistenti né storage esterni, funziona anche in
ambienti serverless, e il backup del database porta con sé anche il logo. Un
logo pesa pochi KB e il limite imposto è 512 KB.

L'endpoint che lo serve è pubblico di proposito — compare nella pagina di
accesso, prima dell'autenticazione — e usa un ETag derivato dal momento del
caricamento: il browser riusa l'immagine, ma un logo nuovo si vede subito.

**Il colore.** L'interfaccia usa dieci gradazioni del colore del marchio.
Chiederle tutte all'amministratore sarebbe assurdo, quindi `buildBrandScale()`
le ricava da un unico esadecimale: converte in HSL, applica una curva di
luminosità e un fattore di saturazione per gradino, e **ancora il gradino 600
esattamente al colore scelto** — quello dei pulsanti principali è il colore che
hai indicato, non una sua approssimazione. Lo scostamento di luminosità si
propaga agli altri gradini in modo attenuato verso gli estremi, così i toni
chiarissimi restano chiari anche con un colore molto scuro.

Tailwind riceve la palette come variabili CSS nella forma
`rgb(var(--brand-600) / <alpha-value>)`, che mantiene funzionanti le utility di
opacità. I default stanno in `globals.css` e il layout li sovrascrive con un
blocco `<style>` generato dal colore salvato.

**Il PDF** non usa i CSS: riceve il colore come esadecimale e il logo come data
URI. `@react-pdf/renderer` non sa disegnare gli SVG dentro `<Image>`, quindi un
logo SVG viene mostrato nel sito ma sostituito dal nome testuale nel report; il
pannello lo dice esplicitamente quando il logo caricato è un SVG.

---

## Ruoli organizzativi

| File | Ruolo |
| --- | --- |
| `src/content/org-roles.ts` | i quattro ruoli predefiniti e le loro abilitazioni |
| `src/server/test-service.ts` | `getAllowedAssessments()` e il blocco in `getOrCreateTestSession()` |
| `src/app/admin/ruoli/page.tsx` | il pannello di configurazione |

**Due nozioni di "ruolo", volutamente separate.** `User.role` (USER/ADMIN)
governa i permessi nel portale; `User.orgRoleId` indica il ruolo aziendale
(Collaboratore, Manager, Leader…) e decide quali questionari la persona vede.
Confonderle avrebbe legato i permessi amministrativi alla posizione in
organigramma, che sono cose diverse.

**La regola.** `OrgRoleAssessment` collega ruolo e questionario con un flag
`isRequired`, così si distingue "può farlo" da "deve farlo". Chi non ha un ruolo
assegnato ricade su quello marcato `isDefault`; se non esiste alcun ruolo — per
esempio prima del primo seed — non si blocca nessuno, perché un portale
permissivo è preferibile a uno inutilizzabile.

Gli amministratori non sono filtrati: devono poter provare i questionari che
assegnano agli altri.

**Dove sta il controllo.** In `getOrCreateTestSession()`, cioè nel servizio, non
nella pagina: nascondere una card non impedisce di digitare l'URL. Un
questionario non abilitato solleva `AssessmentNotAllowedError` e la pagina
mostra un messaggio invece di avviare la compilazione. Verificato con un utente
"Collaboratore" che apre direttamente `/questionario/leaders`.
