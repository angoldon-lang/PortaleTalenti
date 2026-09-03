/* eslint-disable */
// ---------------------------------------------------------------------------
// FILE GENERATO da scripts/mpf/gen_blocchi.py — non modificare a mano.
// Le affermazioni sono in scripts/mpf/affermazioni/*.json.
// ---------------------------------------------------------------------------

export type MpfOptionSeed = { position: number; trait: string; statement: string };
export type MpfBlockSeed = {
  position: number;
  /** Posizione del blocco di cui questo ripropone i tratti: solo controllo di coerenza, escluso dai punteggi. */
  controlFor?: number;
  options: MpfOptionSeed[];
};

/** 53 blocchi (45 a punteggio + 8 di controllo) · 30 tratti · 6 comparse per tratto */
const MPF_ESSENZIALE: MpfBlockSeed[] = [
  {
    position: 1,
    options: [
      {
        position: 1,
        trait: "sintonizzazione-empatica",
        statement: "Percepisco lo stato d'animo degli altri prima che lo dicano",
      },
      {
        position: 2,
        trait: "prudenza-valutativa",
        statement: "Prima di impegnarmi valuto che cosa può andare storto",
      },
      {
        position: 3,
        trait: "ottimizzazione-qualitativa",
        statement: "Mi interessa portare il buono a eccellente",
      },
      {
        position: 4,
        trait: "ancoraggio-valoriale",
        statement: "Alcuni principi per me non sono negoziabili",
      },
    ],
  },
  {
    position: 2,
    options: [
      {
        position: 1,
        trait: "autoefficacia-realizzativa",
        statement: "Sento il bisogno di chiudere qualcosa di concreto ogni giorno",
      },
      {
        position: 2,
        trait: "elaborazione-riflessiva",
        statement: "Ho bisogno di tempo per pensare prima di rispondere",
      },
      {
        position: 3,
        trait: "strutturazione-metodica",
        statement: "Amo pianificare i dettagli prima di iniziare",
      },
      {
        position: 4,
        trait: "proiezione-prospettica",
        statement: "Immagino con chiarezza come potrebbero essere le cose fra anni",
      },
    ],
  },
  {
    position: 3,
    options: [
      {
        position: 1,
        trait: "ambizione-visibile",
        statement: "Voglio che il mio contributo lasci un segno",
      },
      {
        position: 2,
        trait: "innesco-relazionale",
        statement: "Rompo il ghiaccio con gli sconosciuti senza fatica",
      },
      {
        position: 3,
        trait: "analisi-evidenziale",
        statement: "Prima di accettare una tesi chiedo su quali dati si basa",
      },
      {
        position: 4,
        trait: "curiosita-esplorativa",
        statement: "Mi dà energia il passaggio dal non sapere al sapere",
      },
    ],
  },
  {
    position: 4,
    options: [
      {
        position: 1,
        trait: "persistenza-operativa",
        statement: "Quello che comincio lo porto a termine",
      },
      {
        position: 2,
        trait: "coordinamento-adattivo",
        statement: "Mi piace riorganizzare le risorse finché tutto non incastra",
      },
      {
        position: 3,
        trait: "generazione-ideativa",
        statement: "Mi entusiasmano le idee nuove più della loro esecuzione",
      },
      {
        position: 4,
        trait: "assertivita-direttiva",
        statement: "Dico le cose come stanno anche quando è scomodo",
      },
    ],
  },
  {
    position: 5,
    options: [
      {
        position: 1,
        trait: "comunicazione-persuasiva",
        statement: "Mi viene naturale spiegare le cose in modo che tutti capiscano",
      },
      {
        position: 2,
        trait: "focalizzazione-selettiva",
        statement: "Scelgo una direzione e non la perdo di vista",
      },
      {
        position: 3,
        trait: "flessibilita-adattiva",
        statement: "Mi muovo bene quando i piani cambiano all'improvviso",
      },
      {
        position: 4,
        trait: "responsabilita-assunta",
        statement: "Quando prometto qualcosa per me diventa un obbligo",
      },
    ],
  },
  {
    position: 6,
    options: [
      {
        position: 1,
        trait: "orientamento-allo-scopo",
        statement: "Ho bisogno di sapere a che cosa serve quello che faccio",
      },
      {
        position: 2,
        trait: "iniziativa-proattiva",
        statement: "Faccio il primo passo prima che me lo chiedano",
      },
      {
        position: 3,
        trait: "facilitazione-della-crescita",
        statement: "Vedo negli altri il potenziale che loro non vedono ancora",
      },
      {
        position: 4,
        trait: "equita-procedurale",
        statement: "Le stesse regole devono valere per tutti",
      },
    ],
  },
  {
    position: 7,
    options: [
      {
        position: 1,
        trait: "ricostruzione-diagnostica",
        statement: "Mi accendo davanti a qualcosa che non funziona",
      },
      {
        position: 2,
        trait: "integrazione-sistemica",
        statement: "Sento che le cose sono collegate fra loro",
      },
      {
        position: 3,
        trait: "spinta-competitiva",
        statement: "Misuro i miei risultati su quelli degli altri",
      },
      {
        position: 4,
        trait: "autonomia-decisionale",
        statement: "Prendo decisioni difficili senza cercare conferme",
      },
    ],
  },
  {
    position: 8,
    options: [
      {
        position: 1,
        trait: "analisi-evidenziale",
        statement: "Cerco sempre la causa dietro un risultato",
      },
      {
        position: 2,
        trait: "autonomia-decisionale",
        statement: "So di poter gestire quasi qualunque situazione mi capiti",
      },
      {
        position: 3,
        trait: "regolazione-del-conflitto",
        statement: "Cerco sempre il punto d'incontro fra posizioni diverse",
      },
      {
        position: 4,
        trait: "positivita-motivazionale",
        statement: "Porto energia nei gruppi in cui lavoro",
      },
    ],
  },
  {
    position: 9,
    options: [
      {
        position: 1,
        trait: "generazione-ideativa",
        statement: "Collego cose che sembrano non c'entrare nulla fra loro",
      },
      {
        position: 2,
        trait: "equita-procedurale",
        statement: "I favoritismi mi disturbano più di qualunque inefficienza",
      },
      {
        position: 3,
        trait: "autoefficacia-realizzativa",
        statement: "Misuro la giornata da quanto ho prodotto",
      },
      {
        position: 4,
        trait: "regolazione-del-conflitto",
        statement: "Le discussioni accese mi sembrano energia sprecata",
      },
    ],
  },
  {
    position: 10,
    options: [
      {
        position: 1,
        trait: "curiosita-esplorativa",
        statement: "Studio volentieri argomenti che non mi servono subito",
      },
      {
        position: 2,
        trait: "ottimizzazione-qualitativa",
        statement: "Preferisco rifinire ciò che funziona che aggiustare ciò che non va",
      },
      {
        position: 3,
        trait: "focalizzazione-selettiva",
        statement: "Valuto ogni attività chiedendomi se mi avvicina all'obiettivo",
      },
      {
        position: 4,
        trait: "facilitazione-della-crescita",
        statement: "I progressi di chi affianco mi danno molta soddisfazione",
      },
    ],
  },
  {
    position: 11,
    options: [
      {
        position: 1,
        trait: "positivita-motivazionale",
        statement: "Trovo il lato buono anche nelle giornate storte",
      },
      {
        position: 2,
        trait: "orientamento-allo-scopo",
        statement: "Il senso di un'attività conta per me più della sua ricompensa",
      },
      {
        position: 3,
        trait: "innesco-relazionale",
        statement: "Una stanza piena di gente nuova mi mette di buon umore",
      },
      {
        position: 4,
        trait: "strutturazione-metodica",
        statement: "Ho bisogno di un metodo chiaro per lavorare bene",
      },
    ],
  },
  {
    position: 12,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "Vivo il presente più che il futuro programmato",
      },
      {
        position: 2,
        trait: "sintonizzazione-empatica",
        statement: "Le emozioni delle persone attorno a me mi arrivano forte",
      },
      {
        position: 3,
        trait: "coordinamento-adattivo",
        statement: "Gestisco bene molte cose in movimento contemporaneamente",
      },
      {
        position: 4,
        trait: "spinta-competitiva",
        statement: "Vincere mi dà una soddisfazione che il solo risultato non dà",
      },
    ],
  },
  {
    position: 13,
    options: [
      {
        position: 1,
        trait: "assertivita-direttiva",
        statement: "Prendo io il controllo quando la situazione è confusa",
      },
      {
        position: 2,
        trait: "ambizione-visibile",
        statement: "Scelgo volentieri i progetti che si vedono",
      },
      {
        position: 3,
        trait: "responsabilita-assunta",
        statement: "Se un lavoro esce male sento che la responsabilità è mia",
      },
      {
        position: 4,
        trait: "elaborazione-riflessiva",
        statement: "Il pensiero per me è un'attività, non una preparazione",
      },
    ],
  },
  {
    position: 14,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Verifico che quello che faccio sia coerente con ciò in cui credo",
      },
      {
        position: 2,
        trait: "persistenza-operativa",
        statement: "Continuo anche quando l'entusiasmo iniziale è finito",
      },
      {
        position: 3,
        trait: "integrazione-sistemica",
        statement: "Considero le conseguenze che vanno oltre il mio perimetro",
      },
      {
        position: 4,
        trait: "ricostruzione-diagnostica",
        statement: "Trovo soddisfazione nel rimettere in piedi ciò che è rotto",
      },
    ],
  },
  {
    position: 15,
    options: [
      {
        position: 1,
        trait: "prudenza-valutativa",
        statement: "Scelgo le parole con attenzione prima di parlare",
      },
      {
        position: 2,
        trait: "proiezione-prospettica",
        statement: "Il futuro mi dà più energia del presente",
      },
      {
        position: 3,
        trait: "iniziativa-proattiva",
        statement: "Preferisco provare che continuare a discutere",
      },
      {
        position: 4,
        trait: "comunicazione-persuasiva",
        statement: "Uso storie ed esempi concreti per far arrivare un concetto",
      },
    ],
  },
  {
    position: 16,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "Un cambio di programma non mi rovina la giornata",
      },
      {
        position: 2,
        trait: "assertivita-direttiva",
        statement: "Il confronto diretto non mi mette a disagio",
      },
      {
        position: 3,
        trait: "orientamento-allo-scopo",
        statement: "Mi disimpegno quando un compito mi sembra privo di scopo",
      },
      {
        position: 4,
        trait: "analisi-evidenziale",
        statement: "Diffido delle conclusioni tratte da pochi casi",
      },
    ],
  },
  {
    position: 17,
    options: [
      {
        position: 1,
        trait: "innesco-relazionale",
        statement: "Conosco qualcuno in quasi ogni ambiente che frequento",
      },
      {
        position: 2,
        trait: "generazione-ideativa",
        statement: "Davanti a un vincolo cerco un modo diverso di vedere il problema",
      },
      {
        position: 3,
        trait: "proiezione-prospettica",
        statement: "Descrivo scenari che gli altri riescono a vedere",
      },
      {
        position: 4,
        trait: "ottimizzazione-qualitativa",
        statement: "Individuo subito i punti di forza delle persone",
      },
    ],
  },
  {
    position: 18,
    options: [
      {
        position: 1,
        trait: "responsabilita-assunta",
        statement: "Preferisco fare tardi che consegnare qualcosa di incompleto",
      },
      {
        position: 2,
        trait: "positivita-motivazionale",
        statement: "Il mio entusiasmo si trasmette agli altri",
      },
      {
        position: 3,
        trait: "equita-procedurale",
        statement: "Preferisco criteri dichiarati alle decisioni caso per caso",
      },
      {
        position: 4,
        trait: "ancoraggio-valoriale",
        statement: "Rinuncio a un vantaggio se ottenerlo richiede una scorciatoia",
      },
    ],
  },
  {
    position: 19,
    options: [
      {
        position: 1,
        trait: "coordinamento-adattivo",
        statement: "Quando un piano salta ridispongo i pezzi senza agitarmi",
      },
      {
        position: 2,
        trait: "comunicazione-persuasiva",
        statement: "Prendo la parola per chiarire il punto",
      },
      {
        position: 3,
        trait: "ambizione-visibile",
        statement: "Mi motiva sapere che il mio lavoro verrà notato",
      },
      {
        position: 4,
        trait: "autoefficacia-realizzativa",
        statement: "Il lavoro arretrato mi toglie serenità",
      },
    ],
  },
  {
    position: 20,
    options: [
      {
        position: 1,
        trait: "iniziativa-proattiva",
        statement: "Sblocco io le situazioni in cui nessuno si muove",
      },
      {
        position: 2,
        trait: "curiosita-esplorativa",
        statement: "Quando inizio qualcosa di nuovo mi sento nel mio elemento",
      },
      {
        position: 3,
        trait: "strutturazione-metodica",
        statement: "Le scadenze scritte in calendario mi danno sicurezza",
      },
      {
        position: 4,
        trait: "sintonizzazione-empatica",
        statement: "Capisco come sta qualcuno dal tono con cui parla",
      },
    ],
  },
  {
    position: 21,
    options: [
      {
        position: 1,
        trait: "focalizzazione-selettiva",
        statement: "Riporto al punto le discussioni che divagano",
      },
      {
        position: 2,
        trait: "regolazione-del-conflitto",
        statement: "Preferisco cedere su un dettaglio che incrinare un rapporto",
      },
      {
        position: 3,
        trait: "elaborazione-riflessiva",
        statement: "Preferisco riflettere da solo che discutere subito",
      },
      {
        position: 4,
        trait: "persistenza-operativa",
        statement: "Gli ostacoli ripetuti non mi fanno desistere",
      },
    ],
  },
  {
    position: 22,
    options: [
      {
        position: 1,
        trait: "integrazione-sistemica",
        statement: "Prima di cambiare qualcosa voglio sapere a cosa serviva",
      },
      {
        position: 2,
        trait: "facilitazione-della-crescita",
        statement: "Mi ritrovo a fare da riferimento anche senza un ruolo formale",
      },
      {
        position: 3,
        trait: "autonomia-decisionale",
        statement: "Sostengo una scelta anche quando resto solo",
      },
      {
        position: 4,
        trait: "prudenza-valutativa",
        statement: "Preferisco una decisione ponderata a una rapida",
      },
    ],
  },
  {
    position: 23,
    options: [
      {
        position: 1,
        trait: "ambizione-visibile",
        statement: "Punto a traguardi importanti più che a piccoli passi",
      },
      {
        position: 2,
        trait: "ricostruzione-diagnostica",
        statement: "Individuo rapidamente la causa di un malfunzionamento",
      },
      {
        position: 3,
        trait: "spinta-competitiva",
        statement: "Le classifiche mi motivano più degli obiettivi assoluti",
      },
      {
        position: 4,
        trait: "generazione-ideativa",
        statement: "Genero molte alternative anche quando una soluzione c'è già",
      },
    ],
  },
  {
    position: 24,
    options: [
      {
        position: 1,
        trait: "assertivita-direttiva",
        statement: "Metto sul tavolo ciò che gli altri pensano ma non dicono",
      },
      {
        position: 2,
        trait: "ricostruzione-diagnostica",
        statement: "Nelle crisi divento più lucido, non meno",
      },
      {
        position: 3,
        trait: "positivita-motivazionale",
        statement: "Celebro volentieri i piccoli progressi",
      },
      {
        position: 4,
        trait: "iniziativa-proattiva",
        statement: "Mi muovo anche quando non ho tutte le informazioni",
      },
    ],
  },
  {
    position: 25,
    options: [
      {
        position: 1,
        trait: "facilitazione-della-crescita",
        statement: "Ho pazienza con chi impara lentamente",
      },
      {
        position: 2,
        trait: "analisi-evidenziale",
        statement: "Mi piace smontare un problema nelle sue componenti",
      },
      {
        position: 3,
        trait: "persistenza-operativa",
        statement: "Faccio fatica ad abbandonare un progetto avviato",
      },
      {
        position: 4,
        trait: "proiezione-prospettica",
        statement: "Colgo le tendenze prima che diventino evidenti",
      },
    ],
  },
  {
    position: 26,
    controlFor: 1,
    options: [
      {
        position: 1,
        trait: "prudenza-valutativa",
        statement: "Mi sento a disagio quando si decide senza valutare i rischi",
      },
      {
        position: 2,
        trait: "ottimizzazione-qualitativa",
        statement: "Noto la differenza fra un lavoro buono e uno ottimo",
      },
      {
        position: 3,
        trait: "sintonizzazione-empatica",
        statement: "Faccio fatica a restare indifferente quando qualcuno sta male",
      },
      {
        position: 4,
        trait: "ancoraggio-valoriale",
        statement: "Preferisco spiegare un no che concederlo controvoglia",
      },
    ],
  },
  {
    position: 27,
    options: [
      {
        position: 1,
        trait: "innesco-relazionale",
        statement: "Mi diverte conquistare la simpatia di chi non mi conosce",
      },
      {
        position: 2,
        trait: "autoefficacia-realizzativa",
        statement: "Preferisco una giornata piena a una leggera",
      },
      {
        position: 3,
        trait: "prudenza-valutativa",
        statement: "Anticipo gli ostacoli che gli altri non hanno considerato",
      },
      {
        position: 4,
        trait: "flessibilita-adattiva",
        statement: "Rispondo volentieri alle richieste dell'ultimo minuto",
      },
    ],
  },
  {
    position: 28,
    options: [
      {
        position: 1,
        trait: "ottimizzazione-qualitativa",
        statement: "Mi accontento raramente di un risultato sufficiente",
      },
      {
        position: 2,
        trait: "strutturazione-metodica",
        statement: "Costruisco procedure per non dover ridecidere ogni volta",
      },
      {
        position: 3,
        trait: "comunicazione-persuasiva",
        statement: "Mi diverte trovare la frase giusta per riassumere un'idea",
      },
      {
        position: 4,
        trait: "orientamento-allo-scopo",
        statement: "Scelgo i progetti in base a cosa producono, non a cosa rendono",
      },
    ],
  },
  {
    position: 29,
    options: [
      {
        position: 1,
        trait: "focalizzazione-selettiva",
        statement: "Elimino senza esitare ciò che non porta al risultato",
      },
      {
        position: 2,
        trait: "responsabilita-assunta",
        statement: "Non riesco a lasciare un impegno a metà",
      },
      {
        position: 3,
        trait: "integrazione-sistemica",
        statement: "Faccio da ponte fra ambiti che si ignorano",
      },
      {
        position: 4,
        trait: "coordinamento-adattivo",
        statement: "Trovo combinazioni di persone che rendono più della somma",
      },
    ],
  },
  {
    position: 30,
    controlFor: 4,
    options: [
      {
        position: 1,
        trait: "assertivita-direttiva",
        statement: "Preferisco uno scontro chiaro a un accordo ambiguo",
      },
      {
        position: 2,
        trait: "persistenza-operativa",
        statement: "Preferisco finire una cosa che iniziarne tre",
      },
      {
        position: 3,
        trait: "coordinamento-adattivo",
        statement: "Coordino più attività parallele senza perdere il filo",
      },
      {
        position: 4,
        trait: "generazione-ideativa",
        statement: "Le mie idee migliori arrivano mentre faccio altro",
      },
    ],
  },
  {
    position: 31,
    options: [
      {
        position: 1,
        trait: "equita-procedurale",
        statement: "Mi accorgo subito quando qualcuno riceve un trattamento diverso",
      },
      {
        position: 2,
        trait: "elaborazione-riflessiva",
        statement: "Le riunioni troppo rapide non mi permettono di contribuire",
      },
      {
        position: 3,
        trait: "sintonizzazione-empatica",
        statement: "Prima di rispondere penso a come si sentirà chi ascolta",
      },
      {
        position: 4,
        trait: "autonomia-decisionale",
        statement: "Le critiche non mi fanno cambiare rotta facilmente",
      },
    ],
  },
  {
    position: 32,
    options: [
      {
        position: 1,
        trait: "regolazione-del-conflitto",
        statement: "Faccio da ponte quando due persone non si parlano",
      },
      {
        position: 2,
        trait: "curiosita-esplorativa",
        statement: "Accumulo letture e approfondimenti per pura curiosità",
      },
      {
        position: 3,
        trait: "ancoraggio-valoriale",
        statement: "Le mie scelte partono sempre dagli stessi criteri di fondo",
      },
      {
        position: 4,
        trait: "spinta-competitiva",
        statement: "Vivo male le sconfitte anche quando contano poco",
      },
    ],
  },
  {
    position: 33,
    controlFor: 7,
    options: [
      {
        position: 1,
        trait: "ricostruzione-diagnostica",
        statement: "Non mi scoraggio davanti a problemi che tornano",
      },
      {
        position: 2,
        trait: "autonomia-decisionale",
        statement: "Resto lucido quando gli altri si agitano",
      },
      {
        position: 3,
        trait: "spinta-competitiva",
        statement: "Un contesto senza confronto mi toglie energia",
      },
      {
        position: 4,
        trait: "integrazione-sistemica",
        statement: "Riconosco i pattern che si ripetono nel tempo",
      },
    ],
  },
  {
    position: 34,
    options: [
      {
        position: 1,
        trait: "ottimizzazione-qualitativa",
        statement: "Investo sulle cose in cui sono già bravo",
      },
      {
        position: 2,
        trait: "flessibilita-adattiva",
        statement: "Preferisco reagire alla situazione che seguire un piano",
      },
      {
        position: 3,
        trait: "ricostruzione-diagnostica",
        statement: "Noto per primo i difetti in un lavoro finito",
      },
      {
        position: 4,
        trait: "regolazione-del-conflitto",
        statement: "Evito di sollevare obiezioni che non siano decisive",
      },
    ],
  },
  {
    position: 35,
    options: [
      {
        position: 1,
        trait: "sintonizzazione-empatica",
        statement: "Mi accorgo della tensione in una stanza anche nel silenzio",
      },
      {
        position: 2,
        trait: "autoefficacia-realizzativa",
        statement: "Mi metto all'opera subito, anche senza avere tutto chiaro",
      },
      {
        position: 3,
        trait: "focalizzazione-selettiva",
        statement: "Le priorità che cambiano di continuo mi disorientano",
      },
      {
        position: 4,
        trait: "analisi-evidenziale",
        statement: "Preferisco un dato verificato a un'impressione condivisa",
      },
    ],
  },
  {
    position: 36,
    options: [
      {
        position: 1,
        trait: "spinta-competitiva",
        statement: "Voglio sapere come sto andando rispetto agli altri",
      },
      {
        position: 2,
        trait: "proiezione-prospettica",
        statement: "Penso spesso a dove saremo fra qualche tempo",
      },
      {
        position: 3,
        trait: "positivita-motivazionale",
        statement: "Preferisco incoraggiare che criticare",
      },
      {
        position: 4,
        trait: "coordinamento-adattivo",
        statement: "Cambio volentieri assetto se scopro un modo migliore",
      },
    ],
  },
  {
    position: 37,
    controlFor: 10,
    options: [
      {
        position: 1,
        trait: "ottimizzazione-qualitativa",
        statement: "Noto la differenza fra un lavoro buono e uno ottimo",
      },
      {
        position: 2,
        trait: "facilitazione-della-crescita",
        statement: "Noto i piccoli miglioramenti delle persone e glieli dico",
      },
      {
        position: 3,
        trait: "curiosita-esplorativa",
        statement: "Il cambiamento mi incuriosisce più di quanto mi preoccupi",
      },
      {
        position: 4,
        trait: "focalizzazione-selettiva",
        statement: "Ho bisogno di sapere esattamente dove stiamo andando",
      },
    ],
  },
  {
    position: 38,
    options: [
      {
        position: 1,
        trait: "equita-procedurale",
        statement: "Difendo chi ha meno voce nelle discussioni",
      },
      {
        position: 2,
        trait: "innesco-relazionale",
        statement: "Costruisco nuovi contatti con grande facilità",
      },
      {
        position: 3,
        trait: "orientamento-allo-scopo",
        statement: "Chiedo spesso perché stiamo facendo una certa cosa",
      },
      {
        position: 4,
        trait: "integrazione-sistemica",
        statement: "Mi interessa il quadro generale più del singolo pezzo",
      },
    ],
  },
  {
    position: 39,
    options: [
      {
        position: 1,
        trait: "elaborazione-riflessiva",
        statement: "Rimugino a lungo sulle questioni complesse",
      },
      {
        position: 2,
        trait: "comunicazione-persuasiva",
        statement: "Curo come dirò le cose, non solo cosa dirò",
      },
      {
        position: 3,
        trait: "ancoraggio-valoriale",
        statement: "So esattamente quali sono le cose su cui non transigo",
      },
      {
        position: 4,
        trait: "iniziativa-proattiva",
        statement: "Le lunghe riunioni preparatorie mi tolgono energia",
      },
    ],
  },
  {
    position: 40,
    options: [
      {
        position: 1,
        trait: "autonomia-decisionale",
        statement: "Mi fido del mio giudizio più del parere della maggioranza",
      },
      {
        position: 2,
        trait: "prudenza-valutativa",
        statement: "Mi muovo con cautela nelle situazioni che non conosco",
      },
      {
        position: 3,
        trait: "curiosita-esplorativa",
        statement: "Preferisco un progetto mai fatto prima a uno che padroneggio",
      },
      {
        position: 4,
        trait: "assertivita-direttiva",
        statement: "La mia presenza si nota quando entro in una discussione",
      },
    ],
  },
  {
    position: 41,
    controlFor: 13,
    options: [
      {
        position: 1,
        trait: "responsabilita-assunta",
        statement: "Controllo due volte prima di consegnare",
      },
      {
        position: 2,
        trait: "ambizione-visibile",
        statement: "Il lavoro invisibile mi dà meno energia",
      },
      {
        position: 3,
        trait: "elaborazione-riflessiva",
        statement: "Le mie conclusioni arrivano dopo un lavoro che non si vede",
      },
      {
        position: 4,
        trait: "assertivita-direttiva",
        statement: "Preferisco uno scontro chiaro a un accordo ambiguo",
      },
    ],
  },
  {
    position: 42,
    options: [
      {
        position: 1,
        trait: "strutturazione-metodica",
        statement: "I cambi di programma mi infastidiscono",
      },
      {
        position: 2,
        trait: "generazione-ideativa",
        statement: "Mi annoio quando si ripete sempre lo stesso schema",
      },
      {
        position: 3,
        trait: "responsabilita-assunta",
        statement: "Anche gli impegni presi a voce per me contano",
      },
      {
        position: 4,
        trait: "facilitazione-della-crescita",
        statement: "Preferisco insegnare a fare che fare al posto di qualcuno",
      },
    ],
  },
  {
    position: 43,
    options: [
      {
        position: 1,
        trait: "persistenza-operativa",
        statement: "Resto sul problema finché non trovo una via d'uscita",
      },
      {
        position: 2,
        trait: "equita-procedurale",
        statement: "Le eccezioni non spiegate mi sembrano una crepa",
      },
      {
        position: 3,
        trait: "flessibilita-adattiva",
        statement: "Le emergenze non mi mettono in difficoltà",
      },
      {
        position: 4,
        trait: "ambizione-visibile",
        statement: "Mi piace essere associato a iniziative che contano",
      },
    ],
  },
  {
    position: 44,
    controlFor: 16,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "Le emergenze non mi mettono in difficoltà",
      },
      {
        position: 2,
        trait: "assertivita-direttiva",
        statement: "Preferisco uno scontro chiaro a un accordo ambiguo",
      },
      {
        position: 3,
        trait: "analisi-evidenziale",
        statement: "Individuo rapidamente i punti deboli di un ragionamento",
      },
      {
        position: 4,
        trait: "orientamento-allo-scopo",
        statement: "Trovo energia nel contribuire a qualcosa di più grande",
      },
    ],
  },
  {
    position: 45,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Preferisco spiegare un no che concederlo controvoglia",
      },
      {
        position: 2,
        trait: "ottimizzazione-qualitativa",
        statement: "Noto la differenza fra un lavoro buono e uno ottimo",
      },
      {
        position: 3,
        trait: "assertivita-direttiva",
        statement: "Preferisco uno scontro chiaro a un accordo ambiguo",
      },
      {
        position: 4,
        trait: "analisi-evidenziale",
        statement: "Individuo rapidamente i punti deboli di un ragionamento",
      },
    ],
  },
  {
    position: 46,
    options: [
      {
        position: 1,
        trait: "iniziativa-proattiva",
        statement: "Quando un'idea mi convince voglio testarla subito",
      },
      {
        position: 2,
        trait: "regolazione-del-conflitto",
        statement: "Un accordo condiviso vale più di una decisione perfetta",
      },
      {
        position: 3,
        trait: "ambizione-visibile",
        statement: "Il lavoro invisibile mi dà meno energia",
      },
      {
        position: 4,
        trait: "integrazione-sistemica",
        statement: "Riconosco i pattern che si ripetono nel tempo",
      },
    ],
  },
  {
    position: 47,
    options: [
      {
        position: 1,
        trait: "generazione-ideativa",
        statement: "Le mie idee migliori arrivano mentre faccio altro",
      },
      {
        position: 2,
        trait: "autonomia-decisionale",
        statement: "Resto lucido quando gli altri si agitano",
      },
      {
        position: 3,
        trait: "comunicazione-persuasiva",
        statement: "Parlare davanti a un pubblico mi dà energia",
      },
      {
        position: 4,
        trait: "coordinamento-adattivo",
        statement: "Coordino più attività parallele senza perdere il filo",
      },
    ],
  },
  {
    position: 48,
    controlFor: 19,
    options: [
      {
        position: 1,
        trait: "ambizione-visibile",
        statement: "Il lavoro invisibile mi dà meno energia",
      },
      {
        position: 2,
        trait: "comunicazione-persuasiva",
        statement: "Parlare davanti a un pubblico mi dà energia",
      },
      {
        position: 3,
        trait: "coordinamento-adattivo",
        statement: "Coordino più attività parallele senza perdere il filo",
      },
      {
        position: 4,
        trait: "autoefficacia-realizzativa",
        statement: "Faccio fatica a stare fermo se resta qualcosa da finire",
      },
    ],
  },
  {
    position: 49,
    options: [
      {
        position: 1,
        trait: "curiosita-esplorativa",
        statement: "Il cambiamento mi incuriosisce più di quanto mi preoccupi",
      },
      {
        position: 2,
        trait: "facilitazione-della-crescita",
        statement: "Noto i piccoli miglioramenti delle persone e glieli dico",
      },
      {
        position: 3,
        trait: "autoefficacia-realizzativa",
        statement: "Faccio fatica a stare fermo se resta qualcosa da finire",
      },
      {
        position: 4,
        trait: "ricostruzione-diagnostica",
        statement: "Non mi scoraggio davanti a problemi che tornano",
      },
    ],
  },
  {
    position: 50,
    options: [
      {
        position: 1,
        trait: "orientamento-allo-scopo",
        statement: "Trovo energia nel contribuire a qualcosa di più grande",
      },
      {
        position: 2,
        trait: "persistenza-operativa",
        statement: "Preferisco finire una cosa che iniziarne tre",
      },
      {
        position: 3,
        trait: "elaborazione-riflessiva",
        statement: "Le mie conclusioni arrivano dopo un lavoro che non si vede",
      },
      {
        position: 4,
        trait: "prudenza-valutativa",
        statement: "Mi sento a disagio quando si decide senza valutare i rischi",
      },
    ],
  },
  {
    position: 51,
    options: [
      {
        position: 1,
        trait: "positivita-motivazionale",
        statement: "Riesco a rendere piacevole anche un lavoro noioso",
      },
      {
        position: 2,
        trait: "sintonizzazione-empatica",
        statement: "Faccio fatica a restare indifferente quando qualcuno sta male",
      },
      {
        position: 3,
        trait: "proiezione-prospettica",
        statement: "Mi entusiasmano le possibilità che ancora non esistono",
      },
      {
        position: 4,
        trait: "responsabilita-assunta",
        statement: "Controllo due volte prima di consegnare",
      },
    ],
  },
  {
    position: 52,
    controlFor: 22,
    options: [
      {
        position: 1,
        trait: "autonomia-decisionale",
        statement: "Resto lucido quando gli altri si agitano",
      },
      {
        position: 2,
        trait: "facilitazione-della-crescita",
        statement: "Noto i piccoli miglioramenti delle persone e glieli dico",
      },
      {
        position: 3,
        trait: "integrazione-sistemica",
        statement: "Riconosco i pattern che si ripetono nel tempo",
      },
      {
        position: 4,
        trait: "prudenza-valutativa",
        statement: "Prima di impegnarmi valuto che cosa può andare storto",
      },
    ],
  },
  {
    position: 53,
    options: [
      {
        position: 1,
        trait: "spinta-competitiva",
        statement: "Un contesto senza confronto mi toglie energia",
      },
      {
        position: 2,
        trait: "strutturazione-metodica",
        statement: "Divido ogni progetto in fasi con responsabili e date",
      },
      {
        position: 3,
        trait: "innesco-relazionale",
        statement: "Preferisco conoscere molte persone che poche a fondo",
      },
      {
        position: 4,
        trait: "focalizzazione-selettiva",
        statement: "Ho bisogno di sapere esattamente dove stiamo andando",
      },
    ],
  },
];

