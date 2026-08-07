'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Icon from '@/components/Icon';
import { rewardByKey } from '@/lib/loyalty';

type Coupon = { id: string; reward_key: string; reward_name: string; cost: number; code: string; expires_at: string | null };

function expiryLabel(iso: string | null): string {
  if (!iso) return 'Sans expiration';
  const ms = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(ms / 86400000);
  if (days <= 0) return 'Expire aujourd’hui';
  if (days === 1) return 'Expire demain';
  return `Expire dans ${days} jours`;
}

export default function CouponsPanel() {
  const [coupons, setCoupons] = useState<Coupon[] | null>(null);

  async function load() {
    try {
      const res = await fetch('/api/account/coupons', { cache: 'no-store' });
      if (res.ok) { const d = await res.json(); setCoupons(d.coupons ?? []); }
    } catch { /* keep last */ }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000); // reflect terminal validation quickly
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(t); window.removeEventListener('focus', onFocus); };
  }, []);

  if (!coupons || coupons.length === 0) return null;

  return (
    <section className="coupons">
      <h2 className="coupons-title">
        <Icon name="gift" className="coupons-title-ic" /> Mes coupons à utiliser
        <span className="coupons-count">{coupons.length}</span>
      </h2>
      <div className="coupons-grid">
        {coupons.map((c) => <CouponCard key={c.id} c={c} />)}
      </div>
    </section>
  );
}

function CouponCard({ c }: { c: Coupon }) {
  const [qr, setQr] = useState('');
  const [shared, setShared] = useState(false);
  const icon = rewardByKey(c.reward_key)?.icon ?? 'gift';

  useEffect(() => {
    const url = `${window.location.origin}/c/${c.code}`;
    QRCode.toDataURL(url, { width: 240, margin: 1, color: { dark: '#2a211a', light: '#ffffff' } })
      .then(setQr).catch(() => setQr(''));
  }, [c.code]);

  async function share() {
    const url = `${window.location.origin}/c/${c.code}`;
    const data = { title: 'Coupon Wash&eat', text: `${c.reward_name} — coupon Wash&eat à scanner en laverie.`, url };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(url);
      setShared(true); setTimeout(() => setShared(false), 1800);
    } catch { /* cancelled */ }
  }

  const pretty = `${c.code.slice(0, 4)}-${c.code.slice(4, 8)}`.toUpperCase();

  return (
    <div className="coupon-card">
      <div className="coupon-head">
        <span className="coupon-icon"><Icon name={icon} /></span>
        <div className="coupon-meta">
          <b>{c.reward_name}</b>
          <span>{c.cost} pts · usage unique</span>
        </div>
      </div>
      <div className="coupon-qr-wrap">
        {qr ? <img src={qr} alt="QR code du coupon" className="coupon-qr" /> : <div className="coupon-qr skeleton" />}
      </div>
      <p className="coupon-expiry"><Icon name="clock" className="coupon-expiry-ic" /> {expiryLabel(c.expires_at)}</p>
      <code className="coupon-code">{pretty}</code>
      <button type="button" className="btn btn-ghost btn-sm coupon-share" onClick={share}>
        <Icon name="handshake" /> {shared ? 'Lien copié !' : 'Partager'}
      </button>
    </div>
  );
}
