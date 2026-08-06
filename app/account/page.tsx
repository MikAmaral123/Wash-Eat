import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import AccountAvatar from '@/components/AccountAvatar';
import ProfileSettings from '@/components/ProfileSettings';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  return (
    <main className="dash">
      <div className="dash-topbar">
        <div className="dash-topbar-inner">
          <Link href="/" className="brand"><span className="porthole" />Wash<span className="amp">&amp;</span>eat</Link>
          <div className="dash-topbar-actions">
            {user.is_admin && <Link href="/admin" className="btn btn-ghost btn-sm">🔑 Admin</Link>}
            <Link href="/" className="btn btn-ghost btn-sm">Retour au site</Link>
            <form action="/api/auth/logout" method="post">
              <button className="btn btn-primary btn-sm" type="submit">Se déconnecter</button>
            </form>
          </div>
        </div>
      </div>

      <div className="dash-inner">
        <header className="dash-hero">
          <AccountAvatar initialAvatarId={user.avatar_id} />
          <div>
            <h1>Bonjour {user.first_name} 👋</h1>
            <p className="dash-phone">{user.phone}</p>
          </div>
        </header>

        <section className="dash-stats">
          <div className="dash-stat"><span className="ds-ic i-green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11Z" /></svg></span><b>5 / 8</b><span className="ds-lbl">Tampons fidélité</span></div>
          <div className="dash-stat"><span className="ds-ic i-coral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><circle cx="12" cy="13" r="4" /></svg></span><b>0</b><span className="ds-lbl">Machine en cours</span></div>
          <div className="dash-stat"><span className="ds-ic i-amber"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M4 12v9h16v-9" /><path d="M12 8C12 5 10 3 8 3a2.5 2.5 0 0 0 0 5ZM12 8c0-3 2-5 4-5a2.5 2.5 0 0 1 0 5Z" /></svg></span><b>3</b><span className="ds-lbl">Lavages avant récompense</span></div>
        </section>

        <ProfileSettings firstName={user.first_name ?? ''} phone={user.phone} />
      </div>
    </main>
  );
}
