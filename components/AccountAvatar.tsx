'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AvatarPicker from '@/components/AvatarPicker';
import { avatarUrl } from '@/lib/avatars';

export default function AccountAvatar({ initialAvatarId }: { initialAvatarId: string | null }) {
  const router = useRouter();
  const [current, setCurrent] = useState<string | null>(initialAvatarId);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(initialAvatarId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  function openModal() { setPicked(current); setError(''); setOpen(true); }

  async function save() {
    if (!picked) { setError('Choisissez un avatar.'); return; }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/account/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarId: picked }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || 'Impossible de changer l’avatar.');
        return;
      }
      setCurrent(picked);
      setOpen(false);
      router.refresh();
    } catch {
      setError('Erreur réseau. Réessayez.');
    } finally {
      setSaving(false);
    }
  }

  const img = avatarUrl(current);

  return (
    <>
      <button type="button" className="avatar-edit" onClick={openModal} aria-label="Changer d’avatar">
        {img && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="Avatar" />
        )}
        <span className="avatar-edit-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
        </span>
      </button>

      {open && (
        <div className="modal open" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={() => setOpen(false)} />
          <div className="modal-card avatar-modal">
            <button className="modal-close" onClick={() => setOpen(false)} aria-label="Fermer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            <h3>Changer d’avatar</h3>
            <p className="avatar-modal-sub">Choisissez le vôtre parmi nos frimousses.</p>
            {picked && (
              <div className="avatar-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <div className="big"><img src={avatarUrl(picked)!} alt="Avatar choisi" /></div>
              </div>
            )}
            <AvatarPicker value={picked} onChange={setPicked} />
            {error && <div className="auth-error" style={{ marginTop: 16 }}>{error}</div>}
            <div className="wizard-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} disabled={saving}>Annuler</button>
              <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
