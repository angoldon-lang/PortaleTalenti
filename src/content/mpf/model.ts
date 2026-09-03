/**
 * ===========================================================================
 * MAPPA DEI PUNTI DI FORZA — tassonomia proprietaria
 * ===========================================================================
 *
 * Modello originale per la valutazione dei punti di forza, sviluppato per uso
 * commerciale e di coaching. Si ispira alla filosofia della psicologia positiva
 * ma NON deriva da alcuno strumento proprietario di terzi.
 *
 * Scelte fatte per garantirne l'indipendenza:
 *
 *  - ARCHITETTURA. Cinque macro-aree per sei tratti ciascuna (30 tratti). La
 *    spina dorsale non è "il tipo di contributo al gruppo" ma il processo
 *    psicologico del lavorare: ciò che orienta (Direzione), ciò che muove
 *    (Energia), ciò che struttura (Regolazione), ciò che passa dalle persone
 *    (Relazione), ciò che consente di adattarsi (Apertura).
 *
 *  - NOMENCLATURA. Ogni tratto è denominato con un sintagma descrittivo tratto
 *    dal lessico scientifico della psicologia del lavoro, non con parole
 *    evocative singole. I costrutti sottostanti appartengono alla letteratura
 *    pubblica (Big Five, autodeterminazione, focus regolatorio, performance
 *    adattiva, capitale psicologico) e non sono appropriabili.
 *
 *  - CONTENUTI. Descrizioni, punti di forza, punti ciechi e indicazioni sono
 *    testi originali scritti per questo modello.
 *
 * `scripts/mpf/verifica_indipendenza.py` controlla automaticamente che nessuna
 * denominazione collida con marchi noti o con il modello legacy del portale.
 */

export type MpfAreaSeed = {
  slug: string;
  name: string;
  short: string;
  color: string;
  sortOrder: number;
  claim: string;
  description: string;
  /** Riferimenti scientifici del costrutto, di dominio pubblico. */
  grounding: string;
};

export type MpfTraitSeed = {
  slug: string;
  name: string;
  area: string;
  tagline: string;
  definition: string;
  strengths: string[];
  blindSpots: string[];
  actionTips: string[];
  thrivesIn: string[];
  leaderApplication: string;
  managerApplication: string;
};

export const MPF_AREAS: MpfAreaSeed[] = [
  {
    slug: "direzione",
    name: "Direzione e Scopo",
    short: "DIR",
    color: "#4f46e5",
    sortOrder: 1,
    claim:
      "Che cosa orienta le tue scelte prima ancora che tu agisca.",
    description:
      "Riguarda ciò che dà un verso al lavoro: i principi che non negozi, il bisogno che quello che fai significhi qualcosa, la capacità di tenere una rotta e di immaginare dove porta. È l'area che risponde alla domanda «perché questo e non altro».",
    grounding:
      "Teoria dell'autodeterminazione (Deci & Ryan) per la componente di scopo; ricerca su goal-setting (Locke & Latham) per focalizzazione e persistenza dell'obiettivo.",
  },
  {
    slug: "energia",
    name: "Energia Realizzativa",
    short: "ENE",
    color: "#d97706",
    sortOrder: 2,
    claim:
      "Quanta spinta metti nel trasformare l'intenzione in risultato.",
    description:
      "Riguarda il passaggio dal proposito al fatto: l'attivazione spontanea, la tenuta nel tempo, il senso di responsabilità su ciò che si è promesso, la voglia di alzare l'asticella. È l'area che risponde alla domanda «quanto e come ti muovi».",
    grounding:
      "Motivazione al risultato (McClelland), autoefficacia (Bandura), comportamento proattivo sul lavoro (Parker & Bindl).",
  },
  {
    slug: "regolazione",
    name: "Regolazione e Rigore",
    short: "REG",
    color: "#0d9488",
    sortOrder: 3,
    claim:
      "Come tieni sotto controllo complessità, rischio e qualità.",
    description:
      "Riguarda il modo in cui si mette ordine: struttura e metodo, valutazione del rischio, uso delle evidenze, capacità di rimettere in funzione ciò che si è rotto, coerenza dei criteri. È l'area che risponde alla domanda «come eviti che le cose vadano storte».",
    grounding:
      "Coscienziosità e le sue sfaccettature (Roberts et al.); teoria del focus regolatorio, versante prevenzione (Higgins).",
  },
  {
    slug: "relazione",
    name: "Relazione e Influenza",
    short: "REL",
    color: "#e11d48",
    sortOrder: 4,
    claim:
      "Come agisci sugli altri e con gli altri.",
    description:
      "Riguarda tutto ciò che passa dalle persone: la lettura degli stati d'animo, la gestione del disaccordo, la facilità ad avviare rapporti nuovi, la capacità di convincere, di prendere posizione e di far crescere. È l'area che risponde alla domanda «che effetto fai agli altri».",
    grounding:
      "Estroversione e amicalità nel modello a cinque fattori; intelligenza emotiva come abilità (Mayer & Salovey); comportamento di cittadinanza organizzativa (Organ).",
  },
  {
    slug: "apertura",
    name: "Apertura e Adattamento",
    short: "APE",
    color: "#16a34a",
    sortOrder: 5,
    claim:
      "Come tratti il nuovo, l'ignoto e ciò che cambia.",
    description:
      "Riguarda il rapporto con l'informazione e con il cambiamento: curiosità, generazione di idee, flessibilità operativa, capacità di vedere il quadro d'insieme, tenuta dell'umore nelle difficoltà. È l'area che risponde alla domanda «come reagisci quando il terreno si muove».",
    grounding:
      "Apertura all'esperienza nel modello a cinque fattori; tassonomia della performance adattiva (Pulakos et al.); capitale psicologico (Luthans).",
  },
];

