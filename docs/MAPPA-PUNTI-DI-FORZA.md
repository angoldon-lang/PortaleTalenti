# Mappa dei Punti di Forza — il modello proprietario

Modello di valutazione dei punti di forza sviluppato per il portale: tassonomia,
item e algoritmo sono originali e non derivano da alcuno strumento di terzi.
Affianca il modello storico del portale senza sostituirlo — le compilazioni già
fatte restano valide e leggibili.

> **Non è un parere legale.** Le scelte descritte qui sono state prese per
> ridurre il rischio di sovrapposizione con strumenti esistenti, e uno script
> automatico ne verifica una parte. Prima di un uso commerciale resta necessaria
> una ricerca di anteriorità su marchi e denominazioni condotta da un legale.

---

## 1. Che cosa lo rende indipendente

Quattro scelte, prese insieme perché nessuna da sola basterebbe.

**Architettura diversa.** Cinque macro-aree per sei tratti ciascuna: trenta
tratti. Non quattro domini per trentaquattro temi. La differenza non è nel
conteggio ma nel criterio: la spina dorsale non è *il tipo di contributo che una
persona dà a un gruppo*, ma **il processo psicologico del lavorare** — ciò che
orienta, ciò che mette in moto, ciò che dà struttura, ciò che passa dalle
persone, ciò che consente di adattarsi. Da una domanda diversa esce una
partizione diversa.

**Nomenclatura descrittiva.** Ogni tratto porta un sintagma tratto dal lessico
scientifico della psicologia del lavoro — «Autoefficacia Realizzativa»,
«Innesco Relazionale», «Prudenza Valutativa» — e non una parola evocativa
singola. I costrutti sottostanti appartengono alla letteratura pubblica: Big
Five, teoria dell'autodeterminazione, focus regolatorio, performance adattiva,
capitale psicologico. Un costrutto pubblicato non è appropriabile; il nome
commerciale che qualcuno gli ha dato sì.

**Contenuti propri.** Definizioni, punti di forza, punti ciechi, indicazioni di
sviluppo e le oltre seicento affermazioni degli item sono testi scritti per
questo modello.

**Formato di risposta proprio.** Blocchi quartetto a scelta forzata con
indicazione *di più* / *di meno*, non una scala di accordo su coppie
contrapposte. Cambia il dato che si raccoglie, e con esso l'algoritmo.

### La verifica automatica

`python3 scripts/mpf/verifica_indipendenza.py` controlla che:

1. nessun nome di tratto coincida con una denominazione nota o con un tema del
   modello storico del portale;
2. nessun nome di area coincida con un dominio noto;
3. nessun marchio compaia nella tassonomia, nelle affermazioni o nei blocchi
   generati;
4. ogni tratto abbia una denominazione composta e non una parola sola;
5. il numero di aree e di tratti sia diverso da quello dell'architettura di
   riferimento.

Lo script confronta con le denominazioni normalizzate (minuscole, senza accenti
e punteggiatura), così una differenza puramente ortografica non passa come
distinta. Va rieseguito ogni volta che si aggiunge o rinomina un tratto.

---

## 2. Le cinque macro-aree

| Area | Sigla | Che cosa raccoglie |
| --- | --- | --- |
| **Direzione e Scopo** | DIR | ciò che orienta: valori, scopo, fuoco, prospettiva |
| **Energia Realizzativa** | ENE | ciò che mette in moto e porta a termine |
| **Regolazione e Rigore** | REG | ciò che dà struttura, misura e cautela |
| **Relazione e Influenza** | REL | ciò che passa dalle persone |
| **Apertura e Adattamento** | APE | ciò che consente di cambiare e ricombinare |

I sei tratti di ciascuna area, con definizione, punti di forza, punti ciechi,
indicazioni di sviluppo e applicazioni per chi guida e per chi gestisce, sono in
[`src/content/mpf/model.ts`](../src/content/mpf/model.ts) — unica fonte di
verità, da cui il seed popola il database e da cui il generatore di blocchi
legge la struttura.

---

## 3. Il formato di risposta

Ogni blocco presenta **quattro affermazioni di quattro aree diverse**. Chi
risponde indica quella che lo descrive **di più** e quella che lo descrive **di
meno**.

```
  Di più                                                        Di meno
    ( )    Quello che comincio lo porto a termine                 ( )
    (•)    Ho bisogno di tempo per pensare prima di rispondere    ( )
    ( )    Amo pianificare i dettagli prima di iniziare           (•)
    ( )    Mi accorgo quando qualcuno sta male prima che lo dica  ( )
```

### Perché la scelta forzata

Una scala di accordo lascia due vie di fuga: dirsi d'accordo con qualunque
affermazione ragionevole (acquiescenza) e usare sempre la stessa zona della
scala. Il confronto forzato le chiude entrambe: fra quattro qualità tutte
plausibili bisogna comunque sceglierne una, e la scelta dice qualcosa che
l'accordo generico non direbbe.

