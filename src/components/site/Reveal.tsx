"use client";

import { useEffect, useRef, useState } from "react";

// Fade-up section reveal — ui_kits/portfolio/Reveal.jsx
export function Reveal({
  delay = 0,
  children,
}: {
  delay?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (reduce || !el || typeof IntersectionObserver === "undefined") {
      setInstant(true);
      setShown(true);
      return;
    }
    let io: IntersectionObserver | null = null;
    let ioFired = false;
    // IO spec mandates an initial callback for every observed element.
    // If none arrives, show content immediately without a transition.
    const fallback = setTimeout(() => {
      if (!ioFired) {
        setInstant(true);
        setShown(true);
      }
    }, 350);
    try {
      io = new IntersectionObserver(
        (entries) => {
          ioFired = true;
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setShown(true);
              io?.disconnect();
            }
          });
        },
        { threshold: 0.12 },
      );
      io.observe(el);
    } catch {
      setInstant(true);
      setShown(true);
    }
    return () => {
      clearTimeout(fallback);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(14px)",
        transition: instant
          ? "none"
          : `opacity var(--dur-slow) var(--ease-out) ${delay}ms, transform var(--dur-slow) var(--ease-out) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
