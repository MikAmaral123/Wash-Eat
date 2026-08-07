import { NextResponse } from 'next/server';
import { authUser } from '@/lib/auth-request';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const user = await authUser(req);
  if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
  return NextResponse.json({ points: user.points });
}
