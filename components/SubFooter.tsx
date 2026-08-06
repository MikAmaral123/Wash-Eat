import Link from 'next/link';

export default function SubFooter() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand"><span className="porthole" />Wash<span className="amp">&amp;</span>eat</div>
          <p>La laverie connectée qui sent bon le café. On lave, vous vivez.</p>
          <span className="open-badge"><span className="dot" />Ouvert 24h/24 · 7/7</span>
        </div>
        <div><h5>Services</h5><ul>
          <li><Link href="/#services">Lavage &amp; séchage</Link></li>
          <li><Link href="/#comptoir">Le comptoir</Link></li>
          <li><Link href="/#fidelite">Fidélité</Link></li>
          <li><Link href="/signup">L&apos;appli</Link></li>
        </ul></div>
        <div><h5>Wash&amp;eat</h5><ul>
          <li><Link href="/#services">Nos adresses</Link></li>
          <li><Link href="/eco-engagement">Éco-engagement</Link></li>
          <li><Link href="/franchise">Nous rejoindre</Link></li>
          <li><Link href="/presse">Presse</Link></li>
        </ul></div>
        <div><h5>Aide</h5><ul>
          <li><Link href="/faq">Support</Link></li>
          <li><Link href="/faq">FAQ</Link></li>
          <li><Link href="/presse">Contact</Link></li>
          <li><Link href="/#services">CGU</Link></li>
        </ul></div>
      </div>
      <div className="container footer-bottom">© 2026 Wash&amp;eat · La laverie connectée.</div>
    </footer>
  );
}
