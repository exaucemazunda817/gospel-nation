import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminLogoutButton from "@/components/AdminLogoutButton";

// Sans ça, Next prégénère l'espace admin au build : les listes restent figées
// (nouveaux membres et témoignages invisibles) et les données personnelles des
// membres se retrouvent écrites dans les fichiers HTML de build.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [pendingTemoignages, pendingRendezVous, pendingOffres, totalMembres, unreadMessages] = await Promise.all([
    prisma.testimony.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "PENDING" } }),
    prisma.memberOffer.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gn-gold">
            Gospel Nation — Admin
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-gn-cream">
            Espace administrateur
          </h1>
        </div>
        <AdminLogoutButton />
      </div>

      <nav className="mt-6 flex flex-wrap gap-2 border-b border-gn-cream/15 pb-px text-sm font-medium">
        <SectionTab
          href="/admin"
          label={`Témoignages${pendingTemoignages ? ` (${pendingTemoignages})` : ""}`}
        />
        <SectionTab
          href="/admin/rendez-vous"
          label={`Rendez-vous${pendingRendezVous ? ` (${pendingRendezVous})` : ""}`}
        />
        <SectionTab
          href="/admin/offres"
          label={`Offres${pendingOffres ? ` (${pendingOffres})` : ""}`}
        />
        <SectionTab
          href="/admin/membres"
          label={`Membres${totalMembres ? ` (${totalMembres})` : ""}`}
        />
        <SectionTab
          href="/admin/contact"
          label={`Messages${unreadMessages ? ` (${unreadMessages})` : ""}`}
        />
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}

function SectionTab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-t-lg px-4 py-2.5 text-gn-cream/70 transition-colors hover:bg-gn-cream/5 hover:text-gn-gold"
    >
      {label}
    </Link>
  );
}
