-- « Je viens pour la première fois » : table des visites (ajout seul).
-- À exécuter sur Neon AVANT de fusionner le code (les pages lisent la base au build).
CREATE TYPE "VisitStatus" AS ENUM ('EXPECTED', 'ARRIVED', 'NO_SHOW', 'FOLLOWED_UP', 'MEMBER');

CREATE TABLE "visits" (
  "id" TEXT PRIMARY KEY,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT,
  "email" TEXT,
  "visitDate" TIMESTAMP(3) NOT NULL,
  "companions" INTEGER NOT NULL DEFAULT 0,
  "companionNames" TEXT,
  "childrenCount" INTEGER NOT NULL DEFAULT 0,
  "source" TEXT,
  "prayerRequest" TEXT,
  "status" "VisitStatus" NOT NULL DEFAULT 'EXPECTED',
  "arrivedAt" TIMESTAMP(3),
  "followedUpAt" TIMESTAMP(3),
  "note" TEXT,
  "teamEmailSentAt" TIMESTAMP(3),
  "visitorEmailSentAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "visits_visitDate_idx" ON "visits"("visitDate");
CREATE INDEX "visits_status_idx" ON "visits"("status");
