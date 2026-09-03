# -*- coding: utf-8 -*-
"""Genera i blocchi quartetto della Mappa dei Punti di Forza.

Ogni blocco presenta quattro affermazioni di quattro tratti diversi, fra cui
chi risponde sceglie quella che lo descrive di più e quella che lo descrive di
meno.

Vincoli del disegno:

  1. BILANCIAMENTO. Ogni tratto compare lo stesso numero di volte, altrimenti
     chi compare più spesso ha più occasioni di essere scelto e il confronto
     fra punteggi non regge. Con 30 tratti e blocchi da 4, il numero di blocchi
     è 30k/4: k deve essere pari.

  2. AREE DISTINTE. I quattro tratti di un blocco appartengono a quattro aree
     diverse. Costringere a scegliere fra due tratti della stessa area
     produrrebbe scelte arbitrarie fra costrutti vicini, e sposterebbe il
     punteggio dell'area invece che quello del tratto.

  3. POSIZIONE. Ogni tratto compare in modo uniforme nelle quattro posizioni
     del blocco, per neutralizzare l'effetto dell'ordine di lettura.

  4. COPERTURA DELLE COPPIE. Le coppie di tratti si ripetono il meno possibile:
     ogni confronto speso su una coppia già vista è informazione che non si
     raccoglie altrove.

  5. BLOCCHI DI CONTROLLO. Alcuni blocchi ripropongono più avanti la stessa
     quartina di tratti già incontrata, con affermazioni diverse fra quelle di
     quei tratti. Servono solo a misurare la coerenza — la stessa scelta, posta
     con altre parole, viene rifatta? — e sono esclusi dal calcolo dei
     punteggi, così il bilanciamento delle comparse resta intatto.
"""
import itertools
import json
import os
import random
import re
import sys
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
STATEMENTS = os.path.join(ROOT, 'scripts', 'mpf', 'affermazioni')
MODEL_TS = os.path.join(ROOT, 'src', 'content', 'mpf', 'model.ts')


def load_model():
    """Legge tratti e aree dal file di contenuto, unica fonte di verità."""
    with open(MODEL_TS, encoding='utf-8') as fh:
        src = fh.read()
    # model.ts è formattato da prettier: le stringhe possono essere fra apici
    # singoli o doppi, quindi la lettura accetta entrambe le forme.
    q = "['\"]"
    traits = re.findall(
        rf"slug: {q}([a-z-]+){q},\n    name: {q}[^'\"]+{q},\n    area: {q}([a-z-]+){q}", src
    )
    areas = re.findall(rf"slug: {q}([a-z-]+){q},\n    name: {q}[^'\"]+{q},\n    short:", src)
    assert traits, 'nessun tratto trovato in model.ts'
    assert areas, 'nessuna area trovata in model.ts'
    return dict(traits), areas


TRAIT_AREA, AREAS = load_model()
TRAITS = list(TRAIT_AREA)
BY_AREA = defaultdict(list)
for t, a in TRAIT_AREA.items():
    BY_AREA[a].append(t)


def build_blocks(k, seed):
    """Costruisce i blocchi con k comparse per tratto."""
    assert k % 2 == 0, 'k deve essere pari perché 30k/4 sia intero'
    n_blocks = len(TRAITS) * k // 4
    rnd = random.Random(seed)

    best = None
    # Il disegno è costruito in modo greedy e può incastrarsi: si riprova con
    # semi diversi e si tiene il tentativo migliore.
    for attempt in range(400):
        need = {t: k for t in TRAITS}
        pair_count = Counter()
        blocks = []
        ok = True

        for _ in range(n_blocks):
            # Aree ordinate per fabbisogno residuo, con rumore per variare.
            area_need = {a: sum(need[t] for t in BY_AREA[a]) for a in AREAS}
            areas = sorted(AREAS, key=lambda a: (-area_need[a], rnd.random()))[:4]
            if any(area_need[a] <= 0 for a in areas):
                ok = False
                break

            chosen = []
            for a in areas:
                candidates = [t for t in BY_AREA[a] if need[t] > 0]
                if not candidates:
                    ok = False
                    break
                # Fra i tratti dell'area: prima quelli più "in debito", poi
                # quelli che hanno già incontrato meno spesso i già scelti.
                candidates.sort(
                    key=lambda t: (
                        -need[t],
                        sum(pair_count[tuple(sorted((t, c)))] for c in chosen),
                        rnd.random(),
                    )
                )
                chosen.append(candidates[0])
            if not ok:
                break

            for t in chosen:
                need[t] -= 1
            for x, y in itertools.combinations(chosen, 2):
                pair_count[tuple(sorted((x, y)))] += 1
            rnd.shuffle(chosen)
            blocks.append(chosen)

        if ok and all(v == 0 for v in need.values()):
            repeats = sum(c - 1 for c in pair_count.values() if c > 1)
            if best is None or repeats < best[0]:
                best = (repeats, blocks, dict(pair_count))
            if repeats == 0:
                break

    if best is None:
        sys.exit(f'Impossibile costruire un disegno bilanciato con k={k}')
    return best[1], best[2]


