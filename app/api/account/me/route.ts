import { NextResponse } from 'next/server';
import { authUser } from '@/lib/auth-request';
import { maybeGrantBirthday } from '@/lib/auth';

// Current user for native/bearer clients (the web uses the server-rendered
// /account page). Grants the birthday bonus on read, mirroring app/account.
export async function GET(req: Request) {
  const user = await authUser(req);
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  const fresh = await maybeGrantBirthday(user);
  return NextResponse.json({ user: fresh });
}
