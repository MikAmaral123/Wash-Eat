import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
export const sql = neon(process.env.DATABASE_URL);

export type User = {
  id: string;
  phone: string;
  first_name: string | null;
  avatar_id: string | null;
  created_at: string;
};
