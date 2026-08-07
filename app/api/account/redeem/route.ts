import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { authUser } from '@/lib/auth-request';
import { REWARDS, rewardByKey } from '@/lib/loyalty';

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

  return NextResponse.json({ ok: true, points: rows[0].points });
}
