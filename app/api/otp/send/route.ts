import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { normalizePhone, getCurrentUser } from '@/lib/auth';
import { issueCode, isDevSms } from '@/lib/otp';

const schema = z.object({
  phone: z.string().min(6),
  purpose: z.enum(['signup', 'change']),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Champs invalides' }, { status: 400 });

  const phone = normalizePhone(parsed.data.phone);
  const purpose = parsed.data.purpose;

  const taken = (await sql`select 1 from app_users where phone = ${phone} limit 1`) as unknown[];

  if (purpose === 'signup' && taken.length) {
    return NextResponse.json({ error: 'Ce numéro est déjà utilisé.' }, { status: 409 });
  }
  if (purpose === 'change') {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    if (taken.length) return NextResponse.json({ error: 'Ce numéro est déjà utilisé.' }, { status: 409 });
  }

  const code = await issueCode(phone, purpose);
  // Dev mode: return the code so the UI can display it (no real SMS yet).
  return NextResponse.json({ ok: true, devCode: isDevSms ? code : undefined });
}
