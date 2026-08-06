import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, maybeGrantBirthday } from '@/lib/auth';
import AccountAvatar from '@/components/AccountAvatar';
import ProfileSettings from '@/components/ProfileSettings';
import LoyaltyPanel from '@/components/LoyaltyPanel';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  let user = await getCurrentUser();
  if (!user) redirect('/login');
  user = await maybeGrantBirthday(user);

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

        <LoyaltyPanel initialPoints={user.points} />

        <ProfileSettings firstName={user.first_name ?? ''} phone={user.phone} birthdate={user.birthdate} />
      </div>
    </main>
  );
}
