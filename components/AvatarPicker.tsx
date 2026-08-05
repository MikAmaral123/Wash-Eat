'use client';
import { useState } from 'react';
import { AVATARS } from '@/lib/avatars';

export default function AvatarPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (id: string) => void;
}) {
  const [gender, setGender] = useState<'f' | 'm'>('f');
  const list = AVATARS.filter((a) => a.gender === gender);
  return (
    <div>
      <div className="gender-tabs">
        <button type="button" className={gender === 'f' ? 'active' : ''} onClick={() => setGender('f')}>
          Femme
        </button>
        <button type="button" className={gender === 'm' ? 'active' : ''} onClick={() => setGender('m')}>
          Homme
        </button>
      </div>
      <div className="avatar-grid">
        {list.map((a) => (
          <button
            key={a.id}
            type="button"
            className={'avatar-tile' + (value === a.id ? ' sel' : '')}
            onClick={() => onChange(a.id)}
            aria-label={`Avatar ${a.id}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.url} alt="" loading="lazy" />
            <span className="check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
