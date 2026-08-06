'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPhone } from '@/lib/phone';

type Flash = { type: 'ok' | 'err'; msg: string } | null;

function Note({ flash }: { flash: Flash }) {
  if (!flash) return null;
  return <div className={flash.type === 'ok' ? 'form-note ok' : 'form-note err'}>{flash.msg}</div>;
}

export default function ProfileSettings({ firstName, phone, birthdate }: { firstName: string; phone: string; birthdate: string | null }) {
  const router = useRouter();

  // First name + birthdate
  const [name, setName] = useState(firstName);
  const [bd, setBd] = useState(birthdate ? String(birthdate).slice(0, 10) : '');
  const [nameFlash, setNameFlash] = useState<Flash>(null);
  const [nameBusy, setNameBusy] = useState(false);
  const profileChanged = name.trim() !== firstName || bd !== (birthdate ? String(birthdate).slice(0, 10) : '');
  async function saveName(e: React.FormEvent) {
    e.preventDefault(); setNameBusy(true); setNameFlash(null);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: name.trim(), birthdate: bd }),
      });
      const d = await res.json();
      if (!res.ok) { setNameFlash({ type: 'err', msg: d.error || 'Échec.' }); return; }
      setNameFlash({ type: 'ok', msg: 'Prénom mis à jour.' });
      router.refresh();
    } catch { setNameFlash({ type: 'err', msg: 'Erreur réseau.' }); }
    finally { setNameBusy(false); }
  }

  // Password
  const [cur, setCur] = useState(''); const [nw, setNw] = useState(''); const [cf, setCf] = useState('');
  const [pwFlash, setPwFlash] = useState<Flash>(null);
  const [pwBusy, setPwBusy] = useState(false);
  async function savePw(e: React.FormEvent) {
    e.preventDefault(); setPwFlash(null);
    if (nw.length < 6) { setPwFlash({ type: 'err', msg: 'Nouveau mot de passe : 6 caractères min.' }); return; }
    if (nw !== cf) { setPwFlash({ type: 'err', msg: 'Les mots de passe ne correspondent pas.' }); return; }
    setPwBusy(true);
    try {
      const res = await fetch('/api/account/password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: cur, newPassword: nw }),
      });
      const d = await res.json();
      if (!res.ok) { setPwFlash({ type: 'err', msg: d.error || 'Échec.' }); return; }
      setPwFlash({ type: 'ok', msg: 'Mot de passe modifié.' });
      setCur(''); setNw(''); setCf('');
    } catch { setPwFlash({ type: 'err', msg: 'Erreur réseau.' }); }
    finally { setPwBusy(false); }
  }

  // Phone change with OTP
  const [editPhone, setEditPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [phFlash, setPhFlash] = useState<Flash>(null);
  const [phBusy, setPhBusy] = useState(false);

  async function sendPhoneCode(e: React.FormEvent) {
    e.preventDefault(); setPhFlash(null);
    if (newPhone.replace(/\D/g, '').length < 9) { setPhFlash({ type: 'err', msg: 'Numéro invalide.' }); return; }
    setPhBusy(true);
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: newPhone, purpose: 'change' }),
      });
      const d = await res.json();
      if (!res.ok) { setPhFlash({ type: 'err', msg: d.error || 'Envoi impossible.' }); return; }
      setSent(true); setDevCode(d.devCode ?? null);
      setPhFlash({ type: 'ok', msg: `Code envoyé au ${newPhone}.` });
    } catch { setPhFlash({ type: 'err', msg: 'Erreur réseau.' }); }
    finally { setPhBusy(false); }
  }

  async function confirmPhone(e: React.FormEvent) {
    e.preventDefault(); setPhFlash(null);
    if (!/^\d{6}$/.test(code.trim())) { setPhFlash({ type: 'err', msg: 'Code à 6 chiffres.' }); return; }
    setPhBusy(true);
    try {
      const res = await fetch('/api/account/phone', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPhone, code: code.trim() }),
      });
      const d = await res.json();
      if (!res.ok) { setPhFlash({ type: 'err', msg: d.error || 'Échec.' }); return; }
      setPhFlash({ type: 'ok', msg: 'Numéro mis à jour.' });
      setEditPhone(false); setSent(false); setNewPhone(''); setCode(''); setDevCode(null);
      router.refresh();
    } catch { setPhFlash({ type: 'err', msg: 'Erreur réseau.' }); }
    finally { setPhBusy(false); }
  }

  return (
    <div className="settings">
      <h2 className="settings-title">Paramètres</h2>

      {/* Profil */}
      <form className="setting-card" onSubmit={saveName}>
        <div className="sc-head"><h3>Profil</h3><span>Prénom & anniversaire.</span></div>
        <div className="sc-body">
          <div className="grid-2">
            <div className="field"><label>Prénom</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre prénom" /></div>
            <div className="field"><label>Date de naissance</label><input type="date" max={new Date().toISOString().slice(0, 10)} value={bd} onChange={(e) => setBd(e.target.value)} /></div>
          </div>
          <Note flash={nameFlash} />
          <button className="btn btn-primary btn-sm" disabled={nameBusy || !profileChanged || !name.trim()}>
            {nameBusy ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </form>

      {/* Mot de passe */}
      <form className="setting-card" onSubmit={savePw}>
        <div className="sc-head"><h3>Mot de passe</h3><span>Choisissez un mot de passe fort.</span></div>
        <div className="sc-body">
          <div className="field"><label>Mot de passe actuel</label><input type="password" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} placeholder="••••••••" /></div>
          <div className="grid-2">
            <div className="field"><label>Nouveau</label><input type="password" autoComplete="new-password" value={nw} onChange={(e) => setNw(e.target.value)} placeholder="••••••••" /></div>
            <div className="field"><label>Confirmer</label><input type="password" autoComplete="new-password" value={cf} onChange={(e) => setCf(e.target.value)} placeholder="••••••••" /></div>
          </div>
          <Note flash={pwFlash} />
          <button className="btn btn-primary btn-sm" disabled={pwBusy || !cur || !nw}>{pwBusy ? 'Enregistrement…' : 'Modifier le mot de passe'}</button>
        </div>
      </form>

      {/* Téléphone */}
      <div className="setting-card">
        <div className="sc-head"><h3>Téléphone</h3><span>Vérifié par code SMS.</span></div>
        <div className="sc-body">
          {!editPhone ? (
            <div className="phone-current">
              <span className="phone-val">{phone}</span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditPhone(true); setPhFlash(null); }}>Modifier</button>
            </div>
          ) : !sent ? (
            <form onSubmit={sendPhoneCode}>
              <div className="field"><label>Nouveau numéro</label>
                <input type="tel" inputMode="tel" value={newPhone} onChange={(e) => setNewPhone(formatPhone(e.target.value))} placeholder="06 12 34 56 78" autoFocus />
              </div>
              <Note flash={phFlash} />
              <div className="sc-actions">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditPhone(false); setPhFlash(null); }}>Annuler</button>
                <button className="btn btn-primary btn-sm" disabled={phBusy}>{phBusy ? 'Envoi…' : 'Envoyer le code'}</button>
              </div>
            </form>
          ) : (
            <form onSubmit={confirmPhone}>
              <div className="field"><label>Code reçu</label>
                <input inputMode="numeric" maxLength={6} className="code-input" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" autoFocus />
              </div>
              {devCode && <div className="dev-code">Mode démo · votre code : <b>{devCode}</b></div>}
              <Note flash={phFlash} />
              <div className="sc-actions">
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setSent(false); setCode(''); }}>Retour</button>
                <button className="btn btn-primary btn-sm" disabled={phBusy}>{phBusy ? 'Validation…' : 'Valider le numéro'}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
