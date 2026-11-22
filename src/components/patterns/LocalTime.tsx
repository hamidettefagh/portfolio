"use client";

import { useLayoutEffect, useState } from "react";
import { LOCAL_TIME_LOCALE, LOCAL_TIME_OPTIONS } from "@/lib/local-time";

// The current time where I work, shown beside the city in the hero. The
// server renders the span empty, so the server and the browser never disagree
// about what time it is. Until this component has the time, the empty span
// shows the one the home page's inline script left in --local-time, so it
// takes its final width from the first frame and nothing moves when the real
// text arrives (see lib/local-time.ts).
const fmt = new Intl.DateTimeFormat(LOCAL_TIME_LOCALE, LOCAL_TIME_OPTIONS);

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  // A layout effect rather than an effect: when the hero is rendered in the
  // browser (arriving from another page) the inline script has not run for
  // this visit, and this puts the time in place before that first paint too.
  useLayoutEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const now = new Date();
      setTime(fmt.format(now));
      // Re-run just after the next minute starts.
      timer = setTimeout(tick, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
    };
    tick();
    return () => clearTimeout(timer);
  }, []);

  return (
    <span
      className="text-ink-300 empty:after:content-(--local-time) [@media(max-width:520px)]:hidden"
      title="Local time in Los Angeles"
    >
      {time === null ? null : " "}
      {time}
    </span>
  );
}
