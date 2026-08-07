import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, maybeGrantBirthday } from '@/lib/auth';
import DashboardShell from '@/components/DashboardShell';

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
            <form action="/api/auth/logout" method="post">
              <button className="btn btn-primary btn-sm" type="submit">Se déconnecter</button>
            </form>
          </div>
        </div>
      </div>

      <div className="dash-inner">
        <DashboardShell
          firstName={user.first_name ?? ''}
          phone={user.phone}
          birthdate={user.birthdate}
          avatarId={user.avatar_id}
          points={user.points}
          isAdmin={user.is_admin}
        />
      </div>
    </main>
  );
}
