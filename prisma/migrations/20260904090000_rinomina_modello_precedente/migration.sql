-- ---------------------------------------------------------------------------
-- Rinomina del modello precedente: 34 temi e 4 macro-aree.
--
-- I nomi visualizzati e gli identificatori interni passano a sintagmi
-- descrittivi del lessico della psicologia del lavoro. Nessun dato viene perso:
-- si rinominano gli slug esistenti e si riscrivono i riferimenti che li citano,
-- così i report già prodotti continuano a mostrare gli stessi temi con i nomi
-- nuovi.
--
-- `topThemeSlugs` è un array di testo dentro test_results: va riscritto elemento
-- per elemento, altrimenti i report storici perderebbero il collegamento ai loro
-- temi dominanti.
-- ---------------------------------------------------------------------------

-- I valori dell'enum sono identificatori interni, mai mostrati: si rinominano
-- in luogo, senza toccare le righe che li usano.
ALTER TYPE "Domain" RENAME VALUE 'EXECUTING' TO 'OPERATIONAL';
ALTER TYPE "Domain" RENAME VALUE 'INFLUENCING' TO 'INTERPERSONAL';
ALTER TYPE "Domain" RENAME VALUE 'RELATIONSHIP' TO 'SUPPORTIVE';
ALTER TYPE "Domain" RENAME VALUE 'STRATEGIC' TO 'COGNITIVE';

-- Slug dei temi: prima la tabella, poi gli array che li citano.
UPDATE "talent_themes" SET "slug" = 'tensione-produttiva' WHERE "slug" = 'realizzatore';
UPDATE "talent_themes" SET "slug" = 'ordinamento-complessita' WHERE "slug" = 'organizzazione';
UPDATE "talent_themes" SET "slug" = 'vincolo-impegno' WHERE "slug" = 'responsabilita';
UPDATE "talent_themes" SET "slug" = 'riconfigurazione-risorse' WHERE "slug" = 'coordinatore';
UPDATE "talent_themes" SET "slug" = 'principi-non-negoziabili' WHERE "slug" = 'valori';
UPDATE "talent_themes" SET "slug" = 'uniformita-trattamento' WHERE "slug" = 'equita';
UPDATE "talent_themes" SET "slug" = 'cautela-preventiva' WHERE "slug" = 'prudenza';
UPDATE "talent_themes" SET "slug" = 'filtro-direzionale' WHERE "slug" = 'focalizzazione';
UPDATE "talent_themes" SET "slug" = 'riparazione-guasto' WHERE "slug" = 'risolutore';
UPDATE "talent_themes" SET "slug" = 'efficacia-espositiva' WHERE "slug" = 'comunicazione';
UPDATE "talent_themes" SET "slug" = 'passaggio-azione' WHERE "slug" = 'attivatore';
UPDATE "talent_themes" SET "slug" = 'sicurezza-giudizio' WHERE "slug" = 'fiducia-in-se';
UPDATE "talent_themes" SET "slug" = 'presa-di-posizione' WHERE "slug" = 'assertivita';
UPDATE "talent_themes" SET "slug" = 'confronto-con-il-risultato' WHERE "slug" = 'competizione';
UPDATE "talent_themes" SET "slug" = 'innalzamento-eccellenza' WHERE "slug" = 'massimizzatore';
UPDATE "talent_themes" SET "slug" = 'impronta-riconoscibile' WHERE "slug" = 'riconoscimento';
UPDATE "talent_themes" SET "slug" = 'apertura-contatto-nuovo' WHERE "slug" = 'socievolezza';
UPDATE "talent_themes" SET "slug" = 'lettura-stati-emotivi' WHERE "slug" = 'empatia';
UPDATE "talent_themes" SET "slug" = 'ricerca-terreno-comune' WHERE "slug" = 'armonia';
UPDATE "talent_themes" SET "slug" = 'riconoscimento-potenziale' WHERE "slug" = 'sviluppatore';
UPDATE "talent_themes" SET "slug" = 'aderenza-al-presente' WHERE "slug" = 'adattabilita';
UPDATE "talent_themes" SET "slug" = 'percezione-dei-legami' WHERE "slug" = 'connessione';
UPDATE "talent_themes" SET "slug" = 'allargamento-del-gruppo' WHERE "slug" = 'inclusione';
UPDATE "talent_themes" SET "slug" = 'differenziazione-persona' WHERE "slug" = 'individualizzazione';
UPDATE "talent_themes" SET "slug" = 'alleggerimento-clima' WHERE "slug" = 'positivita';
UPDATE "talent_themes" SET "slug" = 'profondita-dei-legami' WHERE "slug" = 'relazione';
UPDATE "talent_themes" SET "slug" = 'richiesta-di-prove' WHERE "slug" = 'analitico';
UPDATE "talent_themes" SET "slug" = 'accostamento-inatteso' WHERE "slug" = 'ideazione';
UPDATE "talent_themes" SET "slug" = 'piacere-di-imparare' WHERE "slug" = 'apprendimento';
UPDATE "talent_themes" SET "slug" = 'ricorso-al-precedente' WHERE "slug" = 'contesto';
UPDATE "talent_themes" SET "slug" = 'nitidezza-del-possibile' WHERE "slug" = 'visione-futura';
UPDATE "talent_themes" SET "slug" = 'accumulo-informativo' WHERE "slug" = 'raccolta';
UPDATE "talent_themes" SET "slug" = 'attivita-di-pensiero' WHERE "slug" = 'riflessione';
UPDATE "talent_themes" SET "slug" = 'selezione-del-percorso' WHERE "slug" = 'strategia';

