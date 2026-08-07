'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPhone } from '@/lib/phone';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Connexion impossible.');
        return;
      }
      router.push('/account');
      router.refresh();
    } catch {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-split">
      <aside className="auth-aside auth-aside--coral">
        <span className="ablob x1" /><span className="ablob x2" />
        <Link href="/" className="aside-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Retour au site
        </Link>
        <div>
          <div className="aside-brand"><span className="porthole" />Wash<span className="amp">&amp;</span>eat</div>
          <h2 className="aside-title">Votre laverie,<br />dans votre poche.</h2>
          <p className="aside-lead">Connectez-vous pour lancer vos machines, suivre vos cycles en direct et cumuler votre fidélité.</p>
          <ul className="aside-points">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>Suivi de vos machines en temps réel</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11Z" /></svg>Votre carte de fidélité automatique</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" /><path d="M6 2v2M10 2v2M14 2v2" /></svg>Un café offert de temps en temps</li>
          </ul>
        </div>
        <p className="aside-foot">Ouvert 24h/24 · 7/7</p>
      </aside>

      <section className="auth-main">
        <div className="auth-panel">
          <h1>Bon retour</h1>
          <p className="auth-sub">Connectez-vous à votre compte Wash&amp;eat.</p>

          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="phone">Numéro de téléphone</label>
              <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78"
                value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} required />
            </div>
            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <input id="password" type="password" autoComplete="current-password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <p className="auth-foot">Pas encore de compte ? <Link href="/signup">Créer un compte</Link></p>
        </div>
      </section>
    </main>
  );
}
