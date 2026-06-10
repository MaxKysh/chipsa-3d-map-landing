/* Chipsa map landing — App. Holds language, composes the page.
   The design's tweak defaults are fixed here: teal accent, video hero, reveals on. */
import React from 'react';
import { COPY } from './data/copy.js';
import { Nav, Hero } from './components/Hero.jsx';
import { Demo } from './components/Demo.jsx';
import { What, Value, Niches, Process, About, CTA, SiteFooter } from './components/Sections.jsx';

const HERO_MODE = 'video'; // 'video' | 'wash'
const REVEAL = true;

export default function App() {
  const [lang, setLang] = React.useState(() => {
    try { return localStorage.getItem('chipsa_map_lang') || 'ru'; } catch (e) { return 'ru'; }
  });

  React.useEffect(() => {
    try { localStorage.setItem('chipsa_map_lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
  }, [lang]);

  const copy = COPY[lang];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  };

  return (
    <div className={REVEAL ? 'cl-root' : 'cl-root reveal-off'}>
      <Nav t={copy} lang={lang} setLang={setLang} onContact={() => scrollTo('contact')} />
      <main>
        <Hero t={copy} heroMode={HERO_MODE} onContact={() => scrollTo('contact')} onDemo={() => scrollTo('demo')} />
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
