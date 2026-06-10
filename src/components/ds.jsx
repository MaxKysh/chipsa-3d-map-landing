/* Chipsa Lander design-system components, ported from the handoff bundle.
   Button styles live in design-system.css (.clbtn). */

/* ---- ArrowLink — label sits, the corner-mark advances; goes white on hover ---- */
export function ArrowLink({ children, href = '#', glyph = '↗', tone = 'accent', onClick, style, ...rest }) {
  const color = tone === 'strong' ? 'var(--text-strong)' : 'var(--accent-text)';
  const hoverColor = '#FFFFFF';
  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = hoverColor;
        const a = e.currentTarget.querySelector('[data-arw]');
        if (a) a.style.transform = 'translate(4px,-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = color;
        const a = e.currentTarget.querySelector('[data-arw]');
        if (a) a.style.transform = 'none';
      }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5em', color,
        fontFamily: 'var(--font-sans)', fontWeight: 'var(--w-medium)', fontSize: '1.0625rem',
        textDecoration: 'none', cursor: 'pointer',
        transition: 'color var(--dur-base) var(--ease-out)', ...style,
      }}
      {...rest}
    >
      <span>{children}</span>
      <span data-arw style={{ display: 'inline-block', transition: 'transform var(--dur-base) var(--ease-out)' }}>{glyph}</span>
    </a>
  );
}

/* ---- Button — signature staged hover (circular mask reveal + spotlight + arrow) ---- */
const PALETTES = {
  primary:   { bg: 'var(--teal-500)', base: '#FFFFFF', invBg: '#FFFFFF', invText: 'var(--ink-900)', spot: 'rgba(31,163,154,0.30)', blend: 'normal', mode: 'flip', ghost: false },
  secondary: { bg: 'var(--ink-600)', base: '#FFFFFF', invBg: 'var(--ink-400)', invText: '#FFFFFF', spot: 'rgba(244,247,246,0.20)', blend: 'normal', mode: 'wash', ghost: false },
  invert:    { bg: 'var(--paper-050)', base: 'var(--fg-on-paper-1)', invBg: 'var(--ink-800)', invText: '#FFFFFF', spot: 'rgba(255,255,255,0.30)', blend: 'screen', mode: 'flip', ghost: false },
  ghost:     { bg: 'transparent', base: 'var(--accent-text)', invBg: null, invText: null, spot: null, blend: null, mode: 'none', ghost: true },
};

export function Button({
  children, variant = 'primary', size = 'md', href, icon = false, iconGlyph = '↗',
  disabled = false, type = 'button', onClick, style, ...rest
}) {
  const pad = { sm: '10px 16px', md: '14px 24px', lg: '18px 32px' }[size] || '14px 24px';
  const fs = { sm: '0.9375rem', md: '1.0625rem', lg: '1.1875rem' }[size] || '1.0625rem';

  const pal = PALETTES[variant] || PALETTES.primary;
  const isGhost = pal.ghost;
  const facePad = isGhost ? `${pad.split(' ')[0]} 0` : pad;

  const setPos = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const Face = ({ className }) => (
    <span className={className} style={{ padding: facePad }}>
      <span>{children}</span>
      {icon && <span className="clbtn__arw">{iconGlyph}</span>}
    </span>
  );

  const rootStyle = {
    fontSize: fs, background: pal.bg, color: pal.base,
    opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
    '--cl-inv-bg': pal.invBg || 'transparent',
    '--cl-inv-text': pal.invText || 'inherit',
    '--cl-spot': pal.spot || 'transparent',
    '--cl-blend': pal.blend || 'normal',
    ...style,
  };

  const Tag = href && !disabled ? 'a' : 'button';
  const tagProps = href && !disabled ? { href } : { type, disabled };

  return (
    <Tag
      className={`clbtn${isGhost ? ' clbtn--ghost' : ''}`}
      {...tagProps}
      {...(disabled ? { 'data-disabled': '' } : {})}
      onClick={disabled ? undefined : onClick}
      onPointerMove={disabled ? undefined : setPos}
      onPointerEnter={disabled ? undefined : setPos}
      style={rootStyle}
      {...rest}
    >
      {pal.mode === 'wash' && !disabled && <span className="clbtn__reveal clbtn__reveal--wash" aria-hidden="true" />}
      <Face className="clbtn__base" />
      {pal.mode === 'flip' && !disabled && <Face className="clbtn__reveal clbtn__reveal--flip" />}
      {pal.mode !== 'none' && !disabled && <span className="clbtn__spot" aria-hidden="true" />}
    </Tag>
  );
}

/* ---- Stat — big display number + mono label; optional gradient ink ---- */
export function Stat({ value, label, suffix = '', grad = false, align = 'start', style, ...rest }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--s-2)', textAlign: align,
        alignItems: align === 'center' ? 'center' : 'flex-start', ...style,
      }}
      {...rest}
    >
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 'var(--w-bold)',
        fontSize: 'clamp(2.5rem, 5vw, 4.25rem)', lineHeight: 0.95, letterSpacing: '-0.03em',
        color: grad ? 'transparent' : 'var(--text-strong)',
        background: grad ? 'var(--grad-brand)' : 'none',
        WebkitBackgroundClip: grad ? 'text' : 'border-box',
        backgroundClip: grad ? 'text' : 'border-box',
      }}>
        {value}
        <span style={{ fontSize: '0.55em', verticalAlign: 'baseline' }}>{suffix}</span>
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--t-mono-sm)', letterSpacing: 'var(--ls-mono)',
        textTransform: 'uppercase', color: 'var(--text-muted)',
      }}>
        {label}
      </span>
    </div>
  );
}
