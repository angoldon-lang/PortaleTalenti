# Il modello: temi, questionario e algoritmo

Documento di riferimento per chi deve capire *cosa misura* il portale e *come*.

---

## 1. Le quattro macro-aree

Il modello Gallup raggruppa i temi di talento in quattro modi di contribuire al
lavoro di un gruppo. Nessuna area vale più delle altre: un team efficace le
copre tutte.

| Macro-area | `Domain` | Contributo |
| --- | --- | --- |
| Esecuzione | `EXECUTING` | Far accadere le cose: trasformare le idee in risultati |
| Influenza | `INFLUENCING` | Farsi ascoltare, portare gli altri, estendere la portata del gruppo |
| Relazioni | `RELATIONSHIP` | Tenere insieme le persone, rendere il gruppo più della somma delle parti |
| Pensiero Strategico | `STRATEGIC` | Assorbire e analizzare informazioni per decidere meglio |

## 2. I dodici temi di talento

Tre temi per macro-area. La definizione completa (descrizione, punti di forza,
punti ciechi, azioni di allenamento, contesti) sta in `src/content/themes.ts` ed
è quella che alimenta sia la dashboard sia il PDF.

| Macro-area | Tema | In una riga |
| --- | --- | --- |
| Esecuzione | **Realizzatore** | Un motore interno che chiede risultati concreti ogni giorno |
| Esecuzione | **Organizzazione** | Porta ordine dove gli altri vedono complessità |
| Esecuzione | **Responsabilità** | Gli impegni presi sono vincoli morali |
| Influenza | **Comunicazione** | Rende vive le idee: le spiega, le racconta, le fa ricordare |
| Influenza | **Attivatore** | Trasforma la discussione in azione: si impara facendo |
| Influenza | **Fiducia in Sé** | Ha una bussola interna e la segue anche controcorrente |
| Relazioni | **Empatia** | Percepisce le emozioni degli altri prima che vengano dette |
| Relazioni | **Armonia** | Cerca il terreno comune: il conflitto sterile è uno spreco |
| Relazioni | **Sviluppatore** | Vede il potenziale delle persone e non riesce a ignorarlo |
| Pensiero Strategico | **Analitico** | Chiede le prove: senza dati resta un'opinione |
| Pensiero Strategico | **Ideazione** | Collega cose lontane e ne esce qualcosa di nuovo |
| Pensiero Strategico | **Apprendimento** | Il processo di imparare dà energia quanto il risultato |

Ogni tema è descritto su quattro assi, perché un talento senza il suo lato ombra
non è utilizzabile:

- **Quando lavora al meglio** — i comportamenti produttivi del tema;
- **Punti ciechi** — cosa succede quando il tema è sovra-utilizzato;
- **Come allenarlo** — azioni concrete, non esortazioni;
- **Contesti in cui rende di più** — dove il tema ha più leva.

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

### 3.2 Il design del banco item

Il banco segue un **confronto a coppie completo**: con 12 temi esistono
C(12,2) = **66 coppie**, e ogni coppia viene presentata esattamente una volta.
Ne segue che:

- ogni tema compare in **11 item**, quindi tutti i temi hanno la stessa
  possibilità di accumulare punteggio (nessun tema è avvantaggiato dal numero di
  occasioni);
- ogni tema viene confrontato con **tutti** gli altri, quindi la classifica non
  dipende da quali confronti sono stati scelti;
- ogni tema usa **11 affermazioni diverse**, una per item: nessuna ripetizione
  letterale che inviterebbe a rispondere "come prima".

Il banco è generato da `scripts/gen_questions.py`, che oltre alle coppie
controlla due fonti di distorsione:

- **ordine**: gli item sono ordinati in modo che due item consecutivi non
  condividano un tema (1 sola eccezione su 65 adiacenze), così l'utente non
  percepisce di essere interrogato più volte sullo stesso costrutto;
- **lato**: ogni tema compare 5-7 volte a sinistra, per neutralizzare la
  tendenza a preferire sistematicamente uno dei due lati (*side bias*).

Il file prodotto (`src/content/questions.ts`) è versionato ed esplicito: si legge
riga per riga in code review, e il seed lo carica nel database.

### 3.3 Il timer

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

Per ciascun tema, media ponderata delle preferenze ricevute nei suoi 11 item,
riportata su scala 0-100:

```
rawScore(tema) = 100 × Σ(preferenza × peso) / Σ(peso)
```

Il peso per lato (`leftWeight`, `rightWeight`, default 1) è previsto a schema:
serve a tarare item che discriminano meno bene, senza cambiare il codice.

### 4.3 Normalizzazione intra-individuo

I punteggi grezzi non sono confrontabili fra persone (chi risponde sempre verso
gli estremi ottiene valori più dispersi). Si calcola quindi uno z-score sui 12
temi **della stessa persona**, riscalato su media 50 e deviazione standard 15:

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

`scripts/simulate.ts` definisce un profilo "vero" (intensità nota per ciascun
tema), genera 66 risposte coerenti con quel profilo aggiungendo rumore e un 5% di
timeout, e verifica che l'algoritmo lo ricostruisca.

```bash
npx tsx scripts/simulate.ts
```

Il test fallisce (exit code 1) se meno di 4 dei 5 temi realmente più forti
finiscono nella Top 5 o se la correlazione di rango di Spearman con il profilo
vero scende sotto 0.80. Sulle esecuzioni di riferimento il recupero della Top 5 è
5/5 e Spearman si attesta fra 0.97 e 0.99.

---

## 6. Limiti dichiarati

- **Punteggi ipsativi**: confrontano i temi dentro la stessa persona, non fra
  persone. Le medie di popolazione nel pannello Admin vanno lette come tendenze
  del gruppo, non come graduatorie individuali.
- **Nessuna taratura su campione normativo**: non esistono percentili di
  riferimento, perché non c'è un campione di standardizzazione.
- **Autovalutazione**: misura come la persona si descrive, non come si comporta.
- **Uso previsto**: autoconsapevolezza e sviluppo. Non è uno strumento clinico né
  validato per la selezione del personale.