Il prezzo è che il punteggio diventa **ipsativo**: ciò che un tratto guadagna lo
perde un altro, e i valori vanno letti in rapporto fra loro, non come misura
assoluta né come confronto con altre persone. È lo stesso limite del modello
storico del portale, dichiarato per entrambi.

### Le regole del disegno dei blocchi

Il generatore ([`scripts/mpf/gen_blocchi.py`](../scripts/mpf/gen_blocchi.py))
rispetta cinque vincoli:

1. **Bilanciamento.** Ogni tratto compare lo stesso numero di volte. Chi
   comparisse più spesso avrebbe più occasioni di essere scelto, e il confronto
   fra punteggi non reggerebbe. Con trenta tratti e blocchi da quattro il numero
   di blocchi è 30·k/4, quindi k dev'essere pari.
2. **Aree distinte.** I quattro tratti di un blocco appartengono a quattro aree
   diverse. Costringere a scegliere fra due tratti vicini produrrebbe scelte
   arbitrarie, e sposterebbe il punteggio dell'area invece che quello del
   tratto.
3. **Posizione.** Ogni tratto occupa le quattro posizioni del blocco in modo
   uniforme, per neutralizzare l'effetto dell'ordine di lettura.
4. **Copertura delle coppie.** Le coppie di tratti si ripetono il meno
   possibile: ogni confronto speso su una coppia già vista è informazione non
   raccolta altrove.
5. **Blocchi di controllo.** Otto blocchi per banca ripropongono più avanti una
   quartina già incontrata, con affermazioni che quei tratti hanno mostrato in
   altri blocchi. Servono solo alla coerenza e non entrano nei punteggi: se ci
   entrassero, i tratti che vi compaiono avrebbero più occasioni degli altri.

Il vincolo 2 ha una conseguenza da conoscere: **due tratti della stessa area non
vengono mai confrontati direttamente**, e il loro ordine reciproco si ricava per
transitività. Chi ha un profilo molto concentrato in un'area può quindi trovare
alcuni tratti di testa a pari punteggio. L'insieme dei dominanti resta corretto —
la simulazione lo verifica proprio su questo caso — ma l'ordine interno fra
tratti mai messi a confronto è meno informativo del resto della classifica.

### Le quattro banche

| Questionario | Blocchi | di cui controllo | Comparse per tratto | Durata |
| --- | --- | --- | --- | --- |
| Essenziale | 53 | 8 | 6 | ~17 min |
| Completa | 68 | 8 | 8 | ~22 min |
| Leadership | 53 | 8 | 6 | ~17 min |
| Gestione del Team | 53 | 8 | 6 | ~17 min |

Le affermazioni sono in
[`scripts/mpf/affermazioni/`](../scripts/mpf/affermazioni/): un file per
contesto, trenta tratti ciascuno. *Leadership* parla di direzione, decisioni
difficili, dissenso e fiducia; *Gestione* di assegnazioni, feedback, carichi di
lavoro e crescita delle persone. Non è lo stesso test con etichette diverse.

---

## 4. L'algoritmo

Implementato in [`src/lib/mpf-scoring.ts`](../src/lib/mpf-scoring.ts).

### 4.1 Dalla scelta ai confronti

La risposta a un blocco è un ordinamento parziale:

```
scelto come "più"  >  i due non scelti  >  scelto come "meno"
```

cioè **cinque confronti a coppie** per blocco. Il confronto fra i due intermedi
resta indeterminato e non viene inventato.

### 4.2 Quote di preferenza

Da quell'ordinamento esce una quota per ciascuno dei quattro tratti del blocco:

| Scelta | Quota |
| --- | --- |
| «mi descrive di più» | 1,0 |
| non scelto | 0,5 |
| «mi descrive di meno» | 0,0 |

Il **punteggio grezzo** di un tratto è la media delle quote ricevute, su 0-100.
Poiché ogni tratto compare lo stesso numero di volte, le medie sono
confrontabili.

### 4.3 Normalizzazione

Il punteggio mostrato è uno **z-score calcolato sui tratti della stessa
persona**, riscalato a media 50 e deviazione standard 15. Dice quanto un tratto
si stacca dalla media personale, non dalla popolazione.

### 4.4 Bilanciamento fra le aree

I punteggi grezzi dei sei tratti di ciascuna area si sommano, e le cinque somme
si normalizzano a 100. È una tabella e non cinque colonne fisse: il numero di
aree è un dato del modello, e cambiarlo non deve richiedere una migrazione dello
schema.

### 4.5 Coerenza e attendibilità

Sui blocchi di controllo si misura se la stessa scelta, posta con altre parole,
viene rifatta. Due confronti per blocco (il «più» e il «meno»), sedici in tutto.

Il tasso di disaccordo **non va letto rispetto allo zero**. Un rispondente
attento non arriva a zero: circa metà dei confronti di controllo cade fra tratti
che possiede in misura simile, e lì la scelta è legittimamente instabile. Gli
ancoraggi ricavati per simulazione sono:

