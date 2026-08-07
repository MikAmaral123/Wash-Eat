'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { REWARDS, GRADES, EARN_RULES, gradeFor, nextGrade, gradeProgress } from '@/lib/loyalty';
import Icon from '@/components/Icon';

export default function LoyaltyPanel({ initialPoints }: { initialPoints: number }) {
  const router = useRouter();
  const [points, setPoints] = useState(initialPoints);
  const [busy, setBusy] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);

  const grade = gradeFor(points);
  const next = nextGrade(points);
  const pct = Math.round(gradeProgress(points) * 100);

  async function redeem(key: string, cost: number, name: string) {
    if (points < cost || busy) return;
    setBusy(key); setFlash(null);
    try {
      const res = await fetch('/api/account/redeem', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardKey: key }),
      });
      const d = await res.json();
      if (!res.ok) { setFlash({ type: 'err', msg: d.error || 'Échec.' }); return; }
      setPoints(d.points);
      setFlash({ type: 'ok', msg: `${name} échangé ! Votre coupon vous attend dans l’onglet Aperçu.` });
      router.refresh();
    } catch { setFlash({ type: 'err', msg: 'Erreur réseau.' }); }
    finally { setBusy(null); }
  }

  return (
    <div className="loyalty-panel">
      {/* Points + grade */}
      <div className="lp-hero">
        <div className="lp-points">
          <span className="lp-coin"><Icon name="coins" /></span>
          <div>
            <b>{points.toLocaleString('fr-FR')}</b>
            <span>points Wash&amp;eat</span>
          </div>
        </div>
        <div className="lp-grade">
          <span className="lp-grade-badge"><Icon name={grade.icon} /> {grade.name}</span>
          {next ? (
            <>
              <div className="lp-bar"><i style={{ width: `${pct}%` }} /></div>
              <span className="lp-next">{(next.min - points).toLocaleString('fr-FR')} pts avant <Icon name={next.icon} className="lp-inline-ic" /> {next.name}</span>
            </>
          ) : (
            <span className="lp-next">Grade maximum atteint</span>
          )}
        </div>
      </div>

      {/* Current grade perks */}
      <div className="lp-perks">
        <div><span className="lp-perk-lbl">Avantage</span><p>{grade.perk}</p></div>
        <div><span className="lp-perk-lbl">Débloqué</span><p>{grade.unlock}</p></div>
      </div>

      {flash && <div className={flash.type === 'ok' ? 'form-note ok' : 'form-note err'}>{flash.msg}</div>}

      {/* Boutique */}
      <h3 className="lp-sub"><Icon name="gift" className="lp-sub-ic" /> Boutique de points</h3>
      <div className="lp-rewards">
        {REWARDS.map((r) => {
          const affordable = points >= r.cost;
          return (
            <div className={'lp-reward' + (affordable ? '' : ' locked')} key={r.key}>
              <span className="lp-reward-emoji"><Icon name={r.icon} /></span>
              <div className="lp-reward-info">
                <b>{r.name}</b>
                <span>{r.cost} pts</span>
              </div>
              <button type="button" className="btn btn-primary btn-sm" disabled={!affordable || busy === r.key}
                onClick={() => redeem(r.key, r.cost, r.name)}>
                {busy === r.key ? '…' : affordable ? 'Échanger' : 'Bientôt'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Grades ladder */}
      <h3 className="lp-sub"><Icon name="trophy" className="lp-sub-ic" /> Les grades</h3>
      <div className="lp-grades">
        {GRADES.map((g) => (
          <div className={'lp-grade-row' + (g.key === grade.key ? ' current' : '')} key={g.key}>
            <span className="lp-grade-emoji"><Icon name={g.icon} /></span>
            <div className="lp-grade-meta"><b>{g.name}</b><span>{g.min.toLocaleString('fr-FR')} pts</span></div>
            <p>{g.unlock}</p>
          </div>
        ))}
      </div>

      {/* How to earn */}
      <h3 className="lp-sub"><Icon name="coins" className="lp-sub-ic" /> Comment gagner des points</h3>
      <div className="lp-earn">
        {EARN_RULES.map((e) => (
          <div className="lp-earn-row" key={e.label}>
            <span><Icon name={e.icon} className="lp-earn-ic" /> {e.label}</span><b>{e.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
