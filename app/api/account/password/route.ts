import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { authUser } from '@/lib/auth-request';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export async function POST(req: Request) {
  const user = await authUser(req);
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Mot de passe : 6 caractères minimum.' }, { status: 400 });

  const rows = (await sql`select password_hash from app_users where id = ${user.id} limit 1`) as { password_hash: string }[];
  if (!rows[0] || !(await verifyPassword(parsed.data.currentPassword, rows[0].password_hash))) {
    return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 400 });
  }

  const hash = await hashPassword(parsed.data.newPassword);
  await sql`update app_users set password_hash = ${hash} where id = ${user.id}`;
  return NextResponse.json({ ok: true });
}
