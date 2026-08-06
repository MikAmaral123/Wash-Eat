'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AvatarPicker from '@/components/AvatarPicker';
import { avatarUrl } from '@/lib/avatars';
import { formatPhone } from '@/lib/phone';

const STEPS = [
  { label: 'Téléphone', sub: 'Votre numéro' },
  { label: 'Mot de passe', sub: 'Sécurisez le compte' },
  { label: 'Prénom', sub: 'Comment vous appeler' },
  { label: 'Avatar', sub: 'Choisissez votre style' },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function validStep(): string | null {
    if (step === 0) {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 9) return 'Entrez un numéro de téléphone valide.';
    }
    if (step === 1) {
      if (password.length < 6) return 'Mot de passe : 6 caractères minimum.';
      if (password !== confirm) return 'Les mots de passe ne correspondent pas.';
    }
    if (step === 2 && firstName.trim().length < 1) return 'Entrez votre prénom.';
    if (step === 3 && !avatarId) return 'Choisissez un avatar.';
    return null;
  }

  function next() {
    const err = validStep();
    if (err) { setError(err); return; }
    setError('');
    if (step < STEPS.length - 1) setStep(step + 1);
    else submit();
  }
  function back() { setError(''); setStep(Math.max(0, step - 1)); }

  async function submit() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, firstName: firstName.trim(), avatarId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Inscription impossible.');
        if (res.status === 409) setStep(0);
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

  const pct = ((step + 1) / STEPS.length) * 100;

  return (
    <main className="auth-split">
      <aside className="auth-aside auth-aside--green">
        <span className="ablob x1" /><span className="ablob x2" />
        <Link href="/" className="aside-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Retour au site
        </Link>
        <div>
          <div className="aside-brand"><span className="porthole" />Wash<span className="amp">&amp;</span>eat</div>
          <h2 className="aside-title">Créez votre<br />compte en 1 min.</h2>
          <ol className="stepper">
            {STEPS.map((s, i) => (
              <li key={s.label} className={i === step ? 'active' : i < step ? 'done' : ''}>
                <span className="st-dot">
                  {i < step
                    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    : i + 1}
                </span>
                <span className="st-label"><b>{s.label}</b><span>{s.sub}</span></span>
              </li>
            ))}
          </ol>
        </div>
        <p className="aside-foot">Déjà un compte ? <Link href="/login" style={{ color: '#fff', fontWeight: 700 }}>Se connecter</Link></p>
      </aside>

      <section className="auth-main">
        <div className="auth-panel">
          <div className="wiz-progress">
            <div className="wp-top">
              <span className="wp-step">Étape {step + 1} / {STEPS.length}</span>
              <span className="wp-name">{STEPS[step].label}</span>
            </div>
            <div className="wiz-bar"><i style={{ width: `${pct}%` }} /></div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {step === 0 && (
            <div className="field">
              <label htmlFor="phone">Numéro de téléphone</label>
              <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78"
                value={phone} autoFocus
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                onKeyDown={(e) => { if (e.key === 'Enter') next(); }} />
              <p className="hint">On l&apos;utilise pour vous prévenir quand votre linge est prêt.</p>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="field">
                <label htmlFor="password">Mot de passe</label>
                <input id="password" type="password" autoComplete="new-password" placeholder="••••••••"
                  value={password} autoFocus onChange={(e) => setPassword(e.target.value)} />
                <p className="hint">6 caractères minimum.</p>
              </div>
              <div className="field">
                <label htmlFor="confirm">Confirmer le mot de passe</label>
                <input id="confirm" type="password" autoComplete="new-password" placeholder="••••••••"
                  value={confirm} onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') next(); }} />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="field">
              <label htmlFor="firstName">Votre prénom</label>
              <input id="firstName" type="text" autoComplete="given-name" placeholder="Camille"
                value={firstName} autoFocus onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') next(); }} />
              <p className="hint">C&apos;est comme ça qu&apos;on vous dira bonjour.</p>
            </div>
          )}

          {step === 3 && (
            <>
              {avatarId && (
                <div className="avatar-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="big"><img src={avatarUrl(avatarId)!} alt="Avatar choisi" /></div>
                </div>
              )}
              <AvatarPicker value={avatarId} onChange={setAvatarId} />
            </>
          )}

          <div className="wizard-actions">
            {step > 0 && (
              <button type="button" className="btn btn-ghost" onClick={back} disabled={loading}>Retour</button>
            )}
            <button type="button" className="btn btn-primary" onClick={next} disabled={loading}>
              {loading ? 'Création…' : step === STEPS.length - 1 ? 'Créer mon compte' : 'Continuer'}
            </button>
          </div>

          <p className="auth-foot">Déjà un compte ? <Link href="/login">Se connecter</Link></p>
        </div>
      </section>
    </main>
  );
}
