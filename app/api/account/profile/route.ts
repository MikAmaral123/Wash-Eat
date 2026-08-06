import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

const schema = z.object({ firstName: z.string().trim().min(1).max(60) });

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Prénom invalide' }, { status: 400 });

  await sql`update app_users set first_name = ${parsed.data.firstName} where id = ${user.id}`;
  return NextResponse.json({ ok: true });
}
