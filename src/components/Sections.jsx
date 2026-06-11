/* Chipsa map landing — content sections: What(01), Value(02), Niches(04),
   Process(05, inverted), About(06), CTA, Footer. */
import React from 'react';
import { Section, SectionHead, Frame, Caption, Reveal, Icon } from './primitives.jsx';
import { Stat, ArrowLink, Button } from './ds.jsx';
import { ASSETS } from '../data/assets.js';

/* On-system card: toned surface, small radius, no shadow. Hover lifts the card and
   reveals a cursor-following teal spotlight with faint concentric rings — text stays light. */
function Card({ icon, index, title, body, compact = false }) {
  const ref = React.useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <div ref={ref} className={`cl-card${compact ? ' cl-card--compact' : ''}`} onMouseMove={onMove}>
      <div className="cl-card__inner">
        <div className="cl-card__top">
          {icon && <span className="cl-card__icon"><Icon name={icon} size={compact ? 24 : 28} /></span>}
          {index != null && <span className="cl-card__index">{index}</span>}
        </div>
        <h3 className={compact ? 'cl-card__title cl-card__title--sm' : 'cl-card__title'}>{title}</h3>
        <p className="cl-card__body">{body}</p>
      </div>
    </div>
  );
}

/* 01 — What it is (light) */
export function What({ t }) {
  const w = t.what;
  return (
    <Section id="what" invert>
      <SectionHead num={w.num} kicker={w.kicker} title={w.title} lede={w.lede} invert />
      <div>
        <Reveal className="rv-scale">
          <Frame video={ASSETS.tour} label={w.tour.label} ratio="16 / 9" invert />
        </Reveal>
        <Caption kicker={w.tour.capKicker} invert>{w.tour.cap}</Caption>
      </div>
    </Section>
  );
}

/* 02 — Value (3-up) */
export function Value({ t }) {
  const v = t.value;
  return (
    <Section id="value">
      <SectionHead num={v.num} kicker={v.kicker} title={v.title} lede={v.lede} />
      <div className="cl-grid-3">
        {v.items.map((it, i) => (
          <Reveal key={i} className="rv-scale" style={{ transitionDelay: `${i * 90}ms` }}>
            <Card icon={it.icon} index={String(i + 1).padStart(2, '0')} title={it.title} body={it.body} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 04 — Niches (2-up + full-width row) */
export function Niches({ t }) {
  const n = t.niches;
  return (
    <Section id="niches">
      <SectionHead num={n.num} kicker={n.kicker} title={n.title} lede={n.lede} />
      <div className="cl-grid-niche">
        {n.items.map((it, i) => (
          <Reveal key={i} className="rv-scale" style={{ transitionDelay: `${i * 80}ms` }}>
            <Card icon={it.icon} title={it.title} body={it.body} compact />
          </Reveal>
        ))}
        <Reveal className="cl-niche-full rv-scale" style={{ transitionDelay: `${n.items.length * 80}ms` }}>
          <Card icon={n.full.icon} title={n.full.title} body={n.full.body} compact />
        </Reveal>
      </div>
    </Section>
  );
}

/* 05 — Process. The one inverted (light) section — high-contrast break. */
export function Process({ t }) {
  const p = t.process;
  return (
    <Section id="process" invert>
      <SectionHead num={p.num} kicker={p.kicker} title={p.title} lede={p.lede} invert />
      <div className="cl-process">
        {p.steps.map((s, i) => (
          <Reveal key={i} delay={i % 2 ? 1 : 0} className="cl-process__row">
            <div className="cl-process__lead">
              <span className="cl-process__num">{s.num}</span>
              <span className="cl-process__dur">{s.duration}</span>
            </div>
            <div className="cl-process__main">
              <h3 className="cl-process__title">{s.title}</h3>
              <p className="cl-process__body">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="cl-process__media">
        <Reveal className="rv-scale">
          <Frame src={ASSETS.macbookLive} label={p.macbook.label + ' · ' + p.macbook.name} ratio="16 / 9" invert />
        </Reveal>
        <Caption kicker={p.macbook.capKicker} invert>{p.macbook.cap}</Caption>
      </div>
    </Section>
  );
}

/* 06 — About + stats */
export function About({ t }) {
  const a = t.about;
  return (
    <Section id="studio">
      <SectionHead num={a.num} kicker={a.kicker} title={a.title} />
      <div className="cl-about">
        <Reveal className="cl-about__text">
          {a.paras.map((para, i) => (
            <p key={i}>
              {para[0] && <strong>{para[0]}</strong>}
              {para[1]}
              {para[2] && <a className="link" href={para[2].href} target="_blank" rel="noopener noreferrer">{para[2].label}</a>}
              {para[3]}
            </p>
          ))}
        </Reveal>
        <div className="cl-about__stats">
          {a.stats.map((s, i) => (
            <Reveal key={i} className="rv-scale" style={{ transitionDelay: `${i * 90}ms` }}>
              <Stat value={s.num} label={s.label} grad={i === 0} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* CTA — full-bleed deep band over the crowd photo with a teal protection wash. */
export function CTA({ t }) {
  const c = t.cta;
  return (
    <section className="cl-cta" id="contact" data-screen-label="contact">
      <img className="cl-cta__bg" src={ASSETS.crowd} alt="" aria-hidden="true" width="1920" height="1434" />
      <div className="cl-cta__scrim" aria-hidden="true" />
      <div className="shell cl-cta__grid">
        <Reveal className="cl-cta__head">
          <h2 className="cl-cta__title">{c.title}</h2>
        </Reveal>
        <Reveal delay={1} className="cl-cta__body">
          <p className="cl-cta__note">{c.note}</p>
          <div className="cl-cta__btn">
            <Button size="lg" variant="primary" icon href="https://3d-plan.chipsa.ru/" target="_blank" rel="noopener noreferrer">
              {t.hero.primary}
            </Button>
          </div>
        </Reveal>
        <Reveal delay={1} as="ul" className="cl-cta__contacts">
          {c.contacts.map((ct, i) => (
            <li key={i}>
              <span className="cl-cta__key">{ct.key}</span>
              <ArrowLink href={ct.href} tone="strong" {...(ct.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{ct.val}</ArrowLink>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* Footer — mark, tagline, year. No divider rule; separation is tone + scale. */
export function SiteFooter({ t }) {
  const f = t.footer;
  return (
    <footer className="cl-footer">
      <div className="shell cl-footer__inner">
        <div className="cl-footer__brand">
          <img src={ASSETS.logo} alt="Chipsa" width="352" height="58" />
          <span className="cl-footer__tag">{f.tagline}</span>
        </div>
        <div className="cl-footer__meta">
          <span>{f.made}</span>
          <span>{f.year}</span>
        </div>
      </div>
    </footer>
  );
}
