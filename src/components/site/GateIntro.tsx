"use client";

import { useEffect, useRef } from "react";
import { MiniFlow } from "@/components/patterns/MiniFlow";

// First-visit intro: the design gate, run on this page. The page is already
// rendered underneath; this draws the decision record over it, then hands the
// verdict's diagram to its resting place in the hero and lifts.
//
// The sequence itself is CSS (see "First-visit intro" in globals.css), started
// by an inline script before first paint, so it never waits on this component.
// This component only does what CSS cannot: the hand-off, skipping, and replay.
// If it never runs, a CSS failsafe lifts the overlay on its own.

// Delays shrink as the rows go on, so the list reads as one wave.
const ROW_DELAYS = [80, 180, 270, 350, 420, 480, 530];
const VERDICT_LABEL_AT = 760;
const FLOW_AT = 860;
const SENTENCE_AT = 1120;
// How long the finished record holds before the overlay lifts.
const HOLD_MS = 450;
// Must match the delay on gi-out in globals.css.
const FAILSAFE_AT = 3600;

const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function GateIntro({
  signals,
  stages,
  verdict,
  replayEventName = "pf-intro-replay",
}: {
  signals: { id: string; signal: string; read: string }[];
  stages: { label: string; accent?: boolean }[];
  verdict: string;
  replayEventName?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const fly = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el) return;

    let hold: ReturnType<typeof setTimeout> | undefined;
    let running: Animation[] = [];
    let unmounted = false;

    const playing = () => html.dataset.intro === "play";

    const finish = () => {
      clearTimeout(hold);
      SKIP_EVENTS.forEach((e) => window.removeEventListener(e, finish, true));
      if (playing()) html.dataset.intro = "done";
    };

    const lift = () => {
      if (!playing()) return;
      const src = fly.current;
      const dst = document.querySelector<HTMLElement>("[data-gate-flow]");
      const bg = el.querySelector<HTMLElement>("[data-gi-bg]");
      if (!src || !dst || !bg) return finish();

      // If the CSS failsafe has already begun lifting, stay out of its way.
      const failsafe = el
        .getAnimations()
        .find((a) => a instanceof CSSAnimation && a.animationName === "gi-out");
      if (failsafe && Number(failsafe.currentTime ?? 0) >= FAILSAFE_AT) return finish();

      const s = src.getBoundingClientRect();
      const t = dst.getBoundingClientRect();
      const reachable =
        s.width > 0 && t.width > 0 && t.bottom > 0 && t.top < window.innerHeight;

      el.querySelectorAll<HTMLElement>("[data-gi-text]").forEach((n) => {
        running.push(
          n.animate({ opacity: [1, 0] }, { duration: 180, easing: "ease-out", fill: "forwards" }),
        );
      });
      running.push(
        bg.animate({ opacity: [1, 0] }, { duration: 460, delay: 100, easing: "ease", fill: "forwards" }),
      );
      // The diagram is moving across the screen, not entering it: ease-in-out.
      const move = reachable
        ? src.animate(
            {
              transform: [
                "translate(0px, 0px) scale(1)",
                `translate(${t.left - s.left}px, ${t.top - s.top}px) scale(${t.width / s.width})`,
              ],
            },
            { duration: 560, easing: "cubic-bezier(0.65, 0.05, 0.36, 1)", fill: "forwards" },
          )
        : src.animate({ opacity: [1, 0] }, { duration: 300, easing: "ease-out", fill: "forwards" });
      running.push(move);
      move.finished.then(finish, () => {});
    };

    // Wait for the CSS sequence to finish, hold a beat, then lift.
    const arm = () => {
      if (!playing()) return;
      SKIP_EVENTS.forEach((e) =>
        window.addEventListener(e, finish, { capture: true, passive: true }),
      );
      const sequence = el
        .getAnimations({ subtree: true })
        .filter(
          (a) =>
            a instanceof CSSAnimation &&
            (a.animationName === "gi-in" || a.animationName === "gi-fade"),
        );
      Promise.all(sequence.map((a) => a.finished)).then(
        () => {
          if (!unmounted && playing()) hold = setTimeout(lift, HOLD_MS);
        },
        () => {},
      );
    };

    const replay = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      finish();
      running.forEach((a) => a.cancel());
      running = [];
      window.scrollTo({ top: 0, behavior: "instant" });
      html.dataset.intro = "play";
      // Two frames: one for the overlay to render, one for its animations to exist.
      requestAnimationFrame(() => requestAnimationFrame(arm));
    };

    arm();
    window.addEventListener(replayEventName, replay);
    return () => {
      unmounted = true;
      clearTimeout(hold);
      window.removeEventListener(replayEventName, replay);
      SKIP_EVENTS.forEach((e) => window.removeEventListener(e, finish, true));
    };
  }, [replayEventName]);

  const labelCls = "m-0 font-mono text-mono tracking-mono uppercase text-accent-600";

  return (
    <div ref={root} className="gate-intro fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      <div data-gi-bg className="absolute inset-0 bg-paper-0"></div>
      {/* Anchored from the top with fixed row heights, never centered: the
          record's geometry must not depend on how its text happens to wrap,
          or a late web font would shift the whole block. */}
      <div className="relative h-full max-w-(--container-site) mx-auto px-(--gutter) pt-[clamp(84px,17vh,190px)]">
        <div className="max-w-[560px]">
          <p data-gi-text className={`gi-fade ${labelCls}`}>
            Design gate, run on this page
          </p>
          <dl data-gi-text className="mt-6 mb-0 border-b border-line-1">
            {signals.map((s, i) => (
              <div
                key={s.id}
                className="gi-in grid grid-cols-[11rem_minmax(0,1fr)] items-center gap-5 h-[40px] border-t border-line-1 whitespace-nowrap overflow-hidden [@media(max-width:640px)]:grid-cols-[8.25rem_minmax(0,1fr)] [@media(max-width:640px)]:gap-3"
                style={delay(ROW_DELAYS[i] ?? ROW_DELAYS[ROW_DELAYS.length - 1])}
              >
                <dt className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-500">
                  {s.signal}
                </dt>
                <dd className="m-0 text-[16px] leading-none text-ink-900">{s.read}</dd>
              </div>
            ))}
          </dl>
          <p data-gi-text className={`gi-fade mt-8 ${labelCls}`} style={delay(VERDICT_LABEL_AT)}>
            Verdict
          </p>
          <div
            ref={fly}
            className="gi-flow mt-4 w-fit origin-top-left text-[clamp(13px,calc(1.6vw+7px),18px)]"
            style={delay(FLOW_AT)}
          >
            <MiniFlow stages={stages} />
          </div>
          <p
            data-gi-text
            className="gi-in mt-5 mb-0 max-w-[18em] font-display font-semibold text-[clamp(22px,3vw,32px)] tracking-heading leading-[1.15] text-ink-900"
            style={delay(SENTENCE_AT)}
          >
            {verdict}
          </p>
        </div>
        <p
          data-gi-text
          className="gi-fade absolute bottom-7 left-(--gutter) m-0 font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-300"
          style={delay(500)}
        >
          Tap or press any key to skip
        </p>
      </div>
    </div>
  );
}
