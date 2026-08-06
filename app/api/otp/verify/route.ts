import { NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizePhone } from '@/lib/auth';
import { verifyCode } from '@/lib/otp';

const schema = z.object({
  phone: z.string().min(6),
  purpose: z.enum(['signup', 'change']),
  code: z.string().trim().regex(/^\d{6}$/, 'Code à 6 chiffres'),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Code invalide' }, { status: 400 });

  const phone = normalizePhone(parsed.data.phone);
  const ok = await verifyCode(phone, parsed.data.purpose, parsed.data.code);
  if (!ok) return NextResponse.json({ error: 'Code incorrect ou expiré.' }, { status: 400 });
  return NextResponse.json({ ok: true });
}
