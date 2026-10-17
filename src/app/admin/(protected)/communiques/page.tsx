import Image from "next/image";
import { prisma } from "@/lib/prisma";
import AnnouncementForm from "@/components/admin/AnnouncementForm";
import AnnouncementActions from "@/components/admin/AnnouncementActions";
import { isAdmin } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

export default async function AdminAnnouncementsPage() {
  if (!(await isAdmin())) redirect('/admin/login');
  const now = new Date();
  const announcements = await prisma.announcement.findMany({ orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }] });

  return (
    <div className="space-y-8">
      <AnnouncementForm />
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-gn-cream">Communiqués ({announcements.length})</h2>
        {announcements.length === 0 && (
          <p className="text-gn-cream/60">Aucun communiqué. La valve de la page d&apos;accueil n&apos;affiche rien tant qu&apos;il n&apos;y en a pas.</p>
        )}
        {announcements.map((a) => {
          const expired = a.expiresAt && a.expiresAt < now;
          return (
            <div key={a.id} className="flex flex-col gap-4 rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5 sm:flex-row">
              {a.imageUrl && (
                <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-lg bg-gn-black">
                  <Image src={`/communiques/image/${a.id}`} alt={`Affiche : ${a.title}`} fill sizes="112px" className="object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-gn-cream">{a.title}</p>
                  {a.kind === "URGENT" && <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">Urgent</span>}
                  {a.pinned && <span className="rounded-full bg-gn-gold px-2.5 py-0.5 text-xs font-bold text-gn-black">Épinglé</span>}
                  {expired && <span className="rounded-full border border-gn-cream/30 px-2.5 py-0.5 text-xs text-gn-cream/70">Expiré, non affiché</span>}
                </div>
                <p className="mt-1 text-xs text-gn-cream/50">
                  Publié le {a.publishedAt.toLocaleDateString("fr-FR", { timeZone: "Africa/Kinshasa" })}
                  {a.expiresAt ? ` · affiché jusqu'au ${a.expiresAt.toLocaleDateString("fr-FR", { timeZone: "Africa/Kinshasa" })}` : " · sans date de fin"}
                </p>
                {a.body && <p className="mt-2 whitespace-pre-wrap text-sm text-gn-cream/80">{a.body}</p>}
                <div className="mt-4">
                  <AnnouncementActions id={a.id} pinned={a.pinned} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
