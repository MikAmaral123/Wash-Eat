import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

// Lazy client: don't throw at import time (breaks `next build` page-data
// collection when env isn't present). Only fail when a query actually runs.
let _sql: NeonQueryFunction<false, false> | null = null;
function client(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  _sql = neon(url);
  return _sql;
}

// Tagged-template passthrough so callers keep using sql`...`.
export const sql: NeonQueryFunction<false, false> = ((
  strings: TemplateStringsArray,
  ...params: unknown[]
) => client()(strings, ...params)) as unknown as NeonQueryFunction<false, false>;

export type User = {
  id: string;
  phone: string;
  first_name: string | null;
  avatar_id: string | null;
  created_at: string;
};
