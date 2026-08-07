import type { Metadata } from 'next';
import SubNav from '@/components/SubNav';
import SubFooter from '@/components/SubFooter';
import FranchiseForm from '@/components/FranchiseForm';
import Icon from '@/components/Icon';

export const metadata: Metadata = {
  title: 'Nous rejoindre · Devenir franchisé Wash&eat',
  description: 'Ouvrez votre laverie connectée Wash&eat. Un concept clé en main, rentable et éco-responsable.',
};

const WHY = [
  { icon: 'M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5', title: 'Concept clé en main', body: 'Machines connectées, appli, comptoir café et identité de marque : tout est prêt, vous vous concentrez sur votre local.' },
  { icon: 'M3 3v18h18M7 15l4-4 3 3 5-6', title: 'Un modèle rentable', body: 'Deux sources de revenus complémentaires · laverie 24h/24 et café · pour lisser l’activité sur toute la journée.' },
  { icon: 'M12 2s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11Z', title: 'Éco-responsable', body: 'Un positionnement moderne qui parle aux clients : moins d’eau, zéro plastique, lessive éco-certifiée.' },
  { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75', title: 'Accompagnés de A à Z', body: 'Recherche de local, aménagement, formation, marketing et support : notre équipe vous suit à chaque étape.' },
];

const STEPS = [
  { n: '01', title: 'Prise de contact', body: 'Vous remplissez le formulaire, on échange sur votre projet et votre zone.' },
  { n: '02', title: 'Étude & local', body: 'On valide ensemble l’emplacement, le budget et le potentiel du secteur.' },
  { n: '03', title: 'Aménagement & formation', body: 'Installation des machines et du comptoir, formation à l’appli et au concept.' },
  { n: '04', title: 'Ouverture', body: 'On lance votre laverie Wash&eat, avec un coup de pouce marketing pour démarrer fort.' },
];

export default function FranchisePage() {
  return (
    <>
      <SubNav />
      <main>
        <section className="page-hero page-hero--coral">
          <span className="blob pb1" /><span className="blob pb2" />
          <div className="container">
            <span className="eyebrow" style={{ color: 'var(--coral)' }}><Icon name="handshake" /> Nous rejoindre</span>
            <h1>Ouvrez votre laverie<br />nouvelle génération.</h1>
            <p className="page-lead">Wash&amp;eat réinvente la laverie de quartier : connectée, chaleureuse et éco-responsable. Devenez franchisé et portez ce concept dans votre ville, avec notre accompagnement complet.</p>
            <a href="#candidature" className="btn btn-primary">Déposer ma candidature</a>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head"><h2>Pourquoi Wash&amp;eat ?</h2></div>
            <div className="features">
              {WHY.map((w) => (
                <div className="f-card" key={w.title}>
                  <div className="f-icon i-coral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={w.icon} /></svg></div>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head"><h2>Comment ça se passe</h2></div>
            <div className="franchise-steps">
              {STEPS.map((s) => (
                <div className="fstep" key={s.n}>
                  <span className="fstep-num">{s.n}</span>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="candidature" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="lead-wrap">
              <div className="lead-intro">
                <h2>Parlons de votre projet</h2>
                <p>Remplissez ce formulaire : notre équipe franchise vous recontacte sous 48h. Une question directe ? Écrivez-nous à <a href="mailto:franchise@washeat.fr">franchise@washeat.fr</a>.</p>
              </div>
              <FranchiseForm />
            </div>
          </div>
        </section>
      </main>
      <SubFooter />
    </>
  );
}
