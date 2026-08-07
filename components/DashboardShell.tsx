'use client';
import { useCallback, useEffect, useState } from 'react';
import AccountAvatar from '@/components/AccountAvatar';
import ProfileSettings from '@/components/ProfileSettings';
import LoyaltyPanel from '@/components/LoyaltyPanel';
import CouponsPanel from '@/components/CouponsPanel';
import Icon from '@/components/Icon';
import { gradeFor, nextGrade, gradeProgress } from '@/lib/loyalty';

type Tab = 'apercu' | 'fidelite' | 'profil';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'apercu', label: 'Aperçu', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg> },
  { key: 'fidelite', label: 'Fidélité', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></svg> },
  { key: 'profil', label: 'Profil', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg> },
];

// Live points: poll the server so the balance/grade update without a reload.
function useLivePoints(initial: number) {
  const [points, setPoints] = useState(initial);
  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/account/points', { cache: 'no-store' });
      if (res.ok) { const d = await res.json(); if (typeof d.points === 'number') setPoints(d.points); }
    } catch { /* keep last */ }
  }, []);
  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 4000);
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(t); window.removeEventListener('focus', onFocus); };
  }, [refresh]);
  return { points, refresh, setPoints };
}

export default function DashboardShell({
  firstName, phone, birthdate, avatarId, points: initialPoints, isAdmin,
}: {
  firstName: string; phone: string; birthdate: string | null; avatarId: string | null; points: number; isAdmin?: boolean;
}) {
  const [tab, setTab] = useState<Tab>('apercu');
  const { points, refresh: refreshPoints, setPoints } = useLivePoints(initialPoints);

  const grade = gradeFor(points);
  const next = nextGrade(points);
  const pct = Math.round(gradeProgress(points) * 100);

  return (
    <>
      <header className="dash-head">
        <AccountAvatar initialAvatarId={avatarId} />
        <div className="dash-head-info">
          <h1>Bonjour {firstName}</h1>
          <span className="grade-badge" data-grade={grade.key}>
            <span className="gb-emoji"><Icon name={grade.icon} /></span>
            <span className="gb-name">{grade.name}</span>
            <span className="gb-pts">{points.toLocaleString('fr-FR')} pts</span>
          </span>
        </div>
      </header>

      <nav className="dash-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={tab === t.key}
            className={'dash-tab' + (tab === t.key ? ' active' : '')} onClick={() => setTab(t.key)}>
            {t.icon}<span>{t.label}</span>
          </button>
        ))}
        {isAdmin && (
          <a href="/admin" className="dash-tab dash-tab-admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
            <span>Admin</span>
          </a>
        )}
      </nav>

      <div className="dash-panel">
        {tab === 'apercu' && (
          <div className="loyalty-panel">
            <CouponsPanel />
            <div className="lp-hero">
              <div className="lp-points">
                <span className="lp-coin"><Icon name="coins" /></span>
                <div><b>{points.toLocaleString('fr-FR')}</b><span>points Wash&amp;eat</span></div>
              </div>
              <div className="lp-grade">
                <span className="lp-grade-badge"><Icon name={grade.icon} /> {grade.name}</span>
                {next ? (
                  <>
                    <div className="lp-bar"><i style={{ width: `${pct}%` }} /></div>
                    <span className="lp-next">{(next.min - points).toLocaleString('fr-FR')} pts avant <Icon name={next.icon} className="lp-inline-ic" /> {next.name}</span>
                  </>
                ) : <span className="lp-next">Grade maximum atteint</span>}
              </div>
            </div>
            <div className="lp-perks">
              <div><span className="lp-perk-lbl">Avantage</span><p>{grade.perk}</p></div>
              <div><span className="lp-perk-lbl">Débloqué</span><p>{grade.unlock}</p></div>
            </div>
          </div>
        )}

        {tab === 'fidelite' && (
          <LoyaltyPanel
            points={points}
            onRedeem={(newPoints) => { setPoints(newPoints); refreshPoints(); }}
          />
        )}

        {tab === 'profil' && <ProfileSettings firstName={firstName} phone={phone} birthdate={birthdate} />}
      </div>
    </>
  );
}
