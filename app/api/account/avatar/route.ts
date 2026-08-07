import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { authUser } from '@/lib/auth-request';
import { AVATARS } from '@/lib/avatars';

const schema = z.object({ avatarId: z.enum(AVATARS.map((a) => a.id) as [string, ...string[]]) });

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
  if (!parsed.success) return NextResponse.json({ error: 'Avatar invalide' }, { status: 400 });

  await sql`update app_users set avatar_id = ${parsed.data.avatarId} where id = ${user.id}`;
  return NextResponse.json({ ok: true });
}
