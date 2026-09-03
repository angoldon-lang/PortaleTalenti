-- AlterTable
ALTER TABLE "users" ADD COLUMN     "orgRoleId" TEXT;

-- CreateTable
CREATE TABLE "org_roles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_role_assessments" (
    "orgRoleId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "org_role_assessments_pkey" PRIMARY KEY ("orgRoleId","assessmentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "org_roles_slug_key" ON "org_roles"("slug");

-- CreateIndex
CREATE INDEX "org_roles_sortOrder_idx" ON "org_roles"("sortOrder");

-- CreateIndex
CREATE INDEX "org_role_assessments_assessmentId_idx" ON "org_role_assessments"("assessmentId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_orgRoleId_fkey" FOREIGN KEY ("orgRoleId") REFERENCES "org_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_role_assessments" ADD CONSTRAINT "org_role_assessments_orgRoleId_fkey" FOREIGN KEY ("orgRoleId") REFERENCES "org_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_role_assessments" ADD CONSTRAINT "org_role_assessments_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

