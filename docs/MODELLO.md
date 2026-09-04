# Il modello: temi, questionario e algoritmo

> **Questo documento descrive il modello precedente**, quello dei quattro domini
> e dei trentaquattro temi, che resta attivo nel portale per chi lo ha già
> compilato. Il modello proprietario corrente — cinque macro-aree, trenta
> tratti, blocchi a scelta forzata — è descritto in
> [`MAPPA-PUNTI-DI-FORZA.md`](MAPPA-PUNTI-DI-FORZA.md).

Documento di riferimento per chi deve capire *cosa misura* il portale e *come*.

---

## 1. Le quattro macro-aree

Questo modello raggruppa i temi in quattro modi di contribuire al
lavoro di un gruppo. Nessuna area vale più delle altre: un team efficace le
copre tutte.

| Macro-area | `Domain` | Contributo |
| --- | --- | --- |
| Concretezza Operativa | `OPERATIONAL` | Far accadere le cose: trasformare le idee in risultati |
| Impatto Interpersonale | `INTERPERSONAL` | Farsi ascoltare, portare gli altri, estendere la portata del gruppo |
| Legame e Sostegno | `SUPPORTIVE` | Tenere insieme le persone, rendere il gruppo più della somma delle parti |
| Elaborazione Cognitiva | `COGNITIVE` | Assorbire e analizzare informazioni per decidere meglio |

## 2. I trentaquattro temi di talento

La distribuzione fra le aree è di 9 temi in Concretezza Operativa, 8 in Impatto
Interpersonale, 9 in Legame e Sostegno, 8 in Elaborazione Cognitiva. La
definizione completa (descrizione, punti di forza, punti ciechi, azioni di
allenamento, contesti, più le due sezioni per le lenti Leaders e Managers) sta in
`src/content/themes.ts` ed è quella che alimenta sia la dashboard sia il PDF.

I nomi sono sintagmi descrittivi, riscritti perché nessuno richiami la
denominazione di uno strumento di terzi: la versione precedente usava
denominazioni che ne erano traduzioni troppo ravvicinate. Il portale condivide
l'impianto concettuale pubblico di questa famiglia di modelli, non la
nomenclatura di un prodotto specifico.

| Macro-area | Temi |
| --- | --- |
| Concretezza Operativa (9) | Tensione Produttiva · Ordinamento della Complessità · Vincolo dell'Impegno Preso · Riconfigurazione delle Risorse · Princìpi Non Negoziabili · Uniformità di Trattamento · Cautela Preventiva · Filtro Direzionale · Riparazione del Guasto |
| Impatto Interpersonale (8) | Efficacia Espositiva · Passaggio all'Azione · Sicurezza di Giudizio · Presa di Posizione · Confronto con il Risultato Altrui · Innalzamento dell'Eccellenza · Impronta Riconoscibile · Apertura al Contatto Nuovo |
| Legame e Sostegno (9) | Lettura degli Stati Emotivi · Ricerca del Terreno Comune · Riconoscimento del Potenziale · Aderenza al Presente · Percezione dei Legami · Allargamento del Gruppo · Differenziazione della Persona · Alleggerimento del Clima · Profondità dei Pochi Legami |
| Elaborazione Cognitiva (8) | Richiesta di Prove · Accostamento Inatteso · Piacere di Imparare · Ricorso al Precedente · Nitidezza del Possibile · Accumulo Informativo · Attività di Pensiero · Selezione del Percorso |

I dodici temi usati dal questionario breve (Inventario dei Talenti — Essenziale) sono i primi tre
di ciascuna area: Tensione Produttiva, Ordinamento della Complessità, Vincolo dell'Impegno Preso, Efficacia Espositiva, Passaggio all'Azione, Sicurezza di Giudizio, Lettura degli Stati Emotivi, Ricerca del Terreno Comune, Riconoscimento del Potenziale, Richiesta di Prove, Accostamento Inatteso, Piacere di Imparare.

Ogni tema è descritto su sei assi, perché un talento senza il suo lato ombra non
è utilizzabile:

- **Quando lavora al meglio** — i comportamenti produttivi del tema;
- **Punti ciechi** — cosa succede quando il tema è sovra-utilizzato;
- **Come allenarlo** — azioni concrete, non esortazioni;
- **Contesti in cui rende di più** — dove il tema ha più leva;
- **Quando guidi** — come il tema si esprime nel ruolo di chi guida (lente *for Leaders*);
- **Nella gestione del team** — come far rendere al meglio chi ha quel tema (lente *for Managers*).

---

## 3. Il questionario

### 3.1 Formato dell'item

Ogni item contrappone due affermazioni che descrivono temi diversi, e chiede
all'utente di posizionarsi su una scala Likert a 7 punti:

```
Affermazione A                                          Affermazione B
"Amo pianificare ogni dettaglio"      "Preferisco improvvisare e correggere
                                              strada facendo"

  1 ──── 2 ──── 3 ──── 4 ──── 5 ──── 6 ──── 7
  pienamente A       uguali        pienamente B
```

Il confronto forzato è la scelta metodologica centrale: chiedere *quanto sono
d'accordo* con un'affermazione isolata produce risposte socialmente desiderabili
(quasi tutti dicono di essere responsabili). Chiedere *quale delle due mi
descrive di più* costringe a un compromesso e fa emergere le preferenze reali.

### 3.2 I quattro questionari

| Questionario | Temi | Item | Comparse per tema | Costruzione |
| --- | --- | --- | --- | --- |
| Inventario dei Talenti — Essenziale | 12 | 66 | 11 | round-robin completo |
| Inventario dei Talenti — Completo | 34 | 136 | 8 | design circolante, scarti {1, 6, 11, 16} |
| for Leaders | 34 | 102 | 6 | design circolante, scarti {2, 7, 12} |
| for Managers | 34 | 102 | 6 | design circolante, scarti {3, 8, 13} |

Gli scarti sono diversi per ciascuna banca: i tre questionari a 34 temi
confrontano **coppie di temi diverse**, quindi non sono lo stesso strumento
riformulato. Le affermazioni sono anch'esse specifiche del contesto: quelle di
*for Leaders* descrivono comportamenti di chi guida, quelle di *for Managers*
comportamenti di chi gestisce collaboratori.

### 3.3 Il design del banco item

**Round-robin completo (12 temi).** Con 12 temi esistono C(12,2) = **66 coppie**,
e ogni coppia viene presentata esattamente una volta. Ne segue che:

- ogni tema compare in **11 item**, quindi tutti i temi hanno la stessa
  possibilità di accumulare punteggio (nessun tema è avvantaggiato dal numero di
  occasioni);
- ogni tema viene confrontato con **tutti** gli altri, quindi la classifica non
  dipende da quali confronti sono stati scelti;
- ogni tema usa **11 affermazioni diverse**, una per item: nessuna ripetizione
  letterale che inviterebbe a rispondere "come prima".

**Design circolante (34 temi).** Il round-robin completo su 34 temi richiederebbe
C(34,2) = 561 item, impraticabile. Si dispongono allora i temi in cerchio e si
generano le coppie *(i, i+d)* per ogni tema *i* e per ogni scarto *d* di un
insieme scelto. Ogni scarto produce 34 coppie e fa comparire ogni tema
esattamente due volte, quindi *k* scarti danno 34*k* item con 2*k* comparse per
tema. Il risultato ha la stessa proprietà che conta del round-robin — **nessun
tema ha più occasioni di altri** — a un costo lineare invece che quadratico.

L'ordine dei temi nel cerchio alterna le macro-aree, così gli scarti producono in
prevalenza confronti fra aree diverse (74-82% degli item, a seconda della banca).

**Vincolo sulla scelta degli scarti.** I temi sono disposti nel cerchio
alternando le quattro macro-aree, quindi lo scarto *d* modulo 4 determina *quale
coppia di aree* viene confrontata. Servono perciò quattro scarti con residui mod
4 tutti diversi, altrimenti alcune coppie di aree restano sotto-campionate.

