import ExcelJS from 'exceljs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  VALIDATED: 'Validé',
  REJECTED: 'Rejeté'
};

export async function GET() {
  const members = await prisma.user.findMany({
    where: { role: 'MEMBER' },
    orderBy: { createdAt: 'desc' },
    include: { department: { select: { name: true } } }
  });

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Gospel Nation';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Membres');
  sheet.columns = [
    { header: 'Numéro de membre', key: 'memberNumber', width: 18 },
    { header: 'Prénom', key: 'firstName', width: 18 },
    { header: 'Nom', key: 'lastName', width: 18 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'Téléphone', key: 'phone', width: 18 },
    { header: 'Adresse', key: 'address', width: 32 },
    { header: 'Date de naissance', key: 'birthDate', width: 16 },
    { header: 'Membre depuis (année)', key: 'memberSinceYear', width: 20 },
    { header: 'Département', key: 'department', width: 22 },
    { header: 'Statut', key: 'status', width: 14 },
    { header: "Date d'inscription", key: 'createdAt', width: 18 }
  ];
  sheet.getRow(1).font = { bold: true };

  for (const m of members) {
    sheet.addRow({
      memberNumber: m.memberNumber ?? '',
      firstName: m.firstName,
      lastName: m.lastName,
      email: m.email,
      phone: m.phone ?? '',
      address: m.address ?? '',
      birthDate: m.birthDate ? m.birthDate.toLocaleDateString('fr-FR') : '',
      memberSinceYear: m.memberSinceYear ?? '',
      department: m.department?.name ?? '',
      status: STATUS_LABELS[m.status] ?? m.status,
      createdAt: m.createdAt.toLocaleDateString('fr-FR')
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="membres-gospel-nation-${date}.xlsx"`
    }
  });
}
