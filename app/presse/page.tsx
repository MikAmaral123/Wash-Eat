import type { Metadata } from 'next';
import SubNav from '@/components/SubNav';
import SubFooter from '@/components/SubFooter';
import CopyBlock from '@/components/CopyBlock';
import Icon from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Presse · Wash&eat',
  description: 'Kit presse Wash&eat : logo, palette, photos, chiffres clés et contact presse.',
};

const BOILERPLATE =
  'Wash&eat est la laverie connectée qui sent bon le café. On y lance sa machine depuis son téléphone, on suit son cycle en temps réel, et on patiente autour d’un café dans un espace cosy avec wi-fi. Ouvertes 24h/24, les laveries Wash&eat conjuguent praticité, convivialité et engagement écologique : −38% d’eau par cycle, zéro plastique lessive et une lessive éco-certifiée.';

const FACTS = [
  { k: 'Concept', v: 'Laverie connectée + comptoir café' },
  { k: 'Fondée', v: '2026' },
  { k: 'Horaires', v: 'Ouvert 24h/24 · 7/7' },
  { k: 'Appli', v: 'iOS & Android' },
  { k: 'Éco', v: '−38% d’eau · 0 plastique · lessive éco-certifiée' },
  { k: 'Contact presse', v: 'presse@washeat.fr' },
];

const DOWNLOADS = [
  { title: 'Logo (SVG)', desc: 'Logo vectoriel sur fond crème.', href: '/presse/washeat-logo.svg', file: 'washeat-logo.svg' },
  { title: 'Palette (SVG)', desc: 'Couleurs de marque avec codes hex.', href: '/presse/washeat-palette.svg', file: 'washeat-palette.svg' },
  { title: 'Photo laverie (PNG)', desc: 'Intérieur d’une laverie Wash&eat.', href: '/assets/hero-shop.png', file: 'washeat-laverie.png' },
];

export default function PressePage() {
  return (
    <>
      <SubNav />
      <main>
        <section className="page-hero page-hero--amber">
          <span className="blob pb1" /><span className="blob pb2" />
          <div className="container">
            <span className="eyebrow" style={{ color: 'var(--amber)' }}><Icon name="newspaper" /> Espace presse</span>
            <h1>Kit presse Wash&amp;eat</h1>
            <p className="page-lead">Tout ce qu’il faut pour parler de nous : logo, couleurs, photos, chiffres clés et texte de présentation. Une demande spécifique ? Écrivez à <a href="mailto:presse@washeat.fr">presse@washeat.fr</a>.</p>
          </div>
        </section>

        <section className="section">
          <div className="container press-grid">
            <div>
              <h2 className="press-h2">À propos de Wash&amp;eat</h2>
              <CopyBlock text={BOILERPLATE} />
            </div>
            <aside className="facts-card">
              <h3>Chiffres clés</h3>
              <ul>
                {FACTS.map((f) => (
                  <li key={f.k}><span>{f.k}</span><b>{f.v}</b></li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 className="press-h2">Ressources à télécharger</h2>
            <div className="downloads">
              {DOWNLOADS.map((d) => (
                <a className="download-card" key={d.href} href={d.href} download={d.file}>
                  <div className="dl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg></div>
                  <div>
                    <b>{d.title}</b>
                    <span>{d.desc}</span>
                  </div>
                </a>
              ))}
            </div>
            <p className="press-note">Assets fournis pour usage éditorial. Merci de ne pas déformer le logo ni altérer les couleurs de marque.</p>
          </div>
        </section>
      </main>
      <SubFooter />
    </>
  );
}
