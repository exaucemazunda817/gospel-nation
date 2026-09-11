import { prisma } from "@/lib/prisma";
import AppointmentActions from "@/components/admin/AppointmentActions";

export default async function AdminAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    orderBy: [{ status: "asc" }, { preferredDate: "asc" }],
  });

  if (appointments.length === 0) {
    return <p className="text-gn-cream/60">Aucune demande de rendez-vous pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      {appointments.map((a) => (
        <div
          key={a.id}
          className="rounded-2xl border border-gn-cream/15 bg-gn-black-soft p-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-semibold text-gn-cream">{a.requesterName}</p>
            <p className="text-xs text-gn-cream/50">
              Souhaité le {a.preferredDate.toLocaleDateString("fr-FR")}
            </p>
          </div>
          <p className="mt-1 text-sm text-gn-cream/60">
            {a.requesterPhone}
            {a.requesterEmail ? ` · ${a.requesterEmail}` : ""}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-gn-cream/80">{a.reason}</p>
          <p className="mt-1 text-xs text-gn-cream/40">
            Soumis le {a.createdAt.toLocaleString("fr-FR")}
          </p>
          <div className="mt-4">
            <AppointmentActions id={a.id} status={a.status} pastorNote={a.pastorNote} />
          </div>
        </div>
      ))}
    </div>
  );
}
