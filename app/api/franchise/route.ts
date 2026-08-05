import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';

const schema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  city: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Champs invalides' }, { status: 400 });
  }
  const { fullName, email, phone, city, message } = parsed.data;
  await sql`
    insert into franchise_leads (full_name, email, phone, city, message)
    values (${fullName}, ${email}, ${phone || null}, ${city || null}, ${message || null})
  `;
  return NextResponse.json({ ok: true });
}
