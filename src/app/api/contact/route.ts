import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { allowRequest, TOO_MANY_REQUESTS_MESSAGE } from '@/lib/rate-limit';
import { tooLong } from '@/lib/validation';

export async function POST(request: NextRequest) {
  if (!(await allowRequest('contact', request, 15, 60 * 60 * 1000))) {
    return NextResponse.json({ error: TOO_MANY_REQUESTS_MESSAGE }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
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

  if (
    tooLong(name, 100) ||
    tooLong(email, 200) ||
    (typeof subject === 'string' && tooLong(subject, 150)) ||
    tooLong(message, 5000)
  ) {
    return NextResponse.json({ error: 'Un des champs est trop long.' }, { status: 400 });
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