-- Riscrittura degli array `topThemeSlugs`. Solo le righe dei questionari a
-- coppie di affermazioni: quelle a scelta forzata contengono slug di tratti,
-- che non fanno parte di questa rinomina.
UPDATE "test_results" tr
SET "topThemeSlugs" = ARRAY(
  SELECT CASE s
      WHEN 'realizzatore' THEN 'tensione-produttiva'
      WHEN 'organizzazione' THEN 'ordinamento-complessita'
      WHEN 'responsabilita' THEN 'vincolo-impegno'
      WHEN 'coordinatore' THEN 'riconfigurazione-risorse'
      WHEN 'valori' THEN 'principi-non-negoziabili'
      WHEN 'equita' THEN 'uniformita-trattamento'
      WHEN 'prudenza' THEN 'cautela-preventiva'
      WHEN 'focalizzazione' THEN 'filtro-direzionale'
      WHEN 'risolutore' THEN 'riparazione-guasto'
      WHEN 'comunicazione' THEN 'efficacia-espositiva'
      WHEN 'attivatore' THEN 'passaggio-azione'
      WHEN 'fiducia-in-se' THEN 'sicurezza-giudizio'
      WHEN 'assertivita' THEN 'presa-di-posizione'
      WHEN 'competizione' THEN 'confronto-con-il-risultato'
      WHEN 'massimizzatore' THEN 'innalzamento-eccellenza'
      WHEN 'riconoscimento' THEN 'impronta-riconoscibile'
      WHEN 'socievolezza' THEN 'apertura-contatto-nuovo'
      WHEN 'empatia' THEN 'lettura-stati-emotivi'
      WHEN 'armonia' THEN 'ricerca-terreno-comune'
      WHEN 'sviluppatore' THEN 'riconoscimento-potenziale'
      WHEN 'adattabilita' THEN 'aderenza-al-presente'
      WHEN 'connessione' THEN 'percezione-dei-legami'
      WHEN 'inclusione' THEN 'allargamento-del-gruppo'
      WHEN 'individualizzazione' THEN 'differenziazione-persona'
      WHEN 'positivita' THEN 'alleggerimento-clima'
      WHEN 'relazione' THEN 'profondita-dei-legami'
      WHEN 'analitico' THEN 'richiesta-di-prove'
      WHEN 'ideazione' THEN 'accostamento-inatteso'
      WHEN 'apprendimento' THEN 'piacere-di-imparare'
      WHEN 'contesto' THEN 'ricorso-al-precedente'
      WHEN 'visione-futura' THEN 'nitidezza-del-possibile'
      WHEN 'raccolta' THEN 'accumulo-informativo'
      WHEN 'riflessione' THEN 'attivita-di-pensiero'
      WHEN 'strategia' THEN 'selezione-del-percorso'
      ELSE s
    END
  FROM unnest(tr."topThemeSlugs") AS s
)
WHERE EXISTS (
  SELECT 1 FROM "assessments" a
  WHERE a."id" = tr."assessmentId" AND a."itemFormat" = 'PAIRED_LIKERT'
);
