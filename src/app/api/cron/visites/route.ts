import { createHash, timingSafeEqual as cryptoTimingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  isEmailConfigured,
  sendTeamDayBefore,
  sendVisitReminder,
  sendWeeklyVisitSummary
} from '@/lib/email';
import { todayInKinshasa, totalPeople } from '@/lib/visits';
import { anonymizeOldVisits } from '@/lib/visits-db';

// Tâche planifiée par Vercel (vercel.json, chaque jour à 14h UTC = 15h à Kinshasa) :
//  1. la veille d'un culte : rappel e-mail à chaque visiteur qui a donné son adresse
//     (une seule fois par visite) + récapitulatif à l'équipe (WELCOME_NOTIFY_EMAIL) ;
//  2. le lundi : bilan de la semaine écoulée à la même adresse ;
//  3. effacement des visites trop anciennes.
// Vercel appelle la route avec « Authorization: Bearer <CRON_SECRET> » : sans ce
// secret (au moins 16 caractères) la route refuse tout.
export const dynamic = 'force-dynamic';

function sameSecret(a: string, b: string): boolean {
  const da = createHash('sha256').update(a).digest();
  const db = createHash('sha256').update(b).digest();
  return cryptoTimingSafeEqual(da, db);
}

const DAY = 86400_000;
const CAME = ['ARRIVED', 'FOLLOWED_UP', 'MEMBER'] as const;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) {
    return NextResponse.json({ error: 'CRON_SECRET non configuré.' }, { status: 503 });
  }
  if (!sameSecret(request.headers.get('authorization') ?? '', `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }

  // `?now=2026-11-30T14:00:00Z` rejoue la tâche à une autre date (réservé à qui connaît le secret).
  const nowParam = request.nextUrl.searchParams.get('now');
  const parsedNow = nowParam ? new Date(nowParam) : null;
  const now = parsedNow && !Number.isNaN(parsedNow.getTime()) ? parsedNow : new Date();

  const today = todayInKinshasa(now);
  const tomorrow = new Date(today.getTime() + DAY);
  const report = {
    date: today.toISOString().slice(0, 10),
    emailConfigured: isEmailConfigured(),
    reminders: { sent: 0, failed: 0, skippedNoEmail: 0, alreadySent: 0 },
    teamDayBefore: 'aucune visite demain' as string,
    weekly: 'pas un lundi' as string,
    anonymized: 0
  };

  // 1. La veille
  const tomorrowVisits = await prisma.visit.findMany({
    where: { visitDate: tomorrow, status: 'EXPECTED' },
    orderBy: { createdAt: 'asc' }
  });
  if (tomorrowVisits.length > 0) {
    for (const visit of tomorrowVisits) {
      if (!visit.email) {
        report.reminders.skippedNoEmail += 1;
        continue;
      }
      if (visit.reminderEmailSentAt) {
        report.reminders.alreadySent += 1;
        continue;
      }
      if (!report.emailConfigured) continue;
      // « Réservation » atomique : un seul appel obtient le droit d'envoyer.
      const claim = await prisma.visit.updateMany({
        where: { id: visit.id, reminderEmailSentAt: null },
        data: { reminderEmailSentAt: new Date() }
      });
      if (claim.count === 0) {
        report.reminders.alreadySent += 1;
        continue;
      }
      const result = await sendVisitReminder({ firstName: visit.firstName, email: visit.email, visitDate: visit.visitDate });
      if (result.ok) {
        report.reminders.sent += 1;
      } else {
        // Rien n'est parti : on libère la réservation, la tâche de demain n'y reviendra pas
        // (la visite aura eu lieu) mais un rejeu manuel le pourra.
        await prisma.visit.update({ where: { id: visit.id }, data: { reminderEmailSentAt: null } });
        report.reminders.failed += 1;
      }
    }
    const team = await sendTeamDayBefore(tomorrow, tomorrowVisits);
    report.teamDayBefore = team.ok ? 'envoyé' : `non envoyé (${team.reason})`;
  }

  // 2. Le lundi : bilan de la semaine écoulée (les 7 jours précédents)
  if (today.getUTCDay() === 1) {
    const from = new Date(today.getTime() - 7 * DAY);
    const to = new Date(today.getTime() - DAY);
    const [week, upcomingVisits] = await Promise.all([
      prisma.visit.findMany({ where: { visitDate: { gte: from, lte: to } } }),
      prisma.visit.count({ where: { visitDate: { gte: today, lt: new Date(today.getTime() + 7 * DAY) } } })
    ]);
    // Une semaine sans aucune visite, passée ou à venir : pas de bilan vide.
    if (week.length === 0 && upcomingVisits === 0) {
      report.weekly = 'rien à signaler, aucun e-mail';
    } else {
    const summary = await sendWeeklyVisitSummary({
      from,
      to,
      visits: week.length,
      people: week.reduce((n, v) => n + totalPeople(v), 0),
      came: week.filter((v) => (CAME as readonly string[]).includes(v.status)).length,
      noShow: week.filter((v) => v.status === 'NO_SHOW').length,
      members: week.filter((v) => v.status === 'MEMBER').length,
      toFollowUp: week.filter((v) => v.status === 'ARRIVED').map((v) => ({ firstName: v.firstName, lastName: v.lastName })),
      upcomingVisits
    });
    report.weekly = summary.ok ? 'envoyé' : `non envoyé (${summary.reason})`;
    }
  }

  // 3. Effacement des visites de plus de 180 jours
  report.anonymized = await anonymizeOldVisits(now);

  return NextResponse.json(report);
}
