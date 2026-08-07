'use client';
import { useState } from 'react';
import Icon from '@/components/Icon';

export default function CouponValidate({ code, rewardName }: { code: string; rewardName: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'err'>('idle');
  const [msg, setMsg] = useState('');

  async function validate() {
    if (state === 'busy') return;
    setState('busy');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const d = await res.json();
      if (!res.ok) { setMsg(d.error || 'Échec.'); setState('err'); return; }
      setState('done');
    } catch { setMsg('Erreur réseau.'); setState('err'); }
  }

  if (state === 'done') {
    return (
      <div className="scan-state ok">
        <Icon name="check" className="scan-ic" />
        <h1>Coupon validé</h1>
        <p><b>{rewardName}</b> — à récupérer au comptoir.</p>
      </div>
    );
  }

  return (
    <div className="scan-state">
      <Icon name="gift" className="scan-ic" />
      <h1>{rewardName}</h1>
      <p>Coupon Wash&amp;eat à usage unique.</p>
      <button type="button" className="btn btn-primary" onClick={validate} disabled={state === 'busy'}>
        {state === 'busy' ? 'Validation…' : 'Valider le coupon'}
      </button>
      {state === 'err' && <p className="scan-err">{msg}</p>}
    </div>
  );
}
