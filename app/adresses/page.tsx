import type { Metadata } from 'next';
import SubNav from '@/components/SubNav';
import SubFooter from '@/components/SubFooter';
import AddressesView from '@/components/AddressesView';

export const metadata: Metadata = {
  title: 'Nos adresses · Wash&eat',
  description: 'Trouvez votre laverie connectée Wash&eat. Carte interactive et itinéraire.',
};

export default function AdressesPage() {
  return (
    <>
      <SubNav />
      <main>
        <section className="page-hero page-hero--coral">
          <span className="blob pb1" /><span className="blob pb2" />
          <div className="container">
            <span className="eyebrow" style={{ color: 'var(--coral)' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              Nos adresses
            </span>
            <h1>Trouvez votre laverie.</h1>
            <p className="page-lead">Wash&amp;eat s’installe près de chez vous. Ouvertes jour et nuit, nos laveries connectées vous attendent.</p>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <AddressesView />
          </div>
        </section>
      </main>
      <SubFooter />
    </>
  );
}
