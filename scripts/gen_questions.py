# -*- coding: utf-8 -*-
"""Genera src/content/questions.ts: design a confronto a coppie completo.

12 temi -> C(12,2) = 66 item. Ogni tema compare esattamente 11 volte,
con 11 affermazioni distinte (una per item) per evitare ripetizioni.
L'ordine di somministrazione e' costruito per:
  - evitare che due item consecutivi condividano un tema
  - bilanciare le comparse a sinistra/destra di ogni tema (anti side-bias)
"""
import itertools, json, random

POOLS = {
"realizzatore": [
 "Sento il bisogno di chiudere qualcosa di concreto ogni singolo giorno",
 "A fine settimana misuro il mio valore da quanto ho prodotto",
 "Il lavoro arretrato mi toglie serenita' finche' non lo smaltisco",
 "Preferisco una giornata piena a una giornata leggera",
 "Mi metto al lavoro subito, anche se l'obiettivo non e' ancora perfetto",
 "Trovo energia nel guardare la lista delle cose che ho completato",
 "Faccio fatica a stare fermo quando c'e' ancora qualcosa da finire",
 "Mi assegno obiettivi personali anche quando nessuno me li chiede",
 "Un ritmo di lavoro costante e' cio' che mi fa sentire in forma",
 "Anche nel tempo libero mi piace portare a termine qualche progetto",
 "Giudico una riunione da quante decisioni operative ne escono",
],
"organizzazione": [
 "Amo pianificare ogni dettaglio prima di iniziare",
 "Ho bisogno di un metodo chiaro per lavorare bene",
 "Le scadenze scritte in calendario mi danno sicurezza",
 "Metto in ordine le informazioni prima ancora di analizzarle",
 "Costruisco procedure per non dover ridecidere ogni volta",
 "I cambi di programma mi infastidiscono piu' dei problemi tecnici",
 "I miei file e i miei spazi seguono una logica precisa",
 "Preferisco un piano imperfetto a nessun piano",
 "Divido ogni progetto in fasi con responsabili e date",
 "Arrivo puntuale perche' ho previsto i tempi in anticipo",
 "Mi rassicura sapere in anticipo come sara' la mia settimana",
],
"responsabilita": [
 "Quando prometto qualcosa, per me diventa un obbligo morale",
 "Se un lavoro esce male, sento che la responsabilita' e' comunque mia",
 "Preferisco fare tardi piuttosto che consegnare qualcosa di incompleto",
 "Gli altri mi affidano le cose importanti perche' sanno che le concludo",
 "Non riesco a lasciare un impegno a meta', anche quando non conviene",
 "Mi sento in debito finche' non ho restituito cio' che ho ricevuto",
 "Anche gli impegni presi a voce, per me, contano come contratti",
 "Preferisco sacrificarmi piuttosto che deludere chi conta su di me",
 "Controllo due volte prima di consegnare, per non lasciare errori ad altri",
 "Davanti a un problema il mio primo pensiero e' cosa potevo fare io",
 "Rispetto le regole anche quando nessuno sta guardando",
],
"comunicazione": [
 "Mi viene naturale spiegare le cose in modo che tutti capiscano",
 "Uso storie ed esempi concreti per far arrivare un concetto",
 "In riunione prendo la parola per chiarire il punto",
 "Mi diverte trovare la frase giusta per riassumere un'idea",
 "Preparo con cura come diro' le cose, non solo cosa diro'",
 "Parlare davanti a un pubblico mi da' energia invece che ansia",
 "Traduco volentieri il linguaggio tecnico per chi non lo conosce",
 "Mi accorgo subito quando un messaggio non e' arrivato",
 "Preferisco discutere un'idea a voce piuttosto che per iscritto",
 "Trovo soddisfazione nel rendere memorabile una presentazione",
 "Do volentieri voce alle idee del gruppo davanti agli altri",
],
"attivatore": [
 "Preferisco improvvisare e correggere strada facendo",
 "Dopo dieci minuti di analisi mi chiedo quando si parte",
 "Imparo molto di piu' provando che studiando",
 "Sono io a fare il primo passo quando il gruppo e' bloccato",
 "Una decisione presa oggi vale piu' di una perfetta fra un mese",
 "Le lunghe riunioni preparatorie mi tolgono energia",
 "Preferisco un prototipo grezzo a una presentazione impeccabile",
 "Mi muovo anche quando non ho tutte le informazioni",
 "Credo che sia l'azione a creare chiarezza, non la riflessione",
 "Quando un'idea mi convince, voglio testarla entro la settimana",
 "Accetto il rischio di sbagliare pur di andare piu' veloce",
],
"fiducia-in-se": [
 "So di poter gestire quasi qualunque situazione mi capiti",
 "Prendo decisioni difficili senza bisogno di conferme",
 "Se sono convinto di una scelta, la sostengo anche da solo",
 "Le critiche non mi fanno cambiare rotta facilmente",
 "Mi fido del mio giudizio piu' che del parere della maggioranza",
 "Nei momenti di crisi resto lucido mentre gli altri si agitano",
 "Preferisco decidere io piuttosto che aspettare un consenso",
 "Non ho bisogno di essere rassicurato per andare avanti",
 "Accetto volentieri la responsabilita' di una scelta impopolare",
 "Uso la mia bussola interna piu' dei riferimenti esterni",
 "Chiedo aiuto solo dopo aver esaurito le mie opzioni",
],
"empatia": [
 "Percepisco lo stato d'animo degli altri prima che lo dicano",
 "Le emozioni delle persone attorno a me mi arrivano forte",
 "Capisco come sta un collega dal tono con cui mi saluta",
 "Le persone mi confidano cose personali anche senza conoscermi bene",
 "Prima di rispondere penso a come si sentira' chi mi ascolta",
 "Mi accorgo della tensione in una stanza anche se nessuno parla",
 "Faccio fatica a restare indifferente quando qualcuno sta male",
 "Scelgo le parole con cura nei momenti delicati",
 "Riesco a mettermi nei panni anche di chi non mi somiglia",
 "Il clima emotivo del team influenza molto il mio lavoro",
 "Ascolto piu' quello che non viene detto che le parole",
],
"armonia": [
 "Cerco sempre il punto d'incontro fra posizioni diverse",
 "Le discussioni accese mi sembrano spesso energia sprecata",
 "Preferisco cedere su un dettaglio che incrinare un rapporto",
 "Faccio da ponte quando due colleghi non si parlano",
 "Evito di sollevare obiezioni che non siano davvero decisive",
 "Un accordo condiviso vale piu' di una decisione perfetta",
 "Mi accordo sul metodo prima di entrare nel merito",
 "Guardo prima cio' che unisce e poi cio' che divide",
 "Nei conflitti abbasso il tono invece di alzarlo",
 "Preferisco un gruppo sereno a un gruppo brillante ma teso",
 "Prima di chiudere voglio che tutti si siano sentiti ascoltati",
],
"sviluppatore": [
 "Vedo negli altri il potenziale che loro non vedono ancora",
 "I progressi di chi affianco mi danno piu' soddisfazione dei miei",
 "Mi ritrovo a fare da mentore anche senza un ruolo formale",
 "Ho pazienza autentica con chi impara lentamente",
 "Preferisco insegnare a fare che fare al posto di qualcuno",
 "Noto i piccoli miglioramenti delle persone e glieli dico",
 "Investo tempo su chi e' promettente anche se ora rende poco",
 "Mi piace costruire percorsi di crescita su misura",
 "Credo che quasi tutti possano migliorare, se ben accompagnati",
 "Do volentieri una seconda occasione a chi ha sbagliato",
 "Considero un successo quando chi ho formato non ha piu' bisogno di me",
],
"analitico": [
 "Prima di accettare una tesi chiedo su quali dati si basa",
 "Cerco sempre la causa che sta dietro a un risultato",
 "Diffido delle conclusioni tratte da pochi casi",
 "Mi piace smontare un problema nelle sue componenti",
 "Preferisco un dato verificato a un'impressione condivisa",
 "Individuo rapidamente i punti deboli di un ragionamento",
 "Non decido finche' non ho considerato le spiegazioni alternative",
 "Le scelte prese d'istinto mi mettono a disagio",
 "Trovo soddisfazione nel far tornare i conti",
 "Chiedo tempo per verificare prima di dare una risposta",
 "Un'idea entusiasmante senza prove per me resta un'ipotesi",
],
"ideazione": [
 "Mi entusiasmano le idee nuove piu' della loro esecuzione",
 "Collego spesso cose che sembrano non c'entrare nulla fra loro",
 "Davanti a un vincolo cerco un modo diverso di vedere il problema",
 "Genero molte alternative anche quando una soluzione c'e' gia'",
 "Mi annoio quando si ripete sempre lo stesso schema",
 "Le mie idee migliori arrivano mentre sto facendo altro",
 "Preferisco riformulare la domanda che rispondere a quella data",
 "Mi piace immaginare scenari che ancora non esistono",
 "Trovo bello un concetto anche prima di sapere se sara' utile",
 "Propongo volentieri strade che nessuno ha ancora considerato",
 "Un brainstorming mi ricarica piu' di una riunione decisionale",
],
"apprendimento": [
 "Mi da' energia il passaggio dal non sapere al sapere",
 "Studio volentieri argomenti che non mi servono subito",
 "Quando inizio qualcosa di nuovo mi sento nel mio elemento",
 "Accumulo corsi, letture e approfondimenti per pura curiosita'",
 "Preferisco un progetto mai fatto prima a uno che padroneggio",
 "Il cambiamento mi incuriosisce piu' di quanto mi preoccupi",
 "Provo i nuovi strumenti prima che diventino uno standard",
 "Mi piace essere principiante, anche se e' scomodo",
 "Approfondisco un tema finche' non ne capisco la struttura",
 "Chiedo 'perche' funziona cosi'?' anche fuori dal mio ruolo",
 "Cambio volentieri campo pur di imparare qualcosa di nuovo",
],
}

