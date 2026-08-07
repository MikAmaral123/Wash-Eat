import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { normalizePhone } from '@/lib/auth';
import { authUser } from '@/lib/auth-request';
import { verifyCode, consume } from '@/lib/otp';

const schema = z.object({
  newPhone: z.string().min(6),
  code: z.string().trim().regex(/^\d{6}$/, 'Code à 6 chiffres'),
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
  if (!parsed.success) return NextResponse.json({ error: 'Champs invalides' }, { status: 400 });

  const phone = normalizePhone(parsed.data.newPhone);

  const taken = (await sql`select 1 from app_users where phone = ${phone} and id <> ${user.id} limit 1`) as unknown[];
  if (taken.length) return NextResponse.json({ error: 'Ce numéro est déjà utilisé.' }, { status: 409 });

  const ok = await verifyCode(phone, 'change', parsed.data.code);
  if (!ok) return NextResponse.json({ error: 'Code incorrect ou expiré.' }, { status: 400 });

  await sql`update app_users set phone = ${phone} where id = ${user.id}`;
  await consume(phone, 'change');
  return NextResponse.json({ ok: true });
}