Non è teoria. La prima versione di *for Leaders* usava gli scarti {2, 7, 12, 15},
con residui {2, 3, 0, 3} — un duplicato e un residuo mancante. La simulazione
mostrava un recupero della Top 7 di 5,3 su 7 contro il 6,5 di *for Managers*, a
parità di item e di algoritmo. Passando a {2, 7, 9, 12} (residui {2, 3, 1, 0}) il
recupero è salito a 6,7 su 7. Gli scarti attuali:

| Banca | Scarti | Residui mod 4 |
| --- | --- | --- |
| Inventario dei Talenti — Completo | {1, 6, 11, 16} | {1, 2, 3, 0} |
| for Leaders | {2, 7, 9, 12} | {2, 3, 1, 0} |
| for Managers | {3, 8, 13, 14} | {3, 0, 1, 2} |

Le affermazioni vivono in `scripts/statements/*.json` — dati versionati e
rivedibili in code review — e `scripts/gen_questions.py` le assembla
controllando due fonti di distorsione:

- **ordine**: gli item sono ordinati in modo che due item consecutivi non
  condividano un tema (1 sola eccezione su 65 adiacenze), così l'utente non
  percepisce di essere interrogato più volte sullo stesso costrutto;
- **lato**: dopo una prima assegnazione si esegue un raffinamento che scambia i
  lati finché lo sbilanciamento non è minimo, così ogni tema compare a sinistra in
  circa metà dei propri item (deviazione massima ±1) e si neutralizza la tendenza
  a preferire sistematicamente uno dei due lati (*side bias*).

Il file prodotto (`src/content/questions.ts`) è versionato ed esplicito: si legge
riga per riga in code review, e il seed lo carica nel database. Rigenerarlo:

```bash
python3 scripts/gen_questions.py && npm run db:seed
```

### 3.4 Il timer

Venti secondi per item (configurabili con `NEXT_PUBLIC_QUESTION_TIMER_SECONDS`,
`0` disattiva il timer). Il razionale è psicometrico, non ludico: il tempo breve
riduce lo spazio per la risposta costruita a tavolino e favorisce la reazione
spontanea, che nei questionari di preferenza correla meglio con il comportamento
osservato.

Allo scadere l'item viene salvato come **neutro** (valore 4) con
`timedOut = true`. La quota di risposte scadute finisce nel report come
indicatore di affidabilità: un profilo con troppi timeout va letto con cautela.

L'utente può mettere in pausa il timer — l'obiettivo è la spontaneità, non la
pressione.

---

## 4. L'algoritmo di calcolo

Implementato in `src/lib/scoring.ts`. È una funzione pura: nessun accesso al
database, quindi verificabile in isolamento.

### 4.1 Dalla risposta alle preferenze

Ogni risposta distribuisce una preferenza fra i due temi in gioco:

```
preferenzaSinistra = (7 − v) / 6        preferenzaDestra = (v − 1) / 6
```

| Risposta | Sinistra | Destra |
| --- | --- | --- |
| 1 | 1.00 | 0.00 |
| 2 | 0.83 | 0.17 |
| 4 (neutro / timeout) | 0.50 | 0.50 |
| 6 | 0.17 | 0.83 |
| 7 | 0.00 | 1.00 |

La somma è sempre 1: la scala è **ipsativa**, ciò che un tema guadagna lo perde
l'altro.

### 4.2 Punteggio grezzo

Per ciascun tema, media ponderata delle preferenze ricevute nei suoi item (11, 8
o 6 a seconda del questionario), riportata su scala 0-100:

```
rawScore(tema) = 100 × Σ(preferenza × peso) / Σ(peso)
```

Il peso per lato (`leftWeight`, `rightWeight`, default 1) è previsto a schema:
serve a tarare item che discriminano meno bene, senza cambiare il codice.

### 4.3 Normalizzazione intra-individuo

I punteggi grezzi non sono confrontabili fra persone (chi risponde sempre verso
gli estremi ottiene valori più dispersi). Si calcola quindi uno z-score sui temi
misurati **della stessa persona**, riscalato su media 50 e deviazione standard 15:

```
normalizedScore(tema) = 50 + 15 × (raw − mediaPersona) / sdPersona
```

È questo il valore usato per la classifica, per il radar e per l'etichetta
"intensità" nel report: dice *quanto un tema si stacca dal profilo medio della
persona*. Se la deviazione standard è ~0 (profilo piatto) tutti i temi restano a
50, senza divisioni per zero.

