import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { verifyPassword, createSession, normalizePhone } from '@/lib/auth';

const schema = z.object({ phone: z.string().min(6), password: z.string().min(1) });

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
  const phone = normalizePhone(parsed.data.phone);
  const rows = (await sql`
    select id, password_hash from app_users where phone = ${phone} limit 1
  `) as { id: string; password_hash: string }[];

  const user = rows[0];
  if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
    return NextResponse.json({ error: 'Numéro ou mot de passe incorrect.' }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
