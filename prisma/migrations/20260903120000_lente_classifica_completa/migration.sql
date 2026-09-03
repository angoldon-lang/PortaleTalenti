-- Nuovo valore della lente di report, in una migrazione a sé.
-- PostgreSQL non consente di usare un valore di enum appena aggiunto dentro la
-- stessa transazione che lo crea: separarlo evita che la migrazione successiva,
-- che lo referenzia, fallisca.

-- AlterEnum
ALTER TYPE "ReportLens" ADD VALUE 'FULL_RANKING';
