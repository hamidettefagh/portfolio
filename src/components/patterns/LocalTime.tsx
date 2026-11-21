"use client";

import { useEffect, useState } from "react";

// The current time where I work, shown beside the city in the hero. It renders
// nothing on the server and fills in after mount, so the server and the
// browser never disagree about what time it is. It sits at the end of its
// line, so nothing moves when it appears.
const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "numeric",
  minute: "2-digit",
});

export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
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

  if (!time) return null;
  return (
    <span
      className="text-ink-300 [@media(max-width:520px)]:hidden"
      title="Local time in Los Angeles"
    >
      {" "}
      {time}
    </span>
  );
}
