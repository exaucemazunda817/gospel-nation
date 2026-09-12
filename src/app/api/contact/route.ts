import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, subject, message } = body;

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Le nom est obligatoire.' }, { status: 400 });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
  }
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Le message est obligatoire.' }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: typeof subject === 'string' && subject.trim() ? subject.trim() : null,
      message: message.trim()
    }
  });

  return NextResponse.json({ ok: true });
}
