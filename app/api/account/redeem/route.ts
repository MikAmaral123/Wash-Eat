import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { authUser } from '@/lib/auth-request';
import { REWARDS, rewardByKey } from '@/lib/loyalty';
import { ensureCouponsTable, genCode, COUPON_TTL_DAYS } from '@/lib/coupons';

const schema = z.object({ rewardKey: z.enum(REWARDS.map((r) => r.key) as [string, ...string[]]) });

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
  if (!parsed.success) return NextResponse.json({ error: 'Récompense inconnue' }, { status: 400 });

  const reward = rewardByKey(parsed.data.rewardKey)!;

  // Atomic conditional deduction (prevents going negative on races).
  const rows = (await sql`
    update app_users set points = points - ${reward.cost}
    where id = ${user.id} and points >= ${reward.cost}
    returning points
  `) as { points: number }[];

  if (!rows.length) {
    return NextResponse.json({ error: 'Points insuffisants.' }, { status: 400 });
  }

  await sql`insert into loyalty_ledger (user_id, delta, reason, reward_key)
            values (${user.id}, ${-reward.cost}, 'redeem', ${reward.key})`;

  // Emit a single-use coupon to redeem at the in-store terminal.
  await ensureCouponsTable();
  const code = genCode();
  const inserted = (await sql`
    insert into coupons (user_id, reward_key, reward_name, cost, code, expires_at)
    values (${user.id}, ${reward.key}, ${reward.name}, ${reward.cost}, ${code}, now() + make_interval(days => ${COUPON_TTL_DAYS}))
    returning id, status, created_at, expires_at`) as { id: string; status: string; created_at: string; expires_at: string }[];

  // Return the full coupon so the client can render it optimistically
  // (no wait for the next poll).
  return NextResponse.json({
    ok: true, points: rows[0].points,
    coupon: {
      id: inserted[0]?.id,
      reward_key: reward.key,
      reward_name: reward.name,
      cost: reward.cost,
      code,
      status: inserted[0]?.status ?? 'active',
      created_at: inserted[0]?.created_at,
      expires_at: inserted[0]?.expires_at,
    },
  });
}
