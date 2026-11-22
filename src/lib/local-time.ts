// The hero's local time: how it is formatted, and how it gets onto the page
// before React does.
//
// The home page is prerendered, so the server cannot know the time, and the
// LocalTime component only learns it after hydration. If the time simply
// appeared then, the eyebrow would grow, and at widths where the eyebrow and
// the dock only just share a row the dock would wrap and push the headline
// down. So an inline script at the top of the home page works the time out
// before anything is drawn and leaves it on <html> as a CSS variable, and the
// empty span shows it from there (see LocalTime) until React fills it in.
// The eyebrow has its final width from the first frame.

export const LOCAL_TIME_LOCALE = "en-US";

export const LOCAL_TIME_OPTIONS = {
  timeZone: "America/Los_Angeles",
  hour: "numeric",
  minute: "2-digit",
} as const;

// Kept inline and tiny because it has to run before anything is drawn. It
// formats the time exactly as LocalTime does, so nothing changes width when
// the real text takes over. The value is a CSS string, leading space included.
//
// It does nothing at 520px and below, where LocalTime hides the time (the
// same media query as the class there). Building the first time-zone
// formatter of a page is slow, about 30ms on a phone-class processor, and
// phones should not pay that before first paint for text they never show.
export const LOCAL_TIME_SCRIPT = `(function(){try{if(matchMedia("(max-width:520px)").matches)return;document.documentElement.style.setProperty("--local-time",JSON.stringify(" "+new Intl.DateTimeFormat(${JSON.stringify(LOCAL_TIME_LOCALE)},${JSON.stringify(LOCAL_TIME_OPTIONS)}).format(new Date())))}catch(e){}})();`;
