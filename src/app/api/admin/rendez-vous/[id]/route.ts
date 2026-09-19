import { NextRequest, NextResponse } from "next/server";
import type { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendAppointmentConfirmation } from "@/lib/email";

const VALID_STATUSES: readonly AppointmentStatus[] = ["PENDING", "CONFIRMED", "DECLINED", "DONE"];

function isAppointmentStatus(value: unknown): value is AppointmentStatus {
  return typeof value === "string" && (VALID_STATUSES as readonly string[]).includes(value);
}

// Résultat de l'e-mail, renvoyé à l'écran admin pour qu'il sache ce qui s'est passé.
type EmailOutcome = "sent" | "already-sent" | "no-address" | "not-configured" | "failed" | "not-applicable";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, pastorNote } = await request.json();

  if (!isAppointmentStatus(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    return NextResponse.json({ error: "Rendez-vous introuvable." }, { status: 404 });
  }

  // Le statut est enregistré d'abord : un e-mail qui échoue ne doit jamais
  // empêcher de confirmer le rendez-vous.
  await prisma.appointment.update({
    where: { id },
    data: {
      status,
      pastorNote: typeof pastorNote === "string" && pastorNote.trim() ? pastorNote : null,
    },
  });

  let email: EmailOutcome = "not-applicable";
  if (status === "CONFIRMED") {
    if (!appointment.requesterEmail) {
      email = "no-address";
    } else {
      // « Réservation » atomique : si l'admin double-clique ou recoche
      // « Confirmer », une seule requête obtient le droit d'envoyer.
      const claim = await prisma.appointment.updateMany({
        where: { id, confirmationEmailSentAt: null },
        data: { confirmationEmailSentAt: new Date() },
      });
      if (claim.count === 0) {
        email = "already-sent";
      } else {
        // La note pastorale est privée (« visible admin uniquement ») : elle
        // n'est jamais transmise dans l'e-mail.
        const result = await sendAppointmentConfirmation({
          requesterName: appointment.requesterName,
          requesterEmail: appointment.requesterEmail,
          preferredDate: appointment.preferredDate,
        });
        if (result.ok) {
          email = "sent";
        } else {
          // Rien n'est parti : on libère la réservation pour pouvoir réessayer.
          await prisma.appointment.update({ where: { id }, data: { confirmationEmailSentAt: null } });
          email = result.reason === "not-configured" ? "not-configured" : "failed";
        }
      }
    }
  }

  return NextResponse.json({ ok: true, email });
}
