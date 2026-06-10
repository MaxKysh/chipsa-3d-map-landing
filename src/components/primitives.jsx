/* Chipsa map landing — shared primitives. */
import React from 'react';
import { Route, TrendingUp, Award, Factory, Stethoscope, Pill, Dna, LayoutGrid } from 'lucide-react';

/* ---- Lucide icon (1.5px stroke, sits with bold type, never decorates) ---- */
const ICONS = {
  route: Route,
  'trending-up': TrendingUp,
  award: Award,
  factory: Factory,
  stethoscope: Stethoscope,
  pill: Pill,
  dna: Dna,
  'layout-grid': LayoutGrid,
};

export function Icon({ name, size = 26, stroke = 1.5, style }) {
  const Cmp = ICONS[name];
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', color: 'var(--accent-text)', ...style }}>
      {Cmp ? <Cmp width={size} height={size} strokeWidth={stroke} /> : null}
    </span>
  );
}

/* ---- Scroll reveal. End-state is base style; toggled via [data-inview].
   Driven by a single shared scroll handler for reliability. Live on/off comes
   from the .reveal-off wrapper class. ---- */
const _revealEls = new Set();
let _revealBound = false;
function _checkReveal() {
  const h = window.innerHeight || document.documentElement.clientHeight;
  _revealEls.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < h * 0.92 && r.bottom > -40) {
      el.setAttribute('data-inview', '');
      _revealEls.delete(el);
    }
  });
}
function _bindReveal() {
  if (_revealBound) return;
  _revealBound = true;
  const run = () => { _checkReveal(); requestAnimationFrame(_checkReveal); };
  window.addEventListener('scroll', run, { passive: true });
  window.addEventListener('resize', run, { passive: true });
  window.addEventListener('load', run);
  [60, 250, 700, 1500].forEach((ms) => setTimeout(_checkReveal, ms));
}
function useReveal() {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.setAttribute('data-inview', ''); return; }
    _revealEls.add(el);
    _bindReveal();
    _checkReveal();
    const id = setTimeout(_checkReveal, 0);
    return () => { _revealEls.delete(el); clearTimeout(id); };
  }, []);
  return ref;
}

export function Reveal({ as = 'div', delay, className = '', children, style, ...rest }) {
  const ref = useReveal();
  const Tag = as;
  const cls = ['reveal', delay ? `delay-${delay}` : '', className].filter(Boolean).join(' ');
  return <Tag ref={ref} className={cls} style={style} {...rest}>{children}</Tag>;
}

/* ---- Section shell + editorial two-column header ---- */
export function Section({ id, invert = false, tight = false, children, style }) {
  return (
    <section
      id={id}
      data-screen-label={id}
      className={`cl-section${invert ? ' surface-invert' : ''}`}
      style={{ paddingBlock: tight ? 'var(--section-y-tight)' : 'var(--section-y)', position: 'relative', ...style }}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

export function SectionHead({ num, kicker, title, lede, invert = false }) {
  return (
    <div className="cl-head">
      <Reveal className="cl-head__rail">
        <span className="cl-head__num">{num}</span>
        <span className="cl-head__kicker">{kicker}</span>
      </Reveal>
      <div className="cl-head__body">
        <Reveal as="h2" className="cl-head__title">{title}</Reveal>
        {lede && (
          <Reveal as="p" delay={1} className="cl-head__lede" style={{ color: invert ? 'var(--text-on-invert-muted)' : 'var(--text-body)' }}>
            {lede}
          </Reveal>
        )}
      </div>
    </div>
  );
}

/* ---- Framed media (small radius, no shadow).
   Videos adopt their clip's real aspect ratio on load so they never crop. ---- */
export function Frame({ src, video, poster, label, ratio = '4 / 3', topRule = false, invert = false, style }) {
  const isVideo = !!video;
  const [natRatio, setNatRatio] = React.useState(null);
  const onMeta = (e) => {
    const v = e.currentTarget;
    if (v.videoWidth && v.videoHeight) setNatRatio(v.videoWidth + ' / ' + v.videoHeight);
  };
  return (
    <figure
      className="cl-frame"
      style={{
        position: 'relative', margin: 0, width: '100%',
        aspectRatio: isVideo ? (natRatio || ratio) : ratio, overflow: 'hidden',
        borderRadius: 'var(--r-4)', border: 'none',
        background: invert ? '#0B1416' : 'var(--surface-1)',
        ...style,
      }}
    >
      {isVideo ? (
        <video
          src={video} poster={poster} autoPlay muted loop playsInline preload="metadata" onLoadedMetadata={onMeta}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <img
          src={src} alt={label || ''} loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
    </figure>
  );
}

/* ---- Caption below media (kicker + body) ---- */
export function Caption({ kicker, children, invert = false }) {
  return (
    <Reveal delay={1} className="cl-caption">
      {kicker && <span className="cl-caption__kicker">{kicker}</span>}
      <p className="cl-caption__body" style={{ color: invert ? 'var(--text-on-invert-muted)' : 'var(--text-body)' }}>{children}</p>
    </Reveal>
  );
}
