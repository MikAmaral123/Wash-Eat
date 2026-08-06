import type { Metadata } from 'next';
import Link from 'next/link';
import SubNav from '@/components/SubNav';
import SubFooter from '@/components/SubFooter';

export const metadata: Metadata = {
  title: 'FAQ · Wash&eat',
  description: 'Toutes les réponses sur le lavage, l’appli, la fidélité, le comptoir, votre compte et notre engagement éco.',
};

type Cat = { color: string; title: string; icon: React.ReactNode; items: { q: string; a: string }[] };

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const CATS: Cat[] = [
  {
    color: 'coral', title: 'Lavage & séchage',
    icon: <svg viewBox="0 0 24 24" {...S}><rect x="4" y="2" width="16" height="20" rx="2" /><circle cx="12" cy="13" r="5" /><path d="M8 6h.01M12 6h.01" /></svg>,
    items: [
      { q: 'Comment lancer une machine ?', a: 'Scannez le QR code de la machine ou réservez-la depuis l’appli, choisissez votre programme et réglez sans contact. Le cycle démarre immédiatement.' },
      { q: 'Puis-je réserver une machine à l’avance ?', a: 'Oui, de 5 à 15 minutes avant le lancement selon votre grade fidélité. Si la machine n’est pas activée dans le délai, la réservation s’annule automatiquement et la machine redevient disponible pour les clients sur place.' },
      { q: 'Comment savoir quand mon linge est prêt ?', a: 'Suivez le cycle en direct dans l’appli et recevez une notification dès qu’il est terminé.' },
      { q: 'Combien de temps dure un cycle ?', a: 'Comptez environ 30 à 45 minutes pour un lavage, et 15 minutes par cycle de séchage.' },
      { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Le paiement se fait sans contact depuis l’appli (carte bancaire et wallets mobiles).' },
    ],
  },
  {
    color: 'sky', title: 'L’application',
    icon: <svg viewBox="0 0 24 24" {...S}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>,
    items: [
      { q: 'Ai-je besoin de l’application ?', a: 'Elle est recommandée pour le suivi, la réservation et la fidélité, mais vous pouvez aussi scanner le QR code directement sur place.' },
      { q: 'Sur quelles plateformes est-elle disponible ?', a: 'Sur iOS et Android.' },
      { q: 'L’application est-elle gratuite ?', a: 'Oui, le téléchargement et l’utilisation sont gratuits.' },
    ],
  },
  {
    color: 'green', title: 'Fidélité & points',
    icon: <svg viewBox="0 0 24 24" {...S}><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></svg>,
    items: [
      { q: 'Comment gagner des points ?', a: '1 € dépensé = 10 points, sur le lavage comme au comptoir. Bonus : +50 points à la création du compte, +100 pour votre anniversaire, +20 sur les créneaux en heures creuses, +30 pour un combo machine + snack, et +200 par parrainage validé.' },
      { q: 'À quoi servent les points ?', a: 'Ils s’échangent dans la boutique de l’appli : boissons, snacks, doypack de lessive éco, cycles de séchage et lavages offerts.' },
      { q: 'Comment fonctionnent les grades ?', a: 'Il existe quatre grades : Snacker, Gourmet, Chef et Foodie VIP. Plus vous cumulez de points, plus vous débloquez d’avantages : réservation anticipée, réductions permanentes et cadeaux.' },
      { q: 'Mes points expirent-ils ?', a: 'Non, vos points restent acquis tant que votre compte reste actif.' },
    ],
  },
  {
    color: 'amber', title: 'Le comptoir & café',
    icon: <svg viewBox="0 0 24 24" {...S}><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" /><path d="M6 2v2M10 2v2M14 2v2" /></svg>,
    items: [
      { q: 'Que propose le comptoir ?', a: 'Un café torréfié localement, des boissons fraîches et des snacks sucrés ou salés, disponibles à toute heure.' },
      { q: 'Puis-je travailler ou patienter sur place ?', a: 'Oui : wi-fi gratuit, prises à chaque place, grande table et espace repos confortable le temps de votre lessive.' },
      { q: 'Faut-il consommer pour rester ?', a: 'Non, l’espace de vie est ouvert à tous pendant votre cycle.' },
    ],
  },
  {
    color: 'coral', title: 'Compte & sécurité',
    icon: <svg viewBox="0 0 24 24" {...S}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>,
    items: [
      { q: 'Comment créer un compte ?', a: 'Avec votre numéro de téléphone et un mot de passe. Le numéro est vérifié par un code envoyé par SMS, puis vous renseignez votre prénom, votre date de naissance et choisissez un avatar.' },
      { q: 'Pourquoi vérifier mon numéro ?', a: 'Pour sécuriser votre compte et pouvoir vous prévenir quand votre linge est prêt.' },
      { q: 'Comment changer mon numéro ou mon mot de passe ?', a: 'Depuis votre compte, dans la section Paramètres. Le changement de numéro demande une nouvelle vérification par code SMS.' },
      { q: 'Mes données sont-elles protégées ?', a: 'Vos mots de passe sont chiffrés et votre numéro n’est utilisé que pour le service.' },
    ],
  },
  {
    color: 'green', title: 'Éco-responsabilité',
    icon: <svg viewBox="0 0 24 24" {...S}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6" /></svg>,
    items: [
      { q: 'En quoi Wash&eat est éco-responsable ?', a: 'Nos machines consomment 38 % d’eau en moins par cycle, nous bannissons le plastique de lessive à usage unique et n’utilisons qu’une lessive éco-certifiée.' },
      { q: 'Quelle lessive utilisez-vous ?', a: 'Une lessive biodégradable et éco-certifiée, sans phosphates ni colorants inutiles, douce pour le linge et pour l’eau.' },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <SubNav />
      <main>
        <section className="page-hero page-hero--sky">
          <span className="blob pb1" /><span className="blob pb2" />
          <div className="container">
            <span className="eyebrow" style={{ color: 'var(--sky)' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" {...S}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
              Centre d’aide
            </span>
            <h1>Questions fréquentes</h1>
            <p className="page-lead">Tout ce qu’il faut savoir sur Wash&amp;eat. Une question sans réponse ? Écrivez-nous à <a href="mailto:support@washeat.fr">support@washeat.fr</a>.</p>
          </div>
        </section>

        <section className="section faq">
          <div className="container">
            {CATS.map((cat) => (
              <div className="faq-cat" key={cat.title}>
                <div className="faq-cat-head">
                  <span className={`faq-cat-ic i-${cat.color}`}>{cat.icon}</span>
                  <h2>{cat.title}</h2>
                </div>
                <div className="faq-list">
                  {cat.items.map((it) => (
                    <details className="faq-item" key={it.q}>
                      <summary>
                        <span>{it.q}</span>
                        <svg className="faq-chevron" viewBox="0 0 24 24" {...S}><path d="m6 9 6 6 6-6" /></svg>
                      </summary>
                      <p>{it.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            <div className="faq-contact">
              <span className="faq-cat-ic i-coral">
                <svg viewBox="0 0 24 24" {...S}><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="m22 6-10 7L2 6" /></svg>
              </span>
              <div>
                <h3>Vous ne trouvez pas votre réponse ?</h3>
                <p>Notre équipe vous répond sous 24h.</p>
              </div>
              <a href="mailto:support@washeat.fr" className="btn btn-primary">Nous contacter</a>
            </div>
          </div>
        </section>
      </main>
      <SubFooter />
    </>
  );
}
