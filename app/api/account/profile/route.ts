import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sql } from '@/lib/db';
import { authUser } from '@/lib/auth-request';

const schema = z.object({
  firstName: z.string().trim().min(1).max(60),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
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
  if (!parsed.success) return NextResponse.json({ error: 'Prénom invalide' }, { status: 400 });

  const bd = parsed.data.birthdate && parsed.data.birthdate.length ? parsed.data.birthdate : null;
  await sql`update app_users set first_name = ${parsed.data.firstName},
            birthdate = coalesce(${bd}, birthdate) where id = ${user.id}`;
  return NextResponse.json({ ok: true });
}
