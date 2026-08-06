import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { sql, type User } from './db';

const COOKIE = 'washeat_session';
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-insecure-secret-change-me');

export function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}
export function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

// Normalize a French phone to +33XXXXXXXXX-ish digits (keeps leading +).
export function normalizePhone(raw: string): string {
  let s = raw.replace(/[\s.\-()]/g, '');
  if (s.startsWith('0')) s = '+33' + s.slice(1);
  if (!s.startsWith('+')) s = '+' + s;
  return s;
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const id = payload.sub as string;
    const rows = (await sql`
      select id, phone, first_name, avatar_id, is_admin, created_at
      from app_users where id = ${id} limit 1
    `) as User[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}
