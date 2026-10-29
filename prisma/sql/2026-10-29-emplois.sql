-- Emplois et candidatures (ajout seul). À exécuter sur Neon AVANT de fusionner.
CREATE TYPE "JobSource" AS ENUM ('NOTION', 'DRIVE', 'ADMIN');
CREATE TYPE "JobApplicationStatus" AS ENUM ('QUEUED', 'SENT');

CREATE TABLE "job_offers" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "employer" TEXT,
  "location" TEXT,
  "contractType" TEXT,
  "description" TEXT NOT NULL,
  "requirements" TEXT,
  "wantsCv" BOOLEAN NOT NULL DEFAULT true,
  "wantsLetter" BOOLEAN NOT NULL DEFAULT true,
  "contactPhone" TEXT,
  "contactEmail" TEXT,
  "externalUrl" TEXT,
  "deadline" TIMESTAMP(3),
  "source" "JobSource" NOT NULL,
  "sourceRef" TEXT,
  "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "job_offers_sourceRef_key" ON "job_offers"("sourceRef");
CREATE INDEX "job_offers_status_idx" ON "job_offers"("status");

CREATE TABLE "job_profiles" (
  "id" TEXT PRIMARY KEY,
  "clerkUserId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT,
  "city" TEXT,
  "headline" TEXT,
  "summary" TEXT,
  "experience" TEXT,
  "education" TEXT,
  "skills" TEXT,
  "languages" TEXT,
  "consentAt" TIMESTAMP(3) NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "job_profiles_clerkUserId_key" ON "job_profiles"("clerkUserId");

CREATE TABLE "job_applications" (
  "id" TEXT PRIMARY KEY,
  "jobId" TEXT NOT NULL REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "clerkUserId" TEXT NOT NULL,
  "status" "JobApplicationStatus" NOT NULL DEFAULT 'QUEUED',
  "processAfter" TIMESTAMP(3) NOT NULL,
  "sentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX "job_applications_jobId_clerkUserId_key" ON "job_applications"("jobId", "clerkUserId");
CREATE INDEX "job_applications_status_processAfter_idx" ON "job_applications"("status", "processAfter");
