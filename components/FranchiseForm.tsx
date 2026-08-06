'use client';
import { useState } from 'react';
import { formatPhone } from '@/lib/phone';

export default function FranchiseForm() {
  const [f, setF] = useState({ fullName: '', email: '', phone: '', city: '', message: '' });
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = k === 'phone' ? formatPhone(e.target.value) : e.target.value;
    setF({ ...f, [k]: v });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    setError('');
    try {
      const res = await fetch('/api/franchise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || 'Envoi impossible. Vérifiez vos informations.');
        setState('error');
        return;
      }
      setState('ok');
    } catch {
      setError('Erreur réseau. Réessayez.');
      setState('error');
    }
  }

  if (state === 'ok') {
    return (
      <div className="form-success">
        <div className="fs-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg></div>
        <h3>Candidature envoyée 🎉</h3>
        <p>Merci {f.fullName.split(' ')[0]} ! Notre équipe franchise vous recontacte sous 48h à {f.email}.</p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit}>
      {error && <div className="auth-error">{error}</div>}
      <div className="field">
        <label htmlFor="fullName">Nom complet *</label>
        <input id="fullName" required value={f.fullName} onChange={set('fullName')} placeholder="Camille Durand" />
      </div>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="email">Email *</label>
          <input id="email" type="email" required value={f.email} onChange={set('email')} placeholder="camille@email.com" />
        </div>
        <div className="field">
          <label htmlFor="phone">Téléphone</label>
          <input id="phone" type="tel" value={f.phone} onChange={set('phone')} placeholder="06 12 34 56 78" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="city">Ville / zone visée</label>
        <input id="city" value={f.city} onChange={set('city')} placeholder="Lyon, Part-Dieu" />
      </div>
      <div className="field">
        <label htmlFor="message">Votre projet</label>
        <textarea id="message" rows={4} value={f.message} onChange={set('message')} placeholder="Parlez-nous de vous et de votre projet…" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? 'Envoi…' : 'Envoyer ma candidature'}
      </button>
    </form>
  );
}
