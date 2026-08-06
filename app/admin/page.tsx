import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { sql, type FranchiseLead } from '@/lib/db';

export const dynamic = 'force-dynamic';

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!user.is_admin) redirect('/account');

  const leads = (await sql`
    select id, full_name, email, phone, city, message, created_at
    from franchise_leads order by created_at desc
  `) as FranchiseLead[];

  return (
    <main className="admin-wrap">
      <div className="admin-inner">
        <div className="admin-head">
          <div>
            <Link href="/account" className="auth-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Mon compte
            </Link>
            <h1>Candidatures franchise</h1>
            <p className="admin-sub">{leads.length} candidature{leads.length > 1 ? 's' : ''} reçue{leads.length > 1 ? 's' : ''}.</p>
          </div>
          <span className="admin-badge">🔑 Admin - {user.first_name}</span>
        </div>

        {leads.length === 0 ? (
          <div className="admin-empty">
            <div className="ae-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" /></svg></div>
            <h3>Aucune candidature pour le moment</h3>
            <p>Les candidatures envoyées depuis la page <Link href="/franchise">Nous rejoindre</Link> apparaîtront ici.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Date</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Ville</th><th>Projet</th></tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="nowrap muted">{fmtDate(l.created_at)}</td>
                    <td><b>{l.full_name}</b></td>
                    <td><a href={`mailto:${l.email}`}>{l.email}</a></td>
                    <td className="nowrap">{l.phone || '-'}</td>
                    <td>{l.city || '-'}</td>
                    <td className="msg">{l.message || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
