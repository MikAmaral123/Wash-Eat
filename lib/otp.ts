import bcrypt from 'bcryptjs';
import { sql } from './db';

export type OtpPurpose = 'signup' | 'change';
const TTL_MIN = 10;
const MAX_ATTEMPTS = 5;

// Twilio Verify config (real SMS). When absent -> dev mode (code shown on screen).
const TW_SID = process.env.TWILIO_ACCOUNT_SID;
const TW_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TW_SERVICE = process.env.TWILIO_VERIFY_SERVICE_SID;
export const isTwilio = !!(TW_SID && TW_TOKEN && TW_SERVICE);
export const isDevSms = !isTwilio;

function twAuth() {
  return 'Basic ' + Buffer.from(`${TW_SID}:${TW_TOKEN}`).toString('base64');
}

async function twilioStart(phone: string): Promise<void> {
  const res = await fetch(`https://verify.twilio.com/v2/Services/${TW_SERVICE}/Verifications`, {
    method: 'POST',
    headers: { Authorization: twAuth(), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: phone, Channel: 'sms' }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error('[Twilio start]', res.status, t);
    throw new Error('Envoi du SMS impossible.');
  }
}

async function twilioCheck(phone: string, code: string): Promise<boolean> {
  const res = await fetch(`https://verify.twilio.com/v2/Services/${TW_SERVICE}/VerificationCheck`, {
    method: 'POST',
    headers: { Authorization: twAuth(), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ To: phone, Code: code }),
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { status?: string };
  return data.status === 'approved';
}

function genCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Record a verified (not yet consumed) row so isVerified()/consume() work for both modes.
async function markVerified(phone: string, purpose: OtpPurpose): Promise<void> {
  await sql`update phone_verifications set consumed = true
            where phone = ${phone} and purpose = ${purpose} and consumed = false`;
  await sql`insert into phone_verifications (phone, code_hash, purpose, verified, expires_at)
            values (${phone}, 'twilio', ${purpose}, true, now() + make_interval(mins => 15))`;
}

// Send a code. Returns the code only in dev mode (Twilio delivers it by SMS).
export async function issueCode(phone: string, purpose: OtpPurpose): Promise<string | null> {
  if (isTwilio) {
    await twilioStart(phone);
    return null;
  }
  const code = genCode();
  const hash = await bcrypt.hash(code, 10);
  await sql`update phone_verifications set consumed = true
            where phone = ${phone} and purpose = ${purpose} and consumed = false`;
  await sql`insert into phone_verifications (phone, code_hash, purpose, expires_at)
            values (${phone}, ${hash}, ${purpose}, now() + make_interval(mins => ${TTL_MIN}))`;
  console.log(`[OTP dev] code for ${phone} (${purpose}): ${code}`);
  return code;
}

// Check a code; on success records the verification.
export async function verifyCode(phone: string, purpose: OtpPurpose, code: string): Promise<boolean> {
  if (isTwilio) {
    const ok = await twilioCheck(phone, code);
    if (ok) await markVerified(phone, purpose);
    return ok;
  }
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

export async function isVerified(phone: string, purpose: OtpPurpose): Promise<boolean> {
  const rows = (await sql`
    select 1 from phone_verifications
    where phone = ${phone} and purpose = ${purpose} and verified = true and consumed = false
      and expires_at > now()
    limit 1
  `) as unknown[];
  return rows.length > 0;
}

export async function consume(phone: string, purpose: OtpPurpose): Promise<void> {
  await sql`update phone_verifications set consumed = true
            where phone = ${phone} and purpose = ${purpose} and consumed = false`;
}
