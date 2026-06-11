/* Lightweight wheel-driven smooth scroll.
   Intercepts the mouse wheel and eases the scroll position with a per-frame lerp,
   smoothing the steppy native wheel scrolling (notably on Windows).
   - Touch scrolling is untouched (it doesn't emit wheel events → stays native + momentum).
   - Respects prefers-reduced-motion and pauses while a modal locks body scroll.
   Returns a cleanup function. */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return () => {};

  // Only smooth where native wheel scrolling is steppy (Windows/Linux mouse).
  // Skip Apple (macOS/iOS already smooth scroll at the OS level — hijacking it
  // breaks trackpad scrolling), touch devices, and reduced-motion users.
  const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  const isApple = /Mac|iPhone|iPad|iPod/i.test(platform) || /Mac OS X/.test(navigator.userAgent || '');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isApple || isTouch) return () => {};

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = !mq.matches;

  const SPEED = 1;    // wheel-distance multiplier
  const EASE = 0.12;  // 0..1 — higher is snappier, lower is floatier

  let target = window.scrollY;
  let current = target;
  let raf = 0;
  let running = false;
  let lastWheel = 0;

  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clamp = (v) => Math.max(0, Math.min(v, maxScroll()));

  function loop() {
    current += (target - current) * EASE;
    if (Math.abs(target - current) < 0.4) {
      current = target;
      window.scrollTo(0, Math.round(current));
      running = false;
      return;
    }
    window.scrollTo(0, current);
    raf = requestAnimationFrame(loop);
  }

  function onWheel(e) {
    if (!enabled || e.ctrlKey) return;                       // pinch-zoom → native
    if (document.body.style.overflow === 'hidden') return;   // modal/menu open
    if (maxScroll() === 0) return;                           // nothing to scroll

    // normalise line / page delta modes (Firefox, some Windows setups) to pixels
    const px = e.deltaMode === 1 ? e.deltaY * 16
             : e.deltaMode === 2 ? e.deltaY * window.innerHeight
             : e.deltaY;
    if (!px) return;

    e.preventDefault();
    const now = performance.now();
    // resync to the real position after idle or non-wheel scrolls (scrollbar, keys, anchors)
    if (!running || now - lastWheel > 220) { target = current = window.scrollY; }
    lastWheel = now;
    target = clamp(target + px * SPEED);
    if (!running) { running = true; raf = requestAnimationFrame(loop); }
  }

  function onMqChange() {
    enabled = !mq.matches;
    if (!enabled && running) { cancelAnimationFrame(raf); running = false; }
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  if (mq.addEventListener) mq.addEventListener('change', onMqChange);

  return () => {
    window.removeEventListener('wheel', onWheel);
    if (mq.removeEventListener) mq.removeEventListener('change', onMqChange);
    if (running) cancelAnimationFrame(raf);
  };
}
