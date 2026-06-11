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
      <Reveal className="cl-head__rail rv-left">
        <span className="cl-head__lead">
          <span className="cl-head__num">{num}</span>
          <span className="cl-head__rule" aria-hidden="true" />
        </span>
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
export function Frame({ src, video, poster, label, ratio = '4 / 3', invert = false, zoomable = false, zoom = 1.5, style }) {
  const isVideo = !!video;
  const loupe = zoomable && !isVideo; // cursor-driven magnify, opt-in (small paired images)
  const [ratioW, ratioH] = String(ratio).split('/').map((n) => parseFloat(n.trim()) || 1); // intrinsic-size hint for the img
  const [natRatio, setNatRatio] = React.useState(null);
  const [loadVideo, setLoadVideo] = React.useState(false); // defer offscreen video downloads
  const figRef = React.useRef(null);
  const imgRef = React.useRef(null);
  const onMeta = (e) => {
    const v = e.currentTarget;
    if (v.videoWidth && v.videoHeight) setNatRatio(v.videoWidth + ' / ' + v.videoHeight);
  };

  // Lazy-load videos: only fetch/play once the frame nears the viewport, so the
  // offscreen clips don't compete for bandwidth on first paint. Scroll-based
  // (mirrors the reveal system) so it fires reliably across environments.
  React.useEffect(() => {
    if (!isVideo) return;
    const el = figRef.current; if (!el) return;
    let done = false;
    const check = () => {
      if (done) return;
      const r = el.getBoundingClientRect();
      const h = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < h + 300 && r.bottom > -300) { done = true; cleanup(); setLoadVideo(true); }
    };
    const cleanup = () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    check();
    const timers = [0, 300, 800].map((ms) => setTimeout(check, ms));
    return () => { cleanup(); timers.forEach(clearTimeout); };
  }, [isVideo]);

  /* loupe: container stays fixed; the image scales and pans to follow the cursor
     via transform-origin, so moving the mouse explores the magnified image. */
  const onMove = (e) => {
    const img = imgRef.current; if (!img) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
    img.style.transform = `scale(${zoom})`;
  };
  const onLeave = () => {
    const img = imgRef.current; if (!img) return;
    img.style.transform = 'scale(1)';
    img.style.transformOrigin = 'center';
  };
  return (
    <figure
      ref={figRef}
      className="cl-frame"
      onMouseMove={loupe ? onMove : undefined}
      onMouseLeave={loupe ? onLeave : undefined}
      style={{
        position: 'relative', margin: 0, width: '100%',
        aspectRatio: isVideo ? (natRatio || ratio) : ratio, overflow: 'hidden',
        borderRadius: 'var(--r-4)', border: 'none',
        background: invert ? '#0B1416' : 'var(--surface-1)',
        cursor: loupe ? 'zoom-in' : undefined,
        ...style,
      }}
    >
      {isVideo ? (
        loadVideo && (
          <video
            src={video} poster={poster} autoPlay muted loop playsInline preload="metadata" onLoadedMetadata={onMeta}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )
      ) : (
        <img
          ref={imgRef}
          src={src} alt={label || ''} loading="lazy" width={ratioW} height={ratioH}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            transform: 'scale(1)', transformOrigin: 'center',
            transition: 'transform var(--dur-base) var(--ease-out)', willChange: 'transform',
          }}
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
