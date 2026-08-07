import { randomUUID } from 'crypto';
import { sql } from './db';

export type Coupon = {
  id: string;
  reward_key: string;
  reward_name: string;
  cost: number;
  code: string;
  status: string;
  created_at: string;
};

// Idempotent provisioning — no migration tooling in this project, so the table
// is created on demand the first time a coupon is written/read.
let ensured = false;
export async function ensureCouponsTable(): Promise<void> {
  if (ensured) return;
  await sql`
    create table if not exists coupons (
      id uuid primary key default gen_random_uuid(),
      user_id text not null,
      reward_key text not null,
      reward_name text not null,
      cost int not null,
      code text not null unique,
      status text not null default 'active',
      created_at timestamptz not null default now(),
      used_at timestamptz
    )`;
  ensured = true;
}

// Single-use, unguessable coupon code.
export function genCode(): string {
  return randomUUID().replace(/-/g, '');
}
