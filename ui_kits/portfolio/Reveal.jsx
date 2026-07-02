import React from 'react';

export function Reveal({ delay = 0, children, style, ...rest }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  const [instant, setInstant] = React.useState(false);
  React.useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = ref.current;
    if (reduce || !el || typeof IntersectionObserver === 'undefined') { setInstant(true); setShown(true); return; }
    let io = null;
    let ioFired = false;
    // IO spec mandates an initial callback for every observed element.
    // If none arrives (broken in some embedded contexts), show content
    // immediately WITHOUT a transition: a frozen animation clock would
    // otherwise hold the CSSTransition at offset 0 forever.
    const fallback = setTimeout(() => { if (!ioFired) { setInstant(true); setShown(true); } }, 350);
    try {
      io = new IntersectionObserver((entries) => {
        ioFired = true;
        entries.forEach((e) => {
          if (e.isIntersecting) { setShown(true); io.disconnect(); }
        });
      }, { threshold: 0.12 });
      io.observe(el);
    } catch (err) {
      setInstant(true); setShown(true);
    }
    return () => { clearTimeout(fallback); if (io) io.disconnect(); };
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(14px)',
        transition: instant ? 'none' : 'opacity var(--dur-slow) var(--ease-out) ' + delay + 'ms, transform var(--dur-slow) var(--ease-out) ' + delay + 'ms',
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
