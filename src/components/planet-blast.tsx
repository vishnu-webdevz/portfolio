"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Hero visual: a meteoroid hits a big planet, the planet cracks open, and
   what I bring to a team bursts out of its glowing core. Plays once when it
   comes into view. */

type Phase = "idle" | "incoming" | "impact" | "open";

const DEBRIS = Array.from({ length: 12 }, (_, i) => ({ a: i * 30 + (i % 2) * 12, d: 40 + (i % 3) * 18 }));

function Meteoroid() {
  return (
    <svg width="120" height="44" viewBox="0 0 120 44" aria-hidden="true">
      <defs>
        <linearGradient id="blast-tail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff7a1a" stopOpacity="0" />
          <stop offset="0.7" stopColor="#ff7a1a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff1c2" />
        </linearGradient>
      </defs>
      <path d="M0 22c30-7 60-10 88-11v22c-28-1-58-4-88-11z" fill="url(#blast-tail)" />
      <path d="M86 12l12-6 14 3 6 12-4 13-13 6-12-4-5-12z" fill="#3b3530" stroke="#f4f1ea" strokeWidth="1.5" />
      <circle cx="98" cy="18" r="3" fill="#29241f" />
      <circle cx="107" cy="28" r="2.2" fill="#29241f" />
    </svg>
  );
}

function PlanetFace() {
  return (
    <div className="absolute inset-0 rounded-full border-2 border-[#111113]/80 bg-[radial-gradient(circle_at_35%_30%,#ffe58a,#f5b800_45%,#d98a00)]">
      <span className="absolute left-[16%] top-[56%] size-9 rounded-full bg-[#e8a400]/70 shadow-[inset_2px_2px_0_rgba(0,0,0,0.12)]" />
      <span className="absolute left-[60%] top-[18%] size-7 rounded-full bg-[#e8a400]/70 shadow-[inset_2px_2px_0_rgba(0,0,0,0.12)]" />
      <span className="absolute left-[66%] top-[62%] size-5 rounded-full bg-[#e8a400]/70 shadow-[inset_2px_2px_0_rgba(0,0,0,0.12)]" />
      <span className="absolute left-[34%] top-[28%] size-4 rounded-full bg-[#e8a400]/60" />
      <span className="absolute inset-x-[8%] top-[44%] h-3 rounded-full bg-[#f0a400]/50" />
    </div>
  );
}

export function PlanetBlast({ items }: { items: string[] }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const play = useCallback(() => {
    timers.current.forEach(clearTimeout);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("open");
      return;
    }
    setPhase("idle");
    timers.current = [
      setTimeout(() => setPhase("incoming"), 80),
      setTimeout(() => setPhase("impact"), 1150),
      setTimeout(() => setPhase("open"), 1500),
    ];
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          timers.current.push(setTimeout(play, 400));
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    const t = timers.current;
    return () => {
      io.disconnect();
      t.forEach(clearTimeout);
    };
  }, [play]);

  return (
    <div ref={rootRef} className="relative size-[300px] sm:size-[380px]">
      <div data-phase={phase} className="blast absolute left-0 top-0 size-[380px] origin-top-left scale-[0.789] sm:scale-100">
        {/* the space window */}
        <div className="orbit-window absolute inset-0 rounded-full ring-1 ring-line-strong shadow-[0_30px_60px_-30px_rgba(6,10,28,0.65)]">
          <div className="absolute inset-[10px] rounded-full border border-white/10" />
          <div className="absolute inset-[38px] rounded-full border border-dashed border-white/10" />
        </div>

        {/* shockwave */}
        <span className="blast-shock absolute left-1/2 top-1/2 size-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#f5b800]" />

        {/* glowing core revealed when the planet splits */}
        <div className="blast-core absolute left-1/2 top-1/2 size-[92px] -translate-x-1/2 -translate-y-1/2">
          <div className="planet-glow absolute -inset-8 rounded-full bg-[#f5b800]/40 blur-xl" />
          <div className="absolute inset-0 grid place-items-center rounded-full border-2 border-[#111113] bg-[radial-gradient(circle_at_40%_35%,#fffbe8,#ffe27a_45%,#f5b800)] font-mono text-2xl font-semibold text-[#111113]">
            &lt;/&gt;
          </div>
        </div>

        {/* the planet, drawn as two halves that crack apart */}
        <div className="blast-planet absolute left-1/2 top-1/2 size-[200px] -translate-x-1/2 -translate-y-1/2">
          <div className="blast-half blast-half-l absolute inset-0 [clip-path:polygon(0_0,52%_0,46%_38%,54%_60%,47%_100%,0_100%)]">
            <PlanetFace />
          </div>
          <div className="blast-half blast-half-r absolute inset-0 [clip-path:polygon(52%_0,100%_0,100%_100%,47%_100%,54%_60%,46%_38%)]">
            <PlanetFace />
          </div>
        </div>

        {/* incoming meteoroid (its rock sits on the element's anchor point) */}
        <div className="blast-meteor pointer-events-none absolute left-1/2 top-1/2">
          <Meteoroid />
        </div>

        {/* impact flash + debris at the hit point (upper-left of the planet) */}
        <div className="pointer-events-none absolute left-[calc(50%-71px)] top-[calc(50%-71px)]">
          <span className="blast-flash absolute -left-6 -top-6 size-12 rounded-full bg-[#fff6c8]" />
          {DEBRIS.map((p, i) => (
            <span
              key={i}
              className="blast-debris absolute -left-1 -top-1 size-2 rounded-full"
              style={{ "--a": `${p.a}deg`, "--d": `${p.d}px`, background: i % 3 ? "#ffc20e" : "#3b3530" } as React.CSSProperties}
            />
          ))}
        </div>

        {/* what bursts out */}
        {items.map((label, i) => {
          const angle = (-90 + (360 / items.length) * i) * (Math.PI / 180);
          const x = Math.round(Math.cos(angle) * 124);
          const y = Math.round(Math.sin(angle) * 140);
          return (
            <div
              key={label}
              className="blast-item absolute left-1/2 top-1/2"
              style={{ "--x": `${x}px`, "--y": `${y}px`, "--i": i } as React.CSSProperties}
            >
              <span className="blast-badge flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-surface px-3 py-1 font-mono text-[0.68rem] font-medium text-fg shadow-[var(--shadow)]">
                <span className="size-1.5 rounded-full bg-accent" />
                {label}
              </span>
            </div>
          );
        })}

      </div>
    </div>
  );
}
