import type { Domain } from '@prisma/client';

export type ThemeSeed = {
  slug: string;
  name: string;
  domain: Domain;
  tagline: string;
  fullDescription: string;
  strengths: string[];
  blindSpots: string[];
  actionTips: string[];
  thrivesIn: string[];
  /// Come il tema si esprime quando la persona guida (report "for Leaders").
  leaderApplication: string;
  /// Come far rendere al meglio chi ha questo tema (report "for Managers").
  managerApplication: string;
};

/**
 * 34 temi distribuiti su 4 macro-aree. È il modello precedente del
 * portale, mantenuto attivo per chi lo ha già compilato
 * (Esecuzione 9, Influenza 8, Relazioni 9, Pensiero Strategico 8).
 * I contenuti sono originali e scritti in ottica di psicologia del lavoro:
 * ogni tema descrive un pattern ricorrente di pensiero, sentimento e
 * comportamento che può essere applicato produttivamente.
 */
export const THEMES: ThemeSeed[] = [
  // ======================= CONCRETEZZA OPERATIVA =======================
  {
    slug: 'tensione-produttiva',
    name: 'Tensione Produttiva',
    domain: 'OPERATIONAL',
    tagline: 'Hai un motore interno che chiede risultati concreti, ogni giorno.',
    fullDescription:
      "Chi ha questo tema convive con una spinta costante alla produttività. Ogni giornata parte idealmente da zero: qualcosa di tangibile deve essere portato a termine perché la giornata «conti». Questa energia non nasce dalla pressione esterna ma da un metronomo interno, e per questo è sorprendentemente stabile nel tempo.\n\nNei gruppi di lavoro chi ha questo tema è il punto di riferimento silenzioso: mentre altri discutono, ha già chiuso i primi tre punti. La sua credibilità si costruisce sul volume e sulla continuità del lavoro consegnato, più che sulla retorica.\n\nIl rischio, sul lungo periodo, è confondere il movimento con il progresso. Il talento diventa forza matura quando chi lo possiede impara a scegliere con cura quali risultati meritano la sua energia.",
    strengths: [
      'Mantiene ritmo e produttività anche senza supervisione',
      'Trasforma progetti lunghi in una sequenza di consegne concrete',
      'Alza lo standard di operosità del gruppo con l\'esempio',
      'Regge bene i carichi di lavoro intensi e prolungati',
    ],
    blindSpots: [
      'Può scambiare la quantità di lavoro svolto per impatto reale',
      'Fatica a fermarsi, delegare e celebrare i risultati raggiunti',
      'Rischio di burnout: il "fatto" non basta mai a lungo',
      'Può risultare impaziente con chi ha ritmi più riflessivi',
    ],
    actionTips: [
      'Ogni lunedì scegli i 3 risultati che contano davvero e proteggi quel tempo',
      'Chiudi la giornata annotando cosa hai completato: dà al motore un punto di arrivo',
      'Concorda con il tuo team quali attività puoi legittimamente non fare',
      'Affianca al conteggio delle attività un indicatore di impatto',
    ],
    leaderApplication:
      "Come leader dai l'esempio con il ritmo, non con i discorsi: il gruppo capisce lo standard guardando quanto consegni. Il rischio speculare è che il team legga la tua operosità come unico metro di valore e smetta di fermarsi a pensare. Il tuo compito da leader è decidere pubblicamente cosa NON faremo: senza quella scelta il gruppo insegue il tuo ritmo senza la tua direzione.",
    managerApplication:
      "Dagli obiettivi misurabili e un flusso di lavoro continuo: i tempi morti lo demotivano più del carico. Riconosci i risultati concreti, non lo sforzo. Attenzione al sovraccarico: tenderà a dire sì a tutto, quindi sii tu a stabilire cosa può legittimamente non fare. Nei colloqui sposta la conversazione da quanto ha prodotto all'impatto di ciò che ha prodotto: è la sua area di crescita.",
    thrivesIn: ['Project delivery', 'Operations', 'Ruoli a obiettivi misurabili', 'Startup in fase di scaling'],
  },
  {
    slug: 'ordinamento-complessita',
    name: 'Ordinamento della Complessità',
    domain: 'OPERATIONAL',
    tagline: 'Porti ordine dove gli altri vedono complessità.',
    fullDescription:
      "Chi ha il tema Ordinamento della Complessità ha bisogno di struttura, routine e prevedibilità per esprimersi al meglio. Non si tratta di rigidità: è il modo in cui questa persona riduce il rumore ambientale per liberare attenzione da dedicare al lavoro che conta.\n\nDi fronte a un progetto confuso, l'istinto è immediato: scomporre, sequenziare, assegnare scadenze. Il risultato è che il caos diventa un piano, e il piano diventa qualcosa che tutti possono seguire.\n\nLa maturità del tema si vede nella capacità di distinguere le situazioni che richiedono un processo da quelle che chiedono adattamento: la struttura è uno strumento, non un fine.",
    strengths: [
      'Costruisce processi replicabili a partire da situazioni confuse',
      'Rispetta scadenze e impegni con affidabilità elevata',
      'Anticipa colli di bottiglia prima che diventino emergenze',
      'Riduce il carico cognitivo del gruppo dando un metodo condiviso',
    ],
    blindSpots: [
      'Il cambio di piano dell\'ultimo minuto può generare stress sproporzionato',
      'Può irrigidirsi su procedure che hanno perso utilità',
      'Rischia di essere percepito come poco flessibile in contesti fluidi',
      'Tende a pianificare anche ciò che sarebbe più efficiente esplorare',
    ],
    actionTips: [
      'Inserisci esplicitamente uno slot "imprevisti" in ogni pianificazione',
      'Rivedi ogni trimestre i processi che hai creato: quali sono ancora utili?',
      'Spiega il perché delle tue strutture: le persone le seguono se le capiscono',
      'Allenati su un progetto piccolo a lavorare senza piano dettagliato',
    ],
    leaderApplication:
      "Guidi dando al gruppo un terreno prevedibile su cui muoversi: ruoli chiari, scadenze note, nessuna sorpresa organizzativa. È un enorme sollievo cognitivo per chi ti segue. Attenzione a non confondere la tua esigenza di struttura con quella del team: chi lavora bene nell'ambiguità va lasciato lavorare, e i tuoi processi vanno spiegati nel perché, non imposti nel come.",
    managerApplication:
      "Dagli visibilità sui piani con anticipo: i cambi di programma dell'ultimo minuto gli costano più che agli altri. Se un cambio è inevitabile spiega il perché e concedi tempo per riorganizzare. Usalo per mettere ordine nei progetti confusi, ma verifica ogni tanto che i processi creati servano ancora: tenderà a mantenerli anche quando hanno esaurito la loro utilità.",
    thrivesIn: ['Project management', 'Compliance e qualità', 'Logistica', 'Coordinamento eventi'],
  },
  {
    slug: 'vincolo-impegno',
    name: "Vincolo dell'Impegno Preso",
    domain: 'OPERATIONAL',
    tagline: 'Quando dici che lo farai, per te diventa un vincolo morale.',
    fullDescription:
      "Il tema Vincolo dell'Impegno Preso porta chi lo possiede a vivere gli impegni presi come promesse. Piccoli o grandi che siano, gli impegni non sono negoziabili: se qualcosa non è stato consegnato come previsto, questa persona sente il bisogno di rimediare, anche a costo personale.\n\nQuesto tema costruisce fiducia più velocemente di qualsiasi altro. I colleghi imparano presto che a questa persona si può affidare la cosa importante, e questo genera un circolo virtuoso di responsabilità crescenti.\n\nIl circolo però può diventare vizioso: chi è affidabile riceve sempre più richieste. Il tema si esprime al meglio quando è accompagnato dalla capacità di dire un no chiaro e tempestivo.",
    strengths: [
      'Genera fiducia immediata e duratura in colleghi e clienti',
      'Chiude ciò che inizia, anche quando diventa scomodo',
      'Alto standard etico: la qualità del lavoro riflette la propria parola',
      'Segnala per tempo i rischi anziché nasconderli',
    ],
    blindSpots: [
      'Difficoltà a dire di no: sovraccarico cronico',
      'Si assume colpe che appartengono al sistema, non alla persona',
      'Può avere aspettative severe verso chi è meno rigoroso',
      'Il senso di colpa può superare l\'entità dell\'errore reale',
    ],
    actionTips: [
      'Prima di accettare un impegno, verifica il tempo reale che richiede',
      'Rendi visibile il tuo carico: una lista condivisa rende il no oggettivo',
      'Distingui ciò che dipende da te da ciò che dipende dal contesto',
      'Chiedi feedback: spesso lo standard che ti imponi è più alto del richiesto',
    ],
    leaderApplication:
      "La tua parola è il capitale di fiducia su cui poggia il gruppo: quando prometti una cosa ai tuoi, quella cosa accade. Da leader il pericolo è assorbire ogni impegno personalmente invece di costruire un sistema che regge senza di te. Delegare non è cedere responsabilità: è renderla condivisa, ed è l'unico modo perché il gruppo cresca oltre la tua capacità individuale.",
    managerApplication:
      "È la persona a cui affiderai le cose importanti, e proprio per questo rischia il sovraccarico cronico. Rendi visibile il suo carico e aiutalo a dire di no: un no oggettivo, basato su una lista condivisa, gli costa meno di un no personale. Quando qualcosa va storto, distingui esplicitamente ciò che dipendeva da lui da ciò che dipendeva dal contesto.",
    thrivesIn: ['Ruoli a contatto con il cliente', 'Finance e amministrazione', 'Sanità', 'Team leadership'],
  },

  // ======================= IMPATTO INTERPERSONALE =======================
  {
    slug: 'efficacia-espositiva',
    name: 'Efficacia Espositiva',
    domain: 'INTERPERSONAL',
    tagline: 'Rendi vive le idee: le spieghi, le racconti, le fai ricordare.',
    fullDescription:
      "Chi ha il tema Efficacia Espositiva trova naturale dare parole a ciò che accade. Un dato diventa una storia, un concetto astratto diventa un'immagine, una riunione noiosa diventa un momento in cui tutti capiscono davvero il punto.\n\nQuesto talento ha un impatto diretto sulla circolazione delle idee in azienda: le informazioni non restano ferme nei documenti, ma vengono tradotte in qualcosa che le persone possono usare.\n\nLa competenza matura consiste nel mettere la propria capacità espressiva al servizio del messaggio, non della performance: la domanda guida diventa «cosa deve capire chi ascolta?».",
    strengths: [
      'Traduce concetti complessi in messaggi immediatamente comprensibili',
      'Cattura e mantiene l\'attenzione in presentazioni e riunioni',
      'Rende memorabili dati, progetti e strategie',
      'Facilita l\'allineamento tra funzioni che parlano linguaggi diversi',
    ],
    blindSpots: [
      'Può occupare spazio conversazionale a scapito dei più silenziosi',
      'Il racconto brillante può coprire un contenuto ancora acerbo',
      'Rischio di essere valutato sullo stile più che sulla sostanza',
      'Può sottovalutare l\'importanza della documentazione scritta',
    ],
    actionTips: [
      'In riunione, poniti l\'obiettivo di far parlare gli altri per primi',
      'Prepara sempre una versione scritta di ciò che presenti',
      'Chiudi ogni intervento con la singola frase che vuoi sia ricordata',
      'Chiedi verifica: "cosa avete capito?" invece di "è chiaro?"',
    ],
    leaderApplication:
      "La tua leva di leadership è il senso: sai trasformare una strategia astratta in qualcosa che le persone ricordano il lunedì mattina. Attenzione allo spazio che occupi: un leader che parla bene tende a riempire il silenzio, e il silenzio è dove emergono le idee degli altri. Misurati non da quanto sei stato chiaro, ma da quanto il gruppo sa ripetere la direzione senza di te.",
    managerApplication:
      "Mettilo dove il messaggio deve arrivare: presentazioni, onboarding, allineamento fra funzioni. Chiedigli di tradurre le decisioni per il resto dell'organizzazione. Attenzione a valutarlo sullo stile invece che sulla sostanza: chiedigli sempre la versione scritta di ciò che presenta. In riunione aiutalo a fare spazio ai colleghi più silenziosi.",
    thrivesIn: ['Marketing e comunicazione', 'Vendite', 'Formazione', 'Relazioni pubbliche'],
  },
  {
    slug: 'passaggio-azione',
    name: "Passaggio all'Azione",
    domain: 'INTERPERSONAL',
    tagline: 'Trasformi la discussione in azione: si impara facendo.',
    fullDescription:
      "Chi ha questo tema si porta dietro una domanda ricorrente: «quando partiamo?». L'analisi è utile, ma solo l'azione produce informazioni reali. Per questo tema il movimento non è impulsività: è il modo più rapido per scoprire cosa funziona.\n\nNei gruppi che tendono alla paralisi decisionale, questo tema è il fattore che rompe l'inerzia. Spesso è la persona che fa il primo passo scomodo, quello che sblocca tutti gli altri.\n\nIl tema diventa maturo quando l'energia iniziale viene incanalata: partire in fretta ha valore se qualcuno — o chi lo possiede — presidia anche il completamento.",
    strengths: [
      'Sblocca situazioni di stallo e paralisi decisionale',
      'Crea slancio e senso di urgenza produttiva',
      'Impara rapidamente attraverso prototipi e tentativi',
      'Non teme di prendere decisioni con informazioni incomplete',
    ],
    blindSpots: [
      'Può partire prima di aver valutato rischi rilevanti',
      'Rischia di lasciare progetti a metà quando cala l\'adrenalina iniziale',
      'Può mettere sotto pressione chi ha bisogno di più tempo per decidere',
      'Confonde talvolta la velocità con il progresso',
    ],
    actionTips: [
      'Prima di partire, definisci cosa ti dirà che l\'esperimento è fallito',
      'Alleati con un profilo analitico: la coppia velocità+rigore è potentissima',
      'Assegna esplicitamente il completamento, tuo o di altri, quando lanci',
      'Concediti 24 ore di attesa sulle decisioni irreversibili',
    ],
    leaderApplication:
      "Sei il leader che rompe l'inerzia: dove il gruppo gira su sé stesso, tu fai il primo passo e sblocchi tutti. Il rovescio è una scia di iniziative aperte e mai chiuse, che il team paga in confusione. Da leader il tuo lavoro non finisce con il via: prima di lanciare, decidi e comunica chi presidia il completamento e quale segnale dirà che l'esperimento è fallito.",
    managerApplication:
      "Dagli il permesso esplicito di partire con informazioni incomplete su un perimetro definito: è lì che rende di più. Affiancalo a un profilo analitico o esecutivo che porti a terra ciò che lancia. Concorda in anticipo quali decisioni sono irreversibili e richiedono una pausa. Nei momenti di stallo del team usalo come innesco: farà il primo passo scomodo che sblocca gli altri.",
    thrivesIn: ['Business development', 'Innovazione', 'Startup', 'Turnaround e crisi'],
  },
  {
    slug: 'sicurezza-giudizio',
    name: 'Sicurezza di Giudizio',
    domain: 'INTERPERSONAL',
    tagline: 'Hai una bussola interna e la segui anche controcorrente.',
    fullDescription:
      "Il tema Sicurezza di Giudizio descrive una sicurezza che non dipende dal consenso. Chi lo possiede sa di poter gestire il proprio destino e prende decisioni difficili senza aver bisogno di rassicurazione continua.\n\nQuesta indipendenza di giudizio è preziosa nei momenti di incertezza: quando nessuno sa cosa fare, la presenza di una persona ferma riduce l'ansia collettiva e permette al gruppo di muoversi.\n\nIl tema esprime il suo meglio quando la sicurezza è accompagnata da ascolto reale: essere certi della propria rotta non impedisce di aggiornare la mappa.",
    strengths: [
      'Decide con lucidità in condizioni di incertezza e pressione',
      'Non ha bisogno di approvazione costante per procedere',
      'Trasmette calma e stabilità al gruppo nei momenti critici',
      'Sostiene posizioni impopolari quando le ritiene corrette',
    ],
    blindSpots: [
      'Può apparire arrogante o poco permeabile ai pareri altrui',
      'Rischia di sottostimare i propri punti deboli',
      'Può decidere da solo là dove servirebbe coinvolgimento',
      'Fatica a chiedere aiuto quando ne avrebbe bisogno',
    ],
    actionTips: [
      'Prima di decidere, cerca attivamente l\'opinione più distante dalla tua',
      'Rendi espliciti i criteri della tua decisione: la sicurezza diventa fiducia',
      'Individua un mentore che possa contraddirti senza timore',
      'Distingui i temi su cui sei competente da quelli su cui sei solo sicuro',
    ],
    leaderApplication:
      "Nei momenti di incertezza la tua fermezza abbassa l'ansia collettiva e permette al gruppo di muoversi: è un contributo raro. Il rischio è che la stessa fermezza chiuda la porta al dissenso, e un leader che non riceve più cattive notizie sta guidando alla cieca. Rendi espliciti i criteri delle tue decisioni: la sicurezza diventa fiducia solo quando è verificabile dagli altri.",
    managerApplication:
      "Dagli autonomia reale e responsabilità visibili: il micromanagement lo spegne più di qualsiasi altro profilo. Non ha bisogno di rassicurazione continua, quindi non sprecare feedback generico. Cerca però attivamente il suo confronto con opinioni distanti dalla sua, e individua qualcuno che possa contraddirlo senza timore: è la sua principale area cieca.",
    thrivesIn: ['Leadership esecutiva', 'Ruoli imprenditoriali', 'Vendite complesse', 'Consulenza strategica'],
  },

  // ======================= LEGAME E SOSTEGNO =======================
  {
    slug: 'lettura-stati-emotivi',
    name: 'Lettura degli Stati Emotivi',
    domain: 'SUPPORTIVE',
    tagline: 'Percepisci le emozioni degli altri prima che vengano dette.',
    fullDescription:
      "La lettura degli stati emotivi è la capacità di sentire le emozioni altrui come se fossero, per un istante, proprie. Non significa essere d'accordo o farsi carico di tutto: significa disporre di un'informazione che agli altri sfugge.\n\nNelle organizzazioni questo talento funziona come un sistema di allerta precoce: il disagio di un collega, la tensione latente in un team, la frustrazione di un cliente vengono colti quando sono ancora gestibili.\n\nIl tema diventa una forza professionale quando chi lo possiede impara a usare l'informazione emotiva senza esserne travolto: sentire non obbliga ad assorbire.",
    strengths: [
      'Coglie tensioni e disagi prima che diventino conflitti aperti',
      'Crea rapidamente relazioni di fiducia e sicurezza psicologica',
      'Sa scegliere le parole giuste nei momenti delicati',
      'Aiuta il gruppo a dare voce a ciò che resta implicito',
    ],
    blindSpots: [
      'Rischio di assorbire il carico emotivo altrui fino all\'esaurimento',
      'Può evitare conversazioni necessarie per non ferire',
      'Le decisioni impopolari ma corrette risultano molto costose',
      'Può interpretare come personale un problema organizzativo',
    ],
    actionTips: [
      'Distingui ogni giorno ciò che senti da ciò di cui sei responsabile',
      'Usa quello che percepisci come domanda, non come conclusione',
      'Allenati a dare feedback difficili: la cura include la sincerità',
      'Proteggi momenti di recupero dopo le conversazioni intense',
    ],
    leaderApplication:
      "Percepisci lo stato del gruppo molto prima che diventi un problema formale: è un sistema di allerta precoce che pochi leader possiedono. Il rischio è farti carico del disagio altrui fino a rinviare le decisioni scomode. La cura, per un leader, include la sincerità: dire chiaramente una cosa difficile è più rispettoso che proteggere qualcuno da un'informazione che lo riguarda.",
    managerApplication:
      "È il tuo termometro sul clima del team: chiedigli cosa percepisce, ma non scaricargli addosso la gestione emotiva del gruppo. Proteggi i suoi momenti di recupero dopo le conversazioni difficili. Aiutalo ad allenare il feedback scomodo: tenderà a evitarlo per non ferire, e quel silenzio a lungo andare danneggia proprio le persone che vuole proteggere.",
    thrivesIn: ['HR e people management', 'Coaching e counseling', 'Customer success', 'Design centrato sull\'utente'],
  },
  {
    slug: 'ricerca-terreno-comune',
    name: 'Ricerca del Terreno Comune',
    domain: 'SUPPORTIVE',
    tagline: 'Cerchi il terreno comune: il conflitto sterile ti sembra uno spreco.',
    fullDescription:
      "Chi ha il tema Ricerca del Terreno Comune parte da un presupposto pratico: il disaccordo raramente produce valore, mentre il consenso mette le persone in condizione di lavorare. Per questo cerca istintivamente i punti di contatto tra posizioni distanti.\n\nÈ un talento sottovalutato e molto efficace: riduce il costo relazionale delle decisioni e permette ai gruppi di andare avanti senza lasciare rancori sul percorso.\n\nLa versione matura del tema non evita il conflitto: lo rende produttivo, portando la discussione sui fatti e sugli obiettivi condivisi invece che sulle posizioni personali.",
    strengths: [
      'Trova rapidamente il terreno comune tra posizioni opposte',
      'Abbassa la temperatura emotiva delle discussioni difficili',
      'Facilita decisioni condivise e quindi realmente eseguite',
      'Crea ambienti di lavoro sereni e collaborativi',
    ],
    blindSpots: [
      'Può cedere su questioni di merito pur di evitare tensione',
      'Rischia di far passare sotto silenzio disaccordi importanti',
      'Il consenso apparente può nascondere problemi irrisolti',
      'Fatica in contesti dove il dibattito acceso è la norma',
    ],
    actionTips: [
      'Distingui i conflitti da spegnere da quelli da fare emergere',
      'Chiedi il parere dei dissenzienti prima di chiudere una decisione',
      'Prepara in anticipo la tua posizione sulle questioni non negoziabili',
      'Ricorda che un accordo troppo rapido spesso si rompe in esecuzione',
    ],
    leaderApplication:
      "Da leader riduci il costo relazionale delle decisioni: le persone escono dalle tue riunioni allineate e senza rancori, quindi eseguono davvero. Il pericolo è il consenso apparente, che nasconde i disaccordi invece di risolverli e li fa riemergere in esecuzione. Distingui i conflitti da spegnere da quelli da far emergere: alcuni dissensi sono informazione che il gruppo ti sta offrendo.",
    managerApplication:
      "Usalo dove servono accordi che reggano nel tempo: mediazioni, progetti cross-funzionali, clienti difficili. Chiedigli però la sua posizione in modo esplicito e in privato: in gruppo tenderà a smussarla per non creare tensione. Prima di chiudere una decisione verifica con lui se il consenso è reale o solo apparente: è la domanda che gli fa dare il meglio.",
    thrivesIn: ['Mediazione e negoziazione', 'Team cross-funzionali', 'Servizio clienti', 'Partnership'],
  },
  {
    slug: 'riconoscimento-potenziale',
    name: 'Riconoscimento del Potenziale',
    domain: 'SUPPORTIVE',
    tagline: 'Vedi il potenziale delle persone e non riesci a ignorarlo.',
    fullDescription:
      "Chi ha questo tema percepisce negli altri il potenziale non ancora espresso e trova profonda soddisfazione nel vederlo emergere. Ogni piccolo progresso altrui è per lui un risultato personale.\n\nQuesto talento produce un effetto composto sull'organizzazione: le persone che crescono restano, e a loro volta fanno crescere altri. Chi ha questo tema costruisce spesso, senza accorgersene, la panchina di talenti dell'azienda.\n\nLa maturità del tema sta nel saper distinguere il potenziale reale dal desiderio di aiutare: non tutti vogliono, in quel momento, essere sviluppati.",
    strengths: [
      'Riconosce e nomina il potenziale che gli altri non vedono in sé',
      'Costruisce percorsi di crescita concreti e su misura',
      'Ha una pazienza autentica per l\'apprendimento altrui',
      'Genera fedeltà e retention nei team che guida',
    ],
    blindSpots: [
      'Può investire a lungo su chi non è realmente motivato',
      'Rischia di tollerare prestazioni insufficienti troppo a lungo',
      'Può trascurare il proprio percorso di crescita',
      'Il feedback può diventare troppo morbido per essere utile',
    ],
    actionTips: [
      'Chiedi esplicitamente: "vuoi crescere su questo?" prima di investire',
      'Definisci con la persona traguardi osservabili e una scadenza',
      'Accetta che a volte la crescita migliore avvenga altrove',
      'Dedica a te stesso lo stesso livello di attenzione che dedichi agli altri',
    ],
    leaderApplication:
      "La tua leadership produce un effetto composto: le persone che fai crescere restano, e a loro volta fanno crescere altri. Costruisci la panchina di talenti dell'organizzazione quasi senza accorgertene. Il rischio è investire a lungo su chi non è motivato e tollerare prestazioni insufficienti oltre il ragionevole. Chiedi esplicitamente «vuoi crescere su questo?» prima di investire: la risposta cambia tutto.",
    managerApplication:
      "Affidagli le persone nuove e chi ha bisogno di crescere: è lì che il suo talento produce ritorno composto. Concorda però traguardi osservabili e una scadenza, altrimenti investirà a tempo indeterminato. Aiutalo a dare feedback abbastanza diretto da essere utile, e ricordagli di curare il proprio percorso: tenderà a metterlo in fondo alla lista.",
    thrivesIn: ['Management di team', 'Formazione e L&D', 'Mentoring', 'Educazione'],
  },

  // ======================= ELABORAZIONE COGNITIVA =======================
  {
    slug: 'richiesta-di-prove',
    name: 'Richiesta di Prove',
    domain: 'COGNITIVE',
    tagline: 'Chiedi le prove: senza dati, per te resta un\'opinione.',
    fullDescription:
      "Il tema Richiesta di Prove spinge a cercare le cause. Di fronte a un'affermazione, la reazione naturale è chiedersi su cosa si fonda, quali dati la supportano e quali spiegazioni alternative sono state escluse.\n\nQuesta postura protegge le organizzazioni da decisioni prese sull'onda dell'entusiasmo. La richiesta di prove non è il freno: è il sistema di controllo che rende una decisione difendibile e ripetibile.\n\nIl tema esprime il suo massimo quando l'analisi ha un termine definito: la domanda utile non è «so tutto?» ma «so abbastanza per decidere bene?».",
    strengths: [
      'Individua errori logici e assunzioni non verificate',
      'Fonda le decisioni su dati e relazioni causa-effetto',
      'Struttura problemi complessi in componenti gestibili',
      'Riduce il rischio di scelte basate solo sull\'entusiasmo',
    ],
    blindSpots: [
      'Rischio di analisi paralizzante quando i dati non bastano mai',
      'Può essere percepito come scettico o demotivante',
      'Sottovaluta gli elementi qualitativi e relazionali',
      'Fatica in contesti che richiedono decisioni istintive e rapide',
    ],
    actionTips: [
      'Fissa in anticipo la soglia di dati che ti basta per decidere',
      'Presenta le tue obiezioni insieme a una proposta alternativa',
      'Comunica i risultati in forma narrativa, non solo numerica',
      'Riconosci esplicitamente ciò che funziona, non solo ciò che non torna',
    ],
    leaderApplication:
      "Proteggi il gruppo dalle decisioni prese sull'onda dell'entusiasmo: con te al tavolo le scelte diventano difendibili e ripetibili. Il rischio, da leader, è che il tuo scetticismo venga letto come sfiducia e spenga le proposte prima che maturino. Fissa in anticipo la soglia di dati che ti basta per decidere e accompagna ogni obiezione con un'alternativa: così sei il sistema di controllo, non il freno.",
    managerApplication:
      "Coinvolgilo prima che la decisione sia presa, non dopo: usato come revisore finale diventa un freno, usato all'inizio è un moltiplicatore di qualità. Concorda con lui la soglia di dati sufficiente a decidere, altrimenti l'analisi non finisce mai. Chiedigli di presentare i risultati in forma narrativa: il suo rigore arriva molto più lontano quando è raccontato.",
    thrivesIn: ['Data analysis', 'Ricerca', 'Finance e controllo di gestione', 'Quality assurance'],
  },
  {
    slug: 'accostamento-inatteso',
    name: 'Accostamento Inatteso',
    domain: 'COGNITIVE',
    tagline: 'Colleghi cose che sembravano lontane e ne esce qualcosa di nuovo.',
    fullDescription:
      "Chi ha il tema Accostamento Inatteso è affascinato dalle idee. Trova connessioni fra fenomeni apparentemente scollegati e prova un piacere autentico nel momento in cui un concetto nuovo prende forma.\n\nQuesto talento è il carburante dell'innovazione: dove altri vedono un vincolo, questo tema vede una riformulazione possibile del problema. Le soluzioni migliori spesso arrivano da qui.\n\nLa maturità del tema consiste nel selezionare: molte idee sono interessanti, poche sono utili adesso. Chi impara a scegliere trasforma la creatività in impatto.",
    strengths: [
      'Genera soluzioni originali dove gli approcci standard falliscono',
      'Riformula i problemi trovando angoli inaspettati',
      'Alimenta il pensiero laterale dell\'intero gruppo',
      'Vede opportunità dentro i vincoli',
    ],
    blindSpots: [
      'Può moltiplicare le idee senza portarne a termine nessuna',
      'Rischia di annoiarsi nella fase esecutiva',
      'Le idee troppo distanti dal contesto vengono scartate a priori',
      'Può cambiare direzione quando il gruppo aveva appena preso il ritmo',
    ],
    actionTips: [
      'Tieni un archivio delle idee: libera la mente senza perderle',
      'Per ogni idea che proponi, indica il primo passo concreto',
      'Collabora con profili esecutivi che portino a terra ciò che immagini',
      'Fissa un limite: al massimo due iniziative nuove per trimestre',
    ],
    leaderApplication:
      "Sei il leader che riformula il problema quando la squadra sbatte contro un vincolo: dove altri vedono un muro, tu vedi una domanda posta male. Il rischio è cambiare direzione appena il gruppo aveva trovato il ritmo, pagando in fiducia ciò che guadagni in creatività. Per ogni idea che porti al team indica il primo passo concreto, e proteggi le iniziative già in corso.",
    managerApplication:
      "Dagli problemi mal posti e vincoli difficili: è dove rende di più. Tieni però un archivio delle sue idee e chiedi, per ciascuna, il primo passo concreto. Non assegnargli lunghe fasi esecutive ripetitive: perderà energia e con essa affidabilità. Un limite condiviso di due iniziative nuove per trimestre protegge lui e il resto del team.",
    thrivesIn: ['Product design', 'R&D', 'Strategia', 'Advertising e creatività'],
  },
  {
    slug: 'piacere-di-imparare',
    name: 'Piacere di Imparare',
    domain: 'COGNITIVE',
    tagline: 'Il processo di imparare ti dà energia quanto il risultato.',
    fullDescription:
      "Il tema Piacere di Imparare descrive chi è attratto dal passaggio dall'ignoranza alla competenza. Non è necessariamente il bisogno di diventare esperto: è il processo stesso di imparare a dare soddisfazione.\n\nQueste persone sono le più adatte a contesti che cambiano rapidamente, perché la novità non le minaccia: la trovano stimolante. Sono spesso i primi ad adottare strumenti e metodi nuovi e a diffonderli.\n\nIl tema diventa vantaggio competitivo quando l'apprendimento viene indirizzato: scegliere in cosa diventare davvero bravi moltiplica il valore della curiosità.",
    strengths: [
      'Si aggiorna in autonomia e assorbe rapidamente ambiti nuovi',
      'Affronta il cambiamento con curiosità invece che con ansia',
      'Porta nel gruppo strumenti, metodi e riferimenti nuovi',
      'Ideale per progetti pionieristici e mai affrontati prima',
    ],
    blindSpots: [
      'Può accumulare conoscenza senza tradurla in risultati',
      'Rischia di lasciare i temi appena superata la curva ripida iniziale',
      'La curiosità può disperdere il focus su troppi fronti',
      'Può sottovalutare il valore della ripetizione e della padronanza',
    ],
    actionTips: [
      'Per ogni cosa che impari, definisci dove la applicherai entro 30 giorni',
      'Scegli una competenza all\'anno in cui puntare alla vera padronanza',
      'Insegna ciò che impari: consolida te e crea valore per il gruppo',
      'Valuta i corsi non per interesse ma per rilevanza sui tuoi obiettivi',
    ],
    leaderApplication:
      "Guidi bene i contesti che cambiano, perché la novità non ti minaccia: sei tra i primi ad adottare metodi nuovi e a diffonderli. Il rischio è trascinare il team su troppi fronti e lasciare i temi appena superata la curva ripida. Da leader il valore non è ciò che impari, ma ciò che rendi patrimonio del gruppo: insegna quello che apprendi e scegli in cosa la squadra deve diventare davvero brava.",
    managerApplication:
      "Assegnagli i progetti mai fatti prima: la curva ripida è la sua zona di massima energia. Chiedigli però dove applicherà entro trenta giorni ciò che impara, altrimenti la conoscenza resta scollegata dai risultati. Fallo insegnare al gruppo quello che ha appreso: consolida lui e crea valore per gli altri. Concorda una competenza all'anno in cui puntare alla padronanza.",
    thrivesIn: ['Tecnologia', 'Consulenza', 'Ricerca e sviluppo', 'Ruoli in contesti in forte cambiamento'],
  },
  {
    slug: "riconfigurazione-risorse",
    name: "Riconfigurazione delle Risorse",
    domain: "OPERATIONAL",
    tagline: "Riconfiguri persone e risorse finché l'insieme non funziona.",
    fullDescription:
      "Chi ha questo tema è un direttore d'orchestra della complessità. Di fronte a molte variabili in movimento — persone, scadenze, risorse — non si sente sopraffatto: si sente nel proprio elemento. La domanda ricorrente è «come possiamo disporre i pezzi perché rendano di più?».\n\nA differenza di chi cerca la struttura per ridurre l'incertezza, chi ha questo tema ama proprio riconfigurare: prova una disposizione, la osserva, la cambia. È flessibile per natura, e questa flessibilità è ciò che gli permette di ottimizzare mentre gli altri stanno ancora pianificando.\n\nIl tema matura quando la riconfigurazione smette di essere continua: a un certo punto una disposizione va lasciata stabilizzare, perché anche le persone hanno bisogno di sapere dove stanno.",
    strengths: [
      "Gestisce molte variabili in movimento senza perdere il quadro d'insieme",
      "Trova la combinazione di persone e risorse che rende di più",
      "Si adatta rapidamente quando le condizioni cambiano",
      "Fa emergere efficienze che agli altri sfuggono",
    ],
    blindSpots: [
      "Può riorganizzare così spesso da destabilizzare il gruppo",
      "Rischia di ottimizzare processi che andrebbero eliminati",
      "Fatica a spiegare un metodo che per lui è intuitivo",
      "Può accentrare troppe informazioni su di sé",
    ],
    actionTips: [
      "Dichiara quando una disposizione è definitiva: il gruppo ha bisogno di stabilità",
      "Documenta le tue configurazioni, così non dipendono solo da te",
      "Prima di ottimizzare, chiediti se l'attività serve ancora",
      "Coinvolgi le persone nella riconfigurazione che le riguarda",
    ],
    leaderApplication:
      "Da leader sei bravissimo a mettere le persone giuste nei posti giusti, e a rimescolare quando il contesto cambia: è un vantaggio enorme nelle fasi di crescita o riorganizzazione. Il rischio è che ciò che per te è ottimizzazione, per il team sia instabilità. Ogni riconfigurazione ha un costo umano: annuncia le tue mosse in anticipo, spiega il criterio e dai al gruppo periodi dichiarati di stabilità.",
    managerApplication:
      "Dagli progetti con molte parti mobili e la libertà di ridisporle: è lì che rende di più. Chiedigli però di scrivere il metodo, altrimenti l'organizzazione dipende dalla sua testa. Attenzione a non usarlo come tappabuchi permanente: la sua flessibilità lo rende la persona a cui chiedi sempre l'ultimo favore, e questo nel tempo lo logora.",
    thrivesIn: [
      "Operations e supply chain",
      "Project management complesso",
      "Produzione e cantieri",
      "Coordinamento di team multipli",
    ],
  },
  {
    slug: "principi-non-negoziabili",
    name: "Princìpi Non Negoziabili",
    domain: "OPERATIONAL",
    tagline: "Alcuni princìpi non sono negoziabili, e da lì passa ogni tua scelta.",
    fullDescription:
      "Chi ha il tema Princìpi Non Negoziabili possiede un nucleo di princìpi stabili che non cambiano con le circostanze. Non si tratta necessariamente di religione o ideologia: è la certezza che alcune cose contano più di altre, e che quelle cose orientano il lavoro.\n\nQuesta persona ha bisogno che il proprio lavoro abbia un senso coerente con ciò in cui crede. Quando quel senso c'è, l'impegno è quasi inesauribile; quando manca, nessun incentivo economico lo sostituisce.\n\nNelle organizzazioni il tema funziona come una bussola etica condivisa: rende espliciti i criteri che gli altri danno per scontati. La maturità consiste nel distinguere i princìpi dalle preferenze, e nel non trasformare ogni divergenza in una questione morale.",
    strengths: [
      "Porta coerenza e prevedibilità etica nelle decisioni",
      "Genera fiducia profonda: si sa cosa aspettarsi",
      "Sostiene l'impegno anche quando il compito è ingrato",
      "Rende espliciti i criteri impliciti del gruppo",
    ],
    blindSpots: [
      "Può leggere come questione morale ciò che è solo una preferenza",
      "Rischia di irrigidirsi di fronte a compromessi legittimi",
      "Fatica in contesti percepiti come disallineati dai suoi princìpi",
      "Può giudicare chi ha priorità diverse",
    ],
    actionTips: [
      "Distingui i tuoi tre princìpi non negoziabili dalle molte preferenze",
      "Cerca il lavoro coerente con essi invece di combattere quello che non lo è",
      "Spiega il perché dei tuoi no: rendono la posizione comprensibile",
      "Riconosci che valori diversi dai tuoi possono essere altrettanto solidi",
    ],
    leaderApplication:
      "La tua leadership dà al gruppo qualcosa di raro: una direzione che non cambia con la convenienza del trimestre. Le persone ti seguono perché sanno dove stai. Il rischio è confondere i tuoi princìpi con le regole del gruppo, e far sentire fuori posto chi ha priorità diverse. Rendi espliciti i tre valori su cui l'organizzazione non transige e lascia negoziabile tutto il resto.",
    managerApplication:
      "Collega esplicitamente i suoi compiti al perché: senza quel collegamento perde motivazione anche su attività che sa fare benissimo. Non provare a motivarlo solo con bonus o avanzamenti. Quando gli chiedi un compromesso, spiega il ragionamento: se lo capisce lo accetta, se sembra arbitrario lo vive come tradimento.",
    thrivesIn: [
      "Non profit e cooperazione",
      "Sanità e assistenza",
      "Sostenibilità e compliance",
      "Ruoli con forte componente etica",
    ],
  },
  {
    slug: "uniformita-trattamento",
    name: "Uniformità di Trattamento",
    domain: "OPERATIONAL",
    tagline: "Le stesse regole per tutti: i favoritismi ti sembrano una crepa.",
    fullDescription:
      "Il tema Uniformità di Trattamento nasce dalla convinzione che le persone vadano trattate allo stesso modo, con regole chiare e valide per tutti. Le eccezioni concesse in base alla simpatia o al potere sono, per questa persona, una ferita al patto sociale del gruppo.\n\nÈ un talento che protegge le organizzazioni: dove c'è uniformità di trattamento, i processi sono trasparenti, i criteri dichiarati, le decisioni difendibili. Le persone sanno cosa aspettarsi e questo riduce enormemente il rumore politico.\n\nLa versione matura del tema riconosce che trattamento uguale e trattamento equo non sempre coincidono: persone in situazioni diverse possono aver bisogno di supporti diversi per avere davvero le stesse opportunità.",
    strengths: [
      "Costruisce processi trasparenti e criteri dichiarati",
      "Riduce le dinamiche politiche e i favoritismi",
      "Difende chi ha meno voce nel gruppo",
      "Rende le decisioni difendibili e ripetibili",
    ],
    blindSpots: [
      "Può applicare la regola anche quando il caso richiede giudizio",
      "Rischia di leggere come ingiustizia ogni differenziazione",
      "Fatica con i sistemi meritocratici molto sbilanciati",
      "Può rallentare decisioni che richiederebbero un'eccezione",
    ],
    actionTips: [
      "Distingui uguale da equo: a volte serve un supporto diverso",
      "Definisci in anticipo quali eccezioni sono legittime, e perché",
      "Usa la tua sensibilità per progettare i criteri, non solo per contestarli",
      "Chiedi il contesto prima di concludere che c'è un favoritismo",
    ],
    leaderApplication:
      "Da leader garantisci qualcosa che le persone percepiscono immediatamente: che le regole valgono per tutti, te compreso. È la base della sicurezza psicologica di un team. Il rischio è la rigidità: alcune situazioni chiedono un giudizio, non un'applicazione. Dichiara in anticipo dove il criterio è rigido e dove c'è discrezionalità, e spiega ogni eccezione: un'eccezione motivata non incrina l'equità, una silenziosa sì.",
    managerApplication:
      "Sii assolutamente trasparente sui criteri con cui assegni compiti, valutazioni e riconoscimenti: le differenze non spiegate le vive come ingiustizie e perde fiducia rapidamente. Usalo per progettare processi di valutazione o selezione, dove la sua sensibilità diventa qualità. Quando devi fare un'eccezione, dagliene la ragione prima che la scopra da solo.",
    thrivesIn: [
      "Risorse umane e relazioni sindacali",
      "Compliance e audit",
      "Amministrazione pubblica",
      "Gestione di processi di selezione",
    ],
  },
  {
    slug: "cautela-preventiva",
    name: "Cautela Preventiva",
    domain: "OPERATIONAL",
    tagline: "Prima di muoverti guardi dove metti i piedi.",
    fullDescription:
      "Chi ha il tema Cautela Preventiva affronta le decisioni con cautela deliberata. Non è timore: è la consapevolezza che il mondo è pieno di rischi che gli altri non stanno vedendo, e che vale la pena identificarli prima di impegnarsi.\n\nQuesta persona parla poco e sceglie con cura le parole; anticipa gli ostacoli, valuta gli scenari negativi, riduce l'esposizione. In un gruppo entusiasta è la voce che chiede «e se andasse male?» — la domanda che, posta al momento giusto, salva progetti interi.\n\nIl tema è maturo quando la cautela ha un termine: valutare i rischi serve a decidere meglio, non a rimandare la decisione.",
    strengths: [
      "Identifica rischi che agli altri sfuggono",
      "Prende decisioni ponderate che reggono nel tempo",
      "Riduce l'esposizione dell'organizzazione a errori costosi",
      "Costruisce relazioni professionali solide e durature",
    ],
    blindSpots: [
      "Può rallentare decisioni che richiedono velocità",
      "Rischia di essere percepito come pessimista o poco coraggioso",
      "Fatica nei contesti che premiano l'azione rapida",
      "Può tenere per sé opinioni che sarebbero utili al gruppo",
    ],
    actionTips: [
      "Fissa una scadenza per la valutazione: la cautela deve chiudersi in una scelta",
      "Presenta i rischi insieme alle contromisure, non da soli",
      "Dichiara esplicitamente quando sei favorevole: il tuo sì pesa",
      "Allenati su decisioni piccole e reversibili a decidere in fretta",
    ],
    leaderApplication:
      "Da leader eviti al gruppo gli errori costosi e irreversibili: il tuo intervento vale più di dieci correzioni successive. Il rischio è che la squadra impari a non proporre, perché anticipa la tua obiezione. Rendi visibile anche il tuo assenso: se il team sente solo i tuoi dubbi, smette di portarti idee. E dichiara quali decisioni sono reversibili, perché lì la velocità vale più della cautela.",
    managerApplication:
      "Chiedigli esplicitamente la sua opinione: non la offrirà spontaneamente, e spesso è la più preziosa della stanza. Dagli tempo prima delle riunioni decisionali, non metterlo sotto pressione a caldo. Usalo per fare la pre-mortem dei progetti importanti. Non confondere la sua cautela con mancanza di impegno: quando dice sì, ci ha già pensato più di tutti gli altri.",
    thrivesIn: [
      "Risk management",
      "Legale e contrattualistica",
      "Sicurezza e qualità",
      "Investimenti e finanza",
    ],
  },
  {
    slug: "filtro-direzionale",
    name: "Filtro Direzionale",
    domain: "OPERATIONAL",
    tagline: "Scegli una direzione e ci resti, filtrando tutto il resto.",
    fullDescription:
      "Il tema Filtro Direzionale descrive chi ha bisogno di una destinazione chiara e, una volta trovata, non la perde di vista. Ogni attività viene valutata su una sola domanda: mi avvicina all'obiettivo?\n\nQuesta persona è un filtro naturale contro la dispersione. Nelle riunioni che divagano è quella che riporta il discorso al punto; nei progetti che si allargano è quella che chiede se stiamo ancora facendo la stessa cosa.\n\nLa maturità del tema sta nel saper riconoscere quando la deviazione è rumore e quando invece è un segnale che l'obiettivo va rivisto: la costanza è una virtù finché la direzione è giusta.",
    strengths: [
      "Mantiene la rotta anche quando il contesto distrae",
      "Riporta le discussioni al punto e fa risparmiare tempo",
      "Individua e taglia le attività che non portano all'obiettivo",
      "Porta a termine progetti lunghi senza perdere intensità",
    ],
    blindSpots: [
      "Può ignorare informazioni rilevanti perché fuori tema",
      "Rischia di insistere su un obiettivo che andrebbe rivisto",
      "Può sembrare sordo alle esigenze non collegate al progetto",
      "Fatica quando le priorità cambiano di frequente",
    ],
    actionTips: [
      "Rivedi trimestralmente se l'obiettivo è ancora quello giusto",
      "Concediti finestre dichiarate per esplorare fuori dal perimetro",
      "Spiega il criterio con cui tagli: sembra brusco se resta implicito",
      "Chiedi al gruppo cosa stai eventualmente non vedendo",
    ],
    leaderApplication:
      "La tua leadership regala al gruppo la cosa più scarsa in azienda: una direzione che non cambia ogni settimana. Le persone sanno su cosa saranno valutate. Il rischio è la sordità ai segnali deboli — cambi di mercato, disagi del team — perché non rientrano nell'obiettivo. Istituisci un momento fisso in cui la domanda è «l'obiettivo è ancora giusto?», altrimenti rischi di guidare benissimo verso il posto sbagliato.",
    managerApplication:
      "Dagli un obiettivo chiaro e poi proteggilo dalle interruzioni: rende molto più della media se non lo frammenti su cinque fronti. Quando cambi le priorità, spiega il perché e dagli il tempo di riorientarsi: i cambi improvvisi gli costano più che agli altri. Usalo per riportare al punto i progetti che si stanno allargando.",
    thrivesIn: [
      "Ruoli a obiettivo singolo e misurabile",
      "Project delivery",
      "Vendite con target",
      "Ricerca applicata",
    ],
  },
  {
    slug: "riparazione-guasto",
    name: "Riparazione del Guasto",
    domain: "OPERATIONAL",
    tagline: "Ti accendi davanti a ciò che è rotto: ripararlo ti dà energia.",
    fullDescription:
      "Chi ha questo tema ama i problemi. Dove altri vedono un guasto o una situazione degradata, lui vede qualcosa che può tornare a funzionare, e prova soddisfazione concreta nel riportarlo in vita.\n\nÈ il profilo che si attiva nelle crisi: analizza i sintomi, individua la causa, interviene. Le organizzazioni se ne accorgono soprattutto quando qualcosa va storto, ed è allora che questa persona dà il meglio.\n\nIl rovescio è l'attenzione permanentemente puntata su ciò che non va: con il tempo si rischia di vedere solo difetti, nel lavoro e nelle persone. Il tema è maturo quando la stessa energia viene usata anche per riconoscere e consolidare ciò che funziona.",
    strengths: [
      "Diagnostica rapidamente la causa dei malfunzionamenti",
      "Dà il meglio nelle crisi e nelle situazioni degradate",
      "Recupera progetti, processi e relazioni che altri darebbero per persi",
      "Non si scoraggia davanti a problemi ricorrenti",
    ],
    blindSpots: [
      "Tende a vedere prima i difetti che i risultati",
      "Rischia di riparare all'infinito ciò che andrebbe sostituito",
      "Il feedback può risultare sbilanciato sul negativo",
      "Può cercare problemi anche dove non ce ne sono",
    ],
    actionTips: [
      "Per ogni criticità che segnali, nomina anche una cosa che funziona",
      "Chiediti se conviene riparare o ripartire da zero",
      "Trasforma le riparazioni ricorrenti in una correzione strutturale",
      "Non applicare alle persone lo sguardo diagnostico che usi sui processi",
    ],
    leaderApplication:
      "Sei il leader che le persone vogliono quando qualcosa va male: mantieni la lucidità, isoli la causa e riporti il sistema in funzione. Il rischio è cronico e sottile: se il gruppo ti sente nominare solo ciò che non va, si convince di non fare mai abbastanza. La proporzione conta più dell'accuratezza. Nomina esplicitamente ciò che funziona, altrimenti la tua diagnosi corretta produrrà un team demotivato.",
    managerApplication:
      "Mandalo dove le cose sono rotte: progetti in difficoltà, clienti insoddisfatti, processi che perdono pezzi. È lì che trova energia. Bilancia però il suo feedback quando lo dà ad altri, perché tenderà al negativo. E ogni tanto chiedigli se quello che sta riparando vada invece sostituito: la sua tenacia può tenerlo su un sistema che non conviene più salvare.",
    thrivesIn: [
      "Assistenza tecnica e troubleshooting",
      "Turnaround e gestione crisi",
      "Manutenzione e affidabilità",
      "Medicina e diagnostica",
    ],
  },
  {
    slug: "presa-di-posizione",
    name: "Presa di Posizione",
    domain: "INTERPERSONAL",
    tagline: "Prendi in mano la situazione e dici le cose come stanno.",
    fullDescription:
      "Il tema Presa di Posizione descrive chi ha presenza: quando entra in una stanza, la stanza se ne accorge. Non teme il confronto, non gira intorno alle cose e mette sul tavolo ciò che gli altri pensano ma non dicono.\n\nQuesta persona porta chiarezza. In situazioni ambigue o bloccate assume il controllo, prende posizione e obbliga il gruppo a fare i conti con la realtà. Molti provano sollievo: finalmente qualcuno ha detto la cosa vera.\n\nLa maturità del tema sta nel dosaggio. La stessa forza che sblocca una situazione può schiacciare chi ha meno voce: essere diretti è utile, essere sovrastanti no.",
    strengths: [
      "Mette sul tavolo i temi che gli altri evitano",
      "Prende il controllo nelle situazioni ambigue o bloccate",
      "Non teme il confronto né le conversazioni difficili",
      "Dà al gruppo chiarezza e una posizione da cui partire",
    ],
    blindSpots: [
      "Può intimidire e far tacere i profili più riservati",
      "Rischia di trasformare un confronto in uno scontro",
      "Può decidere da solo dove servirebbe coinvolgimento",
      "Sottovaluta l'impatto emotivo della propria intensità",
    ],
    actionTips: [
      "Chiedi il parere degli altri prima di dichiarare il tuo",
      "Distingui i temi su cui vuoi decidere da quelli su cui vuoi discutere",
      "Abbassa il volume di un gradino: perdi poco, guadagni ascolto",
      "Verifica come è arrivato il tuo messaggio, non solo se era corretto",
    ],
    leaderApplication:
      "Da leader dai al gruppo una cosa che vale moltissimo nei momenti confusi: una posizione chiara e qualcuno che se ne assume la responsabilità. Il rischio è che la tua presenza riempia tutto lo spazio disponibile e che il team smetta di portarti dissenso — proprio l'informazione che ti serve. Parla per ultimo nelle riunioni decisionali e chiedi esplicitamente a chi non ha parlato: il tuo peso rende il silenzio degli altri molto probabile.",
    managerApplication:
      "Dagli responsabilità visibili e situazioni difficili da sbloccare: è lì che rende. Sii diretto con lui, perché apprezza la franchezza e diffida dei giri di parole. Lavora però sul suo impatto: chiedigli feedback specifico su come viene percepito, perché tende a sottovalutarlo. Non metterlo a guidare persone molto riservate senza averlo prima allenato ad ascoltare.",
    thrivesIn: [
      "Leadership in situazioni di crisi",
      "Negoziazione",
      "Vendite complesse",
      "Ruoli imprenditoriali",
    ],
  },
  {
    slug: "confronto-con-il-risultato",
    name: "Confronto con il Risultato Altrui",
    domain: "INTERPERSONAL",
    tagline: "Misuri i tuoi risultati su quelli degli altri, e vuoi vincere.",
    fullDescription:
      "Chi ha il tema Confronto con il Risultato Altrui ha bisogno di un termine di paragone. Il risultato assoluto dice poco: conta come si posiziona rispetto agli altri. Vincere non è un capriccio, è ciò che dà senso allo sforzo.\n\nQuesta persona alza il livello di tutti. La sua presenza rende visibile lo standard e spinge il gruppo a non accontentarsi. Nei contesti misurabili — vendite, sport, mercati — è un motore straordinario.\n\nIl tema è maturo quando la competizione è indirizzata all'esterno o al proprio risultato precedente, invece che ai colleghi: la stessa energia può moltiplicare un team o dividerlo.",
    strengths: [
      "Alza lo standard di prestazione dell'intero gruppo",
      "Trova energia nei contesti misurabili e comparativi",
      "Non si accontenta di un risultato mediocre",
      "Rende visibile il livello a cui si può arrivare",
    ],
    blindSpots: [
      "Può trasformare i colleghi in avversari",
      "Vive male le sconfitte, anche quelle irrilevanti",
      "Rischia di evitare le sfide in cui non è certo di vincere",
      "Può sottovalutare i risultati non misurabili",
    ],
    actionTips: [
      "Indirizza il confronto verso l'esterno o verso il tuo risultato precedente",
      "Definisci cosa significa vincere anche quando non c'è una classifica",
      "Celebra i risultati altrui a voce alta: costa poco e cambia il clima",
      "Scegli qualche sfida in cui sei sicuro di non essere il migliore",
    ],
    leaderApplication:
      "Come leader porti il gruppo a non accontentarsi: rendi visibile lo standard e lo alzi. Il pericolo è farlo diventare un confronto interno, che trasforma i colleghi in avversari e distrugge la collaborazione. Indirizza la competizione verso il mercato, il benchmark, il risultato dello scorso trimestre. E fai attenzione a come reagisci quando perdi: il tuo team lo osserva molto più di quanto immagini.",
    managerApplication:
      "Dagli classifiche, benchmark e obiettivi comparabili: senza un metro di paragone perde carburante. Attenzione a come strutturi i premi, perché un incentivo a somma zero fra colleghi con lui diventa esplosivo. Aiutalo a gestire le sconfitte: tenderà a evitare le sfide dove non è sicuro di vincere, e questo nel tempo gli restringe il campo di crescita.",
    thrivesIn: [
      "Vendite e business development",
      "Trading e mercati",
      "Sport e performance",
      "Contesti con obiettivi comparabili",
    ],
  },
  {
    slug: "innalzamento-eccellenza",
    name: "Innalzamento dell'Eccellenza",
    domain: "INTERPERSONAL",
    tagline: "Ti interessa portare il buono a eccellente, non il mediocre a sufficiente.",
    fullDescription:
      "Chi ha questo tema è affascinato dalla qualità. Non gli interessa correggere ciò che è scadente: gli interessa prendere qualcosa che già funziona e portarlo a un livello superiore. La differenza fra buono ed eccellente, per lui, non è un dettaglio.\n\nLo stesso sguardo si applica alle persone: individua i punti di forza altrui e spinge perché vengano usati, invece di consumare energie a colmare le lacune. È l'incarnazione dell'approccio dei punti di forza.\n\nIl tema è maturo quando accetta che non tutto merita l'eccellenza: alcune cose devono solo essere fatte, e il tempo dedicato a rifinirle è tolto a ciò che conta davvero.",
    strengths: [
      "Porta a livelli di qualità che gli altri non immaginavano possibili",
      "Riconosce e valorizza i punti di forza delle persone",
      "Non si accontenta del sufficiente su ciò che conta",
      "Trasforma prodotti e processi buoni in eccellenti",
    ],
    blindSpots: [
      "Può rifinire all'infinito e non chiudere",
      "Rischia di trascurare ciò che va semplicemente sistemato",
      "Può risultare insoddisfatto e trasmettere insoddisfazione",
      "Fatica a delegare ciò a cui tiene molto",
    ],
    actionTips: [
      "Decidi in anticipo cosa merita eccellenza e cosa solo di essere fatto",
      "Datti un criterio di chiusura: fatto è meglio di perfetto sull'80% delle cose",
      "Dì a voce alta cosa è già ottimo, non solo cosa si può migliorare",
      "Delega ciò che non deve essere eccellente",
    ],
    leaderApplication:
      "Il tuo modo di guidare valorizza le persone per ciò che sanno fare meglio, invece di consumarle sulle lacune: è la forma di leadership che produce più energia in assoluto. Il rischio è che il tuo standard non venga mai raggiunto e che il team si senta cronicamente insufficiente. Dichiara esplicitamente quando una cosa è finita, e quando invece punti all'eccellenza: senza quella distinzione il gruppo non sa mai quando può fermarsi.",
    managerApplication:
      "Affidagli ciò che è già buono e deve diventare eccellente, non ciò che è rotto: sui problemi da riparare si annoia e rende poco. Usalo per far crescere i colleghi sui loro punti di forza, è un mentore naturale. Aiutalo a chiudere: concorda in anticipo il criterio di completamento, altrimenti rifinisce oltre il punto in cui il miglioramento conta ancora per qualcuno.",
    thrivesIn: [
      "Product management",
      "Design e qualità",
      "Coaching e sviluppo persone",
      "Consulenza specialistica",
    ],
  },
  {
    slug: "impronta-riconoscibile",
    name: "Impronta Riconoscibile",
    domain: "INTERPERSONAL",
    tagline: "Vuoi che il tuo contributo lasci un segno visibile.",
    fullDescription:
      "Il tema Impronta Riconoscibile descrive il bisogno di contare, di fare qualcosa che venga notato e ricordato. Non è vanità: è il motore che porta questa persona a scegliere progetti ambiziosi e a lavorare perché abbiano un impatto reale.\n\nChi ha questo tema si misura su traguardi importanti e cerca l'associazione con persone e organizzazioni credibili. Questa aspirazione, usata bene, produce risultati che nessun obiettivo modesto avrebbe generato.\n\nLa maturità del tema sta nel legare la visibilità al contributo reale: essere riconosciuti per qualcosa che è servito davvero, invece che semplicemente essere visti.",
    strengths: [
      "Punta a obiettivi ambiziosi e li rende possibili",
      "Lavora con intensità sui progetti ad alta visibilità",
      "Alza le aspettative su cosa il gruppo può raggiungere",
      "Costruisce credibilità e reputazione per sé e per il team",
    ],
    blindSpots: [
      "Può scegliere ciò che si vede invece di ciò che serve",
      "Rischia di prendersi il merito del lavoro altrui",
      "Vive male i ruoli di supporto poco visibili",
      "Può sopravvalutare l'importanza dell'immagine esterna",
    ],
    actionTips: [
      "Chiediti se stai scegliendo il progetto giusto o quello più visibile",
      "Attribuisci pubblicamente il merito agli altri: aumenta la tua credibilità",
      "Accetta un incarico invisibile all'anno: ti tiene onesto",
      "Lega il riconoscimento che cerchi a un impatto misurabile",
    ],
    leaderApplication:
      "Da leader porti il gruppo su traguardi che senza di te non avrebbe nemmeno considerato: l'ambizione è contagiosa e apre porte. Il rischio è che il team percepisca che la visibilità va sempre in una direzione sola. La contromisura è semplice e potentissima: attribuisci pubblicamente e per nome i meriti. Un leader riconosciuto per aver fatto crescere altri ha una reputazione più solida di uno riconosciuto per i propri risultati.",
    managerApplication:
      "Dagli progetti che contano e visibilità reale: presentare in comitato, rappresentare il team, firmare un risultato. È una leva motivazionale più forte di quasi qualsiasi altra. Sii però esplicito su come si attribuiscono i meriti nel tuo gruppo, e verifica che il contributo dei colleghi meno visibili venga riconosciuto. Non parcheggiarlo a lungo in ruoli di pura esecuzione.",
    thrivesIn: [
      "Ruoli di rappresentanza",
      "Imprenditoria",
      "Comunicazione e advocacy",
      "Progetti ad alta visibilità",
    ],
  },
  {
    slug: "apertura-contatto-nuovo",
    name: "Apertura al Contatto Nuovo",
    domain: "INTERPERSONAL",
    tagline: "Rompi il ghiaccio con chiunque, e ti diverte farlo.",
    fullDescription:
      "Chi ha il tema Apertura al Contatto Nuovo trova naturale e piacevole entrare in contatto con persone che non conosce. Una stanza piena di sconosciuti non è una prova da superare: è un'opportunità.\n\nQuesta persona costruisce reti ampie con una facilità che agli altri sembra magia. Conosce qualcuno in ogni funzione, e quella rete diventa un patrimonio dell'organizzazione: le informazioni circolano, le porte si aprono, le collaborazioni nascono.\n\nIl tema matura quando alla larghezza si aggiunge la profondità: le reti ampie aprono le porte, ma sono le relazioni solide a farci passare qualcosa di importante.",
    strengths: [
      "Costruisce reti ampie in tempi brevissimi",
      "Mette a proprio agio le persone nuove",
      "Apre porte e crea connessioni fra mondi separati",
      "Rappresenta l'organizzazione verso l'esterno con naturalezza",
    ],
    blindSpots: [
      "Può privilegiare la quantità dei contatti sulla profondità",
      "Rischia di essere percepito come superficiale o interessato",
      "Fatica nei lavori isolati e prolungati",
      "Può disperdere energia su troppe relazioni",
    ],
    actionTips: [
      "Scegli dieci relazioni all'anno da coltivare in profondità",
      "Dopo un evento, fai seguito con poche persone invece che con tutte",
      "Usa la tua rete per presentare gli altri, non solo te stesso",
      "Proteggi blocchi di lavoro individuale: ti servono più di quanto pensi",
    ],
    leaderApplication:
      "Da leader sei la porta d'ingresso del tuo gruppo verso il resto dell'organizzazione e verso l'esterno: le collaborazioni che servono al team spesso passano dalla tua rete. Attenzione a due cose: che la rete serva al gruppo e non solo a te, e che la facilità con cui entri in relazione non venga scambiata per superficialità nelle conversazioni che richiedono profondità, come un feedback difficile o un colloquio di crescita.",
    managerApplication:
      "Mettilo in prima linea: primi contatti, eventi, onboarding dei nuovi, relazioni con clienti freddi. Ottiene in un pomeriggio ciò che ad altri costa settimane. Chiedigli però di trasferire i contatti al CRM e al team, altrimenti la rete resta sua e non dell'organizzazione. Non isolarlo in ruoli prolungatamente solitari: perde energia rapidamente.",
    thrivesIn: [
      "Sviluppo commerciale",
      "Relazioni pubbliche e partnership",
      "Recruiting",
      "Eventi e community",
    ],
  },
  {
    slug: "aderenza-al-presente",
    name: "Aderenza al Presente",
    domain: "SUPPORTIVE",
    tagline: "Vivi nel presente e ti muovi con quello che arriva.",
    fullDescription:
      "Chi ha il tema Aderenza al Presente considera il futuro qualcosa che si costruisce un momento alla volta. Non subisce il cambiamento: lo asseconda. Un piano che salta non è un fallimento, è semplicemente la situazione nuova da cui ripartire.\n\nQuesta flessibilità rende la persona preziosa nei contesti imprevedibili: mentre gli altri sono ancora fermi allo shock del cambio di programma, lei sta già lavorando alla nuova versione.\n\nIl tema è maturo quando l'apertura al presente non diventa assenza di direzione: adattarsi bene richiede comunque di sapere dove si vuole arrivare, altrimenti si finisce dove porta la corrente.",
    strengths: [
      "Resta produttivo quando i piani cambiano all'improvviso",
      "Abbassa l'ansia del gruppo nelle situazioni incerte",
      "Gestisce bene emergenze e priorità mobili",
      "Accoglie richieste dell'ultimo minuto senza irrigidirsi",
    ],
    blindSpots: [
      "Può faticare con la pianificazione a lungo termine",
      "Rischia di reagire invece che scegliere",
      "Può sembrare poco affidabile a chi ha bisogno di struttura",
      "Rimanda ciò che non è urgente adesso",
    ],
    actionTips: [
      "Fissa pochi obiettivi lunghi e verificali ogni mese",
      "Distingui ciò che è urgente da ciò che è solo recente",
      "Comunica a chi ha bisogno di struttura come stai gestendo",
      "Proteggi tempo per il non urgente, o non lo farai mai",
    ],
    leaderApplication:
      "Da leader tieni il gruppo calmo quando salta tutto: la tua reazione al caos è ciò che il team imita. Nei momenti di crisi è un dono enorme. Il rischio è che la squadra non percepisca mai una direzione stabile, perché tu stesso ne senti poco il bisogno. Dichiara pochi punti fermi che non cambiano — la meta del trimestre, i criteri di priorità — e lascia mobile tutto il resto.",
    managerApplication:
      "Usalo dove il contesto è imprevedibile: emergenze, priorità mobili, clienti che cambiano idea. Non punirlo per la scarsa pianificazione a lungo termine, ma affiancagli qualcuno strutturato sui progetti lunghi. Aiutalo a proteggere il lavoro importante ma non urgente, altrimenti verrà sempre schiacciato dall'ultima richiesta arrivata.",
    thrivesIn: [
      "Pronto intervento e customer care",
      "Giornalismo e produzione",
      "Startup in fase iniziale",
      "Ruoli con priorità mutevoli",
    ],
  },
  {
    slug: "percezione-dei-legami",
    name: "Percezione dei Legami",
    domain: "SUPPORTIVE",
    tagline: "Vedi i legami: nulla ti sembra davvero isolato.",
    fullDescription:
      "Il tema Percezione dei Legami descrive la convinzione profonda che le cose siano collegate. Ogni evento fa parte di un quadro più ampio, ogni scelta ha conseguenze che vanno oltre il perimetro immediato, ogni persona è parte di qualcosa di più grande.\n\nNelle organizzazioni questa persona è un ponte: collega funzioni che si ignorano, ricorda le conseguenze a valle delle decisioni, aiuta il gruppo a vedere il senso complessivo del proprio lavoro.\n\nIl tema è maturo quando la visione d'insieme non impedisce di agire sul particolare: vedere tutti i collegamenti è utile solo se poi si sceglie dove intervenire.",
    strengths: [
      "Collega funzioni e persone che altrimenti resterebbero separate",
      "Anticipa le conseguenze a valle delle decisioni",
      "Dà senso e prospettiva nei momenti difficili",
      "Considera l'impatto ampio, non solo il risultato immediato",
    ],
    blindSpots: [
      "Può perdersi nel quadro generale e non agire sul dettaglio",
      "Rischia di attribuire significato a coincidenze",
      "Fatica nei contesti puramente transazionali",
      "Può rallentare decisioni con considerazioni troppo ampie",
    ],
    actionTips: [
      "Traduci la visione d'insieme in un'azione concreta questa settimana",
      "Distingui i collegamenti reali da quelli suggestivi",
      "Usa il tuo sguardo per fare da ponte, non solo per commentare",
      "Dichiara qual è l'impatto ampio che ti preoccupa, in modo verificabile",
    ],
    leaderApplication:
      "La tua leadership dà al gruppo qualcosa che quasi nessuno fornisce: il senso di far parte di qualcosa che va oltre il compito. È uno dei più potenti motori di motivazione a lungo termine. Il rischio è restare sul piano del significato senza atterrare sulle decisioni concrete. Chiudi ogni discorso sul quadro d'insieme con la conseguenza operativa: cosa cambia, da lunedì, per chi ti ascolta.",
    managerApplication:
      "Spiegagli sempre dove si colloca il suo lavoro nel quadro complessivo: senza quel collegamento perde motivazione anche su compiti che padroneggia. Usalo come ponte fra funzioni che non si parlano, e chiedigli di valutare le conseguenze a valle prima di decisioni importanti. Aiutalo però a chiudere sul concreto: tenderà ad allargare quando servirebbe scegliere.",
    thrivesIn: [
      "Ruoli di raccordo fra funzioni",
      "Sostenibilità e impatto sociale",
      "Change management",
      "Cura e accompagnamento",
    ],
  },
  {
    slug: "allargamento-del-gruppo",
    name: "Allargamento del Gruppo",
    domain: "SUPPORTIVE",
    tagline: "Cerchi chi è rimasto fuori e lo fai entrare.",
    fullDescription:
      "Chi ha il tema Allargamento del Gruppo nota immediatamente chi è ai margini: la persona nuova che non parla, il collega escluso dalla catena di comunicazione, il gruppo che si è chiuso. E prova un disagio autentico finché non lo ha fatto entrare.\n\nÈ un talento che allarga il cerchio. Le organizzazioni con persone così perdono meno idee, perché anche chi non ha il coraggio o il ruolo per parlare trova comunque uno spazio.\n\nLa maturità del tema consiste nel distinguere l'inclusione dalla diluizione: coinvolgere tutti in tutto rallenta le decisioni. L'obiettivo è che nessuno resti escluso da ciò che lo riguarda.",
    strengths: [
      "Nota subito chi è ai margini e lo coinvolge",
      "Fa emergere idee che sarebbero rimaste inespresse",
      "Accoglie i nuovi arrivati e accorcia il loro inserimento",
      "Crea gruppi in cui le persone si sentono legittimate a parlare",
    ],
    blindSpots: [
      "Può coinvolgere troppe persone e rallentare le decisioni",
      "Rischia di evitare le scelte che escludono qualcuno",
      "Può accogliere anche chi danneggia il gruppo",
      "Fatica a gestire l'uscita di una persona dal team",
    ],
    actionTips: [
      "Distingui chi deve decidere da chi deve essere informato",
      "Coinvolgi sempre chi è toccato dalla decisione, non necessariamente tutti",
      "Accogliere non significa tollerare tutto: fissa i limiti",
      "Chiedi in riunione a chi non ha parlato: è il tuo intervento più efficace",
    ],
    leaderApplication:
      "Da leader crei gruppi in cui le persone parlano davvero, e questo significa che le informazioni scomode arrivano fino a te: è un vantaggio competitivo che pochi ottengono. Il rischio è confondere l'inclusione con il coinvolgimento di tutti in tutto, che rallenta e diluisce la responsabilità. Dichiara per ogni decisione chi decide, chi è consultato e chi è informato: si può essere inclusivi e rapidi contemporaneamente.",
    managerApplication:
      "Affidagli l'inserimento dei nuovi e la facilitazione dei gruppi: accorcia i tempi di integrazione in modo misurabile. Chiedigli chi nel team non sta avendo spazio, perché lo sa prima di te. Aiutalo però con le decisioni che escludono qualcuno — una mancata conferma, un'uscita — perché le vive con difficoltà sproporzionata e tenderà a rimandarle.",
    thrivesIn: [
      "Diversity e inclusione",
      "Onboarding e community",
      "Facilitazione di gruppi",
      "Scuola e formazione",
    ],
  },
  {
    slug: "differenziazione-persona",
    name: "Differenziazione della Persona",
    domain: "SUPPORTIVE",
    tagline: "Non esistono le persone in generale: vedi ciascuno per quello che è.",
    fullDescription:
      "Il tema Differenziazione della Persona descrive chi è affascinato dalle differenze fra le persone. Dove altri vedono categorie e ruoli, questa persona vede caratteri unici, e li coglie con precisione notevole: cosa motiva ciascuno, come impara, cosa lo mette a disagio.\n\nÈ il talento che rende possibile costruire squadre davvero complementari, perché sa quali persone si incastrano bene e perché. È anche il talento che fa sentire visti: chi lavora con lui percepisce di essere trattato come individuo, non come funzione.\n\nLa maturità sta nel non trasformare la personalizzazione in trattamento arbitrario: adattare il modo, mantenendo criteri chiari e uguali per tutti.",
    strengths: [
      "Coglie con precisione cosa motiva ciascuna persona",
      "Costruisce squadre complementari e ben incastrate",
      "Adatta comunicazione e delega al singolo interlocutore",
      "Fa sentire le persone viste e comprese",
    ],
    blindSpots: [
      "Può personalizzare al punto da sembrare incoerente",
      "Rischia di sottovalutare le regole generali",
      "Fatica a gestire gruppi molto numerosi",
      "Può giustificare troppo le peculiarità di ciascuno",
    ],
    actionTips: [
      "Adatta il modo, non i criteri: quelli restano uguali per tutti",
      "Spiega perché tratti situazioni simili in modi diversi",
      "Scrivi ciò che osservi sulle persone: la memoria non basta",
      "Usa la tua lettura per comporre le squadre, non solo per gestirle",
    ],
    leaderApplication:
      "Il tuo modo di guidare fa una differenza che le persone ricordano per anni: vengono trattate come individui, con la delega e il linguaggio giusti per loro. È la leva più forte che esista su motivazione e retention. Il rischio, visto da fuori, è l'incoerenza: se adatti il modo ma non spieghi il criterio, il gruppo legge favoritismi. Rendi pubblici i criteri e personalizza il resto.",
    managerApplication:
      "Chiedigli come lavorare al meglio con ciascun collega: la sua lettura è quasi sempre accurata e ti fa risparmiare mesi. Usalo nella composizione delle squadre e nell'assegnazione dei compiti. Attenzione però a non caricarlo di gruppi troppo numerosi: il suo talento richiede attenzione individuale e sopra una certa soglia si spegne.",
    thrivesIn: [
      "Gestione di team",
      "Coaching e counseling",
      "Recruiting e assessment",
      "Vendite consulenziali",
    ],
  },
  {
    slug: "alleggerimento-clima",
    name: "Alleggerimento del Clima",
    domain: "SUPPORTIVE",
    tagline: "Porti energia: con te intorno lavorare pesa meno.",
    fullDescription:
      "Chi ha il tema Alleggerimento del Clima ha un entusiasmo contagioso. Non è ingenuità né negazione dei problemi: è la capacità di trovare, in ogni situazione, l'elemento che dà energia, e di trasmetterlo agli altri.\n\nQuesta persona cambia il clima di un gruppo. Nei progetti lunghi e faticosi è ciò che impedisce alla stanchezza di diventare rassegnazione; nelle giornate storte è ciò che rimette in moto.\n\nIl tema è maturo quando l'ottimismo non impedisce di guardare in faccia i problemi: l'energia serve ad affrontarli, non a evitare di nominarli.",
    strengths: [
      "Solleva il clima e l'energia dell'intero gruppo",
      "Sostiene la motivazione nei progetti lunghi e faticosi",
      "Riconosce e celebra i progressi degli altri",
      "Rende sostenibili i periodi di carico elevato",
    ],
    blindSpots: [
      "Può minimizzare problemi che andrebbero affrontati",
      "Rischia di essere percepito come poco realistico",
      "Fatica nei contesti cinici o molto formali",
      "Può forzare l'entusiasmo quando non è il momento",
    ],
    actionTips: [
      "Nomina il problema prima di offrire l'incoraggiamento",
      "Lascia spazio a chi sta male senza correggerne subito l'umore",
      "Lega l'entusiasmo a un fatto concreto: diventa credibile",
      "Chiediti se stai sollevando il clima o evitando una conversazione",
    ],
    leaderApplication:
      "Da leader determini il clima più di quanto immagini: il tuo stato d'animo è la variabile che il gruppo legge ogni mattina, e la tua energia rende sostenibili i periodi duri. Il rischio è che l'ottimismo costante impedisca alle cattive notizie di arrivarti, perché nessuno vuole spegnere l'entusiasmo. Nomina tu per primo i problemi: un leader positivo che dice chiaramente cosa non va viene creduto due volte.",
    managerApplication:
      "Mettilo dove il clima conta: team sotto pressione, front line, progetti lunghi. Il suo effetto sul gruppo è misurabile. Chiedigli però esplicitamente cosa non funziona, perché tenderà a smussare. E non chiedergli entusiasmo nei momenti in cui il gruppo ha bisogno di essere ascoltato: aiutalo a distinguere quando serve energia e quando serve silenzio.",
    thrivesIn: [
      "Vendite e customer experience",
      "Formazione e animazione",
      "Team in fase di alta pressione",
      "Servizi alla persona",
    ],
  },
  {
    slug: "profondita-dei-legami",
    name: "Profondità dei Pochi Legami",
    domain: "SUPPORTIVE",
    tagline: "Poche persone, conosciute davvero: è lì che dai il meglio.",
    fullDescription:
      "Il tema Profondità dei Pochi Legami descrive chi trae profonda soddisfazione dai legami stretti. Non gli interessa conoscere molte persone: gli interessa conoscerne alcune davvero, fino a poterci contare senza riserve.\n\nQueste relazioni sono un'infrastruttura di lavoro. Con le persone di cui si fida questa persona rende molto più della media, perché non deve spendere energia in cautela e negoziazione continua.\n\nLa maturità del tema sta nell'apertura: la profondità è una forza, ma un gruppo chiuso esclude, e le persone nuove hanno bisogno di un ponte per entrare nel cerchio.",
    strengths: [
      "Costruisce relazioni di lavoro profonde e durature",
      "È leale e affidabile con chi entra nel suo cerchio",
      "Rende molto di più nei team stabili e coesi",
      "Sostiene i colleghi nei momenti difficili senza clamore",
    ],
    blindSpots: [
      "Può apparire chiuso verso chi è nuovo",
      "Rischia di formare sottogruppi involontariamente esclusivi",
      "Fatica nei contesti con turnover elevato",
      "Può confondere il rapporto personale con il merito professionale",
    ],
    actionTips: [
      "Fai un passo verso una persona nuova ogni mese",
      "Distingui la lealtà personale dalla valutazione professionale",
      "Rendi espliciti i tuoi legami: da fuori possono sembrare cerchie chiuse",
      "Usa la fiducia che hai costruito per far entrare qualcun altro",
    ],
    leaderApplication:
      "Da leader costruisci una fiducia che regge le crisi: le persone del tuo cerchio ti seguono ovunque e ti dicono la verità. È un capitale raro. Il rischio, visto da fuori, è il cerchio ristretto: chi è nuovo o distante percepisce un accesso diseguale a te. Struttura momenti individuali con tutti, non solo con chi ti è vicino, e attenzione a non far coincidere lealtà personale e valutazione professionale.",
    managerApplication:
      "Dagli continuità: cambiargli team o interlocutori di frequente gli costa più che ad altri, perché ogni volta ricostruisce da zero. Affidagli i clienti chiave e le relazioni di lungo periodo. Aiutalo a integrare i nuovi arrivati assegnandogli esplicitamente il ruolo di riferimento, altrimenti resterà nel suo gruppo consolidato senza volerlo escludere nessuno.",
    thrivesIn: [
      "Team stabili e di lungo periodo",
      "Gestione clienti chiave",
      "Ruoli di fiducia e riservatezza",
      "Professioni di cura",
    ],
  },
  {
    slug: "ricorso-al-precedente",
    name: "Ricorso al Precedente",
    domain: "COGNITIVE",
    tagline: "Per capire il presente hai bisogno di sapere com'è cominciato.",
    fullDescription:
      "Chi ha il tema Ricorso al Precedente guarda indietro per comprendere. Una decisione, un processo o un conflitto acquistano senso quando si conosce la loro origine: chi lo ha voluto, in risposta a cosa, con quali alternative scartate.\n\nQuesta persona è la memoria dell'organizzazione. Impedisce di ripetere errori già commessi e di smontare soluzioni che rispondevano a un problema ancora presente, solo perché nessuno ricorda più quale fosse.\n\nIl tema è maturo quando la storia informa la decisione senza vincolarla: sapere perché si è sempre fatto così è utile soprattutto per decidere consapevolmente di smettere.",
    strengths: [
      "Ricostruisce l'origine di processi e decisioni",
      "Evita che il gruppo ripeta errori già commessi",
      "Accorcia l'inserimento dei nuovi spiegando il perché delle cose",
      "Coglie i pattern ricorrenti nella storia dell'organizzazione",
    ],
    blindSpots: [
      "Può usare il precedente come argomento contro il cambiamento",
      "Rischia di rallentare le decisioni con troppa ricostruzione",
      "Fatica nei contesti senza storia, come le nuove iniziative",
      "Può attribuire al passato più peso di quanto ne abbia",
    ],
    actionTips: [
      "Concludi ogni ricostruzione con cosa suggerisce di fare adesso",
      "Distingui «si è sempre fatto così» da «ci sono ragioni valide»",
      "Scrivi la storia dei progetti: diventa patrimonio, non memoria personale",
      "Nei contesti nuovi, cerca analogie invece di precedenti diretti",
    ],
    leaderApplication:
      "Come leader eviti al gruppo il costo più stupido che esista: rifare errori già fatti, o smontare soluzioni che rispondevano a un problema reale. La tua memoria è un asset. Il rischio è che il precedente diventi un veto implicito e che il gruppo smetta di proporre cose nuove. Racconta la storia e poi dichiara esplicitamente che la decisione è aperta: senza quella frase il tuo racconto suona come una risposta.",
    managerApplication:
      "Chiedigli di ricostruire il perché prima di cambiare un processo consolidato: ti eviterà di rimuovere qualcosa che serviva davvero. Usalo per l'onboarding, perché spiega il contesto meglio di qualsiasi manuale. Chiedigli però di chiudere sempre con una raccomandazione operativa, altrimenti la ricostruzione resta interessante ma inutilizzabile.",
    thrivesIn: [
      "Analisi organizzativa",
      "Ruoli di continuità e knowledge management",
      "Ricerca e archivistica",
      "Consulenza su processi consolidati",
    ],
  },
  {
    slug: "nitidezza-del-possibile",
    name: "Nitidezza del Possibile",
    domain: "COGNITIVE",
    tagline: "Vedi con nitidezza quello che potrebbe essere, e ti tira in avanti.",
    fullDescription:
      "Il tema Nitidezza del Possibile descrive chi è attratto dal domani. Immagina con dettaglio come potrebbero essere le cose fra tre o dieci anni, e quella immagine ha su di lui un effetto energizzante concreto.\n\nQuando questa persona descrive il futuro, gli altri lo vedono: è un talento che crea allineamento e speranza, e che dà al gruppo una ragione per sopportare la fatica del presente.\n\nIl tema è maturo quando la visione si aggancia al presente con passi concreti: senza quel ponte, l'immagine ispira per una settimana e poi si trasforma in frustrazione.",
    strengths: [
      "Immagina scenari futuri con dettaglio e concretezza",
      "Ispira e allinea il gruppo attorno a una direzione",
      "Coglie tendenze e opportunità prima degli altri",
      "Dà senso alla fatica del presente",
    ],
    blindSpots: [
      "Può trascurare i problemi operativi di oggi",
      "Rischia di promettere futuri che l'organizzazione non può reggere",
      "Si scoraggia quando la realtà avanza lentamente",
      "Può cambiare visione prima che la precedente sia realizzata",
    ],
    actionTips: [
      "Traduci ogni visione in tre passi verificabili nei prossimi 90 giorni",
      "Affiancati a un profilo esecutivo: la coppia visione più esecuzione è rara",
      "Verifica la fattibilità prima di condividere l'immagine",
      "Torna periodicamente sulla stessa visione invece di sostituirla",
    ],
    leaderApplication:
      "È forse il talento più direttamente collegato alla leadership: le persone ti seguono perché vedono dove state andando, e questo dà senso alla fatica quotidiana. Il rischio è la distanza fra l'immagine e il lunedì mattina. Ogni volta che descrivi il futuro, dichiara i tre passi dei prossimi novanta giorni. E non cambiare visione troppo spesso: il gruppo ha bisogno di tempo per crederci prima di poterla realizzare.",
    managerApplication:
      "Coinvolgilo nelle riflessioni di prospettiva e chiedigli scenari: vede tendenze prima degli altri. Ancoralo però al presente chiedendogli sempre il primo passo concreto e la verifica di fattibilità. Attenzione a non lasciarlo troppo a lungo in ruoli puramente operativi senza orizzonte: si spegne più rapidamente di quasi ogni altro profilo.",
    thrivesIn: [
      "Strategia e innovazione",
      "Imprenditoria",
      "Product vision",
      "Comunicazione e leadership",
    ],
  },
  {
    slug: "accumulo-informativo",
    name: "Accumulo Informativo",
    domain: "COGNITIVE",
    tagline: "Accumuli informazioni perché prima o poi serviranno.",
    fullDescription:
      "Chi ha il tema Accumulo Informativo è un collezionista di informazioni. Articoli, dati, strumenti, contatti, esempi: tutto viene archiviato perché un giorno potrebbe tornare utile, e sorprendentemente spesso torna utile davvero.\n\nQuesta persona è la risorsa a cui il gruppo si rivolge quando serve un riferimento, un precedente, un dato. La sua curiosità produce un patrimonio collettivo: se lo condivide.\n\nIl tema è maturo quando la raccolta diventa curatela: selezionare, organizzare e rendere accessibile ciò che si è accumulato vale molto più che accumulare ancora.",
    strengths: [
      "Dispone di riferimenti e dati che agli altri mancano",
      "Sostiene le decisioni con esempi e precedenti concreti",
      "Esplora ampiamente prima di restringere il campo",
      "Diventa il punto di riferimento informativo del gruppo",
    ],
    blindSpots: [
      "Può accumulare senza mai usare ciò che ha raccolto",
      "Rischia di rimandare la decisione in cerca di altre informazioni",
      "Può sommergere gli interlocutori di materiale",
      "Fatica a buttare via ciò che non serve più",
    ],
    actionTips: [
      "Per ogni raccolta, definisci a quale decisione serve",
      "Cura e condividi: il valore nasce quando gli altri possono usarla",
      "Consegna la sintesi, non l'archivio",
      "Fissa un limite di tempo alla ricerca prima di decidere",
    ],
    leaderApplication:
      "Da leader porti al tavolo ciò che agli altri manca: precedenti, dati, esempi di chi ha già affrontato il problema. Le decisioni del gruppo diventano più informate. Il rischio è duplice: rimandare in attesa di sapere di più, e sommergere il team di materiale invece di indicare la direzione. Consegna la sintesi e la raccomandazione, tenendo l'archivio a disposizione di chi vuole approfondire.",
    managerApplication:
      "Usalo come antenna: chiedigli di monitorare un ambito e di riferire periodicamente. Chiedi però sempre la sintesi in una pagina, non il materiale grezzo. Dagli scadenze esplicite per la fase di ricerca, altrimenti si allunga indefinitamente. E valorizza pubblicamente quando il suo archivio salva il gruppo: succede più spesso di quanto venga riconosciuto.",
    thrivesIn: [
      "Ricerca e documentazione",
      "Analisi di mercato",
      "Knowledge management",
      "Consulenza e supporto specialistico",
    ],
  },
  {
    slug: "attivita-di-pensiero",
    name: "Attività di Pensiero",
    domain: "COGNITIVE",
    tagline: "Hai bisogno di pensare, e il pensiero stesso è un'attività.",
    fullDescription:
      "Il tema Attività di Pensiero descrive chi ha un'intensa vita mentale. Pensare non è preparatorio all'azione: è un'attività a sé, che questa persona pratica con piacere e continuità.\n\nQuesto talento produce profondità. Le domande che pone spostano le conversazioni di livello, e le sue conclusioni arrivano dopo un lavoro che gli altri non hanno visto.\n\nIl tema è maturo quando il pensiero viene condiviso: chi riflette molto e comunica poco lascia il gruppo senza il beneficio del proprio lavoro, e rischia di essere considerato assente proprio mentre sta contribuendo di più.",
    strengths: [
      "Porta profondità e domande che spostano il livello",
      "Elabora soluzioni ponderate a problemi complessi",
      "Lavora bene in autonomia e in silenzio",
      "Coglie implicazioni che sfuggono nelle discussioni veloci",
    ],
    blindSpots: [
      "Può sembrare distaccato o poco partecipe",
      "Rischia di rimandare l'azione a favore della riflessione",
      "Fatica nelle riunioni molto rapide e reattive",
      "Tiene per sé conclusioni che sarebbero preziose",
    ],
    actionTips: [
      "Condividi il pensiero anche se non è ancora concluso",
      "Chiedi l'ordine del giorno in anticipo: rendi migliori le riunioni",
      "Datti una scadenza per passare dal pensiero alla proposta",
      "Spiega quando ti serve tempo: il silenzio viene letto come disinteresse",
    ],
    leaderApplication:
      "Da leader porti profondità dove il ritmo aziendale spinge alla reazione: le tue domande impediscono al gruppo di risolvere il problema sbagliato. Il rischio è il silenzio, che nel ruolo di guida viene letto come distanza o disapprovazione. Pensa a voce alta più di quanto ti venga naturale: condividere un ragionamento in corso non è indecisione, è dare al gruppo accesso al tuo contributo migliore.",
    managerApplication:
      "Mandagli i materiali prima delle riunioni: a freddo rende poco, preparato è la persona più utile del tavolo. Proteggi blocchi di lavoro profondo senza interruzioni. Non confondere il suo silenzio con disaccordo o disinteresse: chiediglielo esplicitamente, magari per iscritto, e riceverai l'analisi più accurata che avrai su quel tema.",
    thrivesIn: [
      "Ricerca e sviluppo",
      "Strategia e analisi",
      "Scrittura e progettazione",
      "Ruoli che richiedono lavoro profondo",
    ],
  },
  {
    slug: "selezione-del-percorso",
    name: "Selezione del Percorso",
    domain: "COGNITIVE",
    tagline: "Vedi i percorsi possibili e riconosci subito quello migliore.",
    fullDescription:
      "Il tema Selezione del Percorso descrive una capacità particolare: di fronte a una situazione complessa, questa persona vede rapidamente gli scenari alternativi e individua quale strada porta dove serve, scartando le altre.\n\nNon è pianificazione, è selezione. Mentre gli altri stanno ancora elencando le opzioni, lei ha già proiettato ciascuna fino alle conseguenze e sa quale regge. Spesso non sa spiegare come ci è arrivata: è un riconoscimento di pattern.\n\nIl tema è maturo quando il ragionamento viene esplicitato: una strada scelta e spiegata viene seguita dal gruppo, una intuizione non argomentata resta un'opinione personale.",
    strengths: [
      "Individua rapidamente la strada migliore fra molte possibili",
      "Anticipa le conseguenze di ciascuna alternativa",
      "Riconosce i vicoli ciechi prima di imboccarli",
      "Semplifica situazioni complesse in poche opzioni reali",
    ],
    blindSpots: [
      "Può faticare a spiegare come è arrivato alla conclusione",
      "Rischia di scartare troppo presto alternative valide",
      "Può risultare impaziente con chi ragiona per gradi",
      "Cambia percorso quando emergono nuove informazioni, disorientando il gruppo",
    ],
    actionTips: [
      "Esplicita i criteri con cui hai scartato le alternative",
      "Mostra due opzioni, non solo quella che hai scelto",
      "Dai al gruppo il tempo di arrivare dove sei già arrivato",
      "Verifica le intuizioni con qualche dato prima di impegnarti",
    ],
    leaderApplication:
      "È il talento che il gruppo si aspetta da chi guida: sai dove andare e perché escludi le altre strade. Il rischio non è la qualità della scelta, è la sua trasmissibilità. Se il team riceve la conclusione senza il ragionamento, non può eseguirla con intelligenza né adattarla quando il contesto cambia. Mostra il percorso scartato e il criterio: è ciò che trasforma la tua intuizione in una capacità del gruppo.",
    managerApplication:
      "Portagli i problemi complessi e mal definiti prima che siano strutturati: è lì che il suo contributo vale di più. Chiedigli però di esplicitare i criteri e di presentare almeno due opzioni, perché tende a consegnare solo la conclusione. Dagli visibilità sulle informazioni di contesto: senza il quadro completo la sua intuizione perde precisione.",
    thrivesIn: [
      "Strategia e pianificazione",
      "Consulenza",
      "Direzione generale",
      "Negoziazione complessa",
    ],
  },
];

export const DOMAIN_META: Record<
  Domain,
  { label: string; short: string; color: string; description: string }
> = {
  OPERATIONAL: {
    label: 'Concretezza Operativa',
    short: 'CNC',
    color: '#7c3aed',
    description: 'Sai far accadere le cose. Sei la persona che trasforma le idee in realtà.',
  },
  INTERPERSONAL: {
    label: 'Impatto Interpersonale',
    short: 'IMP',
    color: '#ea580c',
    description: 'Sai farti ascoltare e portare gli altri dove serve. Estendi la portata del gruppo.',
  },
  SUPPORTIVE: {
    label: 'Legame e Sostegno',
    short: 'LEG',
    color: '#0891b2',
    description: 'Tieni insieme le persone. Rendi il gruppo più della somma delle sue parti.',
  },
  COGNITIVE: {
    label: 'Elaborazione Cognitiva',
    short: 'ELB',
    color: '#16a34a',
    description: 'Assorbi e analizzi le informazioni per aiutare il gruppo a decidere meglio.',
  },
};

export const DOMAIN_ORDER: Domain[] = ['OPERATIONAL', 'INTERPERSONAL', 'SUPPORTIVE', 'COGNITIVE'];