/** 68 blocchi (60 a punteggio + 8 di controllo) · 30 tratti · 8 comparse per tratto */
const MPF_COMPLETA: MpfBlockSeed[] = [
  {
    position: 1,
    options: [
      {
        position: 1,
        trait: "positivita-motivazionale",
        statement: "Porto energia nei gruppi in cui lavoro",
      },
      {
        position: 2,
        trait: "coordinamento-adattivo",
        statement: "Mi piace riorganizzare le risorse finché tutto non incastra",
      },
      {
        position: 3,
        trait: "spinta-competitiva",
        statement: "Misuro i miei risultati su quelli degli altri",
      },
      {
        position: 4,
        trait: "innesco-relazionale",
        statement: "Rompo il ghiaccio con gli sconosciuti senza fatica",
      },
    ],
  },
  {
    position: 2,
    options: [
      {
        position: 1,
        trait: "equita-procedurale",
        statement: "Le stesse regole devono valere per tutti",
      },
      {
        position: 2,
        trait: "regolazione-del-conflitto",
        statement: "Cerco sempre il punto d'incontro fra posizioni diverse",
      },
      {
        position: 3,
        trait: "integrazione-sistemica",
        statement: "Sento che le cose sono collegate fra loro",
      },
      {
        position: 4,
        trait: "ambizione-visibile",
        statement: "Voglio che il mio contributo lasci un segno",
      },
    ],
  },
  {
    position: 3,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "Mi muovo bene quando i piani cambiano all'improvviso",
      },
      {
        position: 2,
        trait: "responsabilita-assunta",
        statement: "Quando prometto qualcosa per me diventa un obbligo",
      },
      {
        position: 3,
        trait: "strutturazione-metodica",
        statement: "Amo pianificare i dettagli prima di iniziare",
      },
      {
        position: 4,
        trait: "orientamento-allo-scopo",
        statement: "Ho bisogno di sapere a che cosa serve quello che faccio",
      },
    ],
  },
  {
    position: 4,
    options: [
      {
        position: 1,
        trait: "comunicazione-persuasiva",
        statement: "Mi viene naturale spiegare le cose in modo che tutti capiscano",
      },
      {
        position: 2,
        trait: "autoefficacia-realizzativa",
        statement: "Sento il bisogno di chiudere qualcosa di concreto ogni giorno",
      },
      {
        position: 3,
        trait: "autonomia-decisionale",
        statement: "Prendo decisioni difficili senza cercare conferme",
      },
      {
        position: 4,
        trait: "ricostruzione-diagnostica",
        statement: "Mi accendo davanti a qualcosa che non funziona",
      },
    ],
  },
  {
    position: 5,
    options: [
      {
        position: 1,
        trait: "curiosita-esplorativa",
        statement: "Mi dà energia il passaggio dal non sapere al sapere",
      },
      {
        position: 2,
        trait: "iniziativa-proattiva",
        statement: "Faccio il primo passo prima che me lo chiedano",
      },
      {
        position: 3,
        trait: "ancoraggio-valoriale",
        statement: "Alcuni principi per me non sono negoziabili",
      },
      {
        position: 4,
        trait: "sintonizzazione-empatica",
        statement: "Percepisco lo stato d'animo degli altri prima che lo dicano",
      },
    ],
  },
  {
    position: 6,
    options: [
      {
        position: 1,
        trait: "assertivita-direttiva",
        statement: "Dico le cose come stanno anche quando è scomodo",
      },
      {
        position: 2,
        trait: "focalizzazione-selettiva",
        statement: "Scelgo una direzione e non la perdo di vista",
      },
      {
        position: 3,
        trait: "persistenza-operativa",
        statement: "Quello che comincio lo porto a termine",
      },
      {
        position: 4,
        trait: "generazione-ideativa",
        statement: "Mi entusiasmano le idee nuove più della loro esecuzione",
      },
    ],
  },
  {
    position: 7,
    options: [
      {
        position: 1,
        trait: "ottimizzazione-qualitativa",
        statement: "Mi interessa portare il buono a eccellente",
      },
      {
        position: 2,
        trait: "elaborazione-riflessiva",
        statement: "Ho bisogno di tempo per pensare prima di rispondere",
      },
      {
        position: 3,
        trait: "prudenza-valutativa",
        statement: "Prima di impegnarmi valuto che cosa può andare storto",
      },
      {
        position: 4,
        trait: "facilitazione-della-crescita",
        statement: "Vedo negli altri il potenziale che loro non vedono ancora",
      },
    ],
  },
  {
    position: 8,
    options: [
      {
        position: 1,
        trait: "assertivita-direttiva",
        statement: "Prendo io il controllo quando la situazione è confusa",
      },
      {
        position: 2,
        trait: "analisi-evidenziale",
        statement: "Prima di accettare una tesi chiedo su quali dati si basa",
      },
      {
        position: 3,
        trait: "positivita-motivazionale",
        statement: "Trovo il lato buono anche nelle giornate storte",
      },
      {
        position: 4,
        trait: "proiezione-prospettica",
        statement: "Immagino con chiarezza come potrebbero essere le cose fra anni",
      },
    ],
  },
  {
    position: 9,
    options: [
      {
        position: 1,
        trait: "analisi-evidenziale",
        statement: "Cerco sempre la causa dietro un risultato",
      },
      {
        position: 2,
        trait: "autonomia-decisionale",
        statement: "So di poter gestire quasi qualunque situazione mi capiti",
      },
      {
        position: 3,
        trait: "elaborazione-riflessiva",
        statement: "Il pensiero per me è un'attività, non una preparazione",
      },
      {
        position: 4,
        trait: "iniziativa-proattiva",
        statement: "Preferisco provare che continuare a discutere",
      },
    ],
  },
  {
    position: 10,
    options: [
      {
        position: 1,
        trait: "regolazione-del-conflitto",
        statement: "Le discussioni accese mi sembrano energia sprecata",
      },
      {
        position: 2,
        trait: "strutturazione-metodica",
        statement: "Ho bisogno di un metodo chiaro per lavorare bene",
      },
      {
        position: 3,
        trait: "ottimizzazione-qualitativa",
        statement: "Preferisco rifinire ciò che funziona che aggiustare ciò che non va",
      },
      {
        position: 4,
        trait: "focalizzazione-selettiva",
        statement: "Valuto ogni attività chiedendomi se mi avvicina all'obiettivo",
      },
    ],
  },
  {
    position: 11,
    options: [
      {
        position: 1,
        trait: "orientamento-allo-scopo",
        statement: "Il senso di un'attività conta per me più della sua ricompensa",
      },
      {
        position: 2,
        trait: "persistenza-operativa",
        statement: "Continuo anche quando l'entusiasmo iniziale è finito",
      },
      {
        position: 3,
        trait: "comunicazione-persuasiva",
        statement: "Uso storie ed esempi concreti per far arrivare un concetto",
      },
      {
        position: 4,
        trait: "curiosita-esplorativa",
        statement: "Studio volentieri argomenti che non mi servono subito",
      },
    ],
  },
  {
    position: 12,
    options: [
      {
        position: 1,
        trait: "sintonizzazione-empatica",
        statement: "Le emozioni delle persone attorno a me mi arrivano forte",
      },
      {
        position: 2,
        trait: "flessibilita-adattiva",
        statement: "Vivo il presente più che il futuro programmato",
      },
      {
        position: 3,
        trait: "autoefficacia-realizzativa",
        statement: "Misuro la giornata da quanto ho prodotto",
      },
      {
        position: 4,
        trait: "coordinamento-adattivo",
        statement: "Gestisco bene molte cose in movimento contemporaneamente",
      },
    ],
  },
  {
    position: 13,
    options: [
      {
        position: 1,
        trait: "prudenza-valutativa",
        statement: "Scelgo le parole con attenzione prima di parlare",
      },
      {
        position: 2,
        trait: "proiezione-prospettica",
        statement: "Il futuro mi dà più energia del presente",
      },
      {
        position: 3,
        trait: "generazione-ideativa",
        statement: "Collego cose che sembrano non c'entrare nulla fra loro",
      },
      {
        position: 4,
        trait: "innesco-relazionale",
        statement: "Una stanza piena di gente nuova mi mette di buon umore",
      },
    ],
  },
  {
    position: 14,
    options: [
      {
        position: 1,
        trait: "spinta-competitiva",
        statement: "Vincere mi dà una soddisfazione che il solo risultato non dà",
      },
      {
        position: 2,
        trait: "integrazione-sistemica",
        statement: "Considero le conseguenze che vanno oltre il mio perimetro",
      },
      {
        position: 3,
        trait: "equita-procedurale",
        statement: "I favoritismi mi disturbano più di qualunque inefficienza",
      },
      {
        position: 4,
        trait: "ancoraggio-valoriale",
        statement: "Verifico che quello che faccio sia coerente con ciò in cui credo",
      },
    ],
  },
  {
    position: 15,
    options: [
      {
        position: 1,
        trait: "facilitazione-della-crescita",
        statement: "I progressi di chi affianco mi danno molta soddisfazione",
      },
      {
        position: 2,
        trait: "ambizione-visibile",
        statement: "Scelgo volentieri i progetti che si vedono",
      },
      {
        position: 3,
        trait: "ricostruzione-diagnostica",
        statement: "Trovo soddisfazione nel rimettere in piedi ciò che è rotto",
      },
      {
        position: 4,
        trait: "responsabilita-assunta",
        statement: "Se un lavoro esce male sento che la responsabilità è mia",
      },
    ],
  },
  {
    position: 16,
    options: [
      {
        position: 1,
        trait: "focalizzazione-selettiva",
        statement: "Riporto al punto le discussioni che divagano",
      },
      {
        position: 2,
        trait: "elaborazione-riflessiva",
        statement: "Preferisco riflettere da solo che discutere subito",
      },
      {
        position: 3,
        trait: "innesco-relazionale",
        statement: "Conosco qualcuno in quasi ogni ambiente che frequento",
      },
      {
        position: 4,
        trait: "autoefficacia-realizzativa",
        statement: "Il lavoro arretrato mi toglie serenità",
      },
    ],
  },
  {
    position: 17,
    options: [
      {
        position: 1,
        trait: "coordinamento-adattivo",
        statement: "Quando un piano salta ridispongo i pezzi senza agitarmi",
      },
      {
        position: 2,
        trait: "assertivita-direttiva",
        statement: "Il confronto diretto non mi mette a disagio",
      },
      {
        position: 3,
        trait: "curiosita-esplorativa",
        statement: "Quando inizio qualcosa di nuovo mi sento nel mio elemento",
      },
      {
        position: 4,
        trait: "ottimizzazione-qualitativa",
        statement: "Individuo subito i punti di forza delle persone",
      },
    ],
  },
  {
    position: 18,
    options: [
      {
        position: 1,
        trait: "integrazione-sistemica",
        statement: "Prima di cambiare qualcosa voglio sapere a cosa serviva",
      },
      {
        position: 2,
        trait: "prudenza-valutativa",
        statement: "Preferisco una decisione ponderata a una rapida",
      },
      {
        position: 3,
        trait: "persistenza-operativa",
        statement: "Gli ostacoli ripetuti non mi fanno desistere",
      },
      {
        position: 4,
        trait: "autonomia-decisionale",
        statement: "Sostengo una scelta anche quando resto solo",
      },
    ],
  },
  {
    position: 19,
    options: [
      {
        position: 1,
        trait: "proiezione-prospettica",
        statement: "Descrivo scenari che gli altri riescono a vedere",
      },
      {
        position: 2,
        trait: "equita-procedurale",
        statement: "Preferisco criteri dichiarati alle decisioni caso per caso",
      },
      {
        position: 3,
        trait: "flessibilita-adattiva",
        statement: "Un cambio di programma non mi rovina la giornata",
      },
      {
        position: 4,
        trait: "comunicazione-persuasiva",
        statement: "Prendo la parola per chiarire il punto",
      },
    ],
  },
  {
    position: 20,
    options: [
      {
        position: 1,
        trait: "ricostruzione-diagnostica",
        statement: "Individuo rapidamente la causa di un malfunzionamento",
      },
      {
        position: 2,
        trait: "spinta-competitiva",
        statement: "Le classifiche mi motivano più degli obiettivi assoluti",
      },
      {
        position: 3,
        trait: "orientamento-allo-scopo",
        statement: "Mi disimpegno quando un compito mi sembra privo di scopo",
      },
      {
        position: 4,
        trait: "regolazione-del-conflitto",
        statement: "Preferisco cedere su un dettaglio che incrinare un rapporto",
      },
    ],
  },
  {
    position: 21,
    options: [
      {
        position: 1,
        trait: "responsabilita-assunta",
        statement: "Preferisco fare tardi che consegnare qualcosa di incompleto",
      },
      {
        position: 2,
        trait: "sintonizzazione-empatica",
        statement: "Capisco come sta qualcuno dal tono con cui parla",
      },
      {
        position: 3,
        trait: "ambizione-visibile",
        statement: "Mi motiva sapere che il mio lavoro verrà notato",
      },
      {
        position: 4,
        trait: "analisi-evidenziale",
        statement: "Diffido delle conclusioni tratte da pochi casi",
      },
    ],
  },
  {
    position: 22,
    options: [
      {
        position: 1,
        trait: "generazione-ideativa",
        statement: "Davanti a un vincolo cerco un modo diverso di vedere il problema",
      },
      {
        position: 2,
        trait: "ancoraggio-valoriale",
        statement: "Rinuncio a un vantaggio se ottenerlo richiede una scorciatoia",
      },
      {
        position: 3,
        trait: "facilitazione-della-crescita",
        statement: "Mi ritrovo a fare da riferimento anche senza un ruolo formale",
      },
      {
        position: 4,
        trait: "strutturazione-metodica",
        statement: "Le scadenze scritte in calendario mi danno sicurezza",
      },
    ],
  },
  {
    position: 23,
    options: [
      {
        position: 1,
        trait: "iniziativa-proattiva",
        statement: "Sblocco io le situazioni in cui nessuno si muove",
      },
      {
        position: 2,
        trait: "facilitazione-della-crescita",
        statement: "Ho pazienza con chi impara lentamente",
      },
      {
        position: 3,
        trait: "orientamento-allo-scopo",
        statement: "Scelgo i progetti in base a cosa producono, non a cosa rendono",
      },
      {
        position: 4,
        trait: "positivita-motivazionale",
        statement: "Il mio entusiasmo si trasmette agli altri",
      },
    ],
  },
  {
    position: 24,
    options: [
      {
        position: 1,
        trait: "comunicazione-persuasiva",
        statement: "Mi diverte trovare la frase giusta per riassumere un'idea",
      },
      {
        position: 2,
        trait: "iniziativa-proattiva",
        statement: "Mi muovo anche quando non ho tutte le informazioni",
      },
      {
        position: 3,
        trait: "coordinamento-adattivo",
        statement: "Trovo combinazioni di persone che rendono più della somma",
      },
      {
        position: 4,
        trait: "integrazione-sistemica",
        statement: "Faccio da ponte fra ambiti che si ignorano",
      },
    ],
  },
  {
    position: 25,
    options: [
      {
        position: 1,
        trait: "ambizione-visibile",
        statement: "Punto a traguardi importanti più che a piccoli passi",
      },
      {
        position: 2,
        trait: "ottimizzazione-qualitativa",
        statement: "Mi accontento raramente di un risultato sufficiente",
      },
      {
        position: 3,
        trait: "analisi-evidenziale",
        statement: "Mi piace smontare un problema nelle sue componenti",
      },
      {
        position: 4,
        trait: "generazione-ideativa",
        statement: "Genero molte alternative anche quando una soluzione c'è già",
      },
    ],
  },
  {
    position: 26,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Le mie scelte partono sempre dagli stessi criteri di fondo",
      },
      {
        position: 2,
        trait: "ricostruzione-diagnostica",
        statement: "Nelle crisi divento più lucido, non meno",
      },
      {
        position: 3,
        trait: "innesco-relazionale",
        statement: "Mi diverte conquistare la simpatia di chi non mi conosce",
      },
      {
        position: 4,
        trait: "flessibilita-adattiva",
        statement: "Rispondo volentieri alle richieste dell'ultimo minuto",
      },
    ],
  },
  {
    position: 27,
    options: [
      {
        position: 1,
        trait: "regolazione-del-conflitto",
        statement: "Faccio da ponte quando due persone non si parlano",
      },
      {
        position: 2,
        trait: "proiezione-prospettica",
        statement: "Colgo le tendenze prima che diventino evidenti",
      },
      {
        position: 3,
        trait: "responsabilita-assunta",
        statement: "Non riesco a lasciare un impegno a metà",
      },
      {
        position: 4,
        trait: "prudenza-valutativa",
        statement: "Anticipo gli ostacoli che gli altri non hanno considerato",
      },
    ],
  },
  {
    position: 28,
    options: [
      {
        position: 1,
        trait: "strutturazione-metodica",
        statement: "Costruisco procedure per non dover ridecidere ogni volta",
      },
      {
        position: 2,
        trait: "curiosita-esplorativa",
        statement: "Accumulo letture e approfondimenti per pura curiosità",
      },
      {
        position: 3,
        trait: "assertivita-direttiva",
        statement: "Metto sul tavolo ciò che gli altri pensano ma non dicono",
      },
      {
        position: 4,
        trait: "autoefficacia-realizzativa",
        statement: "Preferisco una giornata piena a una leggera",
      },
    ],
  },
  {
    position: 29,
    options: [
      {
        position: 1,
        trait: "persistenza-operativa",
        statement: "Faccio fatica ad abbandonare un progetto avviato",
      },
      {
        position: 2,
        trait: "positivita-motivazionale",
        statement: "Celebro volentieri i piccoli progressi",
      },
      {
        position: 3,
        trait: "focalizzazione-selettiva",
        statement: "Elimino senza esitare ciò che non porta al risultato",
      },
      {
        position: 4,
        trait: "equita-procedurale",
        statement: "Mi accorgo subito quando qualcuno riceve un trattamento diverso",
      },
    ],
  },
  {
    position: 30,
    options: [
      {
        position: 1,
        trait: "autonomia-decisionale",
        statement: "Le critiche non mi fanno cambiare rotta facilmente",
      },
      {
        position: 2,
        trait: "spinta-competitiva",
        statement: "Vivo male le sconfitte anche quando contano poco",
      },
      {
        position: 3,
        trait: "sintonizzazione-empatica",
        statement: "Prima di rispondere penso a come si sentirà chi ascolta",
      },
      {
        position: 4,
        trait: "elaborazione-riflessiva",
        statement: "Le riunioni troppo rapide non mi permettono di contribuire",
      },
    ],
  },
  {
    position: 31,
    options: [
      {
        position: 1,
        trait: "equita-procedurale",
        statement: "Difendo chi ha meno voce nelle discussioni",
      },
      {
        position: 2,
        trait: "elaborazione-riflessiva",
        statement: "Rimugino a lungo sulle questioni complesse",
      },
      {
        position: 3,
        trait: "iniziativa-proattiva",
        statement: "Le lunghe riunioni preparatorie mi tolgono energia",
      },
      {
        position: 4,
        trait: "assertivita-direttiva",
        statement: "La mia presenza si nota quando entro in una discussione",
      },
    ],
  },
  {
    position: 32,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "So esattamente quali sono le cose su cui non transigo",
      },
      {
        position: 2,
        trait: "analisi-evidenziale",
        statement: "Preferisco un dato verificato a un'impressione condivisa",
      },
      {
        position: 3,
        trait: "regolazione-del-conflitto",
        statement: "Evito di sollevare obiezioni che non siano decisive",
      },
      {
        position: 4,
        trait: "persistenza-operativa",
        statement: "Resto sul problema finché non trovo una via d'uscita",
      },
    ],
  },
  {
    position: 33,
    options: [
      {
        position: 1,
        trait: "positivita-motivazionale",
        statement: "Preferisco incoraggiare che criticare",
      },
      {
        position: 2,
        trait: "comunicazione-persuasiva",
        statement: "Curo come dirò le cose, non solo cosa dirò",
      },
      {
        position: 3,
        trait: "ambizione-visibile",
        statement: "Mi piace essere associato a iniziative che contano",
      },
      {
        position: 4,
        trait: "strutturazione-metodica",
        statement: "I cambi di programma mi infastidiscono",
      },
    ],
  },
  {
    position: 34,
    controlFor: 1,
    options: [
      {
        position: 1,
        trait: "spinta-competitiva",
        statement: "Mi stimola sapere che qualcuno sta facendo meglio",
      },
      {
        position: 2,
        trait: "coordinamento-adattivo",
        statement: "Il disordine organizzativo mi stimola invece di bloccarmi",
      },
      {
        position: 3,
        trait: "positivita-motivazionale",
        statement: "La gente sta meglio dopo aver parlato con me",
      },
      {
        position: 4,
        trait: "innesco-relazionale",
        statement: "Metto a proprio agio chi è appena arrivato",
      },
    ],
  },
  {
    position: 35,
    options: [
      {
        position: 1,
        trait: "facilitazione-della-crescita",
        statement: "Preferisco insegnare a fare che fare al posto di qualcuno",
      },
      {
        position: 2,
        trait: "flessibilita-adattiva",
        statement: "Preferisco reagire alla situazione che seguire un piano",
      },
      {
        position: 3,
        trait: "spinta-competitiva",
        statement: "Voglio sapere come sto andando rispetto agli altri",
      },
      {
        position: 4,
        trait: "focalizzazione-selettiva",
        statement: "Le priorità che cambiano di continuo mi disorientano",
      },
    ],
  },
  {
    position: 36,
    options: [
      {
        position: 1,
        trait: "ricostruzione-diagnostica",
        statement: "Noto per primo i difetti in un lavoro finito",
      },
      {
        position: 2,
        trait: "integrazione-sistemica",
        statement: "Mi interessa il quadro generale più del singolo pezzo",
      },
      {
        position: 3,
        trait: "proiezione-prospettica",
        statement: "Penso spesso a dove saremo fra qualche tempo",
      },
      {
        position: 4,
        trait: "ottimizzazione-qualitativa",
        statement: "Investo sulle cose in cui sono già bravo",
      },
    ],
  },
  {
    position: 37,
    options: [
      {
        position: 1,
        trait: "sintonizzazione-empatica",
        statement: "Mi accorgo della tensione in una stanza anche nel silenzio",
      },
      {
        position: 2,
        trait: "generazione-ideativa",
        statement: "Mi annoio quando si ripete sempre lo stesso schema",
      },
      {
        position: 3,
        trait: "autoefficacia-realizzativa",
        statement: "Mi metto all'opera subito, anche senza avere tutto chiaro",
      },
      {
        position: 4,
        trait: "orientamento-allo-scopo",
        statement: "Chiedo spesso perché stiamo facendo una certa cosa",
      },
    ],
  },
  {
    position: 38,
    options: [
      {
        position: 1,
        trait: "autonomia-decisionale",
        statement: "Mi fido del mio giudizio più del parere della maggioranza",
      },
      {
        position: 2,
        trait: "innesco-relazionale",
        statement: "Costruisco nuovi contatti con grande facilità",
      },
      {
        position: 3,
        trait: "coordinamento-adattivo",
        statement: "Cambio volentieri assetto se scopro un modo migliore",
      },
      {
        position: 4,
        trait: "curiosita-esplorativa",
        statement: "Preferisco un progetto mai fatto prima a uno che padroneggio",
      },
    ],
  },
  {
    position: 39,
    controlFor: 5,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Mi allontano dai contesti che contraddicono le mie convinzioni",
      },
      {
        position: 2,
        trait: "sintonizzazione-empatica",
        statement: "Ascolto più quello che non viene detto che le parole",
      },
      {
        position: 3,
        trait: "iniziativa-proattiva",
        statement: "Trovo che sia l'azione a creare chiarezza",
      },
      {
        position: 4,
        trait: "curiosita-esplorativa",
        statement: "Mi piace essere principiante, anche se è scomodo",
      },
    ],
  },
  {
    position: 40,
    options: [
      {
        position: 1,
        trait: "prudenza-valutativa",
        statement: "Mi muovo con cautela nelle situazioni che non conosco",
      },
      {
        position: 2,
        trait: "comunicazione-persuasiva",
        statement: "Parlare davanti a un pubblico mi dà energia",
      },
      {
        position: 3,
        trait: "ancoraggio-valoriale",
        statement: "Preferisco spiegare un no che concederlo controvoglia",
      },
      {
        position: 4,
        trait: "responsabilita-assunta",
        statement: "Anche gli impegni presi a voce per me contano",
      },
    ],
  },
  {
    position: 41,
    options: [
      {
        position: 1,
        trait: "iniziativa-proattiva",
        statement: "Quando un'idea mi convince voglio testarla subito",
      },
      {
        position: 2,
        trait: "regolazione-del-conflitto",
        statement: "Un accordo condiviso vale più di una decisione perfetta",
      },
      {
        position: 3,
        trait: "prudenza-valutativa",
        statement: "Mi sento a disagio quando si decide senza valutare i rischi",
      },
      {
        position: 4,
        trait: "flessibilita-adattiva",
        statement: "Le emergenze non mi mettono in difficoltà",
      },
    ],
  },
  {
    position: 42,
    options: [
      {
        position: 1,
        trait: "autoefficacia-realizzativa",
        statement: "Faccio fatica a stare fermo se resta qualcosa da finire",
      },
      {
        position: 2,
        trait: "focalizzazione-selettiva",
        statement: "Ho bisogno di sapere esattamente dove stiamo andando",
      },
      {
        position: 3,
        trait: "analisi-evidenziale",
        statement: "Individuo rapidamente i punti deboli di un ragionamento",
      },
      {
        position: 4,
        trait: "integrazione-sistemica",
        statement: "Riconosco i pattern che si ripetono nel tempo",
      },
    ],
  },
  {
    position: 43,
    controlFor: 9,
    options: [
      {
        position: 1,
        trait: "elaborazione-riflessiva",
        statement: "Pongo domande che spostano il livello della discussione",
      },
      {
        position: 2,
        trait: "iniziativa-proattiva",
        statement: "Trovo che sia l'azione a creare chiarezza",
      },
      {
        position: 3,
        trait: "analisi-evidenziale",
        statement: "Chiedo tempo per verificare prima di rispondere",
      },
      {
        position: 4,
        trait: "autonomia-decisionale",
        statement: "Chiedo aiuto solo dopo aver esaurito le mie opzioni",
      },
    ],
  },
  {
    position: 44,
    options: [
      {
        position: 1,
        trait: "proiezione-prospettica",
        statement: "Mi entusiasmano le possibilità che ancora non esistono",
      },
      {
        position: 2,
        trait: "elaborazione-riflessiva",
        statement: "Le mie conclusioni arrivano dopo un lavoro che non si vede",
      },
      {
        position: 3,
        trait: "facilitazione-della-crescita",
        statement: "Noto i piccoli miglioramenti delle persone e glieli dico",
      },
      {
        position: 4,
        trait: "coordinamento-adattivo",
        statement: "Coordino più attività parallele senza perdere il filo",
      },
    ],
  },
  {
    position: 45,
    options: [
      {
        position: 1,
        trait: "generazione-ideativa",
        statement: "Le mie idee migliori arrivano mentre faccio altro",
      },
      {
        position: 2,
        trait: "responsabilita-assunta",
        statement: "Controllo due volte prima di consegnare",
      },
      {
        position: 3,
        trait: "assertivita-direttiva",
        statement: "Preferisco uno scontro chiaro a un accordo ambiguo",
      },
      {
        position: 4,
        trait: "autonomia-decisionale",
        statement: "Resto lucido quando gli altri si agitano",
      },
    ],
  },
  {
    position: 46,
    options: [
      {
        position: 1,
        trait: "persistenza-operativa",
        statement: "Preferisco finire una cosa che iniziarne tre",
      },
      {
        position: 2,
        trait: "sintonizzazione-empatica",
        statement: "Faccio fatica a restare indifferente quando qualcuno sta male",
      },
      {
        position: 3,
        trait: "positivita-motivazionale",
        statement: "Riesco a rendere piacevole anche un lavoro noioso",
      },
      {
        position: 4,
        trait: "ricostruzione-diagnostica",
        statement: "Non mi scoraggio davanti a problemi che tornano",
      },
    ],
  },
  {
    position: 47,
    options: [
      {
        position: 1,
        trait: "orientamento-allo-scopo",
        statement: "Trovo energia nel contribuire a qualcosa di più grande",
      },
      {
        position: 2,
        trait: "ottimizzazione-qualitativa",
        statement: "Noto la differenza fra un lavoro buono e uno ottimo",
      },
      {
        position: 3,
        trait: "equita-procedurale",
        statement: "Le eccezioni non spiegate mi sembrano una crepa",
      },
      {
        position: 4,
        trait: "innesco-relazionale",
        statement: "Preferisco conoscere molte persone che poche a fondo",
      },
    ],
  },
  {
    position: 48,
    controlFor: 13,
    options: [
      {
        position: 1,
        trait: "generazione-ideativa",
        statement: "Propongo volentieri strade che nessuno ha considerato",
      },
      {
        position: 2,
        trait: "proiezione-prospettica",
        statement: "Mi sento tirato in avanti da ciò che potrebbe essere",
      },
      {
        position: 3,
        trait: "prudenza-valutativa",
        statement: "Rifletto a lungo prima di prendere impegni importanti",
      },
      {
        position: 4,
        trait: "innesco-relazionale",
        statement: "Metto a proprio agio chi è appena arrivato",
      },
    ],
  },
  {
    position: 49,
    options: [
      {
        position: 1,
        trait: "ambizione-visibile",
        statement: "Il lavoro invisibile mi dà meno energia",
      },
      {
        position: 2,
        trait: "curiosita-esplorativa",
        statement: "Il cambiamento mi incuriosisce più di quanto mi preoccupi",
      },
      {
        position: 3,
        trait: "strutturazione-metodica",
        statement: "Divido ogni progetto in fasi con responsabili e date",
      },
      {
        position: 4,
        trait: "spinta-competitiva",
        statement: "Un contesto senza confronto mi toglie energia",
      },
    ],
  },
  {
    position: 50,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Valuto le proposte anche sul piano di ciò che è giusto",
      },
      {
        position: 2,
        trait: "positivita-motivazionale",
        statement: "Guardo avanti con ottimismo anche dopo un insuccesso",
      },
      {
        position: 3,
        trait: "assertivita-direttiva",
        statement: "Non ho difficoltà a esprimere una posizione impopolare",
      },
      {
        position: 4,
        trait: "prudenza-valutativa",
        statement: "Do la mia opinione solo quando ne sono sicuro",
      },
    ],
  },
  {
    position: 51,
    options: [
      {
        position: 1,
        trait: "analisi-evidenziale",
        statement: "Le scelte prese d'istinto mi mettono a disagio",
      },
      {
        position: 2,
        trait: "spinta-competitiva",
        statement: "Punto a essere il migliore, non semplicemente bravo",
      },
      {
        position: 3,
        trait: "proiezione-prospettica",
        statement: "Faccio fatica a occuparmi solo dell'oggi",
      },
      {
        position: 4,
        trait: "comunicazione-persuasiva",
        statement: "Mi accorgo subito quando un messaggio non è arrivato",
      },
    ],
  },
  {
    position: 52,
    options: [
      {
        position: 1,
        trait: "focalizzazione-selettiva",
        statement: "Mi infastidisce essere distolto da ciò su cui sono concentrato",
      },
      {
        position: 2,
        trait: "generazione-ideativa",
        statement: "Preferisco riformulare la domanda che rispondere a quella data",
      },
      {
        position: 3,
        trait: "iniziativa-proattiva",
        statement: "Accetto il rischio di sbagliare pur di andare avanti",
      },
      {
        position: 4,
        trait: "regolazione-del-conflitto",
        statement: "Nei conflitti abbasso il tono invece di alzarlo",
      },
    ],
  },
  {
    position: 53,
    controlFor: 18,
    options: [
      {
        position: 1,
        trait: "prudenza-valutativa",
        statement: "Rifletto a lungo prima di prendere impegni importanti",
      },
      {
        position: 2,
        trait: "persistenza-operativa",
        statement: "Reggo bene i lavori lunghi e poco gratificanti",
      },
      {
        position: 3,
        trait: "autonomia-decisionale",
        statement: "Chiedo aiuto solo dopo aver esaurito le mie opzioni",
      },
      {
        position: 4,
        trait: "integrazione-sistemica",
        statement: "Cerco i precedenti prima di affrontare un problema nuovo",
      },
    ],
  },
  {
    position: 54,
    options: [
      {
        position: 1,
        trait: "responsabilita-assunta",
        statement: "Rispetto le regole anche quando nessuno guarda",
      },
      {
        position: 2,
        trait: "coordinamento-adattivo",
        statement: "Vedo subito quale risorsa è nel posto sbagliato",
      },
      {
        position: 3,
        trait: "integrazione-sistemica",
        statement: "Penso all'impatto del mio lavoro su chi sta a valle",
      },
      {
        position: 4,
        trait: "orientamento-allo-scopo",
        statement: "Mi stanca il lavoro che non lascia traccia",
      },
    ],
  },
  {
    position: 55,
    options: [
      {
        position: 1,
        trait: "autoefficacia-realizzativa",
        statement: "Un ritmo di lavoro costante mi fa sentire in forma",
      },
      {
        position: 2,
        trait: "facilitazione-della-crescita",
        statement: "Investo tempo su chi è promettente anche se ora rende poco",
      },
      {
        position: 3,
        trait: "curiosita-esplorativa",
        statement: "Provo i nuovi strumenti prima che diventino uno standard",
      },
      {
        position: 4,
        trait: "equita-procedurale",
        statement: "Costruisco procedure uguali per chiunque le usi",
      },
    ],
  },
  {
    position: 56,
    options: [
      {
        position: 1,
        trait: "strutturazione-metodica",
        statement: "Mi rassicura sapere in anticipo come sarà la settimana",
      },
      {
        position: 2,
        trait: "innesco-relazionale",
        statement: "Attacco discorso volentieri anche fuori dal lavoro",
      },
      {
        position: 3,
        trait: "elaborazione-riflessiva",
        statement: "Mi piace stare in silenzio a elaborare",
      },
      {
        position: 4,
        trait: "ambizione-visibile",
        statement: "Cerco ruoli in cui il mio impatto sia riconoscibile",
      },
    ],
  },
  {
    position: 57,
    options: [
      {
        position: 1,
        trait: "ottimizzazione-qualitativa",
        statement: "Mi infastidisce consegnare qualcosa di mediocre",
      },
      {
        position: 2,
        trait: "autonomia-decisionale",
        statement: "Non ho bisogno di essere rassicurato per procedere",
      },
      {
        position: 3,
        trait: "ricostruzione-diagnostica",
        statement: "Preferisco recuperare qualcosa di compromesso che gestire il sano",
      },
      {
        position: 4,
        trait: "sintonizzazione-empatica",
        statement: "Scelgo le parole con cura nei momenti delicati",
      },
    ],
  },
  {
    position: 58,
    controlFor: 22,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Mi allontano dai contesti che contraddicono le mie convinzioni",
      },
      {
        position: 2,
        trait: "strutturazione-metodica",
        statement: "Metto in ordine le informazioni prima di analizzarle",
      },
      {
        position: 3,
        trait: "generazione-ideativa",
        statement: "Propongo volentieri strade che nessuno ha considerato",
      },
      {
        position: 4,
        trait: "facilitazione-della-crescita",
        statement: "Do volentieri una seconda occasione a chi ha sbagliato",
      },
    ],
  },
  {
    position: 59,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "Mi adatto rapidamente a un contesto nuovo",
      },
      {
        position: 2,
        trait: "ambizione-visibile",
        statement: "Voglio essere ricordato per qualcosa di rilevante",
      },
      {
        position: 3,
        trait: "coordinamento-adattivo",
        statement: "Il disordine organizzativo mi stimola invece di bloccarmi",
      },
      {
        position: 4,
        trait: "persistenza-operativa",
        statement: "Mi infastidisce lasciare le cose a metà",
      },
    ],
  },
  {
    position: 60,
    options: [
      {
        position: 1,
        trait: "positivita-motivazionale",
        statement: "La gente sta meglio dopo aver parlato con me",
      },
      {
        position: 2,
        trait: "autoefficacia-realizzativa",
        statement: "Mi assegno obiettivi personali anche senza che me li chiedano",
      },
      {
        position: 3,
        trait: "regolazione-del-conflitto",
        statement: "Voglio che tutti si siano sentiti ascoltati prima di chiudere",
      },
      {
        position: 4,
        trait: "analisi-evidenziale",
        statement: "Chiedo tempo per verificare prima di rispondere",
      },
    ],
  },
  {
    position: 61,
    options: [
      {
        position: 1,
        trait: "spinta-competitiva",
        statement: "Mi stimola sapere che qualcuno sta facendo meglio",
      },
      {
        position: 2,
        trait: "orientamento-allo-scopo",
        statement: "Collego volentieri le attività quotidiane a un fine più ampio",
      },
      {
        position: 3,
        trait: "comunicazione-persuasiva",
        statement: "Traduco volentieri il linguaggio tecnico per chi non lo conosce",
      },
      {
        position: 4,
        trait: "generazione-ideativa",
        statement: "Propongo volentieri strade che nessuno ha considerato",
      },
    ],
  },
  {
    position: 62,
    controlFor: 26,
    options: [
      {
        position: 1,
        trait: "ricostruzione-diagnostica",
        statement: "Cerco cosa si può sistemare anche quando nessuno lo chiede",
      },
      {
        position: 2,
        trait: "innesco-relazionale",
        statement: "Metto a proprio agio chi è appena arrivato",
      },
      {
        position: 3,
        trait: "ancoraggio-valoriale",
        statement: "Mi allontano dai contesti che contraddicono le mie convinzioni",
      },
      {
        position: 4,
        trait: "flessibilita-adattiva",
        statement: "Faccio fatica a pianificare a lungo termine",
      },
    ],
  },
  {
    position: 63,
    options: [
      {
        position: 1,
        trait: "innesco-relazionale",
        statement: "Metto a proprio agio chi è appena arrivato",
      },
      {
        position: 2,
        trait: "ricostruzione-diagnostica",
        statement: "Cerco cosa si può sistemare anche quando nessuno lo chiede",
      },
      {
        position: 3,
        trait: "curiosita-esplorativa",
        statement: "Mi piace essere principiante, anche se è scomodo",
      },
      {
        position: 4,
        trait: "iniziativa-proattiva",
        statement: "Trovo che sia l'azione a creare chiarezza",
      },
    ],
  },
  {
    position: 64,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "Faccio fatica a pianificare a lungo termine",
      },
      {
        position: 2,
        trait: "equita-procedurale",
        statement: "Trovo giusto che a parità di lavoro corrisponda parità di trattamento",
      },
      {
        position: 3,
        trait: "autonomia-decisionale",
        statement: "Chiedo aiuto solo dopo aver esaurito le mie opzioni",
      },
      {
        position: 4,
        trait: "assertivita-direttiva",
        statement: "Quando serve una decisione, la prendo",
      },
    ],
  },
  {
    position: 65,
    options: [
      {
        position: 1,
        trait: "strutturazione-metodica",
        statement: "Metto in ordine le informazioni prima di analizzarle",
      },
      {
        position: 2,
        trait: "ancoraggio-valoriale",
        statement: "Mi allontano dai contesti che contraddicono le mie convinzioni",
      },
      {
        position: 3,
        trait: "ottimizzazione-qualitativa",
        statement: "Spingo gli altri a usare ciò che sanno fare meglio",
      },
      {
        position: 4,
        trait: "elaborazione-riflessiva",
        statement: "Pongo domande che spostano il livello della discussione",
      },
    ],
  },
  {
    position: 66,
    options: [
      {
        position: 1,
        trait: "focalizzazione-selettiva",
        statement: "Porto avanti una cosa alla volta fino in fondo",
      },
      {
        position: 2,
        trait: "responsabilita-assunta",
        statement: "Preferisco sacrificarmi che deludere chi conta su di me",
      },
      {
        position: 3,
        trait: "sintonizzazione-empatica",
        statement: "Ascolto più quello che non viene detto che le parole",
      },
      {
        position: 4,
        trait: "prudenza-valutativa",
        statement: "Rifletto a lungo prima di prendere impegni importanti",
      },
    ],
  },
  {
    position: 67,
    controlFor: 30,
    options: [
      {
        position: 1,
        trait: "sintonizzazione-empatica",
        statement: "Ascolto più quello che non viene detto che le parole",
      },
      {
        position: 2,
        trait: "spinta-competitiva",
        statement: "Misuro i miei risultati su quelli degli altri",
      },
      {
        position: 3,
        trait: "autonomia-decisionale",
        statement: "Chiedo aiuto solo dopo aver esaurito le mie opzioni",
      },
      {
        position: 4,
        trait: "elaborazione-riflessiva",
        statement: "Pongo domande che spostano il livello della discussione",
      },
    ],
  },
  {
    position: 68,
    options: [
      {
        position: 1,
        trait: "integrazione-sistemica",
        statement: "Cerco i precedenti prima di affrontare un problema nuovo",
      },
      {
        position: 2,
        trait: "facilitazione-della-crescita",
        statement: "Do volentieri una seconda occasione a chi ha sbagliato",
      },
      {
        position: 3,
        trait: "persistenza-operativa",
        statement: "Reggo bene i lavori lunghi e poco gratificanti",
      },
      {
        position: 4,
        trait: "proiezione-prospettica",
        statement: "Mi sento tirato in avanti da ciò che potrebbe essere",
      },
    ],
  },
];

