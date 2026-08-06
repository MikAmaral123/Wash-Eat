'use client';
import { useEffect } from 'react';

const EN: Record<string, string> = {
  'nav.services': 'Services', 'nav.how': 'How it works', 'nav.rewards': 'Rewards', 'nav.counter': 'The counter',
  'nav.open': 'Open 24/7', 'nav.login': 'Log in', 'nav.download': 'Download', 'drawer.download': 'Download the app',
  'hero.eyebrow': '🫧 The connected laundromat',
  'hero.title': 'We wash.<br>You live.<br><span class="amp">&amp;</span> you treat yourself.',
  'hero.lead': "Start a machine from your phone, grab a coffee, enjoy the free wi-fi. We ping you when your laundry's done. Open day and night.",
  'hero.btnDl': 'Download the app', 'hero.btnFind': 'Find a laundromat',
  'hero.fact1': '24/7', 'hero.fact2': 'Free Wi-Fi', 'hero.fact3': 'Contactless payment',
  'mc.sub': 'Washer · 8 kg', 'mc.tag': 'Washing', 'mc.left': 'Left', 'mc.track': 'Track',
  'feat.eyebrow': 'Everything on site', 'feat.title': 'More than a laundromat.',
  'feat.sub': "While your laundry spins, everything's set for a good time.",
  'f1t': 'Connected wash &amp; dry', 'f1d': 'Machines run from the app. Pick your cycle, pay, off you go.',
  'f2t': 'Machine booking', 'f2d': 'Spot a free machine in real time and reserve it before you come. Zero wait.',
  'f3t': 'Tracking &amp; alerts', 'f3d': "Follow the cycle live and get an alert when your laundry's ready.",
  'f4t': 'Drinks &amp; snacks', 'f4d': 'Vending for cold drinks, hot drinks and snacks, available any time.',
  'f5t': 'Free Wi-Fi', 'f5d': 'Fast connection and outlets everywhere. Work or stream while you wash.',
  'f6t': 'Lounge &amp; coworking', 'f6d': 'A comfy corner to sit, read, work or chat during a cycle.',
  'how.eyebrow': 'How it works', 'how.title': 'Your laundromat, in your pocket.',
  's1t': 'Install the app', 's1d': 'Scan the QR code in the laundromat to download the app. It’s required to start a machine.',
  's2t': 'Pick &amp; pay contactless', 's2d': 'Choose a free machine and your cycle from the app. Pay in two taps, then relax.',
  's3t': 'We let you know', 's3d': "A notification when it's done. In the time for a coffee, your laundry's clean and soft.",
  'qr.title': 'Scan to install the app', 'qr.sub': 'One central screen runs machines &amp; vending',
  'loy.eyebrow': 'Loyalty program', 'loy.title': 'Earn points, level up your grade.',
  'loy.text': 'Spend €1, get 10 points — on laundry and at the counter. Redeem them for free coffees, snacks, dries and washes. The more you earn, the more your grade unlocks.',
  'loy.btn': 'Join the program', 'loy.card': 'My points balance', 'loy.foot': '🏆 Snacker · Gourmet · Chef · Foodie VIP',
  'mi1': 'Flat white', 'mi2': 'Fresh juice', 'mi3': 'Homemade cookie', 'mi4': 'Avocado toast',
  'cafe.eyebrow': 'The counter &amp; living space', 'cafe.title': 'Coffee, a cosy corner, wi-fi.',
  'cafe.lead': 'Locally roasted coffee, drink and snack vending any time, a big table, outlets and free wi-fi. A lounge to wait comfortably while the machine does the rest.',
  'cl1': 'Fast Wi-Fi &amp; outlets at every seat', 'cl2': 'Drink &amp; snack vending 24/7', 'cl3': 'Lounge &amp; coworking', 'cafe.btn': 'See the menu',
  'eco.eyebrow': 'Eco-friendly', 'eco.title': 'Clean for you, gentle on the planet.',
  'eco.s1': 'less water per cycle', 'eco.s2': 'green electricity', 'eco.s3': 'detergent plastic',
  'cta.title': 'Ready to wash differently?', 'cta.text': 'Download the app, find your laundromat, and take time to live.',
  'store.a.small': 'Download on the', 'store.g.small': 'Get it on',
  'foot.tag': 'The connected laundromat that smells of good coffee. We wash, you live.',
  'foot.open': 'Open 24/7', 'foot.hServices': 'Services', 'foot.hHelp': 'Help',
  'foot.s1': 'Wash &amp; dry', 'foot.s2': 'The counter', 'foot.s3': 'Rewards', 'foot.s4': 'The app',
  'foot.b1': 'Our locations', 'foot.b2': 'Eco pledge', 'foot.b3': 'Join us', 'foot.b4': 'Press',
  'foot.h1': 'Support', 'foot.h2': 'FAQ', 'foot.h3': 'Contact', 'foot.h4': 'Terms',
  'foot.bottom': '© 2026 Wash&amp;eat · The connected laundromat.',
  'modal.eyebrow': 'The counter', 'modal.title': 'Our menu',
  'modal.intro': 'Locally roasted coffee, fresh drinks and small bites any time, during a cycle.',
  'modal.cat1': 'Coffee &amp; hot drinks', 'modal.cat2': 'Fresh', 'modal.cat3': 'Small bites',
  'm.espresso': 'Single or double', 'm.flat': 'Our signature', 'm.capp': 'Silky foam', 'm.choco': 'Homemade hot chocolate',
  'm.jus': 'Fresh juice of the day<small>Orange · apple · seasonal</small>', 'm.limo': 'Craft lemonade', 'm.eau': 'Infused water',
  'm.cookie': 'Homemade cookie<small>Chocolate chips</small>', 'm.tartine': 'Avocado toast<small>Country bread, poached egg</small>', 'm.muffin': 'Muffin of the day',
};

