'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AvatarPicker from '@/components/AvatarPicker';
import { avatarUrl } from '@/lib/avatars';
import { formatPhone } from '@/lib/phone';

const STEPS = [
  { label: 'Téléphone', sub: 'Votre numéro' },
  { label: 'Vérification', sub: 'Code reçu par SMS' },
  { label: 'Mot de passe', sub: 'Sécurisez le compte' },
  { label: 'Profil', sub: 'Prénom & anniversaire' },
  { label: 'Avatar', sub: 'Choisissez votre style' },
];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [avatarId, setAvatarId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    const res = await fetch('/api/otp/send', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, purpose: 'signup' }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Envoi du code impossible.');
    setDevCode(data.devCode ?? null);
  }

  async function next() {
    setError('');
    // Step 0: phone -> send code
    if (step === 0) {
      if (phone.replace(/\D/g, '').length < 9) { setError('Entrez un numéro de téléphone valide.'); return; }
      setLoading(true);
      try { await sendCode(); setStep(1); }
      catch (e) { setError((e as Error).message); }
      finally { setLoading(false); }
      return;
    }
    // Step 1: verify code
    if (step === 1) {
      if (!/^\d{6}$/.test(code.trim())) { setError('Entrez le code à 6 chiffres.'); return; }
      setLoading(true);
      try {
        const res = await fetch('/api/otp/verify', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, purpose: 'signup', code: code.trim() }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Code incorrect.'); return; }
        setStep(2);
      } catch { setError('Erreur réseau. Réessayez.'); }
      finally { setLoading(false); }
      return;
    }
    if (step === 2) {
      if (password.length < 6) { setError('Mot de passe : 6 caractères minimum.'); return; }
      if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
      setStep(3); return;
    }
    if (step === 3) {
      if (firstName.trim().length < 1) { setError('Entrez votre prénom.'); return; }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) { setError('Entrez votre date de naissance.'); return; }
      if (birthdate > new Date().toISOString().slice(0, 10)) { setError('Date de naissance invalide.'); return; }
      setStep(4); return;
    }
    if (step === 4) {
      if (!avatarId) { setError('Choisissez un avatar.'); return; }
      submit();
    }
  }

  function back() { setError(''); setStep(Math.max(0, step - 1)); }

  async function resend() {
    setError(''); setLoading(true);
    try { await sendCode(); } catch (e) { setError((e as Error).message); } finally { setLoading(false); }
  }

  async function submit() {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, firstName: firstName.trim(), avatarId, birthdate }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Inscription impossible.');
        if (res.status === 409) setStep(0);
        return;
      }
      router.push('/account');
      router.refresh();
    } catch { setError('Erreur réseau. Réessayez.'); }
    finally { setLoading(false); }
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
              <p className="hint">On vous envoie un code à 6 chiffres pour vérifier ce numéro.</p>
            </div>
          )}

          {step === 1 && (
            <div className="field">
              <label htmlFor="code">Code de vérification</label>
              <input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456"
                className="code-input" value={code} autoFocus
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => { if (e.key === 'Enter') next(); }} />
              <p className="hint">Envoyé au {phone}. <button type="button" className="linklike" onClick={resend} disabled={loading}>Renvoyer le code</button></p>
              {devCode && <div className="dev-code">Mode démo · votre code : <b>{devCode}</b></div>}
            </div>
          )}

          {step === 2 && (
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

          {step === 3 && (
            <>
              <div className="field">
                <label htmlFor="firstName">Votre prénom</label>
                <input id="firstName" type="text" autoComplete="given-name" placeholder="Camille"
                  value={firstName} autoFocus onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="birthdate">Date de naissance</label>
                <input id="birthdate" type="date" max={new Date().toISOString().slice(0, 10)}
                  value={birthdate} onChange={(e) => setBirthdate(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') next(); }} />
                <p className="hint">🎂 On vous offre +100 points chaque année pour votre anniversaire.</p>
              </div>
            </>
          )}

          {step === 4 && (
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
              {loading ? '…' : step === 0 ? 'Recevoir le code' : step === STEPS.length - 1 ? 'Créer mon compte' : 'Continuer'}
            </button>
          </div>

          <p className="auth-foot">Déjà un compte ? <Link href="/login">Se connecter</Link></p>
        </div>
      </section>
    </main>
  );
}