### 4.4 Bilanciamento fra macro-aree

Somma dei punteggi grezzi dei temi di ciascuna area, riportata a percentuale sul
totale. Le quattro quote sommano sempre a 100: è una composizione, non quattro
misure indipendenti. Per questo il grafico a ciambella è la rappresentazione
corretta di questo dato, mentre il radar del report mostra i 12 temi (quattro
valori sempre vicini al 25% renderebbero il radar illeggibile).

### 4.5 Indice di affidabilità

`reliabilityIndex()` penalizza due pattern noti dei questionari
autosomministrati:

- **timeout** — quota di item scaduti, cioè disimpegno;
- **straight-lining** — risposte quasi tutte uguali e varianza bassa, cioè
  compilazione meccanica.

Serve all'Admin per distinguere i profili validi da quelli compilati
distrattamente.

---

## 5. Verifica dell'algoritmo

`scripts/simulate.ts` assegna a ogni tema un'intensità "vera" nota, genera
risposte coerenti con quel profilo (con rumore e un 5% di timeout) e verifica che
l'algoritmo ricostruisca la classifica. Gira su **tutti e quattro i questionari**
e su **tre profili diversi**, perché misurano cose diverse:

| Profilo simulato | Cosa rappresenta | Criterio |
| --- | --- | --- |
| Talenti nettamente dominanti | la fascia alta è separata dal resto molto più del rumore | Top K recuperata ≥ 85% **e** Spearman ≥ 0.85 |
| Moderatamente differenziato | il salto fra fascia alta e media è dell'ordine del rumore | solo Spearman ≥ 0.85 |
| Piatto (temi equispaziati) | nessun talento dominante | solo Spearman ≥ 0.80 |

Le risposte sono stocastiche, quindi un singolo run non è una misura: ogni
combinazione questionario × profilo viene replicata 20 volte (`SIM_REPLICATIONS`)
e il criterio si applica alla media.

```bash
npx tsx scripts/simulate.ts            # tutti i questionari
npx tsx scripts/simulate.ts full34     # uno solo
```

Valori di riferimento (20 repliche):

| Questionario | Top K con talenti dominanti | Spearman medio |
| --- | --- | --- |
| Inventario dei Talenti — Essenziale | 5,0 / 5 | 0.92 – 0.98 |
| Inventario dei Talenti — Completo | 9,4 / 10 | 0.91 – 0.93 |
| for Leaders | 6,7 / 7 | 0.92 – 0.93 |
| for Managers | 6,9 / 7 | 0.88 – 0.93 |

**La lettura importante combina la seconda e la terza colonna.** Con un profilo
piatto la Top K *non* viene recuperata (4,0 su 7 per *for Leaders*), e non è un
difetto: se una persona non ha talenti realmente dominanti, dire «il tuo settimo
talento è X» sarebbe arbitrario. La qualità dell'ordinamento complessivo resta
alta in tutti i casi.

## 6. Limiti dichiarati

- **Punteggi ipsativi**: confrontano i temi dentro la stessa persona, non fra
  persone. Le medie di popolazione nel pannello Admin vanno lette come tendenze
  del gruppo, non come graduatorie individuali.
- **Nessuna taratura su campione normativo**: non esistono percentili di
  riferimento, perché non c'è un campione di standardizzazione.
- **Autovalutazione**: misura come la persona si descrive, non come si comporta.
- **Precisione della Top K**: il confine fra l'ultimo talento dominante e il primo
  escluso è affidabile solo se il profilo della persona è realmente differenziato.
  Le posizioni adiacenti in classifica vanno lette come equivalenti, non come una
  graduatoria stretta.
- **Non confrontabilità fra questionari**: i quattro strumenti hanno item diversi.
  La Top 5 di *Inventario dei Talenti — Essenziale* e quella di *Inventario dei Talenti — Completo* possono
  differire legittimamente, anche perché il primo misura 12 temi e il secondo 34.
- **Uso previsto**: autoconsapevolezza e sviluppo. Non è uno strumento clinico né
  validato per la selezione del personale.
