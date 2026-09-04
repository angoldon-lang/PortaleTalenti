# -*- coding: utf-8 -*-
"""Genera src/content/questions.ts: le banche di item dei quattro assessment.

Le affermazioni vivono in scripts/statements/*.json (dati versionati e
rivedibili); questo script si limita ad assemblarle in item a confronto di
coppie, bilanciando il design.

Due schemi di costruzione, a seconda del numero di temi:

  - ROUND-ROBIN COMPLETO (12 temi -> 66 item): ogni coppia di temi viene
    confrontata esattamente una volta. Possibile solo con pochi temi, perche'
    il numero di item cresce con il quadrato: con 34 temi servirebbero 561 item.

  - DESIGN CIRCOLANTE (34 temi): i temi sono disposti in cerchio e si generano
    le coppie (i, i+d) per ogni tema i e per ogni scarto d di un insieme scelto.
    Ogni scarto produce 34 coppie e fa comparire ogni tema esattamente 2 volte,
    quindi k scarti danno 34k item con 2k comparse per tema. Il risultato e' un
    disegno perfettamente bilanciato: nessun tema ha piu' occasioni di altri.

In entrambi i casi si controllano poi:
  - l'ordine: due item consecutivi non condividono un tema, cosi' chi risponde
    non percepisce di essere interrogato due volte di fila sullo stesso tratto;
  - il lato: ogni tema compare a sinistra circa nella meta' dei suoi item, per
    neutralizzare la tendenza a preferire sistematicamente un lato (side bias).
"""
import itertools
import json
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATEMENTS = os.path.join(ROOT, 'scripts', 'statements')

# I 34 temi nell'ordine del catalogo, raggruppati per macro-area.
DOMAINS = {
    'OPERATIONAL': ['tensione-produttiva', 'ordinamento-complessita', 'vincolo-impegno', 'riconfigurazione-risorse',
                  'principi-non-negoziabili', 'uniformita-trattamento', 'cautela-preventiva', 'filtro-direzionale', 'riparazione-guasto'],
    'INTERPERSONAL': ['efficacia-espositiva', 'passaggio-azione', 'sicurezza-giudizio', 'presa-di-posizione',
                    'confronto-con-il-risultato', 'innalzamento-eccellenza', 'impronta-riconoscibile', 'apertura-contatto-nuovo'],
    'SUPPORTIVE': ['lettura-stati-emotivi', 'ricerca-terreno-comune', 'riconoscimento-potenziale', 'aderenza-al-presente', 'percezione-dei-legami',
                     'allargamento-del-gruppo', 'differenziazione-persona', 'alleggerimento-clima', 'profondita-dei-legami'],
    'COGNITIVE': ['richiesta-di-prove', 'accostamento-inatteso', 'piacere-di-imparare', 'ricorso-al-precedente', 'nitidezza-del-possibile',
                  'accumulo-informativo', 'attivita-di-pensiero', 'selezione-del-percorso'],
}
DOMAIN_OF = {slug: d for d, slugs in DOMAINS.items() for slug in slugs}


def interleaved_order(slugs):
    """Alterna le macro-aree, cosi' i temi vicini nel cerchio sono di aree diverse
    e gli scarti del design circolante producono confronti fra aree diverse."""
    buckets = [[s for s in DOMAINS[d] if s in slugs] for d in DOMAINS]
    out = []
    while any(buckets):
        for b in buckets:
            if b:
                out.append(b.pop(0))
    return out


def round_robin_pairs(slugs):
    return [tuple(sorted(p)) for p in itertools.combinations(slugs, 2)]


def circulant_pairs(slugs, offsets):
    """Coppie (i, i+d) su un cerchio di temi. Ogni scarto d fa comparire ogni
    tema due volte; scarti distinti e sotto la meta' del cerchio garantiscono
    che nessuna coppia si ripeta."""
    n = len(slugs)
    assert len(set(offsets)) == len(offsets), 'scarti duplicati'
    for d in offsets:
        assert 0 < d < n / 2, 'lo scarto %d non e\' valido per %d temi' % (d, n)
    pairs = []
    for d in offsets:
        for i in range(n):
            pairs.append(tuple(sorted((slugs[i], slugs[(i + d) % n]))))
    assert len(set(pairs)) == len(pairs), 'coppie duplicate'
    return pairs


