import type { User } from './db';
import { getCurrentUser, getUserFromToken } from './auth';

// Unified auth for API routes: prefer the `Authorization: Bearer <jwt>` header
// (mobile / native / machine clients), fall back to the httpOnly session cookie
// (web). Returns null when neither yields a valid user.
export async function authUser(req: Request): Promise<User | null> {
  const header = req.headers.get('authorization');
  if (header?.startsWith('Bearer ')) {
    const token = header.slice(7).trim();
    if (token) {
      const user = await getUserFromToken(token);
      if (user) return user;
    }
  }
  return getCurrentUser();
}
