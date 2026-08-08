'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function SubNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <header className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand" onClick={close}><span className="porthole" />Wash<span className="amp">&amp;</span>eat</Link>
          <nav className="nav-links">
            <Link href="/#services">Services</Link>
            <Link href="/#comment">Comment ça marche</Link>
            <Link href="/#fidelite">Fidélité</Link>
            <Link href="/#comptoir">Le comptoir</Link>
          </nav>
          <span className="nav-spacer" />
          <div className="nav-cta">
            <Link href="/login" className="link-login">Se connecter</Link>
            <Link href="/signup" className="btn btn-primary btn-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>
              Télécharger
            </Link>
          </div>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </header>

      <nav className={'drawer' + (open ? ' open' : '')}>
        <Link href="/#services" onClick={close}>Services</Link>
        <Link href="/#comment" onClick={close}>Comment ça marche</Link>
        <Link href="/#fidelite" onClick={close}>Fidélité</Link>
        <Link href="/#comptoir" onClick={close}>Le comptoir</Link>
        <Link href="/login" className="drawer-login" onClick={close}>Se connecter</Link>
        <Link href="/signup" className="drawer-cta btn btn-primary" onClick={close}>Télécharger l’appli</Link>
      </nav>
    </>
  );
}