def order_pairs(pairs, seed):
    """Ordina gli item in modo che due consecutivi non condividano un tema."""
    rnd = random.Random(seed)
    remaining = pairs[:]
    rnd.shuffle(remaining)
    ordered = [remaining.pop(0)]
    while remaining:
        prev = set(ordered[-1])
        prev2 = set(ordered[-2]) if len(ordered) > 1 else set()
        best, best_score = 0, -1
        for i, cand in enumerate(remaining):
            c = set(cand)
            score = (0 if c & prev else 2) + (0 if c & prev2 else 1)
            if score > best_score:
                best, best_score = i, score
            if score == 3:
                break
        ordered.append(remaining.pop(best))
    return ordered


def assign_sides(ordered, slugs):
    """Decide quale tema va a sinistra in ciascun item.

    Prima passata greedy, poi raffinamento: si scambiano i lati degli item
    finche' lo scambio riduce lo sbilanciamento complessivo. L'obiettivo e' che
    ogni tema compaia a sinistra in meta' esatta dei propri item.
    """
    appearances = {s: 0 for s in slugs}
    for a, b in ordered:
        appearances[a] += 1
        appearances[b] += 1
    target = {s: appearances[s] / 2 for s in slugs}

    left_count = {s: 0 for s in slugs}
    sides = []
    for position, (a, b) in enumerate(ordered, start=1):
        if left_count[a] < left_count[b]:
            pair = (a, b)
        elif left_count[b] < left_count[a]:
            pair = (b, a)
        else:
            pair = (a, b) if position % 2 else (b, a)
        left_count[pair[0]] += 1
        sides.append(pair)

    def imbalance():
        return sum(abs(left_count[s] - target[s]) for s in slugs)

    improved = True
    while improved:
        improved = False
        for i, (left, right) in enumerate(sides):
            before = abs(left_count[left] - target[left]) + abs(left_count[right] - target[right])
            after = (abs(left_count[left] - 1 - target[left])
                     + abs(left_count[right] + 1 - target[right]))
            if after < before:
                left_count[left] -= 1
                left_count[right] += 1
                sides[i] = (right, left)
                improved = True

    return sides, left_count


def build_bank(key, slugs, pairs, pool, seed):
    ordered = order_pairs(pairs, seed)
    sides, left_count = assign_sides(ordered, slugs)

    used = {s: 0 for s in slugs}
    items = []
    for position, (left, right) in enumerate(sides, start=1):
        for slug in (left, right):
            if used[slug] >= len(pool[slug]):
                raise SystemExit(
                    'Affermazioni insufficienti per "%s" nella banca %s: ne servono %d'
                    % (slug, key, used[slug] + 1))
        ls = pool[left][used[left]]
        used[left] += 1
        rs = pool[right][used[right]]
        used[right] += 1
        items.append({'position': position, 'leftTheme': left, 'rightTheme': right,
                      'leftStatement': ls, 'rightStatement': rs})

    appearances = {s: 0 for s in slugs}
    for it in items:
        appearances[it['leftTheme']] += 1
        appearances[it['rightTheme']] += 1
    adjacent = sum(1 for i in range(1, len(ordered))
                   if set(ordered[i]) & set(ordered[i - 1]))
    cross_domain = sum(1 for it in items
                       if DOMAIN_OF[it['leftTheme']] != DOMAIN_OF[it['rightTheme']])

    return items, {
        'items': len(items),
        'appearances': sorted(set(appearances.values())),
        'left': sorted(set(left_count.values())),
        'adjacent_conflicts': adjacent,
        'cross_domain_pct': round(100 * cross_domain / len(items)),
    }


