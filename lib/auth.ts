import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { sql, type User } from './db';
import { BIRTHDAY_BONUS } from './loyalty';

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

// Sign a 30-day session JWT. Reused by both the cookie (web) and
// bearer-token (mobile/native) auth paths.
export async function signSessionToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

// Load a user from a raw JWT (no cookie). Used by the bearer-token path.
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const id = payload.sub as string;
    const rows = (await sql`
      select id, phone, first_name, avatar_id, is_admin, points,
             birthdate::text as birthdate, birthday_bonus_year, created_at
      from app_users where id = ${id} limit 1
    `) as User[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const token = await signSessionToken(userId);
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

// Grant the +100 birthday bonus once per calendar year if today matches.
// Mutates and returns the user so the caller sees fresh points.
export async function maybeGrantBirthday(user: User): Promise<User> {
  if (!user.birthdate) return user;
  const today = new Date();
  const year = today.getFullYear();
  const todayMd = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const bdMd = String(user.birthdate).slice(5, 10);
  if (bdMd !== todayMd || user.birthday_bonus_year === year) return user;
  const rows = (await sql`
    update app_users set points = points + ${BIRTHDAY_BONUS}, birthday_bonus_year = ${year}
    where id = ${user.id} and (birthday_bonus_year is distinct from ${year})
    returning points
  `) as { points: number }[];
  if (rows.length) {
    await sql`insert into loyalty_ledger (user_id, delta, reason) values (${user.id}, ${BIRTHDAY_BONUS}, 'birthday')`;
    return { ...user, points: rows[0].points, birthday_bonus_year: year };
  }
  return user;
}

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return getUserFromToken(token);
}