# accenti corretti (i pool sono scritti in ASCII per sicurezza di encoding)
FIX = [("perche'","perché"),("piu'","più"),("puo'","può"),("cosi'","così"),("gia'","già"),
       ("e' ","è "),("c'e'","c'è"),("da' ","dà "),("meta'","metà"),("responsabilita'","responsabilità"),
       ("serenita'","serenità"),("curiosita'","curiosità"),("possibilita'","possibilità"),
       ("liberta'","libertà"),("qualita'","qualità"),("diro'","dirò"),("percio'","perciò"),
       ("sara'","sarà"),("verita'","verità"),("utilita'","utilità"),("faro'","farò")]

def fix(s):
    for a,b in FIX:
        s = s.replace(a,b)
    if s.endswith(" e'"): s = s[:-3] + " è"
    return s

THEMES = list(POOLS.keys())
assert len(THEMES) == 12
for t,p in POOLS.items():
    assert len(p) == 11, (t, len(p))
    assert len(set(p)) == 11, t

pairs = [tuple(sorted(p)) for p in itertools.combinations(THEMES, 2)]
assert len(pairs) == 66

# --- ordinamento: nessun tema ripetuto in item consecutivi -------------------
rnd = random.Random(20240517)
remaining = pairs[:]
rnd.shuffle(remaining)
ordered = [remaining.pop(0)]
while remaining:
    prev = set(ordered[-1])
    prev2 = set(ordered[-2]) if len(ordered) > 1 else set()
    # candidato migliore: nessuna sovrapposizione con l'item precedente,
    # e possibilmente nemmeno con quello prima ancora
    best, best_score = None, -1
    for i, cand in enumerate(remaining):
        c = set(cand)
        score = (0 if c & prev else 2) + (0 if c & prev2 else 1)
        if score > best_score:
            best, best_score = i, score
        if score == 3:
            break
    ordered.append(remaining.pop(best))

