'use client';
import { useCallback, useEffect, useState } from 'react';
import AccountAvatar from '@/components/AccountAvatar';
import ProfileSettings from '@/components/ProfileSettings';
import LoyaltyPanel from '@/components/LoyaltyPanel';
import CouponsPanel, { type Coupon } from '@/components/CouponsPanel';
import Icon from '@/components/Icon';
import { gradeFor, nextGrade, gradeProgress } from '@/lib/loyalty';

type Tab = 'apercu' | 'fidelite' | 'profil';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'apercu', label: 'Aperçu', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg> },
  { key: 'fidelite', label: 'Fidélité', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></svg> },
  { key: 'profil', label: 'Profil', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg> },
];

const POLL_MS = 3000;

// Live account: poll points + coupons together so the balance, grade and the
// coupon list update without a reload — and reflect changes made elsewhere
// (in-store terminal validation) within one poll. Redemptions are applied
// optimistically on top so the user's own actions feel instant.
function useLiveAccount(initialPoints: number) {
  const [points, setPoints] = useState(initialPoints);
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [p, c] = await Promise.all([
        fetch('/api/account/points', { cache: 'no-store' }),
        fetch('/api/account/coupons', { cache: 'no-store' }),
      ]);
      if (p.ok) { const d = await p.json(); if (typeof d.points === 'number') setPoints(d.points); }
      if (c.ok) { const d = await c.json(); setCoupons(d.coupons ?? []); }
    } catch { /* keep last known values */ }
  }, []);

  // Optimistically show a freshly redeemed coupon (dedupe against the poll).
  const addCoupon = useCallback((coupon: Coupon | undefined) => {
    if (!coupon?.id) return;
    setCoupons((prev) => {
      const list = prev ?? [];
      if (list.some((x) => x.id === coupon.id)) return list;
      return [coupon, ...list];
    });
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, POLL_MS);
    const onWake = () => { if (document.visibilityState === 'visible') refresh(); };
    window.addEventListener('focus', onWake);
    document.addEventListener('visibilitychange', onWake);
    return () => {
      clearInterval(t);
      window.removeEventListener('focus', onWake);
      document.removeEventListener('visibilitychange', onWake);
    };
  }, [refresh]);

  return { points, setPoints, coupons, addCoupon, refresh };
}

export default function DashboardShell({
  firstName, phone, birthdate, avatarId, points: initialPoints, isAdmin,
}: {
  firstName: string; phone: string; birthdate: string | null; avatarId: string | null; points: number; isAdmin?: boolean;
}) {
  const [tab, setTab] = useState<Tab>('apercu');
  const { points, setPoints, coupons, addCoupon, refresh } = useLiveAccount(initialPoints);

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
            <CouponsPanel coupons={coupons} />
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
            onRedeem={(newPoints, coupon) => { setPoints(newPoints); addCoupon(coupon); refresh(); }}
          />
        )}

        {tab === 'profil' && <ProfileSettings firstName={firstName} phone={phone} birthdate={birthdate} />}
      </div>
    </>
  );
}
