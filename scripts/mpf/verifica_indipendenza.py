# -*- coding: utf-8 -*-
"""Verifica automatica dell'indipendenza della Mappa dei Punti di Forza.

Controlla che la tassonomia proprietaria non collida con denominazioni di
strumenti di terzi né con il modello legacy presente nel portale. NON è una
consulenza legale: è un controllo meccanico che rende ripetibile una parte
delle verifiche, da affiancare a una ricerca di anteriorità fatta da un legale.

Controlli eseguiti:
  1. nessun nome di tratto coincide con i 34 talenti dello strumento Gallup
     (in inglese) né con le rese italiane usate dal modello legacy;
  2. nessun nome di area coincide con i 4 domini di quel modello;
  3. i marchi registrati non compaiono nei contenuti del modello;
  4. ogni tratto ha una denominazione composta (sintagma descrittivo), non una
     parola singola evocativa: è la differenza che conta sul piano dei marchi;
  5. l'architettura è diversa per numero di aree e di tratti.
"""
import json
import os
import re
import sys
import unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL = os.path.join(ROOT, 'src', 'content', 'mpf', 'model.ts')
LEGACY = os.path.join(ROOT, 'src', 'content', 'themes.ts')

# I 34 talenti dello strumento Gallup, in inglese.
GALLUP_EN = [
    'achiever', 'arranger', 'belief', 'consistency', 'deliberative', 'discipline',
    'focus', 'responsibility', 'restorative', 'activator', 'command', 'communication',
    'competition', 'maximizer', 'self-assurance', 'significance', 'woo', 'adaptability',
    'connectedness', 'developer', 'empathy', 'harmony', 'includer', 'individualization',
    'positivity', 'relator', 'analytical', 'context', 'futuristic', 'ideation', 'input',
    'intellection', 'learner', 'strategic',
]
GALLUP_DOMAINS_EN = ['executing', 'influencing', 'relationship building', 'strategic thinking']

STATEMENTS = os.path.join(ROOT, 'scripts', 'mpf', 'affermazioni')
BLOCKS = os.path.join(ROOT, 'src', 'content', 'mpf', 'blocks.ts')

# Traduzioni italiane dirette delle denominazioni note. Un portale in italiano
# non incontra il termine inglese ma la sua resa più ovvia: è lì che la
# somiglianza si ripresenta, ed è lì che va controllata.
TRADUZIONI_NOTE = [
    'Realizzatore', 'Organizzazione', 'Responsabilità', 'Coordinatore', 'Valori', 'Equità',
    'Prudenza', 'Focalizzazione', 'Risolutore', 'Comunicazione', 'Attivatore', 'Fiducia in Sé',
    'Assertività', 'Competizione', 'Massimizzatore', 'Riconoscimento', 'Socievolezza', 'Empatia',
    'Armonia', 'Sviluppatore', 'Adattabilità', 'Connessione', 'Inclusione', 'Individualizzazione',
    'Positività', 'Relazione', 'Analitico', 'Ideazione', 'Apprendimento', 'Contesto',
    'Visione Futura', 'Raccolta', 'Riflessione', 'Strategia', 'Carisma Sociale',
]

DOMINI_TRADOTTI = ['Esecuzione', 'Influenza', 'Relazioni', 'Pensiero Strategico',
                   'Costruzione di Relazioni']

TRADEMARKS = ['gallup', 'cliftonstrengths', 'clifton strengths', 'strengthsfinder', 'strengths finder']


def norm(text):
    text = unicodedata.normalize('NFD', text.lower())
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', ' ', text).strip()


def extract(path, key):
    """Estrae i valori di una chiave da un file TypeScript di contenuto."""
    with open(path, encoding='utf-8') as fh:
        source = fh.read()
    return re.findall(r"%s:\s*'([^']+)'|%s:\s*\"([^\"]+)\"" % (key, key), source)


def values(path, key):
    return [a or b for a, b in extract(path, key)]


