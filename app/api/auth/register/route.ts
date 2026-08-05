import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { hashPassword, createSession, normalizePhone } from '@/lib/auth';
import { AVATARS } from '@/lib/avatars';

const schema = z.object({
  phone: z.string().min(6),
  password: z.string().min(6),
  firstName: z.string().trim().min(1).max(60),
  avatarId: z.enum(AVATARS.map((a) => a.id) as [string, ...string[]]),
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
    return NextResponse.json({ error: 'Champs invalides', issues: parsed.error.flatten() }, { status: 400 });
  }
  const { password, firstName, avatarId } = parsed.data;
  const phone = normalizePhone(parsed.data.phone);

  const existing = (await sql`select 1 from app_users where phone = ${phone} limit 1`) as unknown[];
  if (existing.length) {
    return NextResponse.json({ error: 'Ce numéro est déjà utilisé.' }, { status: 409 });
  }

  const password_hash = await hashPassword(password);
  const rows = (await sql`
    insert into app_users (phone, password_hash, first_name, avatar_id)
    values (${phone}, ${password_hash}, ${firstName}, ${avatarId})
    returning id
  `) as { id: string }[];

  await createSession(rows[0].id);
  return NextResponse.json({ ok: true });
}
