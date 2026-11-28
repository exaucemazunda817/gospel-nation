-- Rappel e-mail de la veille pour les visites (ajout seul).
-- À exécuter sur Neon APRÈS 2026-11-28-visites.sql et AVANT de fusionner le code.
ALTER TABLE "visits" ADD COLUMN "reminderEmailSentAt" TIMESTAMP(3);
