/* Chipsa map landing — Nav + Hero. */
import React from 'react';
import { Button } from './ds.jsx';
import { Reveal, Frame } from './primitives.jsx';
import { ASSETS } from '../data/assets.js';

function LangToggle({ lang, setLang }) {
  return (
    <div className="cl-lang">
      {['ru', 'en'].map((o) => (
        <button key={o} onClick={() => setLang(o)} className={lang === o ? 'is-active' : ''} aria-pressed={lang === o}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function Nav({ t, lang, setLang, onContact }) {
  const [onLight, setOnLight] = React.useState(false);
  React.useEffect(() => {
    const read = () => {
      // sample what sits just below the nav bar
      const probeY = 36;
      const els = document.elementsFromPoint(window.innerWidth / 2, probeY);
      let light = false;
      for (const el of els) {
        const sec = el.closest && el.closest('.cl-section, .cl-hero, .cl-cta');
        if (sec) { light = sec.classList.contains('surface-invert'); break; }
      }
      setOnLight(light);
    };
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read, { passive: true });
    const id = setTimeout(read, 60);
    read();
    return () => { window.removeEventListener('scroll', read); window.removeEventListener('resize', read); clearTimeout(id); };
  }, []);

  return (
    <header className={`cl-nav${onLight ? ' cl-nav--on-light' : ''}`}>
      <div className="cl-nav__inner shell">
        <a href="#top" className="cl-nav__logo" aria-label="Chipsa">
          <img src={ASSETS.logo} alt="Chipsa iGaming" />
        </a>
        <nav className="cl-nav__links">
          {t.nav.links.map((l) => (
            <a key={l.key} href={'#' + l.key} className="link">{l.label}</a>
          ))}
        </nav>
        <div className="cl-nav__right">
          <LangToggle lang={lang} setLang={setLang} />
          <Button size="sm" variant="primary" icon onClick={onContact}>{t.nav.cta}</Button>
        </div>
      </div>
    </header>
  );
}

/* split a headline line so the highlight phrase renders with the brand gradient */
function renderLine(line, highlight) {
  if (!highlight || !line.includes(highlight)) return line;
  const i = line.indexOf(highlight);
  return (
    <>
      {line.slice(0, i)}
      <span className="ink-grad">{highlight}</span>
      {line.slice(i + highlight.length)}
    </>
  );
}

export function Hero({ t, heroMode, onContact, onDemo }) {
  const h = t.hero;
  const title = (
    <h1 className="cl-hero__title">
      {h.title.map((line, idx) => (
        <span key={idx} className="cl-hero__line">{renderLine(line, h.highlight)}</span>
      ))}
    </h1>
  );

  if (heroMode === 'wash') {
    return (
      <section className="cl-hero cl-hero--wash" id="top">
        <div className="cl-hero__atmos" aria-hidden="true" />
        <div className="shell cl-hero__grid">
          <div className="cl-hero__copy">
            <Reveal>{title}</Reveal>
            <Reveal delay={1} as="p" className="cl-hero__lead">{h.lead}</Reveal>
            <Reveal delay={2} className="cl-hero__actions">
              <Button size="lg" variant="primary" icon onClick={onDemo}>{h.primary}</Button>
              <Button size="lg" variant="ghost" icon onClick={onContact}>{h.secondary}</Button>
            </Reveal>
          </div>
          <Reveal delay={2} className="cl-hero__scene">
            <Frame video={ASSETS.hero3d} ratio="3 / 4" topRule />
          </Reveal>
        </div>
      </section>
    );
  }

  /* default: full-bleed looping video behind the headline */
  return (
    <section className="cl-hero cl-hero--video" id="top">
      <video className="cl-hero__video" src={ASSETS.hero3d} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      <div className="cl-hero__scrim" aria-hidden="true" />
      <div className="shell cl-hero__content">
        <Reveal>{title}</Reveal>
        <Reveal delay={1} as="p" className="cl-hero__lead">{h.lead}</Reveal>
        <Reveal delay={2} className="cl-hero__actions">
          <Button size="lg" variant="primary" icon onClick={onDemo}>{h.primary}</Button>
          <Button size="lg" variant="invert" icon onClick={onContact}>{h.secondary}</Button>
        </Reveal>
      </div>
    </section>
  );
}