conflicts = sum(1 for i in range(1, len(ordered)) if set(ordered[i]) & set(ordered[i-1]))

# --- lati bilanciati --------------------------------------------------------
left_count = {t: 0 for t in THEMES}
used = {t: 0 for t in THEMES}
items = []
for pos, (a, b) in enumerate(ordered, start=1):
    if left_count[a] < left_count[b]:
        L, R = a, b
    elif left_count[b] < left_count[a]:
        L, R = b, a
    else:
        L, R = (a, b) if pos % 2 else (b, a)
    left_count[L] += 1
    ls = POOLS[L][used[L]]; used[L] += 1
    rs = POOLS[R][used[R]]; used[R] += 1
    items.append({"position": pos, "leftTheme": L, "rightTheme": R,
                  "leftStatement": fix(ls), "rightStatement": fix(rs)})

appear = {t: 0 for t in THEMES}
for it in items:
    appear[it["leftTheme"]] += 1
    appear[it["rightTheme"]] += 1

lines = []
lines.append("/* eslint-disable */")
lines.append("// ---------------------------------------------------------------------------")
lines.append("// FILE GENERATO da scripts/gen_questions.py — non modificare a mano.")
lines.append("//")
lines.append("// Design a confronto a coppie completo (complete paired-comparison):")
lines.append("// 12 temi -> 66 item, ogni coppia di temi confrontata esattamente una volta.")
lines.append("// Ogni tema compare in 11 item, con 11 affermazioni distinte.")
lines.append("// Lati bilanciati (5/6 comparse a sinistra per tema) per neutralizzare il side-bias.")
lines.append("// ---------------------------------------------------------------------------")
lines.append("")
lines.append("export type QuestionSeed = {")
lines.append("  position: number;")
lines.append("  leftStatement: string;")
lines.append("  rightStatement: string;")
lines.append("  leftTheme: string;")
lines.append("  rightTheme: string;")
lines.append("  leftWeight?: number;")
lines.append("  rightWeight?: number;")
lines.append("};")
lines.append("")
lines.append("export const QUESTIONS: QuestionSeed[] = [")
for it in items:
    lines.append("  {")
    lines.append("    position: %d," % it["position"])
    lines.append("    leftStatement: %s," % json.dumps(it["leftStatement"], ensure_ascii=False))
    lines.append("    rightStatement: %s," % json.dumps(it["rightStatement"], ensure_ascii=False))
    lines.append("    leftTheme: %s," % json.dumps(it["leftTheme"]))
    lines.append("    rightTheme: %s," % json.dumps(it["rightTheme"]))
    lines.append("  },")
lines.append("];")
lines.append("")
lines.append("export const TOTAL_QUESTIONS = QUESTIONS.length;")
lines.append("")

open("src/content/questions.ts", "w", encoding="utf-8").write("\n".join(lines))

print("items:", len(items))
print("adiacenze con tema condiviso:", conflicts)
print("comparse per tema:", sorted(set(appear.values())))
print("comparse a sinistra:", sorted(set(left_count.values())))
