import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { ensureCouponsTable } from '@/lib/coupons';

// Public endpoint hit by the in-store terminal after scanning a coupon QR.
// Marks the coupon used (single-use, atomic).
const schema = z.object({ code: z.string().min(8).max(64) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Code invalide' }, { status: 400 });

  await ensureCouponsTable();
  const rows = (await sql`
    update coupons set status = 'used', used_at = now()
    where code = ${parsed.data.code} and status = 'active'
      and (expires_at is null or expires_at > now())
    returning reward_name
  `) as { reward_name: string }[];

  if (!rows.length) {
    // Distinguish an expired coupon for a clearer terminal message.
    const exp = (await sql`
      select 1 from coupons
      where code = ${parsed.data.code} and status = 'active' and expires_at <= now() limit 1
    `) as unknown[];
    if (exp.length) return NextResponse.json({ error: 'Coupon expiré.' }, { status: 410 });
    return NextResponse.json({ error: 'Coupon introuvable ou déjà utilisé.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, reward_name: rows[0].reward_name });
}
