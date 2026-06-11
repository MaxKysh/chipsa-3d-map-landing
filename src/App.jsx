/* Chipsa map landing — App. Holds language, composes the page.
   The design's tweak defaults are fixed here: teal accent, video hero, reveals on. */
import React from 'react';
import { COPY } from './data/copy.js';
import { Nav, MobileNav, Hero } from './components/Hero.jsx';
import { Demo } from './components/Demo.jsx';
import { What, Value, Niches, Process, About, CTA, SiteFooter } from './components/Sections.jsx';
import { initSmoothScroll } from './lib/smoothScroll.js';

const HERO_MODE = 'video'; // 'video' | 'wash'
const REVEAL = true;

export default function App() {
  // Language from the URL path: /ru → Russian, everything else (/en, /) → English.
  // Each language is its own page (/en, /ru) with its own SEO/OG meta.
  const lang = React.useMemo(() => {
    try {
      const p = window.location.pathname;
      if (p === '/ru' || p.startsWith('/ru/')) return 'ru';
    } catch (e) {}
    return 'en';
  }, []);

  React.useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  React.useEffect(() => initSmoothScroll(), []);

  const copy = COPY[lang];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  };

  return (
    <div className={REVEAL ? 'cl-root' : 'cl-root reveal-off'}>
      <Nav t={copy} onContact={() => scrollTo('contact')} />
      <MobileNav t={copy} onContact={() => scrollTo('contact')} />
      <main>
        <Hero t={copy} heroMode={HERO_MODE} onContact={() => scrollTo('contact')} onDemo={() => window.open('https://3d-plan.chipsa.ru/', '_blank', 'noopener,noreferrer')} />
        <What t={copy} />
        <Value t={copy} />
        <Demo t={copy} />
        <Niches t={copy} />
        <Process t={copy} />
        <About t={copy} />
        <CTA t={copy} />
      </main>
      <SiteFooter t={copy} />
    </div>
  );
}
