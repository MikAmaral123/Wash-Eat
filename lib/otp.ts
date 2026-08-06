import bcrypt from 'bcryptjs';
import { sql } from './db';

export type OtpPurpose = 'signup' | 'change';
const TTL_MIN = 10;
const MAX_ATTEMPTS = 5;

// No SMS provider configured yet -> dev mode (code returned to the client / logged).
export const isDevSms = !process.env.TWILIO_ACCOUNT_SID;

function genCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

// Create a fresh code for phone+purpose, invalidating older pending ones.
export async function issueCode(phone: string, purpose: OtpPurpose): Promise<string> {
  const code = genCode();
  const hash = await bcrypt.hash(code, 10);
  await sql`update phone_verifications set consumed = true
            where phone = ${phone} and purpose = ${purpose} and consumed = false`;
  await sql`insert into phone_verifications (phone, code_hash, purpose, expires_at)
            values (${phone}, ${hash}, ${purpose}, now() + make_interval(mins => ${TTL_MIN}))`;
  // Dev delivery
  console.log(`[OTP] code for ${phone} (${purpose}): ${code}`);
  return code;
}

// Check a code; marks the row verified on success.
export async function verifyCode(phone: string, purpose: OtpPurpose, code: string): Promise<boolean> {
  const rows = (await sql`
    select id, code_hash, attempts from phone_verifications
    where phone = ${phone} and purpose = ${purpose} and consumed = false and verified = false
      and expires_at > now()
    order by created_at desc limit 1
  `) as { id: string; code_hash: string; attempts: number }[];
  const row = rows[0];
  if (!row) return false;
  if (row.attempts >= MAX_ATTEMPTS) return false;
  const ok = await bcrypt.compare(code, row.code_hash);
  if (!ok) {
    await sql`update phone_verifications set attempts = attempts + 1 where id = ${row.id}`;
    return false;
  }
  await sql`update phone_verifications set verified = true where id = ${row.id}`;
  return true;
}

// True if a still-valid verified (not yet consumed) code exists.
export async function isVerified(phone: string, purpose: OtpPurpose): Promise<boolean> {
  const rows = (await sql`
    select 1 from phone_verifications
    where phone = ${phone} and purpose = ${purpose} and verified = true and consumed = false
      and expires_at > now()
    limit 1
  `) as unknown[];
  return rows.length > 0;
}

// Burn the verified code once the action (create / update) succeeds.
export async function consume(phone: string, purpose: OtpPurpose): Promise<void> {
  await sql`update phone_verifications set consumed = true
            where phone = ${phone} and purpose = ${purpose} and consumed = false`;
}