export default function Enhancers() {
  useEffect(() => {
    const $ = (s: string) => document.querySelector(s);
    const $$ = (s: string) => Array.from(document.querySelectorAll(s));

    // Mobile drawer
    const burger = document.getElementById('burger');
    const drawer = document.getElementById('drawer');
    const onBurger = () => drawer?.classList.toggle('open');
    burger?.addEventListener('click', onBurger);
    drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

    // Menu modal
    const modal = document.getElementById('menuModal');
    const openBtn = document.getElementById('openMenu');
    const openModal = () => { modal?.classList.add('open'); modal?.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const closeModal = () => { modal?.classList.remove('open'); modal?.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    openBtn?.addEventListener('click', openModal);
    modal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal(); };
    document.addEventListener('keydown', onKey);

    // i18n
    const FR: Record<string, string> = {};
    $$('[data-i18n]').forEach(el => { FR[el.getAttribute('data-i18n')!] = (el as HTMLElement).innerHTML; });
    const setLang = (lang: string) => {
      const dict = lang === 'en' ? EN : FR;
      $$('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n')!;
        if (dict[k] != null) (el as HTMLElement).innerHTML = dict[k];
      });
      document.documentElement.lang = lang;
      $$('.lang-toggle .lt-opt').forEach(o => o.classList.toggle('active', (o as HTMLElement).dataset.lang === lang));
      try { localStorage.setItem('washeat-lang', lang); } catch {}
    };
    $$('.lang-toggle .lt-opt').forEach(o => o.addEventListener('click', () => setLang((o as HTMLElement).dataset.lang!)));
    let saved = 'fr';
    try { saved = localStorage.getItem('washeat-lang') || 'fr'; } catch {}
    setLang(saved);

    // Progress ring
    const prog = $('.ring .prog') as SVGCircleElement | null;
    if (prog) {
      const circ = 2 * Math.PI * 63;
      prog.style.strokeDasharray = String(circ);
      prog.style.transition = 'stroke-dashoffset 1.2s ease';
      requestAnimationFrame(() => { prog.style.strokeDashoffset = String(circ * (1 - 0.62)); });
    }

    return () => {
      burger?.removeEventListener('click', onBurger);
      openBtn?.removeEventListener('click', openModal);
      document.removeEventListener('keydown', onKey);
    };
  }, []);
  return null;
}
