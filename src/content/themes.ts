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
};

/**
 * 12 Temi di Talento, 3 per ciascuna delle 4 macro-aree del modello Gallup.
 * I contenuti sono originali e scritti in ottica di psicologia del lavoro:
 * ogni tema descrive un pattern ricorrente di pensiero, sentimento e
 * comportamento che può essere applicato produttivamente.
 */
export const THEMES: ThemeSeed[] = [
  // ======================= ESECUZIONE =======================
  {
    slug: 'realizzatore',
    name: 'Realizzatore',
    domain: 'EXECUTING',
    tagline: 'Hai un motore interno che chiede risultati concreti, ogni giorno.',
    fullDescription:
      "Il Realizzatore convive con una spinta costante alla produttività. Ogni giornata parte idealmente da zero: qualcosa di tangibile deve essere portato a termine perché la giornata «conti». Questa energia non nasce dalla pressione esterna ma da un metronomo interno, e per questo è sorprendentemente stabile nel tempo.\n\nNei gruppi di lavoro il Realizzatore è il punto di riferimento silenzioso: mentre altri discutono, ha già chiuso i primi tre punti. La sua credibilità si costruisce sul volume e sulla continuità del lavoro consegnato, più che sulla retorica.\n\nIl rischio, sul lungo periodo, è confondere il movimento con il progresso. Il talento diventa forza matura quando il Realizzatore impara a scegliere con cura quali risultati meritano la sua energia.",
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
    thrivesIn: ['Project delivery', 'Operations', 'Ruoli a obiettivi misurabili', 'Startup in fase di scaling'],
  },
  {
    slug: 'organizzazione',
    name: 'Organizzazione',
    domain: 'EXECUTING',
    tagline: 'Porti ordine dove gli altri vedono complessità.',
    fullDescription:
      "Chi ha il tema Organizzazione ha bisogno di struttura, routine e prevedibilità per esprimersi al meglio. Non si tratta di rigidità: è il modo in cui questa persona riduce il rumore ambientale per liberare attenzione da dedicare al lavoro che conta.\n\nDi fronte a un progetto confuso, l'istinto è immediato: scomporre, sequenziare, assegnare scadenze. Il risultato è che il caos diventa un piano, e il piano diventa qualcosa che tutti possono seguire.\n\nLa maturità del tema si vede nella capacità di distinguere le situazioni che richiedono un processo da quelle che chiedono adattamento: la struttura è uno strumento, non un fine.",
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
    thrivesIn: ['Project management', 'Compliance e qualità', 'Logistica', 'Coordinamento eventi'],
  },
  {
    slug: 'responsabilita',
    name: 'Responsabilità',
    domain: 'EXECUTING',
    tagline: 'Quando dici che lo farai, per te diventa un vincolo morale.',
    fullDescription:
      "Il tema Responsabilità porta chi lo possiede a vivere gli impegni presi come promesse. Piccoli o grandi che siano, gli impegni non sono negoziabili: se qualcosa non è stato consegnato come previsto, questa persona sente il bisogno di rimediare, anche a costo personale.\n\nQuesto tema costruisce fiducia più velocemente di qualsiasi altro. I colleghi imparano presto che a questa persona si può affidare la cosa importante, e questo genera un circolo virtuoso di responsabilità crescenti.\n\nIl circolo però può diventare vizioso: chi è affidabile riceve sempre più richieste. Il tema si esprime al meglio quando è accompagnato dalla capacità di dire un no chiaro e tempestivo.",
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
    thrivesIn: ['Ruoli a contatto con il cliente', 'Finance e amministrazione', 'Sanità', 'Team leadership'],
  },

  // ======================= INFLUENZA =======================
  {
    slug: 'comunicazione',
    name: 'Comunicazione',
    domain: 'INFLUENCING',
    tagline: 'Rendi vive le idee: le spieghi, le racconti, le fai ricordare.',
    fullDescription:
      "Chi ha il tema Comunicazione trova naturale dare parole a ciò che accade. Un dato diventa una storia, un concetto astratto diventa un'immagine, una riunione noiosa diventa un momento in cui tutti capiscono davvero il punto.\n\nQuesto talento ha un impatto diretto sulla circolazione delle idee in azienda: le informazioni non restano ferme nei documenti, ma vengono tradotte in qualcosa che le persone possono usare.\n\nLa competenza matura consiste nel mettere la propria capacità espressiva al servizio del messaggio, non della performance: la domanda guida diventa «cosa deve capire chi ascolta?».",
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
    thrivesIn: ['Marketing e comunicazione', 'Vendite', 'Formazione', 'Relazioni pubbliche'],
  },
  {
    slug: 'attivatore',
    name: 'Attivatore',
    domain: 'INFLUENCING',
    tagline: 'Trasformi la discussione in azione: si impara facendo.',
    fullDescription:
      "L'Attivatore ha una domanda ricorrente: «quando partiamo?». L'analisi è utile, ma solo l'azione produce informazioni reali. Per questo tema il movimento non è impulsività: è il modo più rapido per scoprire cosa funziona.\n\nNei gruppi che tendono alla paralisi decisionale, l'Attivatore è il fattore che rompe l'inerzia. Spesso è la persona che fa il primo passo scomodo, quello che sblocca tutti gli altri.\n\nIl tema diventa maturo quando l'energia iniziale viene incanalata: partire in fretta ha valore se qualcuno — o l'Attivatore stesso — presidia anche il completamento.",
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
    thrivesIn: ['Business development', 'Innovazione', 'Startup', 'Turnaround e crisi'],
  },
  {
    slug: 'fiducia-in-se',
    name: 'Fiducia in Sé',
    domain: 'INFLUENCING',
    tagline: 'Hai una bussola interna e la segui anche controcorrente.',
    fullDescription:
      "Il tema Fiducia in Sé descrive una sicurezza che non dipende dal consenso. Chi lo possiede sa di poter gestire il proprio destino e prende decisioni difficili senza aver bisogno di rassicurazione continua.\n\nQuesta indipendenza di giudizio è preziosa nei momenti di incertezza: quando nessuno sa cosa fare, la presenza di una persona ferma riduce l'ansia collettiva e permette al gruppo di muoversi.\n\nIl tema esprime il suo meglio quando la sicurezza è accompagnata da ascolto reale: essere certi della propria rotta non impedisce di aggiornare la mappa.",
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
    thrivesIn: ['Leadership esecutiva', 'Ruoli imprenditoriali', 'Vendite complesse', 'Consulenza strategica'],
  },

  // ======================= RELAZIONI =======================
  {
    slug: 'empatia',
    name: 'Empatia',
    domain: 'RELATIONSHIP',
    tagline: 'Percepisci le emozioni degli altri prima che vengano dette.',
    fullDescription:
      "L'Empatia è la capacità di sentire le emozioni altrui come se fossero, per un istante, proprie. Non significa essere d'accordo o farsi carico di tutto: significa disporre di un'informazione che agli altri sfugge.\n\nNelle organizzazioni questo talento funziona come un sistema di allerta precoce: il disagio di un collega, la tensione latente in un team, la frustrazione di un cliente vengono colti quando sono ancora gestibili.\n\nIl tema diventa una forza professionale quando chi lo possiede impara a usare l'informazione emotiva senza esserne travolto: sentire non obbliga ad assorbire.",
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
    thrivesIn: ['HR e people management', 'Coaching e counseling', 'Customer success', 'Design centrato sull\'utente'],
  },
  {
    slug: 'armonia',
    name: 'Armonia',
    domain: 'RELATIONSHIP',
    tagline: 'Cerchi il terreno comune: il conflitto sterile ti sembra uno spreco.',
    fullDescription:
      "Chi ha il tema Armonia parte da un presupposto pratico: il disaccordo raramente produce valore, mentre il consenso mette le persone in condizione di lavorare. Per questo cerca istintivamente i punti di contatto tra posizioni distanti.\n\nÈ un talento sottovalutato e molto efficace: riduce il costo relazionale delle decisioni e permette ai gruppi di andare avanti senza lasciare rancori sul percorso.\n\nLa versione matura del tema non evita il conflitto: lo rende produttivo, portando la discussione sui fatti e sugli obiettivi condivisi invece che sulle posizioni personali.",
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
    thrivesIn: ['Mediazione e negoziazione', 'Team cross-funzionali', 'Servizio clienti', 'Partnership'],
  },
  {
    slug: 'sviluppatore',
    name: 'Sviluppatore',
    domain: 'RELATIONSHIP',
    tagline: 'Vedi il potenziale delle persone e non riesci a ignorarlo.',
    fullDescription:
      "Lo Sviluppatore percepisce negli altri il potenziale non ancora espresso e trova profonda soddisfazione nel vederlo emergere. Ogni piccolo progresso altrui è per lui un risultato personale.\n\nQuesto talento produce un effetto composto sull'organizzazione: le persone che crescono restano, e a loro volta fanno crescere altri. Chi ha questo tema costruisce spesso, senza accorgersene, la panchina di talenti dell'azienda.\n\nLa maturità del tema sta nel saper distinguere il potenziale reale dal desiderio di aiutare: non tutti vogliono, in quel momento, essere sviluppati.",
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
    thrivesIn: ['Management di team', 'Formazione e L&D', 'Mentoring', 'Educazione'],
  },

  // ======================= PENSIERO STRATEGICO =======================
  {
    slug: 'analitico',
    name: 'Analitico',
    domain: 'STRATEGIC',
    tagline: 'Chiedi le prove: senza dati, per te resta un\'opinione.',
    fullDescription:
      "Il tema Analitico spinge a cercare le cause. Di fronte a un'affermazione, la reazione naturale è chiedersi su cosa si fonda, quali dati la supportano e quali spiegazioni alternative sono state escluse.\n\nQuesta postura protegge le organizzazioni da decisioni prese sull'onda dell'entusiasmo. L'Analitico non è il freno: è il sistema di controllo che rende una decisione difendibile e ripetibile.\n\nIl tema esprime il suo massimo quando l'analisi ha un termine definito: la domanda utile non è «so tutto?» ma «so abbastanza per decidere bene?».",
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
    thrivesIn: ['Data analysis', 'Ricerca', 'Finance e controllo di gestione', 'Quality assurance'],
  },
  {
    slug: 'ideazione',
    name: 'Ideazione',
    domain: 'STRATEGIC',
    tagline: 'Colleghi cose che sembravano lontane e ne esce qualcosa di nuovo.',
    fullDescription:
      "Chi ha il tema Ideazione è affascinato dalle idee. Trova connessioni fra fenomeni apparentemente scollegati e prova un piacere autentico nel momento in cui un concetto nuovo prende forma.\n\nQuesto talento è il carburante dell'innovazione: dove altri vedono un vincolo, l'Ideazione vede una riformulazione possibile del problema. Le soluzioni migliori spesso arrivano da qui.\n\nLa maturità del tema consiste nel selezionare: molte idee sono interessanti, poche sono utili adesso. Chi impara a scegliere trasforma la creatività in impatto.",
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
    thrivesIn: ['Product design', 'R&D', 'Strategia', 'Advertising e creatività'],
  },
  {
    slug: 'apprendimento',
    name: 'Apprendimento',
    domain: 'STRATEGIC',
    tagline: 'Il processo di imparare ti dà energia quanto il risultato.',
    fullDescription:
      "Il tema Apprendimento descrive chi è attratto dal passaggio dall'ignoranza alla competenza. Non è necessariamente il bisogno di diventare esperto: è il processo stesso di imparare a dare soddisfazione.\n\nQueste persone sono le più adatte a contesti che cambiano rapidamente, perché la novità non le minaccia: la trovano stimolante. Sono spesso i primi ad adottare strumenti e metodi nuovi e a diffonderli.\n\nIl tema diventa vantaggio competitivo quando l'apprendimento viene indirizzato: scegliere in cosa diventare davvero bravi moltiplica il valore della curiosità.",
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
    thrivesIn: ['Tecnologia', 'Consulenza', 'Ricerca e sviluppo', 'Ruoli in contesti in forte cambiamento'],
  },
];

export const DOMAIN_META: Record<
  Domain,
  { label: string; short: string; color: string; description: string }
> = {
  EXECUTING: {
    label: 'Esecuzione',
    short: 'ESE',
    color: '#7c3aed',
    description: 'Sai far accadere le cose. Sei la persona che trasforma le idee in realtà.',
  },
  INFLUENCING: {
    label: 'Influenza',
    short: 'INF',
    color: '#ea580c',
    description: 'Sai farti ascoltare e portare gli altri dove serve. Estendi la portata del gruppo.',
  },
  RELATIONSHIP: {
    label: 'Relazioni',
    short: 'REL',
    color: '#0891b2',
    description: 'Tieni insieme le persone. Rendi il gruppo più della somma delle sue parti.',
  },
  STRATEGIC: {
    label: 'Pensiero Strategico',
    short: 'STR',
    color: '#16a34a',
    description: 'Assorbi e analizzi le informazioni per aiutare il gruppo a decidere meglio.',
  },
};

export const DOMAIN_ORDER: Domain[] = ['EXECUTING', 'INFLUENCING', 'RELATIONSHIP', 'STRATEGIC'];
