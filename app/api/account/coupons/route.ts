import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { authUser } from '@/lib/auth-request';
import { ensureCouponsTable, type Coupon } from '@/lib/coupons';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = await authUser(req);
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  await ensureCouponsTable();
  const coupons = (await sql`
    select id, reward_key, reward_name, cost, code, status, created_at
    from coupons
    where user_id = ${user.id} and status = 'active'
    order by created_at desc
  `) as Coupon[];

  return NextResponse.json({ coupons });
}
