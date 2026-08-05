import Link from 'next/link';

export default function SubNav() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand"><span className="porthole" />Wash<span className="amp">&amp;</span>eat</Link>
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
      </div>
    </header>
  );
}