/** 53 blocchi (45 a punteggio + 8 di controllo) · 30 tratti · 6 comparse per tratto */
const MPF_LEADERSHIP: MpfBlockSeed[] = [
  {
    position: 1,
    options: [
      {
        position: 1,
        trait: "autonomia-decisionale",
        statement: "Prendo decisioni difficili senza cercare conferme",
      },
      {
        position: 2,
        trait: "responsabilita-assunta",
        statement: "Quello che prometto al mio team accade",
      },
      {
        position: 3,
        trait: "elaborazione-riflessiva",
        statement: "Ho bisogno di tempo per pensare prima di rispondere al gruppo",
      },
      {
        position: 4,
        trait: "comunicazione-persuasiva",
        statement: "Traduco la strategia in qualcosa che il team ricorda",
      },
    ],
  },
  {
    position: 2,
    options: [
      {
        position: 1,
        trait: "ricostruzione-diagnostica",
        statement: "Divento più lucido quando qualcosa va storto",
      },
      {
        position: 2,
        trait: "focalizzazione-selettiva",
        statement: "Do al gruppo una direzione e non la cambio",
      },
      {
        position: 3,
        trait: "regolazione-del-conflitto",
        statement: "Cerco il punto d'incontro quando il team è diviso",
      },
      {
        position: 4,
        trait: "iniziativa-proattiva",
        statement: "Faccio partire il gruppo anche senza tutte le informazioni",
      },
    ],
  },
  {
    position: 3,
    options: [
      {
        position: 1,
        trait: "coordinamento-adattivo",
        statement: "Rimescolo ruoli e risorse finché la squadra non rende",
      },
      {
        position: 2,
        trait: "generazione-ideativa",
        statement: "Riformulo il problema quando la squadra si blocca",
      },
      {
        position: 3,
        trait: "persistenza-operativa",
        statement: "Non lascio che il gruppo abbandoni ciò che ha iniziato",
      },
      {
        position: 4,
        trait: "ancoraggio-valoriale",
        statement: "Guido a partire da principi che non cambio",
      },
    ],
  },
  {
    position: 4,
    options: [
      {
        position: 1,
        trait: "spinta-competitiva",
        statement: "Confronto i risultati del mio team con quelli degli altri",
      },
      {
        position: 2,
        trait: "flessibilita-adattiva",
        statement: "Resto efficace quando i piani della squadra saltano",
      },
      {
        position: 3,
        trait: "facilitazione-della-crescita",
        statement: "Vedo nei collaboratori un potenziale che loro non vedono",
      },
      {
        position: 4,
        trait: "strutturazione-metodica",
        statement: "Do al gruppo scadenze e ruoli definiti in anticipo",
      },
    ],
  },
  {
    position: 5,
    options: [
      {
        position: 1,
        trait: "curiosita-esplorativa",
        statement: "Porto nel gruppo metodi e strumenti nuovi",
      },
      {
        position: 2,
        trait: "sintonizzazione-empatica",
        statement: "Percepisco il malessere di un collaboratore prima che lo dica",
      },
      {
        position: 3,
        trait: "analisi-evidenziale",
        statement: "Chiedo su quali dati si basa una proposta del team",
      },
      {
        position: 4,
        trait: "orientamento-allo-scopo",
        statement: "Ricordo al gruppo a che cosa serve quello che facciamo",
      },
    ],
  },
  {
    position: 6,
    options: [
      {
        position: 1,
        trait: "assertivita-direttiva",
        statement: "Dico al gruppo le cose come stanno anche quando è scomodo",
      },
      {
        position: 2,
        trait: "ambizione-visibile",
        statement: "Scelgo per il team i progetti che si vedono",
      },
      {
        position: 3,
        trait: "prudenza-valutativa",
        statement: "Valuto i rischi prima di impegnare il gruppo",
      },
      {
        position: 4,
        trait: "ottimizzazione-qualitativa",
        statement: "Spingo i miei a lavorare sui loro punti di forza",
      },
    ],
  },
  {
    position: 7,
    options: [
      {
        position: 1,
        trait: "positivita-motivazionale",
        statement: "Porto energia al gruppo anche nelle settimane difficili",
      },
      {
        position: 2,
        trait: "equita-procedurale",
        statement: "Applico le stesse regole a tutti i collaboratori",
      },
      {
        position: 3,
        trait: "autoefficacia-realizzativa",
        statement: "Do il ritmo al gruppo con quanto produco io",
      },
      {
        position: 4,
        trait: "proiezione-prospettica",
        statement: "Descrivo al team dove saremo fra qualche anno",
      },
    ],
  },
  {
    position: 8,
    options: [
      {
        position: 1,
        trait: "analisi-evidenziale",
        statement: "Cerco la causa dietro un risultato prima di reagire",
      },
      {
        position: 2,
        trait: "innesco-relazionale",
        statement: "Costruisco per il gruppo la rete di contatti che serve",
      },
      {
        position: 3,
        trait: "autonomia-decisionale",
        statement: "Resto lucido quando il gruppo si agita",
      },
      {
        position: 4,
        trait: "integrazione-sistemica",
        statement: "Spiego al gruppo come il suo lavoro si inserisce nel quadro",
      },
    ],
  },
  {
    position: 9,
    options: [
      {
        position: 1,
        trait: "ottimizzazione-qualitativa",
        statement: "Mi interessa portare il gruppo da buono a eccellente",
      },
      {
        position: 2,
        trait: "ancoraggio-valoriale",
        statement: "Rifiuto obiettivi che vanno contro le mie convinzioni",
      },
      {
        position: 3,
        trait: "comunicazione-persuasiva",
        statement: "Uso storie ed esempi per far arrivare la direzione",
      },
      {
        position: 4,
        trait: "flessibilita-adattiva",
        statement: "Riorganizzo il lavoro del gruppo in giornata se serve",
      },
    ],
  },
  {
    position: 10,
    options: [
      {
        position: 1,
        trait: "equita-procedurale",
        statement: "Dichiaro i criteri con cui valuto e assegno",
      },
      {
        position: 2,
        trait: "innesco-relazionale",
        statement: "Rappresento volentieri il team all'esterno",
      },
      {
        position: 3,
        trait: "generazione-ideativa",
        statement: "Propongo al gruppo strade che nessuno ha considerato",
      },
      {
        position: 4,
        trait: "responsabilita-assunta",
        statement: "Mi assumo io la responsabilità quando il gruppo sbaglia",
      },
    ],
  },
  {
    position: 11,
    options: [
      {
        position: 1,
        trait: "elaborazione-riflessiva",
        statement: "Preferisco elaborare da solo prima di discutere",
      },
      {
        position: 2,
        trait: "facilitazione-della-crescita",
        statement: "I progressi di chi guido mi danno più soddisfazione dei miei",
      },
      {
        position: 3,
        trait: "ambizione-visibile",
        statement: "Voglio che il lavoro del gruppo lasci un segno",
      },
      {
        position: 4,
        trait: "iniziativa-proattiva",
        statement: "Sono io a rompere lo stallo quando nessuno si muove",
      },
    ],
  },
  {
    position: 12,
    options: [
      {
        position: 1,
        trait: "persistenza-operativa",
        statement: "Continuo a spingere anche quando i risultati tardano",
      },
      {
        position: 2,
        trait: "strutturazione-metodica",
        statement: "Costruisco processi perché il team non debba ridecidere",
      },
      {
        position: 3,
        trait: "proiezione-prospettica",
        statement: "Il futuro mi dà più energia della gestione quotidiana",
      },
      {
        position: 4,
        trait: "regolazione-del-conflitto",
        statement: "Evito di far emergere conflitti che considero sterili",
      },
    ],
  },
  {
    position: 13,
    options: [
      {
        position: 1,
        trait: "focalizzazione-selettiva",
        statement: "Riporto al punto le riunioni che divagano",
      },
      {
        position: 2,
        trait: "curiosita-esplorativa",
        statement: "Il cambiamento mi incuriosisce più di quanto mi preoccupi",
      },
      {
        position: 3,
        trait: "autoefficacia-realizzativa",
        statement: "Mi aspetto dai miei la stessa intensità che metto io",
      },
      {
        position: 4,
        trait: "coordinamento-adattivo",
        statement: "Metto le persone dove rendono di più, anche cambiando spesso",
      },
    ],
  },
  {
    position: 14,
    options: [
      {
        position: 1,
        trait: "orientamento-allo-scopo",
        statement: "Scelgo per il team progetti che lascino qualcosa",
      },
      {
        position: 2,
        trait: "ricostruzione-diagnostica",
        statement: "Vado a cercare cosa non funziona nel lavoro del gruppo",
      },
      {
        position: 3,
        trait: "integrazione-sistemica",
        statement: "Considero le conseguenze oltre il mio perimetro",
      },
      {
        position: 4,
        trait: "assertivita-direttiva",
        statement: "Prendo il controllo quando la situazione è confusa",
      },
    ],
  },
  {
    position: 15,
    options: [
      {
        position: 1,
        trait: "sintonizzazione-empatica",
        statement: "Il clima emotivo del team condiziona molto le mie scelte",
      },
      {
        position: 2,
        trait: "prudenza-valutativa",
        statement: "Preferisco una decisione ponderata a una rapida",
      },
      {
        position: 3,
        trait: "positivita-motivazionale",
        statement: "Celebro i progressi della squadra a voce alta",
      },
      {
        position: 4,
        trait: "spinta-competitiva",
        statement: "Voglio che la mia squadra sia la migliore",
      },
    ],
  },
  {
    position: 16,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Spiego al gruppo il perché prima del cosa",
      },
      {
        position: 2,
        trait: "positivita-motivazionale",
        statement: "Il mio umore condiziona il clima del team",
      },
      {
        position: 3,
        trait: "responsabilita-assunta",
        statement: "Non delego ciò di cui rispondo personalmente",
      },
      {
        position: 4,
        trait: "ricostruzione-diagnostica",
        statement: "Prendo io in mano i progetti in difficoltà",
      },
    ],
  },
  {
    position: 17,
    options: [
      {
        position: 1,
        trait: "regolazione-del-conflitto",
        statement: "Preferisco una decisione condivisa a una perfetta",
      },
      {
        position: 2,
        trait: "orientamento-allo-scopo",
        statement: "Motivo le persone con il senso più che con il premio",
      },
      {
        position: 3,
        trait: "equita-procedurale",
        statement: "I trattamenti di favore mi sembrano una crepa nel gruppo",
      },
      {
        position: 4,
        trait: "spinta-competitiva",
        statement: "Uso riferimenti esterni per motivare il gruppo",
      },
    ],
  },
  {
    position: 18,
    options: [
      {
        position: 1,
        trait: "strutturazione-metodica",
        statement: "Pianifico il lavoro della squadra nel dettaglio",
      },
      {
        position: 2,
        trait: "autonomia-decisionale",
        statement: "Sostengo una scelta impopolare se ne sono convinto",
      },
      {
        position: 3,
        trait: "generazione-ideativa",
        statement: "Mi entusiasmano le idee nuove più della loro esecuzione",
      },
      {
        position: 4,
        trait: "sintonizzazione-empatica",
        statement: "Capisco come sta una persona dal modo in cui saluta",
      },
    ],
  },
  {
    position: 19,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "Le emergenze non mi mettono in difficoltà",
      },
      {
        position: 2,
        trait: "persistenza-operativa",
        statement: "Recupero progetti che altri avrebbero chiuso",
      },
      {
        position: 3,
        trait: "focalizzazione-selettiva",
        statement: "Elimino le attività che non portano all'obiettivo",
      },
      {
        position: 4,
        trait: "innesco-relazionale",
        statement: "Metto a proprio agio i nuovi arrivati dal primo giorno",
      },
    ],
  },
  {
    position: 20,
    options: [
      {
        position: 1,
        trait: "iniziativa-proattiva",
        statement: "Preferisco far provare al team che farlo studiare",
      },
      {
        position: 2,
        trait: "assertivita-direttiva",
        statement: "Non evito le conversazioni difficili con i collaboratori",
      },
      {
        position: 3,
        trait: "coordinamento-adattivo",
        statement: "Gestisco più progetti paralleli senza perdere il quadro",
      },
      {
        position: 4,
        trait: "elaborazione-riflessiva",
        statement: "Pongo domande che spostano il livello della discussione",
      },
    ],
  },
  {
    position: 21,
    options: [
      {
        position: 1,
        trait: "ambizione-visibile",
        statement: "Cerco visibilità per ciò che la mia squadra realizza",
      },
      {
        position: 2,
        trait: "analisi-evidenziale",
        statement: "Le decisioni prese d'istinto mi mettono a disagio",
      },
      {
        position: 3,
        trait: "comunicazione-persuasiva",
        statement: "Prendo la parola per chiarire il punto in riunione",
      },
      {
        position: 4,
        trait: "autoefficacia-realizzativa",
        statement: "Chiudo la settimana contando i risultati del team",
      },
    ],
  },
  {
    position: 22,
    options: [
      {
        position: 1,
        trait: "facilitazione-della-crescita",
        statement: "Costruisco percorsi di crescita su misura",
      },
      {
        position: 2,
        trait: "proiezione-prospettica",
        statement: "La mia visione riesce a far muovere le persone",
      },
      {
        position: 3,
        trait: "ottimizzazione-qualitativa",
        statement: "Faccio fatica ad accettare un lavoro solo sufficiente",
      },
      {
        position: 4,
        trait: "curiosita-esplorativa",
        statement: "Scelgo volentieri progetti mai affrontati prima",
      },
    ],
  },
  {
    position: 23,
    options: [
      {
        position: 1,
        trait: "integrazione-sistemica",
        statement: "Faccio da ponte fra funzioni che si ignorano",
      },
      {
        position: 2,
        trait: "autoefficacia-realizzativa",
        statement: "Guido facendo, più che spiegando",
      },
      {
        position: 3,
        trait: "ancoraggio-valoriale",
        statement: "Non scendo a compromessi su ciò in cui credo",
      },
      {
        position: 4,
        trait: "prudenza-valutativa",
        statement: "Anticipo gli ostacoli che il team non ha considerato",
      },
    ],
  },
  {
    position: 24,
    options: [
      {
        position: 1,
        trait: "prudenza-valutativa",
        statement: "Chiedo tempo prima di dare il via a un progetto",
      },
      {
        position: 2,
        trait: "regolazione-del-conflitto",
        statement: "Faccio da ponte fra collaboratori che non si parlano",
      },
      {
        position: 3,
        trait: "curiosita-esplorativa",
        statement: "Insegno alla squadra quello che ho appena imparato",
      },
      {
        position: 4,
        trait: "autonomia-decisionale",
        statement: "Non ho bisogno del consenso per procedere",
      },
    ],
  },
  {
    position: 25,
    options: [
      {
        position: 1,
        trait: "comunicazione-persuasiva",
        statement: "Curo molto come dico le cose al gruppo",
      },
      {
        position: 2,
        trait: "integrazione-sistemica",
        statement: "Racconto al gruppo come siamo arrivati fin qui",
      },
      {
        position: 3,
        trait: "strutturazione-metodica",
        statement: "Un cambio di programma mi obbliga a rifare l'impianto",
      },
      {
        position: 4,
        trait: "iniziativa-proattiva",
        statement: "Metto pressione perché si cominci",
      },
    ],
  },
  {
    position: 26,
    controlFor: 1,
    options: [
      {
        position: 1,
        trait: "elaborazione-riflessiva",
        statement: "Il mio silenzio in riunione è lavoro, non disinteresse",
      },
      {
        position: 2,
        trait: "autonomia-decisionale",
        statement: "Mi assumo scelte che altri non prenderebbero",
      },
      {
        position: 3,
        trait: "responsabilita-assunta",
        statement: "Se il team manca una scadenza ne rispondo io per primo",
      },
      {
        position: 4,
        trait: "comunicazione-persuasiva",
        statement: "Verifico che il messaggio sia arrivato, non solo detto",
      },
    ],
  },
  {
    position: 27,
    options: [
      {
        position: 1,
        trait: "coordinamento-adattivo",
        statement: "Riorganizzo il gruppo appena vedo un assetto migliore",
      },
      {
        position: 2,
        trait: "ottimizzazione-qualitativa",
        statement: "Investo sulle persone già brave più che sulle lacune",
      },
      {
        position: 3,
        trait: "innesco-relazionale",
        statement: "Conosco persone in ogni funzione e le uso per sbloccare",
      },
      {
        position: 4,
        trait: "positivita-motivazionale",
        statement: "Trovo il lato buono anche dopo un insuccesso",
      },
    ],
  },
  {
    position: 28,
    options: [
      {
        position: 1,
        trait: "analisi-evidenziale",
        statement: "Individuo i punti deboli di un ragionamento in riunione",
      },
      {
        position: 2,
        trait: "focalizzazione-selettiva",
        statement: "Proteggo il team dalle richieste fuori perimetro",
      },
      {
        position: 3,
        trait: "assertivita-direttiva",
        statement: "Metto sul tavolo ciò che nessuno osa dire",
      },
      {
        position: 4,
        trait: "generazione-ideativa",
        statement: "Cambio direzione quando intravedo un'opzione migliore",
      },
    ],
  },
  {
    position: 29,
    options: [
      {
        position: 1,
        trait: "proiezione-prospettica",
        statement: "Anticipo al gruppo i cambiamenti che vedo arrivare",
      },
      {
        position: 2,
        trait: "elaborazione-riflessiva",
        statement: "Le riunioni troppo rapide non mi lasciano contribuire",
      },
      {
        position: 3,
        trait: "spinta-competitiva",
        statement: "Vivo male quando un altro gruppo fa meglio del mio",
      },
      {
        position: 4,
        trait: "ricostruzione-diagnostica",
        statement: "Noto per primo i difetti nel lavoro consegnato",
      },
    ],
  },
  {
    position: 30,
    controlFor: 4,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "La mia calma nel caos tranquillizza il team",
      },
      {
        position: 2,
        trait: "spinta-competitiva",
        statement: "Mostro al team dove siamo rispetto agli altri",
      },
      {
        position: 3,
        trait: "strutturazione-metodica",
        statement: "Assegno responsabilità e date a ogni fase",
      },
      {
        position: 4,
        trait: "facilitazione-della-crescita",
        statement: "Considero un successo quando qualcuno non ha più bisogno di me",
      },
    ],
  },
  {
    position: 31,
    options: [
      {
        position: 1,
        trait: "persistenza-operativa",
        statement: "Faccio fatica a cancellare un'iniziativa avviata",
      },
      {
        position: 2,
        trait: "equita-procedurale",
        statement: "Preferisco procedure trasparenti alle decisioni caso per caso",
      },
      {
        position: 3,
        trait: "sintonizzazione-empatica",
        statement: "Rimando le decisioni che faranno soffrire qualcuno",
      },
      {
        position: 4,
        trait: "ambizione-visibile",
        statement: "Punto a traguardi importanti più che a piccoli passi",
      },
    ],
  },
  {
    position: 32,
    options: [
      {
        position: 1,
        trait: "responsabilita-assunta",
        statement: "Sento come miei gli impegni presi dalla squadra",
      },
      {
        position: 2,
        trait: "flessibilita-adattiva",
        statement: "Accolgo le richieste dell'ultimo minuto senza irrigidirmi",
      },
      {
        position: 3,
        trait: "orientamento-allo-scopo",
        statement: "Metto in discussione le iniziative che hanno perso ragione",
      },
      {
        position: 4,
        trait: "facilitazione-della-crescita",
        statement: "Ho pazienza con chi impara lentamente",
      },
    ],
  },
  {
    position: 33,
    controlFor: 7,
    options: [
      {
        position: 1,
        trait: "autoefficacia-realizzativa",
        statement: "Misuro l'andamento del team dalle consegne completate",
      },
      {
        position: 2,
        trait: "positivita-motivazionale",
        statement: "Rendo sostenibili i periodi di carico elevato",
      },
      {
        position: 3,
        trait: "proiezione-prospettica",
        statement: "Faccio fatica a occuparmi solo dell'operatività",
      },
      {
        position: 4,
        trait: "equita-procedurale",
        statement: "Evito eccezioni che non so giustificare pubblicamente",
      },
    ],
  },
  {
    position: 34,
    options: [
      {
        position: 1,
        trait: "elaborazione-riflessiva",
        statement: "Rimugino a lungo sulle decisioni complesse",
      },
      {
        position: 2,
        trait: "ottimizzazione-qualitativa",
        statement: "Chiedo un altro giro quando il risultato è già buono",
      },
      {
        position: 3,
        trait: "strutturazione-metodica",
        statement: "Voglio sapere in anticipo come sarà la settimana del team",
      },
      {
        position: 4,
        trait: "focalizzazione-selettiva",
        statement: "Ripeto la stessa priorità finché non è chiara a tutti",
      },
    ],
  },
  {
    position: 35,
    options: [
      {
        position: 1,
        trait: "generazione-ideativa",
        statement: "Collego cose che sembrano non c'entrare nulla",
      },
      {
        position: 2,
        trait: "ricostruzione-diagnostica",
        statement: "Preferisco recuperare una situazione compromessa",
      },
      {
        position: 3,
        trait: "regolazione-del-conflitto",
        statement: "Abbasso il tono quando la discussione si accende",
      },
      {
        position: 4,
        trait: "autoefficacia-realizzativa",
        statement: "Faccio fatica a fermare il gruppo per riflettere",
      },
    ],
  },
  {
    position: 36,
    options: [
      {
        position: 1,
        trait: "innesco-relazionale",
        statement: "Attacco discorso facilmente con interlocutori nuovi",
      },
      {
        position: 2,
        trait: "spinta-competitiva",
        statement: "Alzo l'asticella finché non superiamo il riferimento",
      },
      {
        position: 3,
        trait: "curiosita-esplorativa",
        statement: "Studio per primo ciò che il gruppo dovrà affrontare",
      },
      {
        position: 4,
        trait: "ambizione-visibile",
        statement: "Mi motiva guidare qualcosa di cui si parlerà",
      },
    ],
  },
  {
    position: 37,
    controlFor: 10,
    options: [
      {
        position: 1,
        trait: "generazione-ideativa",
        statement: "Mi annoio quando si ripete sempre lo stesso schema",
      },
      {
        position: 2,
        trait: "innesco-relazionale",
        statement: "Faccio conoscere i miei collaboratori alle persone giuste",
      },
      {
        position: 3,
        trait: "equita-procedurale",
        statement: "Evito eccezioni che non so giustificare pubblicamente",
      },
      {
        position: 4,
        trait: "responsabilita-assunta",
        statement: "Se il team manca una scadenza ne rispondo io per primo",
      },
    ],
  },
  {
    position: 38,
    options: [
      {
        position: 1,
        trait: "orientamento-allo-scopo",
        statement: "Collego ogni obiettivo a un fine più ampio",
      },
      {
        position: 2,
        trait: "coordinamento-adattivo",
        statement: "Le riorganizzazioni non mi spaventano",
      },
      {
        position: 3,
        trait: "positivita-motivazionale",
        statement: "Preferisco incoraggiare che correggere",
      },
      {
        position: 4,
        trait: "comunicazione-persuasiva",
        statement: "Presentare davanti alla squadra mi dà energia",
      },
    ],
  },
  {
    position: 39,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Dico no a richieste che considero scorrette",
      },
      {
        position: 2,
        trait: "iniziativa-proattiva",
        statement: "Lancio iniziative e le affido strada facendo",
      },
      {
        position: 3,
        trait: "assertivita-direttiva",
        statement: "La mia presenza si sente quando entro in una riunione",
      },
      {
        position: 4,
        trait: "equita-procedurale",
        statement: "Difendo chi nel gruppo ha meno voce",
      },
    ],
  },
  {
    position: 40,
    options: [
      {
        position: 1,
        trait: "facilitazione-della-crescita",
        statement: "Delego compiti difficili per far crescere le persone",
      },
      {
        position: 2,
        trait: "prudenza-valutativa",
        statement: "Metto in guardia il gruppo sugli scenari negativi",
      },
      {
        position: 3,
        trait: "autonomia-decisionale",
        statement: "Le critiche non mi fanno cambiare rotta",
      },
      {
        position: 4,
        trait: "persistenza-operativa",
        statement: "Tengo la rotta anche quando il team si scoraggia",
      },
    ],
  },
  {
    position: 41,
    controlFor: 13,
    options: [
      {
        position: 1,
        trait: "coordinamento-adattivo",
        statement: "So sempre chi può coprire chi nel mio gruppo",
      },
      {
        position: 2,
        trait: "curiosita-esplorativa",
        statement: "Accetto progetti in cui nessuno di noi è esperto",
      },
      {
        position: 3,
        trait: "autoefficacia-realizzativa",
        statement: "Misuro l'andamento del team dalle consegne completate",
      },
      {
        position: 4,
        trait: "focalizzazione-selettiva",
        statement: "Mi infastidisce quando il gruppo si disperde",
      },
    ],
  },
  {
    position: 42,
    options: [
      {
        position: 1,
        trait: "responsabilita-assunta",
        statement: "Preferisco lavorare io di più che deludere qualcuno",
      },
      {
        position: 2,
        trait: "flessibilita-adattiva",
        statement: "Preferisco rispondere alla situazione che seguire il piano",
      },
      {
        position: 3,
        trait: "proiezione-prospettica",
        statement: "Mi entusiasma progettare ciò che non esiste ancora",
      },
      {
        position: 4,
        trait: "analisi-evidenziale",
        statement: "Chiedo tempo per verificare prima di approvare",
      },
    ],
  },
  {
    position: 43,
    options: [
      {
        position: 1,
        trait: "sintonizzazione-empatica",
        statement: "Scelgo le parole con cura nei colloqui difficili",
      },
      {
        position: 2,
        trait: "integrazione-sistemica",
        statement: "Prima di cambiare un processo voglio sapere a cosa serviva",
      },
      {
        position: 3,
        trait: "proiezione-prospettica",
        statement: "Faccio fatica a occuparmi solo dell'operatività",
      },
      {
        position: 4,
        trait: "ottimizzazione-qualitativa",
        statement: "Assegno i compiti in base a ciò che ciascuno fa meglio",
      },
    ],
  },
  {
    position: 44,
    controlFor: 16,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Voglio che il lavoro del gruppo sia fatto nel modo giusto",
      },
      {
        position: 2,
        trait: "responsabilita-assunta",
        statement: "Se il team manca una scadenza ne rispondo io per primo",
      },
      {
        position: 3,
        trait: "ricostruzione-diagnostica",
        statement: "Cerco l'anello debole del processo prima che ceda",
      },
      {
        position: 4,
        trait: "positivita-motivazionale",
        statement: "Rendo sostenibili i periodi di carico elevato",
      },
    ],
  },
  {
    position: 45,
    options: [
      {
        position: 1,
        trait: "facilitazione-della-crescita",
        statement: "Considero un successo quando qualcuno non ha più bisogno di me",
      },
      {
        position: 2,
        trait: "coordinamento-adattivo",
        statement: "So sempre chi può coprire chi nel mio gruppo",
      },
      {
        position: 3,
        trait: "integrazione-sistemica",
        statement: "Riconosco quando il gruppo ripete un vecchio errore",
      },
      {
        position: 4,
        trait: "responsabilita-assunta",
        statement: "Se il team manca una scadenza ne rispondo io per primo",
      },
    ],
  },
  {
    position: 46,
    options: [
      {
        position: 1,
        trait: "strutturazione-metodica",
        statement: "Assegno responsabilità e date a ogni fase",
      },
      {
        position: 2,
        trait: "autonomia-decisionale",
        statement: "Mi assumo scelte che altri non prenderebbero",
      },
      {
        position: 3,
        trait: "assertivita-direttiva",
        statement: "Chiudo io le discussioni che si trascinano",
      },
      {
        position: 4,
        trait: "positivita-motivazionale",
        statement: "Rendo sostenibili i periodi di carico elevato",
      },
    ],
  },
  {
    position: 47,
    options: [
      {
        position: 1,
        trait: "generazione-ideativa",
        statement: "Mi annoio quando si ripete sempre lo stesso schema",
      },
      {
        position: 2,
        trait: "spinta-competitiva",
        statement: "Mostro al team dove siamo rispetto agli altri",
      },
      {
        position: 3,
        trait: "analisi-evidenziale",
        statement: "Verifico le assunzioni dietro una proposta",
      },
      {
        position: 4,
        trait: "ancoraggio-valoriale",
        statement: "Voglio che il lavoro del gruppo sia fatto nel modo giusto",
      },
    ],
  },
  {
    position: 48,
    controlFor: 19,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "La mia calma nel caos tranquillizza il team",
      },
      {
        position: 2,
        trait: "persistenza-operativa",
        statement: "Considero un fallimento personale lasciare le cose a metà",
      },
      {
        position: 3,
        trait: "focalizzazione-selettiva",
        statement: "Mi infastidisce quando il gruppo si disperde",
      },
      {
        position: 4,
        trait: "innesco-relazionale",
        statement: "Faccio conoscere i miei collaboratori alle persone giuste",
      },
    ],
  },
  {
    position: 49,
    options: [
      {
        position: 1,
        trait: "ricostruzione-diagnostica",
        statement: "Cerco l'anello debole del processo prima che ceda",
      },
      {
        position: 2,
        trait: "comunicazione-persuasiva",
        statement: "Verifico che il messaggio sia arrivato, non solo detto",
      },
      {
        position: 3,
        trait: "persistenza-operativa",
        statement: "Considero un fallimento personale lasciare le cose a metà",
      },
      {
        position: 4,
        trait: "curiosita-esplorativa",
        statement: "Accetto progetti in cui nessuno di noi è esperto",
      },
    ],
  },
  {
    position: 50,
    options: [
      {
        position: 1,
        trait: "iniziativa-proattiva",
        statement: "Fisso la data di partenza prima di avere tutte le risposte",
      },
      {
        position: 2,
        trait: "elaborazione-riflessiva",
        statement: "Il mio silenzio in riunione è lavoro, non disinteresse",
      },
      {
        position: 3,
        trait: "innesco-relazionale",
        statement: "Faccio conoscere i miei collaboratori alle persone giuste",
      },
      {
        position: 4,
        trait: "orientamento-allo-scopo",
        statement: "Faccio fatica a guidare qualcosa in cui non credo",
      },
    ],
  },
  {
    position: 51,
    options: [
      {
        position: 1,
        trait: "focalizzazione-selettiva",
        statement: "Mi infastidisce quando il gruppo si disperde",
      },
      {
        position: 2,
        trait: "sintonizzazione-empatica",
        statement: "Mi accorgo delle tensioni prima che esplodano",
      },
      {
        position: 3,
        trait: "flessibilita-adattiva",
        statement: "La mia calma nel caos tranquillizza il team",
      },
      {
        position: 4,
        trait: "equita-procedurale",
        statement: "Evito eccezioni che non so giustificare pubblicamente",
      },
    ],
  },
  {
    position: 52,
    controlFor: 22,
    options: [
      {
        position: 1,
        trait: "ottimizzazione-qualitativa",
        statement: "Spingo i miei a lavorare sui loro punti di forza",
      },
      {
        position: 2,
        trait: "proiezione-prospettica",
        statement: "Faccio fatica a occuparmi solo dell'operatività",
      },
      {
        position: 3,
        trait: "curiosita-esplorativa",
        statement: "Accetto progetti in cui nessuno di noi è esperto",
      },
      {
        position: 4,
        trait: "facilitazione-della-crescita",
        statement: "Vedo nei collaboratori un potenziale che loro non vedono",
      },
    ],
  },
  {
    position: 53,
    options: [
      {
        position: 1,
        trait: "autoefficacia-realizzativa",
        statement: "Misuro l'andamento del team dalle consegne completate",
      },
      {
        position: 2,
        trait: "regolazione-del-conflitto",
        statement: "Voglio che tutti si siano espressi prima di chiudere",
      },
      {
        position: 3,
        trait: "ambizione-visibile",
        statement: "Il lavoro invisibile mi dà meno energia",
      },
      {
        position: 4,
        trait: "prudenza-valutativa",
        statement: "Espongo la squadra solo a rischi che ho valutato",
      },
    ],
  },
];

