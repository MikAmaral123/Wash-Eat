import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import AccountAvatar from '@/components/AccountAvatar';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <main className="auth-wrap" style={{ alignItems: 'flex-start' }}>
      <span className="blob ab1" /><span className="blob ab3" />
      <div className="account-wrap" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Link href="/" className="auth-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Accueil
        </Link>

        <div className="account-top">
          <AccountAvatar initialAvatarId={user.avatar_id} />
          <div>
            <h1>Bonjour {user.first_name} 👋</h1>
            <p>{user.phone}</p>
          </div>
        </div>

        <div className="account-grid">
          <div className="account-card"><b style={{ color: 'var(--green)' }}>5 / 8</b><span>Tampons fidélité</span></div>
          <div className="account-card"><b style={{ color: 'var(--coral)' }}>0</b><span>Machine en cours</span></div>
          <div className="account-card"><b style={{ color: 'var(--amber)' }}>3</b><span>Lavages avant récompense</span></div>
        </div>

        <div className="account-actions">
          <Link href="/" className="btn btn-ghost">Retour au site</Link>
          {user.is_admin && (
            <Link href="/admin" className="btn btn-ghost">🔑 Espace admin</Link>
          )}
          <form action="/api/auth/logout" method="post">
            <button className="btn btn-primary" type="submit">Se déconnecter</button>
          </form>
        </div>
      </div>
    </main>
  );
}
