/* Chipsa map landing — Nav + Hero. */
import React from 'react';
import { Button } from './ds.jsx';
import { Reveal, Frame } from './primitives.jsx';
import { ASSETS } from '../data/assets.js';

/* Mobile nav — a thumb-reach FAB at bottom-right that morphs (burger ↔ X) and
   springs open a menu anchored to the same corner. Replaces the top bar on phones. */
export function MobileNav({ t, onContact }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <div className={`cl-mnav${open ? ' is-open' : ''}`}>
      <div className="cl-mnav__backdrop" onClick={() => setOpen(false)} aria-hidden="true" />

      <nav className="cl-mnav__panel" aria-hidden={!open}>
        <a href="#top" className="cl-mnav__logo" aria-label="Chipsa" onClick={() => setOpen(false)}>
          <img src={ASSETS.logo} alt="Chipsa" />
          <span className="cl-nav__dev">DEV</span>
        </a>
        <ul className="cl-mnav__links">
          {t.nav.links.map((l, i) => (
            <li key={l.key} style={{ '--i': i }}>
              <a href={'#' + l.key} onClick={() => setOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a
          className="cl-mnav__tg"
          href="https://t.me/maxkysh"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          Telegram <span>@maxkysh ↗</span>
        </a>
        <div className="cl-mnav__foot">
          <Button size="sm" variant="primary" icon onClick={() => { setOpen(false); onContact(); }}>{t.nav.cta}</Button>
        </div>
      </nav>

      <button
        className="cl-burger"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="cl-burger__box" aria-hidden="true">
          <span className="cl-burger__line" />
          <span className="cl-burger__line" />
          <span className="cl-burger__line" />
        </span>
      </button>
    </div>
  );
}

export function Nav({ t, onContact }) {
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
          <img src={ASSETS.logo} alt="Chipsa" />
          <span className="cl-nav__dev">DEV</span>
        </a>
        <nav className="cl-nav__links">
          {t.nav.links.map((l) => (
            <a key={l.key} href={'#' + l.key} className="link">{l.label}</a>
          ))}
        </nav>
        <div className="cl-nav__right">
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
      <a className="cl-hero__scroll" href="#what" aria-label={h.scroll}>
        <span className="cl-hero__scroll-label">{h.scroll}</span>
        <span className="cl-hero__scroll-arrow" aria-hidden="true"><i /></span>
      </a>
    </section>
  );
}
