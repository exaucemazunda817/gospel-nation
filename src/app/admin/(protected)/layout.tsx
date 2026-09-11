import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminLogoutButton from "@/components/AdminLogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [pendingTemoignages, pendingRendezVous] = await Promise.all([
    prisma.testimony.count({ where: { status: "PENDING" } }),
    prisma.appointment.count({ where: { status: "PENDING" } }),
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