export const MPF_TRAITS: MpfTraitSeed[] = [
  {
    slug: "ancoraggio-valoriale",
    name: "Ancoraggio Valoriale",
    area: "direzione",
    tagline: "Alcuni principi vengono prima della convenienza, e da lì passa ogni scelta.",
    definition:
      "Descrive la presenza di un nucleo di principi stabili che resistono al cambiare delle circostanze e degli incentivi. Non è rigidità morale: è la disponibilità di criteri già decisi, che rendono rapide e coerenti le scelte difficili.\n\nNelle organizzazioni questo tratto funziona da riferimento condiviso: rende espliciti i criteri che gli altri danno per scontati e alza il costo delle scorciatoie. La maturità sta nel distinguere i pochi principi non negoziabili dalle molte preferenze personali, che invece si possono discutere.",
    strengths: [
      "Decide in fretta le questioni di merito, perché i criteri sono già fissati",
      "Genera fiducia: si sa in anticipo dove starà",
      "Sostiene l'impegno anche quando il compito è ingrato o poco visibile",
      "Rende espliciti i criteri impliciti del gruppo",
    ],
    blindSpots: [
      "Può trattare come questione morale ciò che è solo una preferenza",
      "Rischia di irrigidirsi davanti a compromessi legittimi",
      "Fatica in contesti percepiti come disallineati dai propri principi",
      "Può giudicare chi ha priorità diverse",
    ],
    actionTips: [
      "Metti per iscritto i tre principi su cui non transigi: tutto il resto diventa negoziabile",
      "Spiega il perché dei tuoi no, altrimenti sembrano arbitrari",
      "Cerca contesti coerenti invece di combattere quelli che non lo sono",
    ],
    thrivesIn: [
      "Ruoli con responsabilità etica o di conformità",
      "Organizzazioni a missione",
      "Professioni regolamentate",
    ],
    leaderApplication:
      "Dai al gruppo una direzione che non cambia con la convenienza del trimestre, ed è ciò che rende prevedibili le tue decisioni difficili. Il rischio è confondere i tuoi principi con le regole del gruppo, facendo sentire fuori posto chi ha priorità diverse. Dichiara quali sono i pochi valori su cui l'organizzazione non transige e lascia esplicitamente negoziabile tutto il resto.",
    managerApplication:
      "Collega ogni richiesta al perché: senza quel collegamento perde motivazione anche su attività che padroneggia. Quando gli chiedi un compromesso, esponi il ragionamento — se lo capisce lo accetta, se sembra arbitrario lo vive come tradimento. Non provare a motivarlo solo con leve economiche.",
  },
  {
    slug: "orientamento-allo-scopo",
    name: "Orientamento allo Scopo",
    area: "direzione",
    tagline: "Hai bisogno che il lavoro serva a qualcosa che riconosci come importante.",
    definition:
      "Descrive il bisogno che l'attività quotidiana sia collegata a un fine percepito come significativo. È il motore motivazionale che la teoria dell'autodeterminazione chiama motivazione autonoma: si lavora perché la cosa conta, non perché è richiesta.\n\nQuando quel collegamento c'è, l'impegno è quasi inesauribile e resiste alla fatica; quando manca, nessun incentivo lo sostituisce a lungo. È un tratto che porta nel gruppo la domanda scomoda e utile: a che cosa serve quello che stiamo facendo.",
    strengths: [
      "Sostiene sforzi lunghi senza bisogno di ricompense continue",
      "Riporta il gruppo sul senso quando si perde nell'operatività",
      "Attrae e trattiene persone motivate dalla stessa causa",
      "Riconosce presto quando un'iniziativa ha perso ragione d'essere",
    ],
    blindSpots: [
      "Può disimpegnarsi rapidamente da compiti percepiti come privi di senso",
      "Rischia di sottovalutare l'importanza dei lavori di manutenzione",
      "Può leggere come cinismo il pragmatismo altrui",
      "Vulnerabile alla delusione quando l'organizzazione tradisce il proprio dichiarato",
    ],
    actionTips: [
      "Traduci lo scopo in un indicatore osservabile, altrimenti resta un'aspirazione",
      "Accetta che una parte del lavoro sia solo necessaria, e dosala",
      "Verifica il senso una volta a trimestre, non ogni giorno",
    ],
    thrivesIn: [
      "Sanità, educazione, cooperazione",
      "Sostenibilità e impatto sociale",
      "Progetti di trasformazione",
    ],
    leaderApplication:
      "Dai alle persone qualcosa che quasi nessun leader fornisce: la ragione per cui la fatica vale la pena. È il motore motivazionale più duraturo che esista. Attenzione a non trasformare il senso in retorica: se il racconto non trova riscontro nelle decisioni concrete, l'effetto si inverte e diventa cinismo diffuso.",
    managerApplication:
      "Spiegagli sempre dove si colloca il suo lavoro nel quadro complessivo, anche per i compiti banali. Coinvolgilo nei progetti che hanno un impatto riconoscibile. Attenzione ai periodi di sola manutenzione: sono quelli in cui rischi di perderlo, e un colloquio sul senso vale più di un premio.",
  },
  {
    slug: "focalizzazione-selettiva",
    name: "Focalizzazione Selettiva",
    area: "direzione",
    tagline: "Scegli una direzione e filtri via tutto ciò che non ci porta.",
    definition:
      "Descrive la capacità di mantenere l'attenzione su un obiettivo prescelto e di usare quell'obiettivo come criterio per scartare il resto. È la componente di persistenza direzionale descritta dalla ricerca sul goal-setting: non solo intensità dello sforzo, ma sua costanza di orientamento.\n\nNei gruppi funziona da filtro contro la dispersione: riporta le discussioni al punto e rende visibile il costo delle deviazioni. La maturità sta nel riconoscere quando la deviazione è rumore e quando invece è il segnale che l'obiettivo va rivisto.",
    strengths: [
      "Mantiene la rotta anche quando il contesto distrae",
      "Taglia le attività che non portano al risultato",
      "Porta a termine progetti lunghi senza perdere intensità",
      "Fa risparmiare tempo riportando le discussioni al punto",
    ],
    blindSpots: [
      "Può ignorare informazioni rilevanti perché fuori tema",
      "Rischia di insistere su un obiettivo che andrebbe rivisto",
      "Fatica quando le priorità cambiano di frequente",
      "Può apparire sordo alle esigenze non collegate al progetto",
    ],
    actionTips: [
      "Fissa un momento periodico in cui la domanda è: l'obiettivo è ancora quello giusto?",
      "Spiega il criterio con cui tagli, altrimenti sembra brusco",
      "Concediti finestre dichiarate per esplorare fuori dal perimetro",
    ],
    thrivesIn: [
      "Ruoli a obiettivo unico e misurabile",
      "Consegna di progetti",
      "Ricerca applicata",
    ],
    leaderApplication:
      "Regali al gruppo la cosa più scarsa in azienda: una direzione che non cambia ogni settimana, quindi persone che sanno su cosa saranno valutate. Il rischio è la sordità ai segnali deboli — cambi di mercato, disagi del team — perché non rientrano nell'obiettivo. Istituisci un momento fisso di revisione, altrimenti rischi di guidare benissimo verso il posto sbagliato.",
    managerApplication:
      "Dagli un obiettivo alla volta e proteggilo dalle interruzioni: rende molto più della media se non lo frammenti su cinque fronti. Quando cambi le priorità spiega il perché e dagli il tempo di riorientarsi, perché i cambi improvvisi gli costano più che agli altri.",
  },
  {
    slug: "proiezione-prospettica",
    name: "Proiezione Prospettica",
    area: "direzione",
    tagline: "Vedi con nitidezza ciò che potrebbe essere, e ti tira in avanti.",
    definition:
      "Descrive la tendenza a costruire rappresentazioni dettagliate di scenari futuri e a trarne energia presente. È il versante temporale della cognizione anticipatoria: non previsione tecnica, ma capacità di rendere vivido e desiderabile uno stato di cose che ancora non esiste.\n\nQuando questa persona descrive il futuro, gli altri lo vedono: è un tratto che crea allineamento e sopporta la fatica dell'oggi. La maturità sta nell'agganciare la visione a passi verificabili, altrimenti ispira per una settimana e poi diventa frustrazione.",
    strengths: [
      "Costruisce scenari dettagliati e comunicabili",
      "Allinea le persone attorno a una direzione condivisa",
      "Coglie tendenze prima che diventino evidenti",
      "Dà senso alla fatica presente",
    ],
    blindSpots: [
      "Può trascurare i problemi operativi di oggi",
      "Rischia di promettere futuri che l'organizzazione non può reggere",
      "Si scoraggia quando la realtà avanza lentamente",
      "Può sostituire la visione prima che la precedente sia realizzata",
    ],
    actionTips: [
      "Traduci ogni scenario in tre passi verificabili entro novanta giorni",
      "Affiancati a un profilo esecutivo: la coppia visione-esecuzione è rara",
      "Torna sulla stessa visione invece di cambiarla",
    ],
    thrivesIn: [
      "Strategia e innovazione",
      "Imprenditoria",
      "Direzione di prodotto",
    ],
    leaderApplication:
      "È forse il tratto più direttamente collegato alla leadership: le persone ti seguono perché vedono dove state andando. Il rischio è la distanza fra l'immagine e il lunedì mattina. Ogni volta che descrivi il futuro dichiara i passi dei prossimi tre mesi, e non cambiare visione troppo spesso: al gruppo serve tempo per crederci prima di poterla realizzare.",
    managerApplication:
      "Chiedigli scenari e coinvolgilo nelle riflessioni di prospettiva: vede tendenze prima degli altri. Ancoralo però al presente chiedendo sempre il primo passo concreto. Non lasciarlo a lungo in ruoli puramente operativi senza orizzonte: si spegne più rapidamente di quasi ogni altro profilo.",
  },
  {
    slug: "ambizione-visibile",
    name: "Ambizione Visibile",
    area: "direzione",
    tagline: "Vuoi che il tuo contributo lasci un segno riconoscibile.",
    definition:
      "Descrive il bisogno che il proprio apporto sia notato e ricordato, e la conseguente propensione a scegliere obiettivi ambiziosi. Nella letteratura organizzativa è il versante di status della motivazione: non vanità, ma spinta a rendere il proprio lavoro consequenziale.\n\nUsata bene produce risultati che nessun obiettivo modesto avrebbe generato, e porta il gruppo dove da solo non sarebbe andato. La maturità sta nel legare la visibilità al contributo reale: essere riconosciuti per qualcosa che è servito, invece che semplicemente essere visti.",
    strengths: [
      "Punta a traguardi ambiziosi e li rende praticabili",
      "Alza le aspettative del gruppo su ciò che è possibile",
      "Costruisce credibilità e reputazione anche per il team",
      "Lavora con intensità sui progetti consequenziali",
    ],
    blindSpots: [
      "Può scegliere ciò che si vede invece di ciò che serve",
      "Rischia di appropriarsi del merito altrui",
      "Vive male i ruoli di supporto poco visibili",
      "Può sopravvalutare l'immagine rispetto alla sostanza",
    ],
    actionTips: [
      "Chiediti se stai scegliendo il progetto giusto o quello più visibile",
      "Attribuisci pubblicamente il merito: aumenta la tua credibilità, non la riduce",
      "Accetta un incarico invisibile all'anno: ti tiene onesto",
    ],
    thrivesIn: [
      "Ruoli di rappresentanza",
      "Imprenditoria",
      "Sviluppo commerciale",
    ],
    leaderApplication:
      "Porti il gruppo su traguardi che da solo non avrebbe considerato, e l'ambizione è contagiosa. Il rischio è che il team percepisca che la visibilità va sempre in una direzione sola. La contromisura è semplice e potente: attribuisci i meriti pubblicamente e per nome. Un leader riconosciuto per aver fatto crescere altri ha una reputazione più solida di uno riconosciuto per i propri risultati.",
    managerApplication:
      "Dagli occasioni reali di visibilità: presentare, rappresentare il gruppo, firmare un risultato. È una leva motivazionale più forte di quasi ogni altra. Sii però esplicito su come si attribuiscono i meriti nel tuo team, e verifica che il contributo dei più silenziosi venga riconosciuto.",
  },
  {
    slug: "autoefficacia-realizzativa",
    name: "Autoefficacia Realizzativa",
    area: "energia",
    tagline: "Hai un metronomo interno che chiede risultati concreti, ogni giorno.",
    definition:
      "Descrive la spinta costante a produrre qualcosa di tangibile e la convinzione di esserne capace. Unisce la motivazione al risultato di McClelland e l'autoefficacia di Bandura: non basta volere il risultato, occorre credere di poterlo ottenere.\n\nÈ un tratto notevolmente stabile nel tempo, perché non dipende dalla pressione esterna. Il rischio, sul lungo periodo, è confondere il movimento con il progresso: diventa forza matura quando la persona impara a scegliere quali risultati meritano la sua energia.",
    strengths: [
      "Mantiene ritmo e produttività senza supervisione",
      "Trasforma progetti lunghi in una sequenza di consegne",
      "Alza lo standard di operosità del gruppo con l'esempio",
      "Regge carichi intensi e prolungati",
    ],
    blindSpots: [
      "Può scambiare la quantità di lavoro svolto per impatto reale",
      "Fatica a fermarsi, delegare e riconoscere i risultati raggiunti",
      "Rischio di esaurimento: il fatto non basta mai a lungo",
      "Può risultare impaziente con chi ha ritmi riflessivi",
    ],
    actionTips: [
      "Scegli ogni settimana i tre risultati che contano e proteggi quel tempo",
      "Concorda con il gruppo cosa puoi legittimamente non fare",
      "Affianca al conteggio delle attività un indicatore di impatto",
    ],
    thrivesIn: [
      "Consegna di progetti",
      "Operations",
      "Ruoli a obiettivi misurabili",
    ],
    leaderApplication:
      "Dai l'esempio con il ritmo più che con i discorsi, e il gruppo capisce lo standard guardando quanto consegni. Il rischio speculare è che il team legga l'operosità come unico metro di valore e smetta di fermarsi a pensare. Il tuo compito è decidere pubblicamente cosa NON faremo: senza quella scelta il gruppo insegue il tuo ritmo senza la tua direzione.",
    managerApplication:
      "Dagli obiettivi misurabili e un flusso di lavoro continuo: i tempi morti lo demotivano più del carico. Riconosci i risultati concreti, non lo sforzo. Attenzione al sovraccarico, perché tenderà a dire sì a tutto: sii tu a stabilire cosa può legittimamente non fare.",
  },
  {
    slug: "iniziativa-proattiva",
    name: "Iniziativa Proattiva",
    area: "energia",
    tagline: "Fai il primo passo prima che qualcuno te lo chieda.",
    definition:
      "Descrive la tendenza ad agire in anticipo sugli eventi invece di rispondervi, avviando cambiamenti senza attendere istruzioni. La ricerca sul comportamento proattivo la associa a una maggiore capacità di sbloccare situazioni di stallo e a un apprendimento più rapido per tentativi.\n\nNei gruppi che tendono alla paralisi decisionale è il fattore che rompe l'inerzia. Il tratto diventa maturo quando l'energia iniziale viene incanalata: partire in fretta ha valore se qualcuno presidia anche il completamento.",
    strengths: [
      "Sblocca situazioni di stallo e paralisi decisionale",
      "Crea slancio e senso di urgenza produttiva",
      "Impara rapidamente attraverso prototipi e tentativi",
      "Decide con informazioni incomplete senza bloccarsi",
    ],
    blindSpots: [
      "Può partire prima di aver valutato rischi rilevanti",
      "Rischia di lasciare a metà quando cala l'attivazione iniziale",
      "Mette sotto pressione chi ha bisogno di più tempo",
      "Confonde talvolta la velocità con il progresso",
    ],
    actionTips: [
      "Prima di partire, definisci che cosa ti dirà che l'esperimento è fallito",
      "Assegna esplicitamente il completamento quando lanci",
      "Concediti ventiquattro ore sulle decisioni irreversibili",
    ],
    thrivesIn: [
      "Sviluppo commerciale",
      "Innovazione",
      "Gestione di crisi",
    ],
    leaderApplication:
      "Sei chi rompe l'inerzia: dove il gruppo gira su sé stesso, fai il primo passo e sblocchi tutti. Il rovescio è una scia di iniziative aperte e mai chiuse, che il team paga in confusione. Il tuo lavoro non finisce con il via: prima di lanciare, comunica chi presidia il completamento e quale segnale dirà che l'esperimento è fallito.",
    managerApplication:
      "Dagli il permesso esplicito di partire con informazioni incomplete su un perimetro definito. Affiancalo a un profilo analitico o esecutivo che porti a terra ciò che lancia. Concorda in anticipo quali decisioni sono irreversibili e richiedono una pausa.",
  },
  {
    slug: "persistenza-operativa",
    name: "Persistenza Operativa",
    area: "energia",
    tagline: "Quello che cominci lo chiudi, anche quando smette di essere interessante.",
    definition:
      "Descrive la capacità di mantenere lo sforzo su un compito oltre il punto in cui la motivazione iniziale si esaurisce. È la componente di perseveranza descritta dagli studi su grit e autoregolazione: la differenza fra iniziare molte cose e portarne a termine alcune.\n\nÈ il tratto che rende affidabili le stime e credibili le promesse di un gruppo. La maturità consiste nel distinguere la perseveranza dall'accanimento: insistere ha valore finché l'obiettivo lo merita ancora.",
    strengths: [
      "Porta a termine anche ciò che ha smesso di essere gratificante",
      "Rende affidabili le previsioni di consegna del gruppo",
      "Non si scoraggia davanti agli ostacoli ripetuti",
      "Recupera progetti che altri avrebbero abbandonato",
    ],
    blindSpots: [
      "Può insistere su iniziative che andrebbero chiuse",
      "Fatica ad accettare il cambio di priorità dall'alto",
      "Rischia di assorbire da solo il costo di una scelta sbagliata",
      "Può leggere come leggerezza la flessibilità altrui",
    ],
    actionTips: [
      "Definisci in anticipo la condizione che ti farebbe fermare",
      "Distingui il costo già speso da quello ancora da spendere",
      "Chiedi una verifica esterna quando insisti da più di un mese",
    ],
    thrivesIn: [
      "Progetti lunghi e complessi",
      "Ricerca e sviluppo",
      "Recupero crediti e situazioni difficili",
    ],
    leaderApplication:
      "Il gruppo impara da te che qui le cose si finiscono, ed è una reputazione che vale più di molte dichiarazioni. Attenzione all'accanimento: sei anche la persona che rischia di tenere in vita un progetto oltre il ragionevole, perché fermarsi somiglia troppo a fallire. Dichiara in anticipo le condizioni di chiusura di ogni iniziativa: rende la rinuncia una decisione e non una sconfitta.",
    managerApplication:
      "Affidagli ciò che deve arrivare in fondo, non ciò che va esplorato. Verifica però periodicamente se quello su cui insiste ha ancora senso: tenderà a non sollevare lui la domanda. Quando cancelli un progetto su cui ha investito, spiega il ragionamento — altrimenti lo vive come giudizio sul proprio lavoro.",
  },
  {
    slug: "responsabilita-assunta",
    name: "Responsabilità Assunta",
    area: "energia",
    tagline: "Quando dici che lo farai, per te diventa un vincolo.",
    definition:
      "Descrive la tendenza a vivere gli impegni presi come obbligazioni personali, indipendentemente dalla loro formalità. Nella letteratura sul comportamento organizzativo è vicina al costrutto di coscienziosità di ruolo esteso: ci si sente responsabili anche di ciò che non è formalmente assegnato.\n\nCostruisce fiducia più rapidamente di qualsiasi altro tratto, e questo genera un circolo di responsabilità crescenti. Il circolo può diventare vizioso: chi è affidabile riceve sempre più richieste, quindi il tratto si esprime al meglio accompagnato dalla capacità di dire un no tempestivo.",
    strengths: [
      "Genera fiducia immediata in colleghi e clienti",
      "Chiude ciò che inizia anche quando diventa scomodo",
      "Segnala per tempo i rischi invece di nasconderli",
      "Mantiene alto lo standard senza bisogno di controlli",
    ],
    blindSpots: [
      "Difficoltà a dire di no, con sovraccarico cronico",
      "Si assume colpe che appartengono al sistema",
      "Aspettative severe verso chi è meno rigoroso",
      "Senso di colpa sproporzionato all'errore reale",
    ],
    actionTips: [
      "Prima di accettare, verifica il tempo reale che l'impegno richiede",
      "Rendi visibile il tuo carico: una lista condivisa rende il no oggettivo",
      "Distingui ciò che dipende da te da ciò che dipende dal contesto",
    ],
    thrivesIn: [
      "Ruoli a contatto con il cliente",
      "Amministrazione e finanza",
      "Sanità",
    ],
    leaderApplication:
      "La tua parola è il capitale di fiducia su cui poggia il gruppo. Da leader il pericolo è assorbire ogni impegno personalmente invece di costruire un sistema che regge senza di te. Delegare non è cedere responsabilità: è renderla condivisa, ed è l'unico modo perché il gruppo cresca oltre la tua capacità individuale.",
    managerApplication:
      "È la persona a cui affiderai le cose importanti, e proprio per questo rischia il sovraccarico. Rendi visibile il suo carico e aiutalo a dire di no: un no basato su una lista condivisa gli costa meno di un no personale. Quando qualcosa va storto, distingui esplicitamente ciò che dipendeva da lui da ciò che dipendeva dal contesto.",
  },
  {
    slug: "spinta-competitiva",
    name: "Spinta Competitiva",
    area: "energia",
    tagline: "Il tuo risultato acquista senso quando lo confronti con quello degli altri.",
    definition:
      "Descrive il bisogno di un termine di paragone esterno per dare valore alla propria prestazione. È la componente comparativa della motivazione al risultato: il dato assoluto informa poco, il posizionamento relativo motiva molto.\n\nLa presenza di questo tratto alza il livello percepito di ciò che è possibile e rende visibile lo standard. Diventa maturo quando il confronto è indirizzato verso l'esterno o verso il proprio risultato precedente: la stessa energia può moltiplicare un gruppo o dividerlo.",
    strengths: [
      "Alza lo standard di prestazione dell'intero gruppo",
      "Trova energia nei contesti misurabili",
      "Non si accontenta di un risultato mediocre",
      "Rende visibile il livello a cui si può arrivare",
    ],
    blindSpots: [
      "Può trasformare i colleghi in avversari",
      "Vive male anche le sconfitte irrilevanti",
      "Evita le sfide in cui non è certo di prevalere",
      "Sottovaluta i risultati non misurabili",
    ],
    actionTips: [
      "Indirizza il confronto verso l'esterno o verso il tuo risultato precedente",
      "Celebra a voce alta i risultati altrui: costa poco e cambia il clima",
      "Scegli qualche sfida in cui sai di non essere il migliore",
    ],
    thrivesIn: [
      "Vendite e sviluppo commerciale",
      "Mercati finanziari",
      "Contesti con obiettivi comparabili",
    ],
    leaderApplication:
      "Porti il gruppo a non accontentarsi, rendendo visibile lo standard e alzandolo. Il pericolo è che il confronto diventi interno, trasformando i colleghi in avversari e distruggendo la collaborazione. Indirizza la competizione verso il mercato o verso il risultato dello scorso periodo. E fai attenzione a come reagisci quando perdi: il team lo osserva più di quanto immagini.",
    managerApplication:
      "Dagli metriche e riferimenti comparabili: senza un metro di paragone perde carburante. Attenzione a come strutturi i premi, perché un incentivo a somma zero fra colleghi con lui diventa esplosivo. Aiutalo a gestire le sconfitte, altrimenti eviterà le sfide incerte e nel tempo si restringe il campo.",
  },
  {
    slug: "ottimizzazione-qualitativa",
    name: "Ottimizzazione Qualitativa",
    area: "energia",
    tagline: "Ti interessa portare il buono a eccellente, non il mediocre a sufficiente.",
    definition:
      "Descrive l'attenzione selettiva alla qualità dell'esistente e la propensione a investire dove c'è già una base solida. È un orientamento allo sviluppo delle risorse più che alla correzione dei deficit, coerente con l'approccio dei punti di forza applicato ai processi e alle persone.\n\nLo stesso sguardo si applica agli altri: individua ciò che ciascuno fa meglio e spinge perché venga usato. La maturità sta nell'accettare che non tutto merita l'eccellenza: alcune cose devono solo essere fatte.",
    strengths: [
      "Porta a livelli di qualità che gli altri non ritenevano possibili",
      "Riconosce e valorizza i punti di forza delle persone",
      "Trasforma prodotti e processi buoni in eccellenti",
      "Non si accontenta del sufficiente su ciò che conta",
    ],
    blindSpots: [
      "Può rifinire all'infinito senza chiudere",
      "Trascura ciò che va semplicemente sistemato",
      "Trasmette insoddisfazione anche quando il risultato è buono",
      "Fatica a delegare ciò a cui tiene",
    ],
    actionTips: [
      "Decidi in anticipo che cosa merita eccellenza e che cosa solo di essere fatto",
      "Datti un criterio di chiusura esplicito",
      "Dì a voce alta ciò che è già ottimo, non solo ciò che si può migliorare",
    ],
    thrivesIn: [
      "Gestione di prodotto",
      "Design e qualità",
      "Coaching e sviluppo",
    ],
    leaderApplication:
      "Valorizzi le persone per ciò che sanno fare meglio invece di consumarle sulle lacune: è la forma di leadership che produce più energia in assoluto. Il rischio è che il tuo standard non venga mai raggiunto e il gruppo si senta cronicamente insufficiente. Dichiara esplicitamente quando una cosa è finita: senza quella distinzione nessuno sa quando può fermarsi.",
    managerApplication:
      "Affidagli ciò che è già buono e deve diventare eccellente, non ciò che è rotto: sui problemi da riparare si annoia. Usalo per far crescere i colleghi sui loro punti di forza, è un mentore naturale. Aiutalo a chiudere concordando in anticipo il criterio di completamento.",
  },
  {
    slug: "strutturazione-metodica",
    name: "Strutturazione Metodica",
    area: "regolazione",
    tagline: "Porti ordine dove gli altri vedono complessità.",
    definition:
      "Descrive il bisogno di struttura, sequenza e prevedibilità come condizione per lavorare bene. È la sfaccettatura di ordine della coscienziosità: non rigidità, ma riduzione del rumore ambientale per liberare attenzione da dedicare al lavoro che conta.\n\nDi fronte a una situazione confusa l'istinto è scomporre, sequenziare, assegnare. Il risultato è che il caos diventa un piano che tutti possono seguire. La maturità si vede nel distinguere le situazioni che richiedono un processo da quelle che chiedono adattamento.",
    strengths: [
      "Costruisce processi replicabili da situazioni confuse",
      "Rispetta scadenze e impegni con affidabilità elevata",
      "Anticipa i colli di bottiglia prima che diventino emergenze",
      "Riduce il carico cognitivo del gruppo con un metodo condiviso",
    ],
    blindSpots: [
      "I cambi di piano generano stress sproporzionato",
      "Può irrigidirsi su procedure che hanno perso utilità",
      "Percepito come poco flessibile nei contesti fluidi",
      "Pianifica anche ciò che converrebbe esplorare",
    ],
    actionTips: [
      "Inserisci esplicitamente uno spazio per gli imprevisti in ogni piano",
      "Rivedi ogni trimestre i processi che hai creato: quali servono ancora?",
      "Spiega il perché delle tue strutture: si seguono se si capiscono",
    ],
    thrivesIn: [
      "Gestione di progetto",
      "Conformità e qualità",
      "Logistica",
    ],
    leaderApplication:
      "Dai al gruppo un terreno prevedibile su cui muoversi: ruoli chiari, scadenze note, nessuna sorpresa organizzativa. È un enorme sollievo cognitivo per chi ti segue. Attenzione a non confondere la tua esigenza di struttura con quella del team: chi lavora bene nell'ambiguità va lasciato lavorare, e i processi vanno spiegati nel perché, non imposti nel come.",
    managerApplication:
      "Dagli visibilità sui piani con anticipo: i cambi dell'ultimo minuto gli costano più che agli altri. Se un cambio è inevitabile, spiega il perché e concedi tempo per riorganizzare. Verifica ogni tanto che i processi che ha creato servano ancora.",
  },
  {
    slug: "prudenza-valutativa",
    name: "Prudenza Valutativa",
    area: "regolazione",
    tagline: "Prima di muoverti guardi dove metti i piedi.",
    definition:
      "Descrive l'attivazione anticipata dell'attenzione al rischio prima di un impegno. Nella teoria del focus regolatorio corrisponde all'orientamento alla prevenzione: si cerca innanzitutto di evitare la perdita, e solo dopo di massimizzare il guadagno.\n\nNon è timore, ma consapevolezza che il contesto contiene rischi che gli altri non stanno vedendo. In un gruppo entusiasta è la voce che chiede «e se andasse male?»: la domanda che, posta al momento giusto, salva progetti interi. Diventa matura quando la valutazione ha un termine.",
    strengths: [
      "Identifica rischi che agli altri sfuggono",
      "Prende decisioni ponderate che reggono nel tempo",
      "Riduce l'esposizione a errori costosi",
      "Costruisce relazioni professionali durature",
    ],
    blindSpots: [
      "Può rallentare decisioni che richiedono velocità",
      "Percepito come pessimista o poco coraggioso",
      "Fatica nei contesti che premiano l'azione rapida",
      "Tiene per sé opinioni che sarebbero utili",
    ],
    actionTips: [
      "Fissa una scadenza alla valutazione: la cautela deve chiudersi in una scelta",
      "Presenta i rischi insieme alle contromisure, mai da soli",
      "Dichiara esplicitamente quando sei favorevole: il tuo sì pesa",
    ],
    thrivesIn: [
      "Gestione del rischio",
      "Legale e contrattualistica",
      "Sicurezza e qualità",
    ],
    leaderApplication:
      "Eviti al gruppo gli errori costosi e irreversibili, e il tuo intervento vale più di dieci correzioni successive. Il rischio è che la squadra impari a non proporre, perché anticipa la tua obiezione. Rendi visibile anche il tuo assenso: se il team sente solo i tuoi dubbi, smette di portarti idee. E dichiara quali decisioni sono reversibili, perché lì la velocità vale più della cautela.",
    managerApplication:
      "Chiedigli esplicitamente la sua opinione: non la offrirà spontaneamente ed è spesso la più preziosa della stanza. Dagli tempo prima delle riunioni decisionali. Non confondere la sua cautela con mancanza di impegno: quando dice sì, ci ha già pensato più di tutti gli altri.",
  },
  {
    slug: "analisi-evidenziale",
    name: "Analisi Evidenziale",
    area: "regolazione",
    tagline: "Chiedi le prove: senza dati, per te resta un'opinione.",
    definition:
      "Descrive la tendenza a subordinare le conclusioni alla verifica delle evidenze e a ricercare i nessi causali. È il nucleo del pensiero critico applicato alle decisioni organizzative: individuare assunzioni implicite, spiegazioni alternative e salti logici.\n\nProtegge le organizzazioni dalle decisioni prese sull'onda dell'entusiasmo. Non è il freno, è il sistema di controllo che rende una scelta difendibile e ripetibile. Si esprime al meglio quando l'analisi ha un termine definito: la domanda utile non è «so tutto?» ma «so abbastanza per decidere bene?».",
    strengths: [
      "Individua errori logici e assunzioni non verificate",
      "Fonda le decisioni su dati e nessi causali",
      "Struttura problemi complessi in componenti gestibili",
      "Riduce il rischio di scelte basate solo sull'entusiasmo",
    ],
    blindSpots: [
      "Analisi che si prolunga oltre l'utile",
      "Percepito come scettico o demotivante",
      "Sottovaluta gli elementi qualitativi e relazionali",
      "Fatica nei contesti che richiedono decisioni istintive",
    ],
    actionTips: [
      "Fissa in anticipo la soglia di dati che ti basta per decidere",
      "Presenta le obiezioni insieme a una proposta alternativa",
      "Comunica i risultati in forma narrativa, non solo numerica",
    ],
    thrivesIn: [
      "Analisi dei dati",
      "Controllo di gestione",
      "Ricerca",
    ],
    leaderApplication:
      "Proteggi il gruppo dalle decisioni prese sull'onda dell'entusiasmo: con te al tavolo le scelte diventano difendibili e ripetibili. Il rischio è che lo scetticismo venga letto come sfiducia e spenga le proposte prima che maturino. Fissa la soglia di dati che ti basta e accompagna ogni obiezione con un'alternativa: così sei il sistema di controllo, non il freno.",
    managerApplication:
      "Coinvolgilo prima che la decisione sia presa, non dopo: usato come revisore finale diventa un freno, usato all'inizio è un moltiplicatore di qualità. Concorda la soglia di dati sufficiente, altrimenti l'analisi non finisce mai. Chiedigli di raccontare i risultati: il suo rigore arriva più lontano quando è narrato.",
  },
  {
    slug: "coordinamento-adattivo",
    name: "Coordinamento Adattivo",
    area: "regolazione",
    tagline: "Riconfiguri persone e risorse finché l'insieme non funziona.",
    definition:
      "Descrive la capacità di gestire molte variabili interdipendenti e di ridisporle quando le condizioni cambiano. Si distingue dalla strutturazione perché non cerca stabilità: cerca la configurazione migliore, e la cambia volentieri.\n\nÈ il tratto che fa emergere efficienze invisibili agli altri, perché tiene simultaneamente presenti vincoli che di solito si considerano uno alla volta. Matura quando la riconfigurazione smette di essere continua: a un certo punto una disposizione va lasciata stabilizzare, perché anche le persone hanno bisogno di sapere dove stanno.",
    strengths: [
      "Gestisce molte variabili in movimento senza perdere il quadro",
      "Trova la combinazione di risorse che rende di più",
      "Si adatta rapidamente quando le condizioni cambiano",
      "Fa emergere efficienze che agli altri sfuggono",
    ],
    blindSpots: [
      "Può riorganizzare così spesso da destabilizzare il gruppo",
      "Ottimizza processi che andrebbero eliminati",
      "Fatica a spiegare un metodo che per lui è intuitivo",
      "Accentra troppe informazioni su di sé",
    ],
    actionTips: [
      "Dichiara quando una disposizione è definitiva: al gruppo serve stabilità",
      "Documenta le tue configurazioni, così non dipendono solo da te",
      "Prima di ottimizzare, chiediti se l'attività serve ancora",
    ],
    thrivesIn: [
      "Operations e supply chain",
      "Gestione di progetti complessi",
      "Coordinamento di team multipli",
    ],
    leaderApplication:
      "Sei bravissimo a mettere le persone giuste nei posti giusti e a rimescolare quando il contesto cambia: un vantaggio enorme nelle fasi di crescita o riorganizzazione. Il rischio è che ciò che per te è ottimizzazione, per il team sia instabilità. Ogni riconfigurazione ha un costo umano: annuncia le mosse in anticipo, spiega il criterio e concedi periodi dichiarati di stabilità.",
    managerApplication:
      "Dagli progetti con molte parti mobili e la libertà di ridisporle. Chiedigli però di scrivere il metodo, altrimenti l'organizzazione dipende dalla sua testa. Attenzione a non usarlo come tappabuchi permanente: la sua flessibilità lo rende la persona a cui chiedi sempre l'ultimo favore, e nel tempo lo logora.",
  },
  {
    slug: "ricostruzione-diagnostica",
    name: "Ricostruzione Diagnostica",
    area: "regolazione",
    tagline: "Ti accendi davanti a ciò che è rotto: capirlo e ripararlo ti dà energia.",
    definition:
      "Descrive l'attrazione per i sistemi malfunzionanti e la capacità di risalire dai sintomi alla causa. Combina problem solving diagnostico e motivazione al ripristino: la soddisfazione non sta nel possedere la soluzione, ma nel vedere qualcosa tornare a funzionare.\n\nÈ il profilo che si attiva nelle crisi e che le organizzazioni notano soprattutto quando qualcosa va storto. Il rovescio è l'attenzione permanentemente puntata su ciò che non va: matura quando la stessa energia viene usata anche per riconoscere e consolidare ciò che funziona.",
    strengths: [
      "Risale rapidamente alla causa dei malfunzionamenti",
      "Dà il meglio nelle crisi e nelle situazioni degradate",
      "Recupera progetti e processi che altri darebbero per persi",
      "Non si scoraggia davanti a problemi ricorrenti",
    ],
    blindSpots: [
      "Vede prima i difetti che i risultati",
      "Ripara all'infinito ciò che andrebbe sostituito",
      "Il feedback risulta sbilanciato sul negativo",
      "Cerca problemi anche dove non ce ne sono",
    ],
    actionTips: [
      "Per ogni criticità che segnali, nomina anche una cosa che funziona",
      "Chiediti se conviene riparare o ripartire da zero",
      "Trasforma le riparazioni ricorrenti in una correzione strutturale",
    ],
    thrivesIn: [
      "Assistenza tecnica",
      "Risanamento e gestione crisi",
      "Diagnostica",
    ],
    leaderApplication:
      "Sei chi le persone vogliono quando qualcosa va male: mantieni la lucidità, isoli la causa e riporti il sistema in funzione. Il rischio è cronico e sottile: se il gruppo ti sente nominare solo ciò che non va, si convince di non fare mai abbastanza. La proporzione conta più dell'accuratezza — nomina esplicitamente ciò che funziona, altrimenti la tua diagnosi corretta produrrà un team demotivato.",
    managerApplication:
      "Mandalo dove le cose sono rotte: progetti in difficoltà, clienti insoddisfatti, processi che perdono pezzi. Bilancia però il suo feedback quando lo dà ad altri, perché tenderà al negativo. E chiedigli ogni tanto se quello che sta riparando vada invece sostituito.",
  },
  {
    slug: "equita-procedurale",
    name: "Equità Procedurale",
    area: "regolazione",
    tagline: "Le stesse regole per tutti: le eccezioni non spiegate ti sembrano una crepa.",
    definition:
      "Descrive la sensibilità alla coerenza dei criteri con cui si distribuiscono compiti, riconoscimenti e sanzioni. È il costrutto di giustizia procedurale della psicologia organizzativa: ciò che le persone giudicano non è solo l'esito, ma la trasparenza del processo che vi ha condotto.\n\nDove c'è questo tratto i processi sono dichiarati e le decisioni difendibili, e questo riduce drasticamente il rumore politico. La versione matura riconosce che trattamento uguale e trattamento equo non sempre coincidono: persone in situazioni diverse possono aver bisogno di supporti diversi per avere le stesse opportunità.",
    strengths: [
      "Costruisce processi trasparenti e criteri dichiarati",
      "Riduce le dinamiche politiche e i favoritismi",
      "Difende chi ha meno voce nel gruppo",
      "Rende le decisioni difendibili e ripetibili",
    ],
    blindSpots: [
      "Applica la regola anche quando il caso richiede giudizio",
      "Legge come ingiustizia ogni differenziazione",
      "Fatica con i sistemi molto sbilanciati sul merito individuale",
      "Rallenta decisioni che richiederebbero un'eccezione",
    ],
    actionTips: [
      "Distingui uguale da equo: a volte serve un supporto diverso",
      "Definisci in anticipo quali eccezioni sono legittime, e perché",
      "Usa la tua sensibilità per progettare i criteri, non solo per contestarli",
    ],
    thrivesIn: [
      "Risorse umane e relazioni sindacali",
      "Audit e conformità",
      "Amministrazione pubblica",
    ],
    leaderApplication:
      "Garantisci qualcosa che le persone percepiscono immediatamente: che le regole valgono per tutti, te compreso. È la base della sicurezza psicologica di un team. Il rischio è la rigidità, perché alcune situazioni chiedono un giudizio e non un'applicazione. Dichiara in anticipo dove il criterio è rigido e dove c'è discrezionalità, e motiva ogni eccezione: una eccezione spiegata non incrina l'equità, una silenziosa sì.",
    managerApplication:
      "Sii trasparente sui criteri con cui assegni compiti, valutazioni e riconoscimenti: le differenze non spiegate le vive come ingiustizie e perde fiducia rapidamente. Usalo per progettare processi di valutazione o selezione. Quando devi fare un'eccezione, dagliene la ragione prima che la scopra da solo.",
  },
  {
    slug: "sintonizzazione-empatica",
    name: "Sintonizzazione Empatica",
    area: "relazione",
    tagline: "Percepisci gli stati d'animo prima che vengano detti.",
    definition:
      "Descrive la capacità di percepire e riconoscere accuratamente le emozioni altrui, anche quando non sono espresse. È la componente di percezione emotiva nei modelli di intelligenza emotiva come abilità: un'informazione che agli altri semplicemente non arriva.\n\nNelle organizzazioni funziona da sistema di allerta precoce: il disagio di un collega o la tensione latente in un gruppo vengono colti quando sono ancora gestibili. Diventa forza professionale quando si impara a usare l'informazione emotiva senza esserne travolti: percepire non obbliga ad assorbire.",
    strengths: [
      "Coglie tensioni e disagi prima che diventino conflitti",
      "Crea rapidamente fiducia e sicurezza psicologica",
      "Sceglie le parole giuste nei momenti delicati",
      "Aiuta il gruppo a dare voce a ciò che resta implicito",
    ],
    blindSpots: [
      "Assorbe il carico emotivo altrui fino all'esaurimento",
      "Evita conversazioni necessarie per non ferire",
      "Le decisioni impopolari ma corrette costano molto",
      "Interpreta come personale un problema organizzativo",
    ],
    actionTips: [
      "Distingui ogni giorno ciò che senti da ciò di cui sei responsabile",
      "Usa ciò che percepisci come domanda, non come conclusione",
      "Allenati al feedback difficile: la cura include la sincerità",
    ],
    thrivesIn: [
      "Risorse umane e gestione persone",
      "Coaching e counseling",
      "Successo del cliente",
    ],
    leaderApplication:
      "Percepisci lo stato del gruppo molto prima che diventi un problema formale: è un sistema di allerta precoce che pochi leader possiedono. Il rischio è farti carico del disagio altrui fino a rinviare le decisioni scomode. La cura, in un ruolo di guida, include la sincerità: dire chiaramente una cosa difficile è più rispettoso che proteggere qualcuno da un'informazione che lo riguarda.",
    managerApplication:
      "È il tuo termometro sul clima: chiedigli cosa percepisce, ma non scaricargli addosso la gestione emotiva del gruppo. Proteggi i suoi momenti di recupero dopo le conversazioni difficili. Aiutalo ad allenare il feedback scomodo: tenderà a evitarlo, e quel silenzio a lungo andare danneggia proprio le persone che vuole proteggere.",
  },
  {
    slug: "regolazione-del-conflitto",
    name: "Regolazione del Conflitto",
    area: "relazione",
    tagline: "Cerchi il terreno comune: lo scontro sterile ti sembra uno spreco.",
    definition:
      "Descrive la propensione a ridurre l'attrito interpersonale e a ricercare accordi praticabili fra posizioni distanti. È lo stile di gestione del conflitto orientato all'integrazione e al compromesso, che abbassa il costo relazionale delle decisioni.\n\nÈ un tratto sottovalutato e molto efficace: permette ai gruppi di procedere senza lasciare rancori sul percorso, e quindi di eseguire davvero ciò che hanno deciso. La versione matura non evita il conflitto, lo rende produttivo: porta la discussione sui fatti e sugli obiettivi invece che sulle posizioni personali.",
    strengths: [
      "Trova rapidamente il terreno comune fra posizioni opposte",
      "Abbassa la temperatura emotiva delle discussioni difficili",
      "Facilita decisioni condivise e quindi realmente eseguite",
      "Crea ambienti collaborativi",
    ],
    blindSpots: [
      "Cede sul merito pur di evitare tensione",
      "Lascia passare sotto silenzio disaccordi importanti",
      "Il consenso apparente nasconde problemi irrisolti",
      "Fatica dove il dibattito acceso è la norma",
    ],
    actionTips: [
      "Distingui i conflitti da spegnere da quelli da far emergere",
      "Chiedi il parere dei dissenzienti prima di chiudere",
      "Prepara in anticipo la tua posizione sulle questioni non negoziabili",
    ],
    thrivesIn: [
      "Mediazione e negoziazione",
      "Team interfunzionali",
      "Relazioni con i clienti",
    ],
    leaderApplication:
      "Riduci il costo relazionale delle decisioni: le persone escono dalle tue riunioni allineate e senza rancori, quindi eseguono davvero. Il pericolo è il consenso apparente, che nasconde i disaccordi invece di risolverli e li fa riemergere in esecuzione. Distingui i conflitti da spegnere da quelli da far emergere: alcuni dissensi sono informazione che il gruppo ti sta offrendo.",
    managerApplication:
      "Usalo dove servono accordi che reggano nel tempo: mediazioni, progetti interfunzionali, clienti difficili. Chiedigli però la sua posizione in privato e in modo esplicito, perché in gruppo tenderà a smussarla. Prima di chiudere una decisione, verifica con lui se il consenso è reale o solo apparente.",
  },
  {
    slug: "innesco-relazionale",
    name: "Innesco Relazionale",
    area: "relazione",
    tagline: "Avvii con facilità rapporti nuovi, e ti diverte farlo.",
    definition:
      "Descrive la bassa soglia di attivazione nei contatti con persone sconosciute e il piacere associato. Corrisponde alla sfaccettatura di socievolezza dell'estroversione: una stanza piena di sconosciuti non è una prova da superare, è un'opportunità.\n\nQuesto tratto costruisce reti ampie in tempi brevi, e quella rete diventa un patrimonio dell'organizzazione: le informazioni circolano, le porte si aprono, le collaborazioni nascono. Matura quando alla larghezza si aggiunge profondità: le reti ampie aprono le porte, ma sono le relazioni solide a farci passare qualcosa di importante.",
    strengths: [
      "Costruisce reti ampie in tempi brevissimi",
      "Mette a proprio agio le persone nuove",
      "Collega mondi organizzativi separati",
      "Rappresenta il gruppo verso l'esterno con naturalezza",
    ],
    blindSpots: [
      "Privilegia la quantità dei contatti sulla profondità",
      "Percepito come superficiale o interessato",
      "Fatica nei lavori isolati e prolungati",
      "Disperde energia su troppe relazioni",
    ],
    actionTips: [
      "Scegli dieci relazioni all'anno da coltivare in profondità",
      "Dopo un evento, fai seguito con poche persone invece che con tutte",
      "Usa la tua rete per presentare gli altri, non solo te stesso",
    ],
    thrivesIn: [
      "Sviluppo commerciale",
      "Partnership e relazioni esterne",
      "Selezione del personale",
    ],
    leaderApplication:
      "Sei la porta d'ingresso del tuo gruppo verso il resto dell'organizzazione e verso l'esterno: le collaborazioni che servono al team passano spesso dalla tua rete. Attenzione a due cose: che la rete serva al gruppo e non solo a te, e che la facilità con cui entri in relazione non venga scambiata per superficialità nelle conversazioni che richiedono profondità, come un feedback difficile.",
    managerApplication:
      "Mettilo in prima linea: primi contatti, eventi, inserimento dei nuovi, clienti freddi. Ottiene in un pomeriggio ciò che ad altri costa settimane. Chiedigli però di trasferire i contatti al gruppo, altrimenti la rete resta sua e non dell'organizzazione. Non isolarlo in ruoli prolungatamente solitari.",
  },
  {
    slug: "comunicazione-persuasiva",
    name: "Comunicazione Persuasiva",
    area: "relazione",
    tagline: "Rendi vive le idee: le spieghi, le racconti, le fai ricordare.",
    definition:
      "Descrive la capacità di tradurre contenuti complessi in messaggi comprensibili e memorabili, e di orientare così le decisioni altrui. Unisce competenza comunicativa e influenza sociale non gerarchica: si ottiene adesione senza ricorrere all'autorità.\n\nHa un impatto diretto sulla circolazione delle idee: le informazioni non restano nei documenti, ma diventano qualcosa che le persone possono usare. La competenza matura consiste nel mettere la capacità espressiva al servizio del messaggio e non della performance: la domanda guida è «che cosa deve capire chi ascolta».",
    strengths: [
      "Traduce concetti complessi in messaggi immediati",
      "Cattura e mantiene l'attenzione",
      "Rende memorabili dati, progetti e strategie",
      "Allinea funzioni che parlano linguaggi diversi",
    ],
    blindSpots: [
      "Occupa spazio conversazionale a scapito dei più silenziosi",
      "Il racconto brillante copre un contenuto ancora acerbo",
      "Valutato sullo stile più che sulla sostanza",
      "Sottovaluta l'importanza della documentazione scritta",
    ],
    actionTips: [
      "In riunione poniti l'obiettivo di far parlare gli altri per primi",
      "Prepara sempre una versione scritta di ciò che presenti",
      "Verifica chiedendo «cosa avete capito?» invece di «è chiaro?»",
    ],
    thrivesIn: [
      "Marketing e comunicazione",
      "Formazione",
      "Relazioni istituzionali",
    ],
    leaderApplication:
      "La tua leva è il senso: trasformi una strategia astratta in qualcosa che le persone ricordano il lunedì mattina. Attenzione allo spazio che occupi, perché un leader che parla bene tende a riempire il silenzio, ed è nel silenzio che emergono le idee degli altri. Misurati non da quanto sei stato chiaro, ma da quanto il gruppo sa ripetere la direzione senza di te.",
    managerApplication:
      "Mettilo dove il messaggio deve arrivare: presentazioni, inserimento, allineamento fra funzioni. Chiedigli sempre la versione scritta di ciò che presenta, per non valutarlo sullo stile invece che sulla sostanza. In riunione aiutalo a fare spazio ai colleghi più silenziosi.",
  },
  {
    slug: "assertivita-direttiva",
    name: "Assertività Direttiva",
    area: "relazione",
    tagline: "Prendi posizione e dici le cose come stanno.",
    definition:
      "Descrive la disponibilità ad assumere il controllo di una situazione ambigua e a esprimere posizioni scomode senza attenuarle. È la sfaccettatura di dominanza dell'estroversione, distinta dall'aggressività: l'obiettivo è la chiarezza, non la prevaricazione.\n\nQuesta persona porta chiarezza dove il gruppo gira a vuoto: mette sul tavolo ciò che gli altri pensano e non dicono, e obbliga a fare i conti con la realtà. La maturità sta nel dosaggio, perché la stessa forza che sblocca una situazione può schiacciare chi ha meno voce.",
    strengths: [
      "Mette sul tavolo i temi che gli altri evitano",
      "Prende il controllo nelle situazioni ambigue o bloccate",
      "Non teme il confronto né le conversazioni difficili",
      "Dà al gruppo una posizione da cui partire",
    ],
    blindSpots: [
      "Può intimidire e far tacere i profili riservati",
      "Trasforma un confronto in uno scontro",
      "Decide da solo dove servirebbe coinvolgimento",
      "Sottovaluta l'impatto della propria intensità",
    ],
    actionTips: [
      "Chiedi il parere degli altri prima di dichiarare il tuo",
      "Distingui i temi su cui vuoi decidere da quelli su cui vuoi discutere",
      "Verifica come è arrivato il messaggio, non solo se era corretto",
    ],
    thrivesIn: [
      "Gestione di crisi",
      "Negoziazione",
      "Ruoli imprenditoriali",
    ],
    leaderApplication:
      "Nei momenti confusi dai al gruppo una posizione chiara e qualcuno che se ne assume la responsabilità. Il rischio è che la tua presenza riempia tutto lo spazio disponibile e che il team smetta di portarti dissenso, cioè proprio l'informazione che ti serve. Parla per ultimo nelle riunioni decisionali e interpella chi non ha parlato: il tuo peso rende il silenzio degli altri molto probabile.",
    managerApplication:
      "Dagli responsabilità visibili e situazioni difficili da sbloccare. Sii diretto con lui, perché apprezza la franchezza e diffida dei giri di parole. Lavora però sul suo impatto: chiedigli feedback specifico su come viene percepito, perché tende a sottovalutarlo.",
  },
  {
    slug: "facilitazione-della-crescita",
    name: "Facilitazione della Crescita",
    area: "relazione",
    tagline: "Vedi il potenziale delle persone e non riesci a ignorarlo.",
    definition:
      "Descrive l'attenzione al potenziale inespresso degli altri e la soddisfazione derivante dal vederlo emergere. È il nucleo del comportamento di sviluppo altrui: una forma di cittadinanza organizzativa che produce effetti composti nel tempo.\n\nLe persone che crescono restano, e a loro volta fanno crescere altri: chi ha questo tratto costruisce spesso, senza accorgersene, la panchina di talenti dell'organizzazione. La maturità sta nel distinguere il potenziale reale dal proprio desiderio di aiutare: non tutti, in quel momento, vogliono essere sviluppati.",
    strengths: [
      "Riconosce e nomina il potenziale che gli altri non vedono in sé",
      "Costruisce percorsi di crescita concreti e su misura",
      "Ha pazienza autentica per l'apprendimento altrui",
      "Genera fedeltà e continuità nei gruppi che segue",
    ],
    blindSpots: [
      "Investe a lungo su chi non è realmente motivato",
      "Tollera prestazioni insufficienti troppo a lungo",
      "Trascura il proprio percorso di crescita",
      "Il feedback diventa troppo morbido per essere utile",
    ],
    actionTips: [
      "Chiedi esplicitamente «vuoi crescere su questo?» prima di investire",
      "Definisci traguardi osservabili e una scadenza",
      "Dedica a te stesso l'attenzione che dedichi agli altri",
    ],
    thrivesIn: [
      "Gestione di team",
      "Formazione e sviluppo",
      "Mentoring",
    ],
    leaderApplication:
      "La tua leadership produce un effetto composto: le persone che fai crescere restano e a loro volta fanno crescere altri. Il rischio è investire a lungo su chi non è motivato e tollerare prestazioni insufficienti oltre il ragionevole. Chiedi esplicitamente se la persona vuole crescere su quel fronte prima di investirci: la risposta cambia tutto.",
    managerApplication:
      "Affidagli le persone nuove e chi ha bisogno di crescere: è lì che il suo tratto produce ritorno composto. Concorda però traguardi osservabili e una scadenza, altrimenti investirà a tempo indeterminato. Aiutalo a dare feedback abbastanza diretto da essere utile, e ricordagli di curare il proprio percorso.",
  },
  {
    slug: "autonomia-decisionale",
    name: "Autonomia Decisionale",
    area: "direzione",
    tagline: "Hai una bussola interna e la segui anche senza conferme.",
    definition:
      "Descrive la fiducia nel proprio giudizio e la capacità di decidere senza aver bisogno di rassicurazione esterna. Nella letteratura corrisponde alle autovalutazioni nucleari: la convinzione stabile di poter incidere sugli eventi che ci riguardano.\n\nNei momenti di incertezza la presenza di una persona ferma riduce l'ansia collettiva e permette al gruppo di muoversi. Il tratto esprime il meglio quando la sicurezza è accompagnata da ascolto reale: essere certi della propria rotta non impedisce di aggiornare la mappa.",
    strengths: [
      "Decide con lucidità sotto incertezza e pressione",
      "Non richiede approvazione costante per procedere",
      "Trasmette stabilità nei momenti critici",
      "Sostiene posizioni impopolari quando le ritiene corrette",
    ],
    blindSpots: [
      "Può apparire poco permeabile ai pareri altrui",
      "Sottostima i propri punti deboli",
      "Decide da solo dove servirebbe coinvolgimento",
      "Fatica a chiedere aiuto quando ne avrebbe bisogno",
    ],
    actionTips: [
      "Prima di decidere, cerca attivamente l'opinione più distante dalla tua",
      "Rendi espliciti i criteri: la sicurezza diventa fiducia solo se verificabile",
      "Distingui i temi su cui sei competente da quelli su cui sei solo sicuro",
    ],
    thrivesIn: [
      "Direzione generale",
      "Ruoli imprenditoriali",
      "Consulenza strategica",
    ],
    leaderApplication:
      "Nei momenti di incertezza la tua fermezza abbassa l'ansia collettiva e permette al gruppo di muoversi: è un contributo raro. Il rischio è che la stessa fermezza chiuda la porta al dissenso, e un leader che non riceve più cattive notizie sta guidando alla cieca. Rendi espliciti i criteri delle tue decisioni: la sicurezza diventa fiducia solo quando è verificabile dagli altri.",
    managerApplication:
      "Dagli autonomia reale e responsabilità visibili: il controllo ravvicinato lo spegne più di qualsiasi altro profilo. Non ha bisogno di rassicurazione, quindi non sprecare feedback generico. Cerca però attivamente il suo confronto con opinioni distanti dalla sua: è la sua principale area cieca.",
  },
  {
    slug: "curiosita-esplorativa",
    name: "Curiosità Esplorativa",
    area: "apertura",
    tagline: "Il passaggio dal non sapere al sapere ti dà energia quanto il risultato.",
    definition:
      "Descrive l'attrazione per l'acquisizione di conoscenza e la raccolta di informazioni, indipendentemente dall'utilità immediata. Corrisponde alla curiosità epistemica descritta negli studi sull'apertura all'esperienza: il processo di apprendere è di per sé gratificante.\n\nRende adatti ai contesti che cambiano rapidamente, perché la novità non minaccia ma stimola. Il tratto diventa vantaggio competitivo quando l'apprendimento viene indirizzato: scegliere in che cosa diventare davvero bravi moltiplica il valore della curiosità.",
    strengths: [
      "Si aggiorna in autonomia e assorbe rapidamente ambiti nuovi",
      "Affronta il cambiamento con curiosità invece che con ansia",
      "Porta nel gruppo strumenti, metodi e riferimenti nuovi",
      "Dispone di riferimenti e precedenti che agli altri mancano",
    ],
    blindSpots: [
      "Accumula conoscenza senza tradurla in risultati",
      "Lascia i temi appena superata la curva iniziale",
      "Disperde il focus su troppi fronti",
      "Rimanda la decisione in cerca di altre informazioni",
    ],
    actionTips: [
      "Per ogni cosa che impari, definisci dove la applicherai entro trenta giorni",
      "Scegli una competenza all'anno in cui puntare alla padronanza",
      "Insegna ciò che impari: consolida te e crea valore per il gruppo",
    ],
    thrivesIn: [
      "Tecnologia e ricerca",
      "Consulenza",
      "Contesti in forte cambiamento",
    ],
    leaderApplication:
      "Guidi bene i contesti che cambiano, perché la novità non ti minaccia: sei tra i primi ad adottare metodi nuovi e a diffonderli. Il rischio è trascinare il team su troppi fronti e lasciare i temi appena superata la curva ripida. Il valore non è ciò che impari, ma ciò che rendi patrimonio del gruppo: insegna quello che apprendi e scegli in che cosa la squadra deve diventare davvero brava.",
    managerApplication:
      "Assegnagli i progetti mai fatti prima: la curva ripida è la sua zona di massima energia. Chiedigli però dove applicherà entro trenta giorni ciò che impara, altrimenti la conoscenza resta scollegata dai risultati. Fallo insegnare al gruppo: consolida lui e crea valore per gli altri.",
  },
  {
    slug: "generazione-ideativa",
    name: "Generazione Ideativa",
    area: "apertura",
    tagline: "Colleghi cose lontane e ne esce qualcosa che non c'era.",
    definition:
      "Descrive la fluidità nel produrre alternative e la tendenza a riformulare i problemi invece di risolverli nella forma data. È il versante divergente del pensiero creativo: molte opzioni, anche remote, prima di restringere il campo.\n\nÈ il carburante dell'innovazione: dove altri vedono un vincolo, questo tratto vede una riformulazione possibile. La maturità consiste nel selezionare: molte idee sono interessanti, poche sono utili adesso, e chi impara a scegliere trasforma la creatività in impatto.",
    strengths: [
      "Genera soluzioni originali dove gli approcci standard falliscono",
      "Riformula i problemi trovando angoli inaspettati",
      "Alimenta il pensiero laterale dell'intero gruppo",
      "Vede opportunità dentro i vincoli",
    ],
    blindSpots: [
      "Moltiplica le idee senza portarne a termine nessuna",
      "Si annoia nella fase esecutiva",
      "Le idee troppo distanti dal contesto vengono scartate a priori",
      "Cambia direzione quando il gruppo aveva appena preso il ritmo",
    ],
    actionTips: [
      "Tieni un archivio delle idee: libera la mente senza perderle",
      "Per ogni idea che proponi, indica il primo passo concreto",
      "Fissa un limite: al massimo due iniziative nuove per trimestre",
    ],
    thrivesIn: [
      "Progettazione di prodotto",
      "Ricerca e sviluppo",
      "Pubblicità e creatività",
    ],
    leaderApplication:
      "Riformuli il problema quando la squadra sbatte contro un vincolo: dove altri vedono un muro, tu vedi una domanda posta male. Il rischio è cambiare direzione appena il gruppo aveva trovato il ritmo, pagando in fiducia ciò che guadagni in creatività. Per ogni idea che porti indica il primo passo concreto, e proteggi le iniziative già in corso.",
    managerApplication:
      "Dagli problemi mal posti e vincoli difficili: è dove rende di più. Tieni un archivio delle sue idee e chiedi, per ciascuna, il primo passo concreto. Non assegnargli lunghe fasi esecutive ripetitive: perderà energia e con essa affidabilità.",
  },
  {
    slug: "flessibilita-adattiva",
    name: "Flessibilità Adattiva",
    area: "apertura",
    tagline: "Vivi nel presente e ti muovi con quello che arriva.",
    definition:
      "Descrive la capacità di mantenere efficacia quando le condizioni cambiano in modo imprevisto. È il nucleo della performance adattiva descritta da Pulakos: gestire l'incertezza e riorganizzare rapidamente il proprio comportamento.\n\nUn piano che salta non è un fallimento, è la situazione nuova da cui ripartire. Mentre gli altri sono ancora fermi allo shock del cambio di programma, questo tratto sta già lavorando alla versione successiva. Matura quando l'apertura al presente non diventa assenza di direzione.",
    strengths: [
      "Resta produttivo quando i piani cambiano all'improvviso",
      "Abbassa l'ansia del gruppo nelle situazioni incerte",
      "Gestisce bene emergenze e priorità mobili",
      "Accoglie richieste dell'ultimo minuto senza irrigidirsi",
    ],
    blindSpots: [
      "Fatica con la pianificazione a lungo termine",
      "Reagisce invece di scegliere",
      "Appare poco affidabile a chi ha bisogno di struttura",
      "Rimanda ciò che non è urgente adesso",
    ],
    actionTips: [
      "Fissa pochi obiettivi lunghi e verificali ogni mese",
      "Distingui ciò che è urgente da ciò che è solo recente",
      "Proteggi tempo per il non urgente, o non lo farai mai",
    ],
    thrivesIn: [
      "Pronto intervento e assistenza clienti",
      "Redazioni e produzione",
      "Fasi iniziali d'impresa",
    ],
    leaderApplication:
      "Tieni il gruppo calmo quando salta tutto, e la tua reazione al caos è ciò che il team imita: nei momenti di crisi è un dono enorme. Il rischio è che la squadra non percepisca mai una direzione stabile, perché tu stesso ne senti poco il bisogno. Dichiara pochi punti fermi che non cambiano — la meta del periodo, i criteri di priorità — e lascia mobile tutto il resto.",
    managerApplication:
      "Usalo dove il contesto è imprevedibile: emergenze, priorità mobili, clienti che cambiano idea. Non punirlo per la scarsa pianificazione a lungo termine, ma affiancagli qualcuno strutturato sui progetti lunghi. Aiutalo a proteggere il lavoro importante ma non urgente.",
  },
  {
    slug: "integrazione-sistemica",
    name: "Integrazione Sistemica",
    area: "apertura",
    tagline: "Vedi i legami e le conseguenze oltre il tuo perimetro.",
    definition:
      "Descrive la tendenza a inquadrare eventi e decisioni dentro un sistema più ampio, tenendo conto della storia che li ha prodotti e degli effetti a valle. Unisce pensiero sistemico e sensibilità al contesto: il singolo fatto si comprende solo nella rete di cui fa parte.\n\nNelle organizzazioni funziona da ponte: collega funzioni che si ignorano, ricorda le conseguenze delle decisioni e impedisce di smontare soluzioni che rispondevano a un problema ancora presente. Matura quando la visione d'insieme non impedisce di agire sul particolare.",
    strengths: [
      "Anticipa le conseguenze a valle delle decisioni",
      "Collega funzioni e persone che resterebbero separate",
      "Evita che il gruppo ripeta errori già commessi",
      "Dà senso e prospettiva nei momenti difficili",
    ],
    blindSpots: [
      "Si perde nel quadro generale senza agire sul dettaglio",
      "Usa il precedente come argomento contro il cambiamento",
      "Rallenta le decisioni con considerazioni troppo ampie",
      "Fatica nei contesti puramente transazionali",
    ],
    actionTips: [
      "Chiudi ogni ragionamento d'insieme con l'azione concreta della settimana",
      "Distingui «si è sempre fatto così» da «ci sono ragioni valide»",
      "Usa il tuo sguardo per fare da ponte, non solo per commentare",
    ],
    thrivesIn: [
      "Ruoli di raccordo fra funzioni",
      "Gestione del cambiamento",
      "Sostenibilità e impatto",
    ],
    leaderApplication:
      "Dai al gruppo il senso di far parte di qualcosa che va oltre il compito, ed eviti il costo più stupido che esista: rifare errori già fatti. Il rischio è restare sul piano del significato senza atterrare sulle decisioni, e che il precedente diventi un veto implicito. Chiudi ogni discorso d'insieme con la conseguenza operativa, e dichiara esplicitamente quando la decisione è comunque aperta.",
    managerApplication:
      "Spiegagli sempre dove si colloca il suo lavoro nel quadro complessivo. Usalo come ponte fra funzioni che non si parlano e chiedigli di valutare le conseguenze a valle prima delle decisioni importanti. Aiutalo però a chiudere sul concreto: tenderà ad allargare quando servirebbe scegliere.",
  },
  {
    slug: "elaborazione-riflessiva",
    name: "Elaborazione Riflessiva",
    area: "apertura",
    tagline: "Hai bisogno di pensare, e il pensiero stesso è un'attività.",
    definition:
      "Descrive la propensione all'attività mentale prolungata e al piacere che ne deriva, indipendentemente dall'applicazione immediata. Corrisponde al bisogno di cognizione: la tendenza a impegnarsi in ragionamenti impegnativi e a trovarli gratificanti.\n\nProduce profondità: le domande poste spostano le conversazioni di livello, e le conclusioni arrivano dopo un lavoro che gli altri non hanno visto. Matura quando il pensiero viene condiviso: chi riflette molto e comunica poco lascia il gruppo senza il beneficio del proprio lavoro.",
    strengths: [
      "Porta profondità e domande che spostano il livello",
      "Elabora soluzioni ponderate a problemi complessi",
      "Lavora bene in autonomia e in silenzio",
      "Coglie implicazioni che sfuggono nelle discussioni veloci",
    ],
    blindSpots: [
      "Sembra distaccato o poco partecipe",
      "Rimanda l'azione a favore della riflessione",
      "Fatica nelle riunioni molto rapide e reattive",
      "Tiene per sé conclusioni che sarebbero preziose",
    ],
    actionTips: [
      "Condividi il pensiero anche se non è ancora concluso",
      "Chiedi l'ordine del giorno in anticipo: rendi migliori le riunioni",
      "Datti una scadenza per passare dal pensiero alla proposta",
    ],
    thrivesIn: [
      "Ricerca e sviluppo",
      "Strategia e analisi",
      "Progettazione e scrittura",
    ],
    leaderApplication:
      "Porti profondità dove il ritmo aziendale spinge alla reazione, e le tue domande impediscono al gruppo di risolvere il problema sbagliato. Il rischio è il silenzio, che in un ruolo di guida viene letto come distanza o disapprovazione. Pensa a voce alta più di quanto ti venga naturale: condividere un ragionamento in corso non è indecisione, è dare al gruppo accesso al tuo contributo migliore.",
    managerApplication:
      "Mandagli i materiali prima delle riunioni: a freddo rende poco, preparato è la persona più utile del tavolo. Proteggi blocchi di lavoro profondo senza interruzioni. Non confondere il suo silenzio con disaccordo: chiediglielo esplicitamente, magari per iscritto.",
  },
  {
    slug: "positivita-motivazionale",
    name: "Positività Motivazionale",
    area: "apertura",
    tagline: "Porti energia: con te intorno lavorare pesa meno.",
    definition:
      "Descrive la tendenza a mantenere e trasmettere uno stato affettivo positivo, anche nelle difficoltà. È vicina alle componenti di ottimismo e resilienza del capitale psicologico: non negazione dei problemi, ma capacità di trovare l'elemento che rimette in moto.\n\nCambia il clima di un gruppo in modo misurabile: nei progetti lunghi impedisce che la stanchezza diventi rassegnazione. Matura quando l'ottimismo non impedisce di guardare in faccia i problemi: l'energia serve ad affrontarli, non a evitare di nominarli.",
    strengths: [
      "Solleva il clima e l'energia dell'intero gruppo",
      "Sostiene la motivazione nei progetti lunghi e faticosi",
      "Riconosce e celebra i progressi degli altri",
      "Rende sostenibili i periodi di carico elevato",
    ],
    blindSpots: [
      "Minimizza problemi che andrebbero affrontati",
      "Percepito come poco realistico",
      "Fatica nei contesti cinici o molto formali",
      "Forza l'entusiasmo quando non è il momento",
    ],
    actionTips: [
      "Nomina il problema prima di offrire l'incoraggiamento",
      "Lascia spazio a chi sta male senza correggerne subito l'umore",
      "Lega l'entusiasmo a un fatto concreto: diventa credibile",
    ],
    thrivesIn: [
      "Vendite ed esperienza cliente",
      "Formazione",
      "Team sotto pressione",
    ],
    leaderApplication:
      "Determini il clima più di quanto immagini: il tuo stato d'animo è la variabile che il gruppo legge ogni mattina, e la tua energia rende sostenibili i periodi duri. Il rischio è che l'ottimismo costante impedisca alle cattive notizie di arrivarti, perché nessuno vuole spegnere l'entusiasmo. Nomina tu per primo i problemi: un leader positivo che dice chiaramente cosa non va viene creduto due volte.",
    managerApplication:
      "Mettilo dove il clima conta: gruppi sotto pressione, prima linea, progetti lunghi. Chiedigli però esplicitamente cosa non funziona, perché tenderà a smussare. E non chiedergli entusiasmo nei momenti in cui il gruppo ha bisogno di essere ascoltato.",
  },
];

export const MPF_TRAITS_BY_AREA = MPF_AREAS.map((area) => ({
  area,
  traits: MPF_TRAITS.filter((t) => t.area === area.slug),
}));