def balance_positions(blocks, seed):
    """Riordina i tratti dentro ogni blocco perché ciascuno occupi le quattro
    posizioni in modo uniforme."""
    rnd = random.Random(seed + 1)
    position_count = defaultdict(Counter)

    for block in blocks:
        # Assegnazione greedy: la posizione va al tratto che l'ha usata meno.
        slots = [0, 1, 2, 3]
        order = [None] * 4
        for t in sorted(block, key=lambda x: rnd.random()):
            slot = min(slots, key=lambda s: (position_count[t][s], rnd.random()))
            order[slot] = t
            slots.remove(slot)
            position_count[t][slot] += 1
        block[:] = order
    return position_count


def load_statements(name):
    with open(os.path.join(STATEMENTS, name), encoding='utf-8') as fh:
        return json.load(fh)


# Otto controlli per banca, cioè sedici conferme. Con meno l'indice di coerenza
# oscilla troppo da persona a persona per essere letto sul singolo profilo.
N_CONTROLS = 8


def add_controls(items, seed):
    """Aggiunge i blocchi di controllo e restituisce la sequenza finale.

    Ogni controllo ripropone i quattro tratti di un blocco già somministrato,
    ma con affermazioni che quei tratti hanno mostrato in altri blocchi: chi
    risponde rivede lo stesso confronto fra costrutti, non lo stesso testo.
    """
    rnd = random.Random(seed + 2)
    n = len(items)

    # Che cosa ha già detto ciascun tratto, e dove.
    said = defaultdict(list)
    for idx, it in enumerate(items):
        for o in it['options']:
            said[o['trait']].append((idx, o['statement']))

    # Sorgenti prese dalla prima metà, distanziate fra loro.
    sources = [round(i * (n // 2 - 1) / (N_CONTROLS - 1)) for i in range(N_CONTROLS)]

    controls = []
    for src in sources:
        options = []
        for o in items[src]['options']:
            # Fra le frasi già usate dal tratto, quella detta più lontano dal
            # blocco di origine: riduce il riconoscimento a memoria.
            alt = max((x for x in said[o['trait']] if x[0] != src), key=lambda x: abs(x[0] - src))
            options.append({'position': o['position'], 'trait': o['trait'], 'statement': alt[1]})
        rnd.shuffle(options)
        for slot, o in enumerate(options, start=1):
            o['position'] = slot
        controls.append({'source': items[src], 'options': options})

    # Inserimento nella seconda metà, distanziato.
    seq = list(items)
    targets = [round(n * 0.55 + i * (n * 0.45 - 1) / (N_CONTROLS - 1)) for i in range(N_CONTROLS)]
    for shift, (target, ctrl) in enumerate(zip(targets, controls)):
        seq.insert(target + shift, ctrl)

    for position, it in enumerate(seq, start=1):
        it['position'] = position
    for it in seq:
        if 'source' in it:
            it['controlFor'] = it.pop('source')['position']

    gaps = [it['position'] - it['controlFor'] for it in seq if 'controlFor' in it]
    return seq, gaps


def build_bank(key, k, seed, pool):
    blocks, pair_count = build_blocks(k, seed)
    position_count = balance_positions(blocks, seed)

    used = Counter()
    items = []
    for position, block in enumerate(blocks, start=1):
        options = []
        for slot, trait in enumerate(block, start=1):
            if used[trait] >= len(pool[trait]):
                sys.exit(f'Affermazioni insufficienti per "{trait}" in {key}: ne servono {used[trait]+1}')
            options.append({'position': slot, 'trait': trait, 'statement': pool[trait][used[trait]]})
            used[trait] += 1
        items.append({'position': position, 'options': options})

    items, control_gaps = add_controls(items, seed)

    appearances = Counter(t for b in blocks for t in b)
    control_traits = {o['trait'] for it in items if 'controlFor' in it for o in it['options']}
    same_area = sum(
        1 for b in blocks if len({TRAIT_AREA[t] for t in b}) < 4
    )
    pos_spread = set()
    for t in TRAITS:
        pos_spread.update(position_count[t].values())

    stats = {
        'blocks': len(items),
        'scored': len(blocks),
        'controls': sum(1 for it in items if 'controlFor' in it),
        'control_traits': len(control_traits),
        'control_gap_min': min(control_gaps),
        'appearances': sorted(set(appearances.values())),
        'blocks_with_repeated_area': same_area,
        'position_counts': sorted(pos_spread),
        'pairs_used': len(pair_count),
        'pairs_repeated': sum(1 for c in pair_count.values() if c > 1),
    }
    return items, stats


BANKS = [
    ('mpf_essenziale', 6, 4241, 'generali.json'),
    ('mpf_completa', 8, 8112, 'generali.json'),
    ('mpf_leadership', 6, 6301, 'leadership.json'),
    ('mpf_gestione', 6, 6607, 'gestione.json'),
]

out = [
    '/* eslint-disable */',
    '// ---------------------------------------------------------------------------',
    '// FILE GENERATO da scripts/mpf/gen_blocchi.py — non modificare a mano.',
    '// Le affermazioni sono in scripts/mpf/affermazioni/*.json.',
    '// ---------------------------------------------------------------------------',
    '',
    'export type MpfOptionSeed = { position: number; trait: string; statement: string };',
    'export type MpfBlockSeed = {',
    '  position: number;',
    '  /** Posizione del blocco di cui questo ripropone i tratti: solo controllo di coerenza, escluso dai punteggi. */',
    '  controlFor?: number;',
    '  options: MpfOptionSeed[];',
    '};',
    '',
]

summary = {}
bank_names = []
for key, k, seed, pool_file in BANKS:
    items, stats = build_bank(key, k, seed, load_statements(pool_file))
    summary[key] = stats
    bank_names.append(key)
    out.append(
        f"/** {stats['blocks']} blocchi ({stats['scored']} a punteggio + {stats['controls']} di controllo)"
        f" · {len(TRAITS)} tratti · {stats['appearances'][0]} comparse per tratto */"
    )
    out.append(f'const {key.upper()}: MpfBlockSeed[] = [')
    for it in items:
        out.append('  {')
        out.append(f"    position: {it['position']},")
        if 'controlFor' in it:
            out.append(f"    controlFor: {it['controlFor']},")
        out.append('    options: [')
        for o in it['options']:
            out.append('      {')
            out.append(f"        position: {o['position']},")
            out.append(f"        trait: {json.dumps(o['trait'])},")
            out.append(f"        statement: {json.dumps(o['statement'], ensure_ascii=False)},")
            out.append('      },')
        out.append('    ],')
        out.append('  },')
    out.append('];')
    out.append('')

out.append('export type MpfBankKey = ' + ' | '.join(f"'{b}'" for b in bank_names) + ';')
out.append('')
out.append('export const MPF_BLOCK_BANKS: Record<MpfBankKey, MpfBlockSeed[]> = {')
for b in bank_names:
    out.append(f'  {b}: {b.upper()},')
out.append('};')
out.append('')

with open(os.path.join(ROOT, 'src', 'content', 'mpf', 'blocks.ts'), 'w', encoding='utf-8') as fh:
    fh.write('\n'.join(out))

for key, s in summary.items():
    print(
        f"{key:<16} {s['blocks']:>3} blocchi ({s['scored']} + {s['controls']} controllo) | "
        f"comparse/tratto {s['appearances']} | "
        f"aree ripetute nel blocco {s['blocks_with_repeated_area']} | "
        f"posizioni per tratto {s['position_counts']} | "
        f"coppie {s['pairs_used']} (ripetute {s['pairs_repeated']}) | "
        f"controlli su {s['control_traits']} tratti, distanza min {s['control_gap_min']}"
    )
