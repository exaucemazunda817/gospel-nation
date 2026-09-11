import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "DECLINED", "DONE"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { status, pastorNote } = await request.json();

  if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    return NextResponse.json({ error: "Rendez-vous introuvable." }, { status: 404 });
  }

  await prisma.appointment.update({
    where: { id },
    data: {
      status,
      pastorNote: typeof pastorNote === "string" && pastorNote.trim() ? pastorNote : null,
    },
  });
  return NextResponse.json({ ok: true });
}
