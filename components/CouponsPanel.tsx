'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Icon from '@/components/Icon';
import { rewardByKey } from '@/lib/loyalty';

type Coupon = { id: string; reward_key: string; reward_name: string; cost: number; code: string };

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
  const icon = rewardByKey(c.reward_key)?.icon ?? 'gift';

  useEffect(() => {
    const url = `${window.location.origin}/c/${c.code}`;
    QRCode.toDataURL(url, { width: 240, margin: 1, color: { dark: '#2a211a', light: '#ffffff' } })
      .then(setQr).catch(() => setQr(''));
  }, [c.code]);

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
      <p className="coupon-hint">Scannez à la borne en laverie pour l’utiliser.</p>
      <code className="coupon-code">{pretty}</code>
    </div>
  );
}
