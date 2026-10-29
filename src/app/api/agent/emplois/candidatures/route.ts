import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isJobsAgent } from '@/lib/jobs';

// Candidatures dont la tranche d'heures est arrivée. L'agent reçoit l'offre et
// le profil nécessaires à la rédaction, jamais l'adresse e-mail : l'envoi se
// fait côté site, à l'adresse du profil. Seules les offres publiées sont servies.
export async function GET(request: NextRequest) {
  if (!isJobsAgent(request)) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  const due = await prisma.jobApplication.findMany({
    where: { status: 'QUEUED', processAfter: { lte: new Date() }, job: { status: 'APPROVED' } },
    include: { job: true },
    orderBy: { processAfter: 'asc' },
    take: 20
  });
  const profiles = await prisma.jobProfile.findMany({
    where: { clerkUserId: { in: due.map((a) => a.clerkUserId) } }
  });
  const byUser = new Map(profiles.map((p) => [p.clerkUserId, p]));

  return NextResponse.json({
    applications: due.flatMap((a) => {
      const p = byUser.get(a.clerkUserId);
      if (!p) return [];
      return [
        {
          id: a.id,
          offer: {
            title: a.job.title,
            employer: a.job.employer,
            location: a.job.location,
            contractType: a.job.contractType,
            description: a.job.description,
            requirements: a.job.requirements,
            wantsCv: a.job.wantsCv,
            wantsLetter: a.job.wantsLetter
          },
          profile: {
            fullName: p.fullName,
            phone: p.phone,
            city: p.city,
            headline: p.headline,
            summary: p.summary,
            experience: p.experience,
            education: p.education,
            skills: p.skills,
            languages: p.languages
          }
        }
      ];
    })
  });
}