def main():
    with open(MODEL, encoding='utf-8') as fh:
        model_source = fh.read()

    # I nomi del modello nuovo: aree e tratti stanno nello stesso file, si
    # distinguono perché le aree hanno anche `short`.
    names = values(MODEL, 'name')
    shorts = values(MODEL, 'short')
    area_names = names[:len(shorts)]
    trait_names = names[len(shorts):]

    legacy_names = values(LEGACY, 'name')

    failures = []

    def check(label, ok, detail=''):
        print(('  ✓ ' if ok else '  ✗ ') + label + (('  → ' + detail) if detail and not ok else ''))
        if not ok:
            failures.append(label)

    print('Verifica di indipendenza della tassonomia\n')
    print(f'Modello corrente: {len(area_names)} aree, {len(trait_names)} tratti')
    print(f'Modello precedente: 4 macro-aree, {len(legacy_names)} temi\n')

    print('1. Collisioni con le denominazioni dei talenti di terzi')
    forbidden = {norm(x) for x in GALLUP_EN}
    collisions = [n for n in trait_names if norm(n) in forbidden]
    check('nessun nome di tratto coincide con una denominazione nota',
          not collisions, ', '.join(collisions))

    # Il modello precedente resta attivo nel portale, quindi è esposto quanto
    # quello nuovo: va controllato con lo stesso metro, non dato per buono
    # perché più vecchio.
    legacy_collisions = [n for n in legacy_names if norm(n) in forbidden]
    check('nessun nome del modello precedente coincide con una denominazione nota',
          not legacy_collisions, ', '.join(legacy_collisions))

    # Le traduzioni italiane più dirette delle denominazioni note: è la forma in
    # cui il rischio si ripresenta in un portale in italiano.
    traduzioni = {norm(x) for x in TRADUZIONI_NOTE}
    tradotti = [n for n in trait_names + legacy_names if norm(n) in traduzioni]
    check('nessun nome è una traduzione diretta di una denominazione nota',
          not tradotti, ', '.join(tradotti))

    # I due modelli convivono nello stesso portale: nomi uguali renderebbero
    # illeggibile un confronto fra i due report della stessa persona.
    overlap = {norm(x) for x in trait_names} & {norm(x) for x in legacy_names}
    check('i due modelli non condividono denominazioni', not overlap, ', '.join(sorted(overlap)))

    print('2. Collisioni con i nomi dei domini')
    forbidden_areas = {norm(x) for x in GALLUP_DOMAINS_EN} | {
        norm(x) for x in DOMINI_TRADOTTI}
    legacy_areas = values(LEGACY, 'label')
    area_collisions = [n for n in area_names + legacy_areas if norm(n) in forbidden_areas]
    check('nessun nome di area coincide con un dominio noto',
          not area_collisions, ', '.join(area_collisions))

    print('3. Marchi registrati nei contenuti')
    # Il controllo copre tutto ciò che raggiunge la persona: la tassonomia, le
    # affermazioni degli item e i blocchi generati.
    corpus = {'modello': model_source, 'modello precedente': open(LEGACY, encoding='utf-8').read()}
    for extra in ('src/content/assessments.ts', 'src/content/questions.ts'):
        path = os.path.join(ROOT, extra)
        if os.path.exists(path):
            with open(path, encoding='utf-8') as fh:
                corpus[extra.split('/')[-1]] = fh.read()
    for name in sorted(os.listdir(STATEMENTS)):
        if name.endswith('.json'):
            with open(os.path.join(STATEMENTS, name), encoding='utf-8') as fh:
                corpus[f'affermazioni/{name}'] = fh.read()
    if os.path.exists(BLOCKS):
        with open(BLOCKS, encoding='utf-8') as fh:
            corpus['blocchi'] = fh.read()

    for label, text in corpus.items():
        lowered = text.lower()
        found = [t for t in TRADEMARKS if t in lowered]
        check(f'nessun marchio in {label}', not found, ', '.join(found))

    print('4. Denominazioni descrittive e non evocative')
    single = [n for n in trait_names if len(n.split()) < 2]
    check('ogni tratto ha una denominazione composta', not single, ', '.join(single))

    print('5. Architettura distinta')
    check('numero di aree diverso da 4', len(area_names) != 4, str(len(area_names)))
    check('numero di tratti diverso da 34', len(trait_names) != 34, str(len(trait_names)))

    if failures:
        print('\n✗ Verifica fallita:', ' | '.join(failures))
        sys.exit(1)
    print('\n✓ Nessuna collisione rilevata.')
    print('  Resta necessaria una ricerca di anteriorità su marchi e denominazioni')
    print('  condotta da un legale prima dell\'uso commerciale.')


if __name__ == '__main__':
    main()