| Tasso di disaccordo | Lettura |
| --- | --- |
| ~0,50 | livello di chi risponde con attenzione |
| ~0,75 | livello di chi risponde a caso (una scelta su quattro coincide per caso) |

L'indice di attendibilità 0-100 combina questo tasso con la quota di blocchi
completati. Il report mostra però una **fascia** — buona / da verificare /
bassa — e non il numero puntuale: sedici confronti bastano a collocare una
compilazione, non a rendere preciso il valore sul singolo profilo.

Le soglie sono tarate perché chi risponde con attenzione finisca nella fascia
bassa in meno del 7% dei casi, e chi risponde a caso venga segnalato in circa il
90%.

#### Perché non le terne cicliche

Una misura classica di coerenza sono le terne di preferenze cicliche (A>B, B>C,
C>A). È stata provata e scartata: in questo disegno misura soprattutto **quanto
è piatto il profilo**, non quanto è attenta la persona. Un rispondente
scrupoloso con molti tratti di livello simile produce moltissime terne cicliche
in modo del tutto legittimo, e l'indice risulta indistinguibile da quello di chi
risponde a caso. I blocchi di controllo costano otto item in più per banca e
misurano la cosa giusta.

#### Perché non le sole ripetizioni spontanee

Contare le coppie che il disegno ripete da sé non funziona: il vincolo 4 le
minimizza per costruzione — nella forma breve sono due su centottanta — e un
indice costruito su di esse sarebbe strutturalmente nullo.

### 4.6 Blocchi scaduti

Un blocco chiuso dal timer viene registrato **senza scelte**. Nella scelta
forzata non esiste un valore neutro da metterci al posto: inventarne uno
significherebbe attribuire alla persona una preferenza che non ha espresso. Il
blocco entra nella quota di salti e pesa sull'attendibilità, non sui punteggi.

---

## 5. La verifica

`npx tsx scripts/mpf/simula.ts` simula rispondenti di cui si conosce la
"verità": un livello reale per ogni tratto, più un disturbo casuale che
rappresenta attenzione, umore e ambiguità degli item. Quaranta ripetizioni da
trenta rispondenti per scenario, con generatore riproducibile.

Le soglie sono diverse per scenario perché il compito non ha la stessa
difficoltà. Se i cinque tratti dominanti staccano nettamente gli altri il
recupero dev'essere quasi perfetto; se il profilo è piatto, distinguere il
quinto dal sesto è ambiguo per costruzione, e pretendere precisione
significherebbe misurare il rumore.

| Scenario | Top-5 recuperati | Correlazione di rango |
| --- | --- | --- |
| Profilo netto | 4,8-4,9 su 5 | 0,80-0,83 |
| Profilo graduale | 3,5-3,7 su 5 | 0,91-0,94 |
| Profilo piatto | 2,4-2,6 su 5 | 0,68-0,73 |
| Profilo concentrato in un'area | 5,0 su 5 | 0,78-0,82 |

Nel profilo netto e in quello concentrato la coda è compressa di proposito —
quattro centesimi fra una posizione e la successiva, contro un disturbo dieci
volte più grande — quindi il suo ordine non è recuperabile e la correlazione
complessiva ne risente: è il comportamento atteso, non un difetto. Nel profilo
graduale, dove tutta la classifica è recuperabile, la correlazione arriva a
0,94.

Lo scenario «concentrato» esiste per il caso sfavorevole descritto al § 3: i
cinque tratti dominanti tutti nella stessa area, che i blocchi non confrontano
mai fra loro. L'insieme viene recuperato per intero.

La simulazione verifica anche che l'attendibilità **cali in modo ordinato** al
crescere della quota di risposte tirate a caso (da ~85 a ~18 su 100), e che le
due condizioni estreme finiscano in fasce diverse.

---

## 6. Limiti dichiarati

- **Punteggi ipsativi.** Confrontano i tratti *dentro* una persona. Non sono
  confrontabili fra persone diverse e non si prestano a graduatorie.
- **Nessuna taratura su campione normativo.** I punteggi non sono percentili
  rispetto a una popolazione di riferimento: non ne esiste uno.
- **Autodescrizione.** Lo strumento raccoglie come una persona si vede, non come
  si comporta osservata da altri. La scelta forzata riduce l'effetto della
  desiderabilità sociale, non lo elimina.
- **Non è uno strumento clinico né di selezione.** È pensato per
  l'autoconsapevolezza e lo sviluppo professionale.
- **Ordine interno alle aree.** Vedi § 3: i tratti della stessa area non sono
  mai confrontati direttamente.
- **Validazione psicometrica sul campo ancora da fare.** Le verifiche qui
  descritte sono simulazioni sul disegno e sull'algoritmo: dicono che il motore
  ricostruisce un profilo noto, non che i trenta tratti misurino nella
  popolazione reale ciò che dichiarano di misurare. Servono dati raccolti su
  persone vere.
