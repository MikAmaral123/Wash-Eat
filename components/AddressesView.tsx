'use client';
import { useState } from 'react';
import AddressMap from '@/components/AddressMap';
import { LOCATIONS, mapsDir } from '@/lib/locations';

export default function AddressesView() {
  const [active, setActive] = useState(LOCATIONS[0]?.id);

  return (
    <div className="adr-layout">
      <div className="adr-list">
        {LOCATIONS.map((l) => (
          <button
            type="button"
            key={l.id}
            className={'adr-card' + (l.id === active ? ' active' : '')}
            onClick={() => setActive(l.id)}
          >
            <span className="adr-pin">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            </span>
            <div className="adr-info">
              <h3>{l.name}</h3>
              <p>{l.address}<br />{l.zip} {l.city}</p>
              <span className="adr-hours">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                {l.hours}
              </span>
              <a href={mapsDir(l)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm adr-go" onClick={(e) => e.stopPropagation()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2Z" /></svg>
                Itinéraire
              </a>
            </div>
          </button>
        ))}

        <div className="adr-soon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" /></svg>
          <div><b>Bientôt dans d’autres villes</b><span>De nouvelles laveries Wash&amp;eat ouvrent prochainement.</span></div>
        </div>
      </div>

      <AddressMap activeId={active} />
    </div>
  );
}
