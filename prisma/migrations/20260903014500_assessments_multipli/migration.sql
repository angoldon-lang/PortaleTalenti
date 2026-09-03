-- ---------------------------------------------------------------------------
-- Da un solo questionario a quattro.
--
-- Migrazione che PRESERVA i dati: le tabelle questions, test_sessions e
-- test_results acquisiscono una colonna assessmentId obbligatoria, quindi non
-- si può aggiungerla direttamente NOT NULL su un database già popolato.
-- L'ordine è perciò: creare gli assessment, inserire quello a cui appartengono
-- i dati esistenti, aggiungere le colonne nullable, riempirle, e solo alla fine
-- imporre il vincolo.
-- ---------------------------------------------------------------------------

-- CreateEnum
CREATE TYPE "ReportLens" AS ENUM ('STANDARD', 'FULL_34', 'LEADERS', 'MANAGERS');

-- CreateEnum
CREATE TYPE "AdminAction" AS ENUM ('REPORT_DOWNLOAD', 'RESULTS_EXPORT', 'USER_CREATED', 'ROLE_CHANGED');

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lens" "ReportLens" NOT NULL DEFAULT 'STANDARD',
    "topCount" INTEGER NOT NULL DEFAULT 5,
    "timerSeconds" INTEGER NOT NULL DEFAULT 20,
    "estimatedMinutes" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_audit_logs" (
    "id" TEXT NOT NULL,
    "action" "AdminAction" NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "subjectId" TEXT,
    "subjectEmail" TEXT,
    "testResultId" TEXT,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assessments_slug_key" ON "assessments"("slug");

-- CreateIndex
CREATE INDEX "assessments_isActive_sortOrder_idx" ON "assessments"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "admin_audit_logs_createdAt_idx" ON "admin_audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "admin_audit_logs_subjectId_idx" ON "admin_audit_logs"("subjectId");

-- ---------------------------------------------------------------------------
-- Assessment di destinazione dei dati preesistenti.
--
-- Prima di questa migrazione esisteva un solo questionario, quello a 12 temi:
-- corrisponde a "core12". La riga viene inserita solo se ci sono davvero dati
-- da ricollegare, e con un id fisso così il backfill può riferirsi ad essa.
-- Il seed successivo fa upsert su slug, quindi aggiorna questa riga con i
-- testi definitivi invece di crearne una seconda.
-- ---------------------------------------------------------------------------
INSERT INTO "assessments" ("id", "slug", "name", "subtitle", "description", "lens", "topCount", "timerSeconds", "estimatedMinutes", "sortOrder", "isActive")
SELECT
    'assessment_core12_legacy',
    'core12',
    'Talenti Essenziale',
    '12 temi · 66 domande · ~22 minuti',
    'Questionario storico del portale, a cui sono ricollegate le compilazioni precedenti all''introduzione dei questionari multipli.',
    'STANDARD', 5, 20, 22, 1, true
WHERE EXISTS (SELECT 1 FROM "questions")
   OR EXISTS (SELECT 1 FROM "test_sessions")
   OR EXISTS (SELECT 1 FROM "test_results");

-- AlterTable: prima nullable, per poter riempire le righe esistenti
ALTER TABLE "questions" ADD COLUMN "assessmentId" TEXT;
ALTER TABLE "test_sessions" ADD COLUMN "assessmentId" TEXT;
ALTER TABLE "test_results" ADD COLUMN "assessmentId" TEXT;

-- Backfill
UPDATE "questions" SET "assessmentId" = 'assessment_core12_legacy' WHERE "assessmentId" IS NULL;
UPDATE "test_sessions" SET "assessmentId" = 'assessment_core12_legacy' WHERE "assessmentId" IS NULL;
UPDATE "test_results" SET "assessmentId" = 'assessment_core12_legacy' WHERE "assessmentId" IS NULL;

-- Ora il vincolo può essere imposto
ALTER TABLE "questions" ALTER COLUMN "assessmentId" SET NOT NULL;
ALTER TABLE "test_sessions" ALTER COLUMN "assessmentId" SET NOT NULL;
ALTER TABLE "test_results" ALTER COLUMN "assessmentId" SET NOT NULL;

-- DropIndex: sostituiti dagli indici per assessment
DROP INDEX "questions_isActive_position_idx";
DROP INDEX "questions_position_key";
DROP INDEX "test_sessions_userId_status_idx";

-- CreateIndex
CREATE INDEX "questions_assessmentId_isActive_position_idx" ON "questions"("assessmentId", "isActive", "position");

-- CreateIndex
CREATE UNIQUE INDEX "questions_assessmentId_position_key" ON "questions"("assessmentId", "position");

-- CreateIndex
CREATE INDEX "test_results_assessmentId_computedAt_idx" ON "test_results"("assessmentId", "computedAt");

-- CreateIndex
CREATE INDEX "test_sessions_userId_assessmentId_status_idx" ON "test_sessions"("userId", "assessmentId", "status");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_sessions" ADD CONSTRAINT "test_sessions_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_audit_logs" ADD CONSTRAINT "admin_audit_logs_testResultId_fkey" FOREIGN KEY ("testResultId") REFERENCES "test_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;
