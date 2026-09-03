-- ---------------------------------------------------------------------------
-- Mappa dei Punti di Forza: tassonomia propria e item a scelta forzata.
--
-- Migrazione puramente additiva. Le uniche modifiche a tabelle esistenti sono
-- l'aggiunta di colonne con valore di default e l'allentamento del vincolo NOT
-- NULL sui quattro punteggi d'area del modello legacy: i risultati già salvati
-- conservano i loro valori, e i questionari storici continuano a funzionare
-- senza che una sola riga venga riscritta.
-- ---------------------------------------------------------------------------

-- CreateEnum
CREATE TYPE "ItemFormat" AS ENUM ('PAIRED_LIKERT', 'FORCED_CHOICE_QUARTET');


-- AlterTable
ALTER TABLE "assessments" ADD COLUMN     "itemFormat" "ItemFormat" NOT NULL DEFAULT 'PAIRED_LIKERT';

-- AlterTable
ALTER TABLE "test_results" ADD COLUMN     "inconsistencyRate" DOUBLE PRECISION,
ADD COLUMN     "reliabilityBand" TEXT,
ADD COLUMN     "reliabilityIndex" INTEGER,
ALTER COLUMN "executingScore" DROP NOT NULL,
ALTER COLUMN "influencingScore" DROP NOT NULL,
ALTER COLUMN "relationshipScore" DROP NOT NULL,
ALTER COLUMN "strategicScore" DROP NOT NULL;

-- CreateTable
CREATE TABLE "strength_areas" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "short" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "claim" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "grounding" TEXT NOT NULL,

    CONSTRAINT "strength_areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strength_traits" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "strengths" TEXT[],
    "blindSpots" TEXT[],
    "actionTips" TEXT[],
    "thrivesIn" TEXT[],
    "leaderApplication" TEXT NOT NULL,
    "managerApplication" TEXT NOT NULL,

    CONSTRAINT "strength_traits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "choice_blocks" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "controlForPosition" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "choice_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "choice_options" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "traitId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,

    CONSTRAINT "choice_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "block_responses" (
    "id" TEXT NOT NULL,
    "testSessionId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "mostOptionId" TEXT,
    "leastOptionId" TEXT,
    "timedOut" BOOLEAN NOT NULL DEFAULT false,
    "latencyMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "block_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "area_scores" (
    "id" TEXT NOT NULL,
    "testResultId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "area_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trait_scores" (
    "id" TEXT NOT NULL,
    "testResultId" TEXT NOT NULL,
    "traitId" TEXT NOT NULL,
    "rawScore" DOUBLE PRECISION NOT NULL,
    "normalizedScore" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "timesMost" INTEGER NOT NULL DEFAULT 0,
    "timesLeast" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "trait_scores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "strength_areas_slug_key" ON "strength_areas"("slug");

-- CreateIndex
CREATE INDEX "strength_areas_sortOrder_idx" ON "strength_areas"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "strength_traits_slug_key" ON "strength_traits"("slug");

-- CreateIndex
CREATE INDEX "strength_traits_areaId_idx" ON "strength_traits"("areaId");

-- CreateIndex
CREATE INDEX "choice_blocks_assessmentId_isActive_position_idx" ON "choice_blocks"("assessmentId", "isActive", "position");

-- CreateIndex
CREATE UNIQUE INDEX "choice_blocks_assessmentId_position_key" ON "choice_blocks"("assessmentId", "position");

-- CreateIndex
CREATE INDEX "choice_options_traitId_idx" ON "choice_options"("traitId");

-- CreateIndex
CREATE UNIQUE INDEX "choice_options_blockId_position_key" ON "choice_options"("blockId", "position");

-- CreateIndex
CREATE INDEX "block_responses_blockId_idx" ON "block_responses"("blockId");

-- CreateIndex
CREATE UNIQUE INDEX "block_responses_testSessionId_blockId_key" ON "block_responses"("testSessionId", "blockId");

-- CreateIndex
CREATE UNIQUE INDEX "area_scores_testResultId_areaId_key" ON "area_scores"("testResultId", "areaId");

-- CreateIndex
CREATE INDEX "trait_scores_traitId_normalizedScore_idx" ON "trait_scores"("traitId", "normalizedScore");

-- CreateIndex
CREATE UNIQUE INDEX "trait_scores_testResultId_traitId_key" ON "trait_scores"("testResultId", "traitId");

-- AddForeignKey
ALTER TABLE "strength_traits" ADD CONSTRAINT "strength_traits_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "strength_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choice_blocks" ADD CONSTRAINT "choice_blocks_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choice_options" ADD CONSTRAINT "choice_options_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "choice_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "choice_options" ADD CONSTRAINT "choice_options_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "strength_traits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_responses" ADD CONSTRAINT "block_responses_testSessionId_fkey" FOREIGN KEY ("testSessionId") REFERENCES "test_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_responses" ADD CONSTRAINT "block_responses_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "choice_blocks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_responses" ADD CONSTRAINT "block_responses_mostOptionId_fkey" FOREIGN KEY ("mostOptionId") REFERENCES "choice_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "block_responses" ADD CONSTRAINT "block_responses_leastOptionId_fkey" FOREIGN KEY ("leastOptionId") REFERENCES "choice_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_scores" ADD CONSTRAINT "area_scores_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "test_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "area_scores" ADD CONSTRAINT "area_scores_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "strength_areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trait_scores" ADD CONSTRAINT "trait_scores_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "test_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trait_scores" ADD CONSTRAINT "trait_scores_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "strength_traits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

