-- CreateEnum
CREATE TYPE "ReportLens" AS ENUM ('STANDARD', 'FULL_34', 'LEADERS', 'MANAGERS');

-- CreateEnum
CREATE TYPE "AdminAction" AS ENUM ('REPORT_DOWNLOAD', 'RESULTS_EXPORT', 'USER_CREATED', 'ROLE_CHANGED');

-- DropIndex
DROP INDEX "questions_isActive_position_idx";

-- DropIndex
DROP INDEX "questions_position_key";

-- DropIndex
DROP INDEX "test_sessions_userId_status_idx";

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "assessmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "test_results" ADD COLUMN     "assessmentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "test_sessions" ADD COLUMN     "assessmentId" TEXT NOT NULL;

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
