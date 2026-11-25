"use client";

import { useEffect, useRef } from "react";
import type { Job } from "@/content";

/* A winding road down the section. A little walker follows the road as the
   visitor scrolls, passing one milestone card per job. */

const ROW = 360; // px per milestone on wide screens

// Road x-position (0–100 %) at progress p (0–1) through the rows.
function roadX(p: number, n: number, wide: boolean) {
  return wide ? 50 - 30 * Math.sin(Math.PI * n * p) : 9 + 3 * Math.sin(Math.PI * n * p);
}

function roadPath(n: number, wide: boolean) {
  const steps = 160;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const p = i / steps;
    d += `${i ? "L" : "M"}${roadX(p, n, wide).toFixed(2)} ${(p * 1000).toFixed(1)}`;
  }
  return d;
}

function Walker() {
  return (
    <svg viewBox="0 0 60 92" className="w-full" aria-hidden="true">
      <defs>
        <filter id="walker-outline" x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1.4" result="g" />
          <feFlood floodColor="#16120f" />
          <feComposite in2="g" operator="in" result="o" />
          <feMerge>
            <feMergeNode in="o" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="30" cy="89" rx="16" ry="3" fill="#000" opacity="0.2" />
      <g filter="url(#walker-outline)" className="walker-body">
        {/* back leg */}
        <g className="w-leg w-leg-b">
          <rect x="26" y="54" width="8" height="24" rx="3.5" fill="#1b2536" />
          <rect x="26" y="74" width="8" height="5" fill="#e0a526" />
          <path d="M25 79h12c3 0 5 2 5 5H25z" fill="#d9d4c8" />
        </g>
        {/* backpack */}
        <rect x="13" y="30" width="12" height="22" rx="4" fill="#c4532d" />
        <rect x="15" y="40" width="8" height="6" rx="2" fill="#a8441f" />
        {/* body */}
        <rect x="21" y="28" width="19" height="28" rx="7" fill="#f4f1ea" />
        {/* front leg */}
        <g className="w-leg w-leg-f">
          <rect x="26" y="54" width="8" height="24" rx="3.5" fill="#25324a" />
          <rect x="26" y="74" width="8" height="5" fill="#ffc20e" />
          <path d="M25 79h12c3 0 5 2 5 5H25z" fill="#f4f1ea" />
        </g>
        {/* arm */}
        <g className="w-arm">
          <rect x="27" y="31" width="7" height="19" rx="3.5" fill="#e0d6c2" />
          <circle cx="30.5" cy="51" r="3.5" fill="#c68a5e" />
        </g>
        {/* head */}
        <rect x="28" y="22" width="7" height="7" fill="#a86f47" />
        <circle cx="32" cy="15" r="11" fill="#c68a5e" />
        <path d="M21 15c-1-9 6-14 13-13 7 1 10 6 9 11-4-4-10-5-15-3-3 1-5 3-7 5z" fill="#1a1410" />
      </g>
      {/* face details */}
      <rect x="34" y="12" width="8" height="6" rx="2" fill="#fff" fillOpacity="0.2" stroke="#1a1410" strokeWidth="1.4" />
      <circle cx="39" cy="15" r="1.3" fill="#1a1410" />
      <path d="M36 21q3 2 6 0" stroke="#5a2418" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function Journey({ items }: { items: Job[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const n = items.length;

  useEffect(() => {
    const wrap = wrapRef.current;
    const walker = walkerRef.current;
    if (!wrap || !walker) return;
    const mq = window.matchMedia("(min-width: 768px)");
    let frame = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let last = -1;

    const place = () => {
      const r = wrap.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / r.height));
      const wide = mq.matches;
      const x = (roadX(p, n, wide) / 100) * r.width;
      const y = p * r.height;
      const ahead = roadX(Math.min(1, p + 0.002), n, wide) - roadX(p, n, wide);
      walker.style.transform = `translate(${x}px, ${y}px)`;
      walker.dataset.facing = ahead < -0.001 ? "left" : "right";
      if (last >= 0 && Math.abs(p - last) > 0.0005) {
        walker.dataset.walking = "1";
        clearTimeout(idle);
        idle = setTimeout(() => (walker.dataset.walking = "0"), 180);
      }
      last = p;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };
    place();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(idle);
    };
  }, [n]);

  return (
    <div ref={wrapRef} className="relative" style={{ "--row": `${ROW}px` } as React.CSSProperties}>
      {/* the road */}
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
        {[true, false].map((wide) => (
          <g key={String(wide)} className={wide ? "hidden md:inline" : "md:hidden"}>
            <path d={roadPath(n, wide)} fill="none" stroke="#16120f" strokeWidth="64" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.12" transform="translate(0.6 6)" />
            <path d={roadPath(n, wide)} fill="none" stroke="#16120f" strokeWidth="60" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={roadPath(n, wide)} fill="none" stroke="#3a342d" strokeWidth="52" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d={roadPath(n, wide)} fill="none" stroke="#ffc20e" strokeWidth="3" strokeDasharray="14 14" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </svg>

      {/* milestones */}
      <ol className="relative">
        {items.map((job, i) => {
          const cardRight = i % 2 === 0; // road bulges left on even rows
          return (
            <li key={job.role + job.period} className="relative flex min-h-[260px] items-center py-8 pl-[20%] md:min-h-[var(--row)] md:pl-0">
              {/* pin on the road at the bend */}
              <span
                className="absolute top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-yellow font-display text-lg text-ink md:grid md:size-11"
                style={{ left: cardRight ? "20%" : "80%" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <article
                className={`journey-card w-full rounded-2xl border-[3px] border-ink bg-cream p-6 shadow-[6px_6px_0_var(--ink)] md:w-[44%] ${
                  cardRight ? "md:ml-auto md:rotate-1" : "md:-rotate-1"
                }`}
              >
                <p className="inline-block rounded-full bg-ink px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-yellow">
                  {job.period}
                </p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight">{job.role}</h3>
                <p className="font-semibold text-oxblood">
                  {job.company}
                  {job.location && <span className="font-medium text-ink/60"> · {job.location}</span>}
                </p>
                <p className="mt-3 leading-relaxed text-ink/85">{job.summary}</p>
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Skills used">
                    {job.highlights.map((h) => (
                      <li key={h} className="rounded-full border-2 border-ink/80 px-3 py-1 text-xs font-bold">
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          );
        })}
      </ol>

      {/* the walker */}
      <div
        ref={walkerRef}
        data-walking="0"
        data-facing="right"
        className="walker pointer-events-none absolute left-0 top-0 z-20 will-change-transform"
        aria-hidden="true"
      >
        <div className="walker-inner -ml-[26px] -mt-[78px] w-[52px] md:-ml-[32px] md:-mt-[96px] md:w-[64px]">
          <Walker />
        </div>
      </div>
    </div>
  );
}
