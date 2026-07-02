"use client";

import { useEffect, useRef, useState } from "react";

// Cmd+K command menu — components/patterns/CommandMenu.jsx
export type Command = {
  label: string;
  hint: string;
  action: () => void;
  confirm?: string;
};

export function CommandMenu({
  items = [],
  openEventName = "pf-cmdk-open",
}: {
  items?: Command[];
  openEventName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState<{ label: string; text: string } | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(openEventName, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(openEventName, onOpen);
    };
  }, [openEventName]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setFlash(null);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const filtered = items.filter((it) =>
    it.label.toLowerCase().includes(query.toLowerCase()),
  );

  const run = (item: Command) => {
    item.action();
    if (item.confirm) {
      setFlash({ label: item.label, text: item.confirm });
      setTimeout(() => setOpen(false), 900);
    } else {
      setOpen(false);
    }
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && filtered[active]) {
      e.preventDefault();
      run(filtered[active]);
    }
  };

  if (!open) return null;
  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-[rgba(33,29,24,0.16)]"
        onClick={() => setOpen(false)}
      ></div>
      <div
        className="fixed z-[91] left-1/2 top-[16vh] -translate-x-1/2 w-[min(560px,calc(100vw-40px))] bg-surface-raised border border-line-1 rounded-md shadow-float overflow-hidden"
        role="dialog"
        aria-label="Command menu"
      >
        <input
          ref={inputRef}
          className="w-full outline-none bg-transparent font-body text-[17px] text-ink-900 px-[18px] py-4 border-b border-line-1 tracking-body placeholder:text-ink-300"
          placeholder="Where to?"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKey}
        />
        <div className="max-h-[320px] overflow-y-auto py-[6px]">
          {filtered.length === 0 ? (
            <div className="p-[18px] text-[15px] text-ink-500">
              Nothing matches.
            </div>
          ) : null}
          {filtered.map((it, i) => (
            <div
              key={it.label}
              className={[
                "flex items-center justify-between gap-4 px-[18px] py-[11px] cursor-pointer text-[15px] text-ink-900",
                i === active ? "bg-paper-1" : "",
              ].join(" ")}
              onMouseEnter={() => setActive(i)}
              onClick={() => run(it)}
            >
              <span>
                {flash && flash.label === it.label ? flash.text : it.label}
              </span>
              <span className="font-mono text-mono-sm tracking-[0.06em] uppercase text-ink-300">
                {it.hint}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-[18px] px-[18px] py-[10px] border-t border-line-1 font-mono text-[10.5px] tracking-[0.06em] uppercase text-ink-300">
          <span>&#8593;&#8595; navigate</span>
          <span>&#8629; select</span>
          <span>esc close</span>
        </div>
      </div>
    </>
  );
}