/** 53 blocchi (45 a punteggio + 8 di controllo) · 30 tratti · 6 comparse per tratto */
const MPF_GESTIONE: MpfBlockSeed[] = [
  {
    position: 1,
    options: [
      {
        position: 1,
        trait: "innesco-relazionale",
        statement: "Metto rapidamente a proprio agio i nuovi arrivati",
      },
      {
        position: 2,
        trait: "prudenza-valutativa",
        statement: "Valuto i rischi prima di far partire il gruppo",
      },
      {
        position: 3,
        trait: "proiezione-prospettica",
        statement: "Preparo il team a scenari che non sono ancora arrivati",
      },
      {
        position: 4,
        trait: "spinta-competitiva",
        statement: "Confronto le prestazioni del mio team con quelle degli altri",
      },
    ],
  },
  {
    position: 2,
    options: [
      {
        position: 1,
        trait: "elaborazione-riflessiva",
        statement: "Mi prendo tempo prima di rispondere a un problema del gruppo",
      },
      {
        position: 2,
        trait: "comunicazione-persuasiva",
        statement: "Ottengo adesione spiegando bene le ragioni",
      },
      {
        position: 3,
        trait: "focalizzazione-selettiva",
        statement: "Riduco la lista delle priorità del team a poche voci",
      },
      {
        position: 4,
        trait: "autoefficacia-realizzativa",
        statement: "Mi impegno a consegnare quello che il team ha promesso",
      },
    ],
  },
  {
    position: 3,
    options: [
      {
        position: 1,
        trait: "ottimizzazione-qualitativa",
        statement: "Lavoro sui punti di forza di ciascun collaboratore",
      },
      {
        position: 2,
        trait: "coordinamento-adattivo",
        statement: "Riassegno le persone quando cambiano le priorità",
      },
      {
        position: 3,
        trait: "assertivita-direttiva",
        statement: "Do indicazioni chiare quando serve una direzione",
      },
      {
        position: 4,
        trait: "flessibilita-adattiva",
        statement: "Riorganizzo la giornata del team senza irritarmi",
      },
    ],
  },
  {
    position: 4,
    options: [
      {
        position: 1,
        trait: "sintonizzazione-empatica",
        statement: "Mi accorgo quando un collaboratore sta male prima che lo dica",
      },
      {
        position: 2,
        trait: "autonomia-decisionale",
        statement: "Decido senza aspettare l'avallo del livello superiore",
      },
      {
        position: 3,
        trait: "ricostruzione-diagnostica",
        statement: "Cerco la causa quando un processo del team si inceppa",
      },
      {
        position: 4,
        trait: "generazione-ideativa",
        statement: "Faccio emergere più opzioni prima di scegliere",
      },
    ],
  },
  {
    position: 5,
    options: [
      {
        position: 1,
        trait: "orientamento-allo-scopo",
        statement: "Spiego a ciascuno perché il suo compito conta",
      },
      {
        position: 2,
        trait: "iniziativa-proattiva",
        statement: "Faccio partire il lavoro prima che tutto sia definito",
      },
      {
        position: 3,
        trait: "curiosita-esplorativa",
        statement: "Porto al team pratiche viste altrove",
      },
      {
        position: 4,
        trait: "analisi-evidenziale",
        statement: "Chiedo dati prima di valutare una prestazione",
      },
    ],
  },
  {
    position: 6,
    options: [
      {
        position: 1,
        trait: "integrazione-sistemica",
        statement: "Considero l'effetto delle mie scelte sugli altri reparti",
      },
      {
        position: 2,
        trait: "responsabilita-assunta",
        statement: "Rispondo io degli errori del mio team",
      },
      {
        position: 3,
        trait: "ambizione-visibile",
        statement: "Voglio che il mio team sia riconosciuto come il migliore",
      },
      {
        position: 4,
        trait: "strutturazione-metodica",
        statement: "Do al team procedure chiare e ripetibili",
      },
    ],
  },
  {
    position: 7,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Applico le stesse regole a tutti i membri del team",
      },
      {
        position: 2,
        trait: "equita-procedurale",
        statement: "Distribuisco carichi e opportunità in modo equilibrato",
      },
      {
        position: 3,
        trait: "regolazione-del-conflitto",
        statement: "Faccio parlare le persone che si evitano",
      },
      {
        position: 4,
        trait: "persistenza-operativa",
        statement: "Riprendo con il team i problemi che tornano indietro",
      },
    ],
  },
  {
    position: 8,
    options: [
      {
        position: 1,
        trait: "persistenza-operativa",
        statement: "Non mollo una consegna difficile finché non è chiusa",
      },
      {
        position: 2,
        trait: "orientamento-allo-scopo",
        statement: "Collego i compiti quotidiani al risultato finale del gruppo",
      },
      {
        position: 3,
        trait: "positivita-motivazionale",
        statement: "Tengo alto il morale nei periodi pesanti",
      },
      {
        position: 4,
        trait: "facilitazione-della-crescita",
        statement: "Do feedback per far migliorare, non per giudicare",
      },
    ],
  },
  {
    position: 9,
    options: [
      {
        position: 1,
        trait: "ambizione-visibile",
        statement: "Porto i risultati del gruppo davanti a chi conta",
      },
      {
        position: 2,
        trait: "innesco-relazionale",
        statement: "Costruisco contatti utili al team in altri reparti",
      },
      {
        position: 3,
        trait: "equita-procedurale",
        statement: "Uso criteri uguali per valutare tutti i collaboratori",
      },
      {
        position: 4,
        trait: "elaborazione-riflessiva",
        statement: "Preparo in silenzio i colloqui delicati",
      },
    ],
  },
  {
    position: 10,
    options: [
      {
        position: 1,
        trait: "curiosita-esplorativa",
        statement: "Studio come lavorano gruppi diversi dal mio",
      },
      {
        position: 2,
        trait: "facilitazione-della-crescita",
        statement: "Assegno compiti scelti per far crescere la persona",
      },
      {
        position: 3,
        trait: "responsabilita-assunta",
        statement: "Mantengo gli impegni presi con i collaboratori",
      },
      {
        position: 4,
        trait: "prudenza-valutativa",
        statement: "Faccio controllare due volte le consegne critiche",
      },
    ],
  },
  {
    position: 11,
    options: [
      {
        position: 1,
        trait: "assertivita-direttiva",
        statement: "Affronto subito i comportamenti che non vanno",
      },
      {
        position: 2,
        trait: "ancoraggio-valoriale",
        statement: "Non chiedo ai collaboratori cose che ritengo scorrette",
      },
      {
        position: 3,
        trait: "spinta-competitiva",
        statement: "Uso classifiche e obiettivi di confronto per motivare",
      },
      {
        position: 4,
        trait: "integrazione-sistemica",
        statement: "Faccio vedere al team come si incastra il lavoro di ognuno",
      },
    ],
  },
  {
    position: 12,
    options: [
      {
        position: 1,
        trait: "analisi-evidenziale",
        statement: "Baso le decisioni sul gruppo su numeri verificabili",
      },
      {
        position: 2,
        trait: "generazione-ideativa",
        statement: "Propongo soluzioni a cui il gruppo non aveva pensato",
      },
      {
        position: 3,
        trait: "ottimizzazione-qualitativa",
        statement: "Assegno i compiti in base a ciò che ognuno fa meglio",
      },
      {
        position: 4,
        trait: "focalizzazione-selettiva",
        statement: "Dico chiaramente ai collaboratori cosa possono non fare",
      },
    ],
  },
  {
    position: 13,
    options: [
      {
        position: 1,
        trait: "strutturazione-metodica",
        statement: "Organizzo il lavoro settimanale con una struttura fissa",
      },
      {
        position: 2,
        trait: "autoefficacia-realizzativa",
        statement: "Chiudo personalmente ciò che rischia di restare aperto",
      },
      {
        position: 3,
        trait: "sintonizzazione-empatica",
        statement: "Adatto le richieste al momento che la persona sta vivendo",
      },
      {
        position: 4,
        trait: "positivita-motivazionale",
        statement: "Celebro con il gruppo i traguardi raggiunti",
      },
    ],
  },
  {
    position: 14,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "Accetto le richieste che arrivano fuori programma",
      },
      {
        position: 2,
        trait: "ricostruzione-diagnostica",
        statement: "Analizzo gli errori ricorrenti invece di tamponarli",
      },
      {
        position: 3,
        trait: "regolazione-del-conflitto",
        statement: "Riporto il gruppo all'accordo dopo uno scontro",
      },
      {
        position: 4,
        trait: "proiezione-prospettica",
        statement: "Pianifico i carichi guardando ai mesi successivi",
      },
    ],
  },
  {
    position: 15,
    options: [
      {
        position: 1,
        trait: "autonomia-decisionale",
        statement: "Mi assumo la scelta anche quando il gruppo è diviso",
      },
      {
        position: 2,
        trait: "iniziativa-proattiva",
        statement: "Sblocco le situazioni ferme invece di attendere",
      },
      {
        position: 3,
        trait: "comunicazione-persuasiva",
        statement: "Racconto il lavoro del team in modo che resti impresso",
      },
      {
        position: 4,
        trait: "coordinamento-adattivo",
        statement: "Ricompongo il piano del team in corsa senza fermarlo",
      },
    ],
  },
  {
    position: 16,
    options: [
      {
        position: 1,
        trait: "iniziativa-proattiva",
        statement: "Propongo io al gruppo il primo passo concreto",
      },
      {
        position: 2,
        trait: "elaborazione-riflessiva",
        statement: "Rifletto sulle situazioni prima di intervenire",
      },
      {
        position: 3,
        trait: "strutturazione-metodica",
        statement: "Definisco chi fa che cosa prima di partire",
      },
      {
        position: 4,
        trait: "assertivita-direttiva",
        statement: "Dico in faccia ai collaboratori quello che penso",
      },
    ],
  },
  {
    position: 17,
    options: [
      {
        position: 1,
        trait: "spinta-competitiva",
        statement: "Voglio che il gruppo chiuda davanti agli altri reparti",
      },
      {
        position: 2,
        trait: "flessibilita-adattiva",
        statement: "Resto efficace anche quando il piano salta",
      },
      {
        position: 3,
        trait: "orientamento-allo-scopo",
        statement: "Faccio riemergere il senso quando il team si demotiva",
      },
      {
        position: 4,
        trait: "sintonizzazione-empatica",
        statement: "Ascolto senza interrompere nei colloqui individuali",
      },
    ],
  },
  {
    position: 18,
    options: [
      {
        position: 1,
        trait: "comunicazione-persuasiva",
        statement: "So far cambiare idea a chi parte contrario",
      },
      {
        position: 2,
        trait: "generazione-ideativa",
        statement: "Uso sessioni di idee quando siamo bloccati",
      },
      {
        position: 3,
        trait: "prudenza-valutativa",
        statement: "Segnalo ai collaboratori cosa potrebbe andare storto",
      },
      {
        position: 4,
        trait: "ambizione-visibile",
        statement: "Alzo l'asticella degli obiettivi assegnati",
      },
    ],
  },
  {
    position: 19,
    options: [
      {
        position: 1,
        trait: "responsabilita-assunta",
        statement: "Non scarico su altri i ritardi del gruppo",
      },
      {
        position: 2,
        trait: "regolazione-del-conflitto",
        statement: "Cerco il punto in comune fra posizioni opposte",
      },
      {
        position: 3,
        trait: "focalizzazione-selettiva",
        statement: "Proteggo il gruppo dalle richieste che disperdono energia",
      },
      {
        position: 4,
        trait: "equita-procedurale",
        statement: "Non consento corsie preferenziali nel gruppo",
      },
    ],
  },
  {
    position: 20,
    options: [
      {
        position: 1,
        trait: "ricostruzione-diagnostica",
        statement: "Aiuto i collaboratori a capire dove si è rotto il flusso",
      },
      {
        position: 2,
        trait: "curiosita-esplorativa",
        statement: "Incoraggio i collaboratori a imparare cose nuove",
      },
      {
        position: 3,
        trait: "ancoraggio-valoriale",
        statement: "Tengo il punto quando una richiesta urta i miei principi",
      },
      {
        position: 4,
        trait: "ottimizzazione-qualitativa",
        statement: "Non mi accontento di una consegna appena sufficiente",
      },
    ],
  },
  {
    position: 21,
    options: [
      {
        position: 1,
        trait: "facilitazione-della-crescita",
        statement: "Dedico tempo regolare allo sviluppo dei collaboratori",
      },
      {
        position: 2,
        trait: "integrazione-sistemica",
        statement: "Coordino le attività guardando al processo intero",
      },
      {
        position: 3,
        trait: "analisi-evidenziale",
        statement: "Distinguo nei confronti i fatti dalle impressioni",
      },
      {
        position: 4,
        trait: "proiezione-prospettica",
        statement: "Anticipo ai collaboratori i cambiamenti che vedo arrivare",
      },
    ],
  },
  {
    position: 22,
    options: [
      {
        position: 1,
        trait: "positivita-motivazionale",
        statement: "Trovo il lato utilizzabile anche nelle notizie negative",
      },
      {
        position: 2,
        trait: "persistenza-operativa",
        statement: "Tengo il gruppo sul pezzo anche nei periodi lunghi",
      },
      {
        position: 3,
        trait: "autonomia-decisionale",
        statement: "Delego lasciando margine reale di decisione",
      },
      {
        position: 4,
        trait: "innesco-relazionale",
        statement: "Rompo il ghiaccio nelle riunioni con persone nuove",
      },
    ],
  },
  {
    position: 23,
    options: [
      {
        position: 1,
        trait: "autoefficacia-realizzativa",
        statement: "Misuro l'andamento del gruppo su cose consegnate",
      },
      {
        position: 2,
        trait: "generazione-ideativa",
        statement: "Collego cose distanti per risolvere un problema operativo",
      },
      {
        position: 3,
        trait: "coordinamento-adattivo",
        statement: "Sposto risorse dove servono nel giro di poche ore",
      },
      {
        position: 4,
        trait: "regolazione-del-conflitto",
        statement: "Intervengo presto sulle tensioni fra collaboratori",
      },
    ],
  },
  {
    position: 24,
    options: [
      {
        position: 1,
        trait: "focalizzazione-selettiva",
        statement: "Fisso un obiettivo per volta per ciascuna persona",
      },
      {
        position: 2,
        trait: "strutturazione-metodica",
        statement: "Tengo aggiornato lo stato di avanzamento delle attività",
      },
      {
        position: 3,
        trait: "spinta-competitiva",
        statement: "Rendo visibili gli scarti fra risultato atteso e ottenuto",
      },
      {
        position: 4,
        trait: "curiosita-esplorativa",
        statement: "Faccio domande su ciò che non conosco del lavoro altrui",
      },
    ],
  },
  {
    position: 25,
    options: [
      {
        position: 1,
        trait: "prudenza-valutativa",
        statement: "Preferisco un piano prudente a uno brillante ma fragile",
      },
      {
        position: 2,
        trait: "proiezione-prospettica",
        statement: "Costruisco oggi le competenze che serviranno domani",
      },
      {
        position: 3,
        trait: "persistenza-operativa",
        statement: "Insisto su una soluzione finché non funziona davvero",
      },
      {
        position: 4,
        trait: "assertivita-direttiva",
        statement: "Prendo il comando quando il gruppo è incerto",
      },
    ],
  },
  {
    position: 26,
    controlFor: 1,
    options: [
      {
        position: 1,
        trait: "spinta-competitiva",
        statement: "Punto a superare il risultato del periodo precedente",
      },
      {
        position: 2,
        trait: "proiezione-prospettica",
        statement: "Descrivo al gruppo dove saremo fra un anno",
      },
      {
        position: 3,
        trait: "prudenza-valutativa",
        statement: "Rallento una decisione quando le conseguenze sono pesanti",
      },
      {
        position: 4,
        trait: "innesco-relazionale",
        statement: "Trasformo un incontro formale in un rapporto di lavoro",
      },
    ],
  },
  {
    position: 27,
    options: [
      {
        position: 1,
        trait: "facilitazione-della-crescita",
        statement: "Noto i progressi anche piccoli e li dico",
      },
      {
        position: 2,
        trait: "equita-procedurale",
        statement: "Rendo trasparenti le regole con cui decido",
      },
      {
        position: 3,
        trait: "autoefficacia-realizzativa",
        statement: "Trasmetto ai collaboratori un ritmo di lavoro costante",
      },
      {
        position: 4,
        trait: "autonomia-decisionale",
        statement: "Difendo le scelte del mio team verso l'esterno",
      },
    ],
  },
  {
    position: 28,
    options: [
      {
        position: 1,
        trait: "ambizione-visibile",
        statement: "Cerco per il team incarichi di alto profilo",
      },
      {
        position: 2,
        trait: "positivita-motivazionale",
        statement: "Riconosco pubblicamente il contributo dei collaboratori",
      },
      {
        position: 3,
        trait: "iniziativa-proattiva",
        statement: "Preferisco una prova sul campo a un'altra riunione",
      },
      {
        position: 4,
        trait: "ricostruzione-diagnostica",
        statement: "Faccio revisioni dopo le consegne andate male",
      },
    ],
  },
  {
    position: 29,
    options: [
      {
        position: 1,
        trait: "sintonizzazione-empatica",
        statement: "Colgo il clima del gruppo dai segnali non detti",
      },
      {
        position: 2,
        trait: "ottimizzazione-qualitativa",
        statement: "Investo più tempo su chi è già bravo che su chi arranca",
      },
      {
        position: 3,
        trait: "elaborazione-riflessiva",
        statement: "Preferisco pensare da solo prima di aprire la discussione",
      },
      {
        position: 4,
        trait: "ancoraggio-valoriale",
        statement: "Rendo espliciti i comportamenti che nel gruppo non accetto",
      },
    ],
  },
  {
    position: 30,
    controlFor: 4,
    options: [
      {
        position: 1,
        trait: "generazione-ideativa",
        statement: "Stimolo il team a immaginare modi diversi di lavorare",
      },
      {
        position: 2,
        trait: "autonomia-decisionale",
        statement: "Non rimando una decisione solo perché è impopolare",
      },
      {
        position: 3,
        trait: "sintonizzazione-empatica",
        statement: "Tengo conto delle situazioni personali nelle assegnazioni",
      },
      {
        position: 4,
        trait: "ricostruzione-diagnostica",
        statement: "Smonto la procedura per trovare il punto debole",
      },
    ],
  },
  {
    position: 31,
    options: [
      {
        position: 1,
        trait: "integrazione-sistemica",
        statement: "Individuo dove il flusso fra funzioni si interrompe",
      },
      {
        position: 2,
        trait: "coordinamento-adattivo",
        statement: "Gestisco più attività parallele senza perderne il filo",
      },
      {
        position: 3,
        trait: "innesco-relazionale",
        statement: "Allargo la rete di relazioni del gruppo",
      },
      {
        position: 4,
        trait: "responsabilita-assunta",
        statement: "Mi faccio carico delle attività che nessuno ha preso",
      },
    ],
  },
  {
    position: 32,
    options: [
      {
        position: 1,
        trait: "orientamento-allo-scopo",
        statement: "Rifiuto attività che considero prive di utilità reale",
      },
      {
        position: 2,
        trait: "analisi-evidenziale",
        statement: "Misuro l'effetto dei cambiamenti che introduco",
      },
      {
        position: 3,
        trait: "flessibilita-adattiva",
        statement: "Cambio approccio con la persona se il primo non funziona",
      },
      {
        position: 4,
        trait: "comunicazione-persuasiva",
        statement: "Preparo con cura i messaggi importanti al gruppo",
      },
    ],
  },
  {
    position: 33,
    controlFor: 7,
    options: [
      {
        position: 1,
        trait: "regolazione-del-conflitto",
        statement: "Evito che le divergenze diventino personali",
      },
      {
        position: 2,
        trait: "persistenza-operativa",
        statement: "Sostengo lo sforzo del gruppo anche quando cala l'entusiasmo",
      },
      {
        position: 3,
        trait: "equita-procedurale",
        statement: "Motivo le mie scelte con criteri dichiarati in anticipo",
      },
      {
        position: 4,
        trait: "ancoraggio-valoriale",
        statement: "Mi aspetto coerenza fra ciò che dico e ciò che faccio fare",
      },
    ],
  },
  {
    position: 34,
    options: [
      {
        position: 1,
        trait: "spinta-competitiva",
        statement: "Mi carico quando c'è una sfida da vincere con il team",
      },
      {
        position: 2,
        trait: "elaborazione-riflessiva",
        statement: "Torno a ragionare su una scelta anche dopo averla fatta",
      },
      {
        position: 3,
        trait: "facilitazione-della-crescita",
        statement: "Preparo qualcuno a prendere il mio posto",
      },
      {
        position: 4,
        trait: "coordinamento-adattivo",
        statement: "Riorganizzo il gruppo quando manca qualcuno",
      },
    ],
  },
  {
    position: 35,
    options: [
      {
        position: 1,
        trait: "prudenza-valutativa",
        statement: "Metto per iscritto gli accordi che possono creare equivoci",
      },
      {
        position: 2,
        trait: "focalizzazione-selettiva",
        statement: "Taglio le attività che non spostano il risultato",
      },
      {
        position: 3,
        trait: "integrazione-sistemica",
        statement: "Tengo insieme le esigenze di più interlocutori",
      },
      {
        position: 4,
        trait: "iniziativa-proattiva",
        statement: "Metto in moto le persone quando vedo attesa inutile",
      },
    ],
  },
  {
    position: 36,
    options: [
      {
        position: 1,
        trait: "regolazione-del-conflitto",
        statement: "Mi preoccupo di ricucire i rapporti dentro il team",
      },
      {
        position: 2,
        trait: "strutturazione-metodica",
        statement: "Riduco il disordine assegnando ruoli precisi",
      },
      {
        position: 3,
        trait: "generazione-ideativa",
        statement: "Rilancio con alternative quando una strada si chiude",
      },
      {
        position: 4,
        trait: "orientamento-allo-scopo",
        statement: "Uso il significato del lavoro come leva di ingaggio",
      },
    ],
  },
  {
    position: 37,
    controlFor: 10,
    options: [
      {
        position: 1,
        trait: "prudenza-valutativa",
        statement: "Rallento una decisione quando le conseguenze sono pesanti",
      },
      {
        position: 2,
        trait: "responsabilita-assunta",
        statement: "Chiedo conto in modo diretto degli impegni non rispettati",
      },
      {
        position: 3,
        trait: "facilitazione-della-crescita",
        statement: "Mi soddisfa vedere un collaboratore superarmi",
      },
      {
        position: 4,
        trait: "curiosita-esplorativa",
        statement: "Dedico tempo ad approfondire i temi del mio settore",
      },
    ],
  },
  {
    position: 38,
    options: [
      {
        position: 1,
        trait: "curiosita-esplorativa",
        statement: "Cerco strumenti nuovi per il lavoro quotidiano",
      },
      {
        position: 2,
        trait: "sintonizzazione-empatica",
        statement: "Chiedo come sta chi vedo diverso dal solito",
      },
      {
        position: 3,
        trait: "persistenza-operativa",
        statement: "Do continuità alle attività che gli altri abbandonano",
      },
      {
        position: 4,
        trait: "ambizione-visibile",
        statement: "Mi dispiace quando il lavoro del gruppo passa inosservato",
      },
    ],
  },
  {
    position: 39,
    options: [
      {
        position: 1,
        trait: "ancoraggio-valoriale",
        statement: "Preferisco perdere una commessa che farla male",
      },
      {
        position: 2,
        trait: "ricostruzione-diagnostica",
        statement: "Mi attivo davanti a un problema che nessuno sa spiegare",
      },
      {
        position: 3,
        trait: "responsabilita-assunta",
        statement: "Considero un impegno preso con me una cosa seria",
      },
      {
        position: 4,
        trait: "comunicazione-persuasiva",
        statement: "Uso esempi concreti per far capire cosa chiedo",
      },
    ],
  },
  {
    position: 40,
    options: [
      {
        position: 1,
        trait: "analisi-evidenziale",
        statement: "Contesto le conclusioni non supportate da evidenze",
      },
      {
        position: 2,
        trait: "assertivita-direttiva",
        statement: "Non evito le conversazioni scomode",
      },
      {
        position: 3,
        trait: "autonomia-decisionale",
        statement: "Prendo posizione anche su questioni scomode",
      },
      {
        position: 4,
        trait: "positivita-motivazionale",
        statement: "Porto energia nelle riunioni di squadra",
      },
    ],
  },
  {
    position: 41,
    controlFor: 13,
    options: [
      {
        position: 1,
        trait: "strutturazione-metodica",
        statement: "Uso strumenti condivisi per tracciare le consegne",
      },
      {
        position: 2,
        trait: "positivita-motivazionale",
        statement: "Faccio ripartire il gruppo dopo un insuccesso",
      },
      {
        position: 3,
        trait: "sintonizzazione-empatica",
        statement: "Tengo conto delle situazioni personali nelle assegnazioni",
      },
      {
        position: 4,
        trait: "autoefficacia-realizzativa",
        statement: "Trasformo rapidamente le decisioni in attività assegnate",
      },
    ],
  },
  {
    position: 42,
    options: [
      {
        position: 1,
        trait: "equita-procedurale",
        statement: "Intervengo quando qualcuno viene trattato ingiustamente",
      },
      {
        position: 2,
        trait: "innesco-relazionale",
        statement: "Presento fra loro persone che possono aiutarsi",
      },
      {
        position: 3,
        trait: "flessibilita-adattiva",
        statement: "Trasmetto calma quando le priorità cambiano",
      },
      {
        position: 4,
        trait: "ottimizzazione-qualitativa",
        statement: "Rifinisco con il gruppo quello che è già buono",
      },
    ],
  },
  {
    position: 43,
    options: [
      {
        position: 1,
        trait: "innesco-relazionale",
        statement: "Trasformo un incontro formale in un rapporto di lavoro",
      },
      {
        position: 2,
        trait: "proiezione-prospettica",
        statement: "Ragiono sugli effetti a lungo termine delle scelte organizzative",
      },
      {
        position: 3,
        trait: "autoefficacia-realizzativa",
        statement: "Mi sento a disagio quando la settimana del team produce poco",
      },
      {
        position: 4,
        trait: "curiosita-esplorativa",
        statement: "Dedico tempo ad approfondire i temi del mio settore",
      },
    ],
  },
  {
    position: 44,
    controlFor: 16,
    options: [
      {
        position: 1,
        trait: "iniziativa-proattiva",
        statement: "Avvio iniziative senza aspettare che me le chiedano",
      },
      {
        position: 2,
        trait: "strutturazione-metodica",
        statement: "Uso strumenti condivisi per tracciare le consegne",
      },
      {
        position: 3,
        trait: "assertivita-direttiva",
        statement: "Chiudo la discussione quando è ora di decidere",
      },
      {
        position: 4,
        trait: "elaborazione-riflessiva",
        statement: "Uso i momenti di calma per mettere ordine nei pensieri",
      },
    ],
  },
  {
    position: 45,
    options: [
      {
        position: 1,
        trait: "flessibilita-adattiva",
        statement: "Lavoro bene anche senza un programma definito",
      },
      {
        position: 2,
        trait: "ambizione-visibile",
        statement: "Spingo i collaboratori a puntare più in alto di quanto pensino",
      },
      {
        position: 3,
        trait: "autoefficacia-realizzativa",
        statement: "Trasformo rapidamente le decisioni in attività assegnate",
      },
      {
        position: 4,
        trait: "analisi-evidenziale",
        statement: "Preparo le riunioni con dati alla mano",
      },
    ],
  },
  {
    position: 46,
    options: [
      {
        position: 1,
        trait: "ottimizzazione-qualitativa",
        statement: "Costruisco la squadra combinando talenti complementari",
      },
      {
        position: 2,
        trait: "regolazione-del-conflitto",
        statement: "Evito che le divergenze diventino personali",
      },
      {
        position: 3,
        trait: "prudenza-valutativa",
        statement: "Rallento una decisione quando le conseguenze sono pesanti",
      },
      {
        position: 4,
        trait: "autonomia-decisionale",
        statement: "Non rimando una decisione solo perché è impopolare",
      },
    ],
  },
  {
    position: 47,
    options: [
      {
        position: 1,
        trait: "positivita-motivazionale",
        statement: "Faccio ripartire il gruppo dopo un insuccesso",
      },
      {
        position: 2,
        trait: "spinta-competitiva",
        statement: "Punto a superare il risultato del periodo precedente",
      },
      {
        position: 3,
        trait: "coordinamento-adattivo",
        statement: "Trovo rapidamente una nuova combinazione di ruoli",
      },
      {
        position: 4,
        trait: "focalizzazione-selettiva",
        statement: "Riporto le riunioni sul punto quando si allargano troppo",
      },
    ],
  },
  {
    position: 48,
    controlFor: 19,
    options: [
      {
        position: 1,
        trait: "regolazione-del-conflitto",
        statement: "Evito che le divergenze diventino personali",
      },
      {
        position: 2,
        trait: "focalizzazione-selettiva",
        statement: "Riporto le riunioni sul punto quando si allargano troppo",
      },
      {
        position: 3,
        trait: "responsabilita-assunta",
        statement: "Chiedo conto in modo diretto degli impegni non rispettati",
      },
      {
        position: 4,
        trait: "equita-procedurale",
        statement: "Motivo le mie scelte con criteri dichiarati in anticipo",
      },
    ],
  },
  {
    position: 49,
    options: [
      {
        position: 1,
        trait: "assertivita-direttiva",
        statement: "Chiudo la discussione quando è ora di decidere",
      },
      {
        position: 2,
        trait: "orientamento-allo-scopo",
        statement: "Verifico che il gruppo sappia a cosa serve ciò che consegna",
      },
      {
        position: 3,
        trait: "responsabilita-assunta",
        statement: "Chiedo conto in modo diretto degli impegni non rispettati",
      },
      {
        position: 4,
        trait: "elaborazione-riflessiva",
        statement: "Uso i momenti di calma per mettere ordine nei pensieri",
      },
    ],
  },
  {
    position: 50,
    options: [
      {
        position: 1,
        trait: "generazione-ideativa",
        statement: "Stimolo il team a immaginare modi diversi di lavorare",
      },
      {
        position: 2,
        trait: "facilitazione-della-crescita",
        statement: "Mi soddisfa vedere un collaboratore superarmi",
      },
      {
        position: 3,
        trait: "strutturazione-metodica",
        statement: "Uso strumenti condivisi per tracciare le consegne",
      },
      {
        position: 4,
        trait: "ancoraggio-valoriale",
        statement: "Mi aspetto coerenza fra ciò che dico e ciò che faccio fare",
      },
    ],
  },
  {
    position: 51,
    options: [
      {
        position: 1,
        trait: "proiezione-prospettica",
        statement: "Descrivo al gruppo dove saremo fra un anno",
      },
      {
        position: 2,
        trait: "equita-procedurale",
        statement: "Motivo le mie scelte con criteri dichiarati in anticipo",
      },
      {
        position: 3,
        trait: "iniziativa-proattiva",
        statement: "Avvio iniziative senza aspettare che me le chiedano",
      },
      {
        position: 4,
        trait: "sintonizzazione-empatica",
        statement: "Tengo conto delle situazioni personali nelle assegnazioni",
      },
    ],
  },
  {
    position: 52,
    controlFor: 22,
    options: [
      {
        position: 1,
        trait: "innesco-relazionale",
        statement: "Metto rapidamente a proprio agio i nuovi arrivati",
      },
      {
        position: 2,
        trait: "positivita-motivazionale",
        statement: "Faccio ripartire il gruppo dopo un insuccesso",
      },
      {
        position: 3,
        trait: "autonomia-decisionale",
        statement: "Decido senza aspettare l'avallo del livello superiore",
      },
      {
        position: 4,
        trait: "persistenza-operativa",
        statement: "Sostengo lo sforzo del gruppo anche quando cala l'entusiasmo",
      },
    ],
  },
  {
    position: 53,
    options: [
      {
        position: 1,
        trait: "comunicazione-persuasiva",
        statement: "Riesco a far accettare decisioni difficili",
      },
      {
        position: 2,
        trait: "ricostruzione-diagnostica",
        statement: "Smonto la procedura per trovare il punto debole",
      },
      {
        position: 3,
        trait: "integrazione-sistemica",
        statement: "Ragiono sul sistema prima che sul singolo compito",
      },
      {
        position: 4,
        trait: "persistenza-operativa",
        statement: "Sostengo lo sforzo del gruppo anche quando cala l'entusiasmo",
      },
    ],
  },
];

export type MpfBankKey = 'mpf_essenziale' | 'mpf_completa' | 'mpf_leadership' | 'mpf_gestione';

export const MPF_BLOCK_BANKS: Record<MpfBankKey, MpfBlockSeed[]> = {
  mpf_essenziale: MPF_ESSENZIALE,
  mpf_completa: MPF_COMPLETA,
  mpf_leadership: MPF_LEADERSHIP,
  mpf_gestione: MPF_GESTIONE,
};