def load(name):
    with open(os.path.join(STATEMENTS, name), encoding='utf-8') as fh:
        return json.load(fh)


BANKS = []

# --- core12: round-robin completo, 66 item -----------------------------------
core_pool = load('core12.json')
core_slugs = interleaved_order(list(core_pool))
BANKS.append(('core12', core_slugs, round_robin_pairs(core_slugs), core_pool, 20240517))

# --- banche a 34 temi: design circolante -------------------------------------
# Scarti diversi per banca: i tre assessment confrontano coppie di temi diverse,
# quindi non sono lo stesso questionario con parole diverse.
#
# Vincolo sulla scelta degli scarti: i temi sono disposti alternando le quattro
# macro-aree, quindi lo scarto d modulo 4 determina QUALE coppia di aree viene
# confrontata. Servono perciò quattro scarti con residui mod 4 tutti diversi,
# altrimenti alcune coppie di aree restano sotto-campionate e i temi che vi
# appartengono vengono stimati peggio (verificato con scripts/simulate.ts:
# una banca con residui duplicati perdeva 2 posizioni su 7 nella Top K).
full_pool = load('general34.json')
full_slugs = interleaved_order(list(full_pool))
BANKS.append(('full34', full_slugs, circulant_pairs(full_slugs, [1, 6, 11, 16]), full_pool, 7717))

lead_pool = load('leaders34.json')
BANKS.append(('leaders', full_slugs, circulant_pairs(full_slugs, [2, 7, 9, 12]), lead_pool, 3313))

mgr_pool = load('managers34.json')
BANKS.append(('managers', full_slugs, circulant_pairs(full_slugs, [3, 8, 13, 14]), mgr_pool, 9091))


out = ['/* eslint-disable */',
       '// ---------------------------------------------------------------------------',
       '// FILE GENERATO da scripts/gen_questions.py — non modificare a mano.',
       '// Le affermazioni sono in scripts/statements/*.json.',
       '// ---------------------------------------------------------------------------',
       '',
       'export type QuestionSeed = {',
       '  position: number;',
       '  leftStatement: string;',
       '  rightStatement: string;',
       '  leftTheme: string;',
       '  rightTheme: string;',
       '  leftWeight?: number;',
       '  rightWeight?: number;',
       '};',
       '',
       'export type QuestionBankKey = ' + ' | '.join("'%s'" % k for k, *_ in BANKS) + ';',
       '']

summary = {}
for key, slugs, pairs, pool, seed in BANKS:
    items, stats = build_bank(key, slugs, pairs, pool, seed)
    summary[key] = stats
    out.append('/** %d item · %d temi · %d comparse per tema */'
               % (stats['items'], len(slugs), stats['appearances'][0]))
    out.append('const %s: QuestionSeed[] = [' % key.upper())
    for it in items:
        out.append('  {')
        out.append('    position: %d,' % it['position'])
        out.append('    leftStatement: %s,' % json.dumps(it['leftStatement'], ensure_ascii=False))
        out.append('    rightStatement: %s,' % json.dumps(it['rightStatement'], ensure_ascii=False))
        out.append('    leftTheme: %s,' % json.dumps(it['leftTheme']))
        out.append('    rightTheme: %s,' % json.dumps(it['rightTheme']))
        out.append('  },')
    out.append('];')
    out.append('')

out.append('export const QUESTION_BANKS: Record<QuestionBankKey, QuestionSeed[]> = {')
for key, *_ in BANKS:
    out.append('  %s: %s,' % (key, key.upper()))
out.append('};')
out.append('')

with open(os.path.join(ROOT, 'src', 'content', 'questions.ts'), 'w', encoding='utf-8') as fh:
    fh.write('\n'.join(out))

for key, stats in summary.items():
    print('%-9s %3d item | comparse/tema %s | a sinistra %s | adiacenze %d | cross-area %d%%'
          % (key, stats['items'], stats['appearances'], stats['left'],
             stats['adjacent_conflicts'], stats['cross_domain_pct']))
