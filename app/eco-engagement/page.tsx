import type { Metadata } from 'next';
import Link from 'next/link';
import SubNav from '@/components/SubNav';
import SubFooter from '@/components/SubFooter';

export const metadata: Metadata = {
  title: 'Éco-engagement · Wash&eat',
  description: 'Nos engagements concrets : −38% d’eau par cycle, zéro plastique lessive, lessive éco-certifiée.',
};

const PILLARS = [
  {
    tag: 'Eau',
    stat: '−38%',
    unit: 'd’eau par cycle',
    color: 'green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11Z" /></svg>
    ),
    title: 'Moins d’eau, à chaque lavage',
    body: 'Nos machines nouvelle génération lavent aussi bien avec 38% d’eau en moins par cycle qu’une machine classique. L’eau de rinçage est filtrée et réutilisée sur les cycles suivants.',
  },
  {
    tag: 'Déchets',
    stat: '0',
    unit: 'plastique lessive',
    color: 'coral',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
    ),
    title: 'Zéro flacon plastique',
    body: 'La lessive et l’assouplissant sont dosés automatiquement depuis des cuves rechargeables. Fini les bidons plastiques à usage unique : chaque lavage évite un emballage.',
  },
  {
    tag: 'Produits',
    stat: '100%',
    unit: 'lessive éco-certifiée',
    color: 'amber',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>
    ),
    title: 'Une lessive qui respecte la peau et l’eau',
    body: 'Nous n’utilisons que des lessives biodégradables et éco-certifiées, sans phosphates ni colorants inutiles. Douce pour votre linge, douce pour les rivières.',
  },
];

export default function EcoPage() {
  return (
    <>
      <SubNav />
      <main>
        <section className="page-hero page-hero--green">
          <span className="blob pb1" /><span className="blob pb2" />
          <div className="container">
            <span className="eyebrow" style={{ color: 'var(--green)' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>
              Éco-engagement
            </span>
            <h1>Propre pour vous,<br />doux pour la planète.</h1>
            <p className="page-lead">Laver son linge ne devrait pas coûter cher à la planète. Chez Wash&amp;eat, chaque machine est pensée pour consommer moins et polluer moins, sans jamais rogner sur la qualité du lavage.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="eco-stats-row">
              {PILLARS.map((p) => (
                <div className={`eco-stat s-${p.color}`} key={p.tag}>
                  <b>{p.stat}</b><span>{p.unit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="pillars">
              {PILLARS.map((p) => (
                <article className="pillar" key={p.title}>
                  <div className={`f-icon i-${p.color}`}>{p.icon}</div>
                  <span className={`pillar-tag t-${p.color}`}>{p.tag}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="eco-pledge">
              <h2>Notre promesse</h2>
              <ul className="pledge-list">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Mesurer et afficher notre consommation d’eau et d’énergie en toute transparence.</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Bannir le plastique à usage unique de nos laveries.</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Ne travailler qu’avec des lessives biodégradables et éco-certifiées.</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>Privilégier des produits café et snacks locaux et de saison au comptoir.</li>
              </ul>
              <Link href="/signup" className="btn btn-primary">Rejoindre Wash&amp;eat</Link>
            </div>
          </div>
        </section>
      </main>
      <SubFooter />
    </>
  );
}
