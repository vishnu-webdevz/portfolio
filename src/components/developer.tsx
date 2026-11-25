"use client";

import { useEffect, useRef } from "react";

const SKIN = "#c68a5e";
const SKIN_DARK = "#a86f47";
const HAIR = "#1a1410";
const HOODIE = "#f4f1ea";
const HOODIE_SHADE = "#e0d6c2";
const INK = "#16120f";

/**
 * The developer sitting on the ledge with his desk toys and coffee.
 * viewBox is 520×420; the ledge top (his seat) is at y=200.
 * He waves and says hi on load, breathes, swings his feet, tilts his head,
 * blinks, and his eyes follow the cursor.
 */
export function Developer({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const svg = svgRef.current;
        const pupils = pupilsRef.current;
        if (!svg || !pupils) return;
        const r = svg.getBoundingClientRect();
        const cx = r.left + (260 / 520) * r.width;
        const cy = r.top + (82 / 420) * r.height;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, dist / 300) * 2.4;
        pupils.setAttribute("transform", `translate(${((dx / dist) * k).toFixed(2)} ${((dy / dist) * k).toFixed(2)})`);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg ref={svgRef} className={className} viewBox="0 0 520 420" aria-hidden="true">
      <defs>
        {/* Cartoon outline around whole shapes (not every inner part). */}
        <filter id="ink-outline" x="-15%" y="-15%" width="130%" height="130%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="2.2" result="grown" />
          <feFlood floodColor={INK} />
          <feComposite in2="grown" operator="in" result="outline" />
          <feMerge>
            <feMergeNode in="outline" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="screen-glow">
          <stop offset="0" stopColor="#cfeaff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#cfeaff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ---------- desk toys (left) ---------- */}
      <g filter="url(#ink-outline)">
        {/* star shield */}
        <circle cx="62" cy="182" r="18" fill="#b3261e" />
        <circle cx="62" cy="182" r="13.5" fill="#f4f1ea" />
        <circle cx="62" cy="182" r="9" fill="#b3261e" />
        <circle cx="62" cy="182" r="5.6" fill="#1e4fa3" />
        <path d="M62 177.6l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="#f4f1ea" />
      </g>
      <g filter="url(#ink-outline)">
        {/* red-and-gold armored hero figure */}
        <rect x="103" y="186" width="7" height="14" fill="#b3261e" />
        <rect x="114" y="186" width="7" height="14" fill="#b3261e" />
        <rect x="102" y="196" width="9" height="4" rx="1" fill="#e0a526" />
        <rect x="113" y="196" width="9" height="4" rx="1" fill="#e0a526" />
        <rect x="94" y="164" width="7" height="20" rx="3.5" fill="#b3261e" />
        <rect x="123" y="164" width="7" height="20" rx="3.5" fill="#b3261e" />
        <rect x="94" y="180" width="7" height="6" rx="2" fill="#e0a526" />
        <rect x="123" y="180" width="7" height="6" rx="2" fill="#e0a526" />
        <rect x="100" y="162" width="24" height="26" rx="5" fill="#b3261e" />
        <rect x="105" y="179" width="14" height="7" rx="2" fill="#e0a526" />
        <circle cx="112" cy="171" r="6.5" fill="#9be7ff" opacity="0.35" />
        <circle cx="112" cy="171" r="3.8" fill="#c9f5ff" />
        <rect x="100" y="137" width="24" height="26" rx="9" fill="#b3261e" />
        <path d="M104 145h16v10c0 6-4 8-8 9-4-1-8-3-8-9z" fill="#e0a526" />
        <rect x="106" y="149" width="5" height="2.2" rx="1" fill="#e9fbff" />
        <rect x="113" y="149" width="5" height="2.2" rx="1" fill="#e9fbff" />
      </g>
      <g filter="url(#ink-outline)">
        {/* hammer standing on its head */}
        <rect x="147" y="158" width="6" height="28" rx="2" fill="#6b4a2b" />
        <path d="M147 164h6M147 169h6M147 174h6" stroke="#4e3420" strokeWidth="1.5" />
        <rect x="136" y="184" width="28" height="16" rx="3" fill="#9aa3ab" />
        <rect x="136" y="184" width="5" height="16" rx="2" fill="#7d868e" />
        <rect x="159" y="184" width="5" height="16" rx="2" fill="#7d868e" />
      </g>

      {/* ---------- coffee (right, next to him) ---------- */}
      <path className="steam" d="M334 160c-4-5 4-8 0-14" stroke="#eef2f4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path className="steam steam-2" d="M344 160c-4-5 4-8 0-14" stroke="#eef2f4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <g filter="url(#ink-outline)">
        <path d="M354 176h4a7 7 0 0 1 0 14h-4" stroke="#f4f1ea" strokeWidth="4" fill="none" />
        <rect x="326" y="166" width="29" height="34" rx="4" fill="#f4f1ea" />
        <rect x="326" y="178" width="29" height="7" fill="#ffc20e" />
      </g>

      {/* ---------- "Hi!" bubble ---------- */}
      <g className="hi-pop">
        <path d="M330 58l-14 18 26-14z" fill="#f4f1ea" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <rect x="318" y="12" width="84" height="48" rx="16" fill="#f4f1ea" stroke={INK} strokeWidth="3" />
        <path d="M330 57l-10 14" stroke="#f4f1ea" strokeWidth="4" />
        <text x="360" y="48" textAnchor="middle" fontSize="32" fill={INK} style={{ fontFamily: "var(--font-anton), Impact, sans-serif" }}>
          Hi!
        </text>
      </g>

      {/* soft shadow where he sits on the ledge */}
      <ellipse cx="260" cy="212" rx="64" ry="9" fill="#000" opacity="0.22" />

      {/* ---------- legs: swing from the knee ---------- */}
      <g filter="url(#ink-outline)">
        <g className="leg leg-l">
          <path d="M229 204h29l-2 86h-25z" fill="#25324a" />
          <path d="M243 216l1 70" stroke="#1b2536" strokeWidth="2" />
          <rect x="231" y="284" width="25" height="14" rx="3" fill="#ffc20e" />
          <path d="M231 290h25" stroke="#e0a526" strokeWidth="2" />
          <path d="M226 298h34v18c0 7-5 10-12 10h-28c-7 0-8-5-5-10z" fill="#f4f1ea" />
          <path d="M214 324h46" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d="M234 306l14 4" stroke="#ffc20e" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g className="leg leg-r">
          <path d="M262 204h29l-3 86h-25z" fill="#25324a" />
          <path d="M276 216l-1 70" stroke="#1b2536" strokeWidth="2" />
          <rect x="263" y="284" width="25" height="14" rx="3" fill="#ffc20e" />
          <path d="M263 290h25" stroke="#e0a526" strokeWidth="2" />
          <path d="M260 298h34l6 18c3 5 1 10-5 10h-25c-7 0-10-3-10-10z" fill="#f4f1ea" />
          <path d="M260 324h42" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d="M268 306l14 4" stroke="#ffc20e" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* ---------- upper body: breathes ---------- */}
      <g className="breathe">
        <g filter="url(#ink-outline)">
          {/* hoodie */}
          <path d="M222 140c4-12 20-18 38-18s34 6 38 18l6 66h-88z" fill={HOODIE} />
          <path d="M282 127c10 4 15 9 16 13l6 66h-22z" fill={HOODIE_SHADE} />
          {/* resting arm (his left) */}
          <path d="M296 138l18 30-14 8-10-24z" fill={HOODIE} />
          <path d="M302 170l4 26-14 2v-26z" fill={SKIN} />
          {/* waving arm (his right), sleeve pushed up */}
          <path d="M228 134l-28-12-6 16 30 14z" fill={HOODIE} />
          <path d="M200 122l-14-2-4 16 12 2z" fill={SKIN} />
          <g className="wave">
            <path d="M180 130l-4-38 14-2 4 38z" fill={SKIN} />
            <ellipse cx="182" cy="82" rx="11" ry="12" fill={SKIN} />
            <rect x="172.5" y="59" width="5" height="17" rx="2.5" fill={SKIN} />
            <rect x="178.5" y="55" width="5" height="19" rx="2.5" fill={SKIN} />
            <rect x="184.5" y="56" width="5" height="18" rx="2.5" fill={SKIN} />
            <rect x="190" y="61" width="5" height="15" rx="2.5" fill={SKIN} />
            <path d="M191 84l9-7 3 4-9 7z" fill={SKIN} />
          </g>
          {/* laptop on his lap (back of the lid) */}
          <rect x="216" y="150" width="88" height="56" rx="6" fill="#2f343d" />
          <rect x="212" y="202" width="96" height="8" rx="3" fill="#22262d" />
        </g>
        {/* inner details drawn without the outline filter */}
        <path d="M198 123l-5 15" stroke={HOODIE_SHADE} strokeWidth="5" strokeLinecap="round" />
        <path d="M176 76h12" stroke={SKIN_DARK} strokeWidth="1.5" opacity="0.6" />
        <circle cx="260" cy="177" r="12" fill="#ffc20e" opacity="0.25" />
        <circle cx="260" cy="177" r="7" fill="#ffc20e" />
        <path d="M232 160l2 4.5 4.8.4-3.6 3.2 1.1 4.7-4.3-2.5-4.3 2.5 1.1-4.7-3.6-3.2 4.8-.4z" fill="#ffd23f" />
        <rect x="278" y="188" width="18" height="10" rx="2" fill="#f4f1ea" transform="rotate(-8 287 193)" />
        <path d="M283 190l-2 3 2 3M291 190l2 3-2 3" stroke={INK} strokeWidth="1.4" fill="none" transform="rotate(-8 287 193)" />

        {/* ---------- head: tilts now and then ---------- */}
        <g className="head-tilt">
          <g filter="url(#ink-outline)">
            {/* hood bunched behind the neck */}
            <path d="M232 134c-4-16 10-26 28-26s32 10 28 26c-8-7-18-10-28-10s-20 3-28 10z" fill={HOODIE_SHADE} />
            <rect x="249" y="110" width="22" height="22" rx="4" fill={SKIN_DARK} />
            <ellipse cx="222" cy="86" rx="6" ry="9" fill={SKIN_DARK} />
            <ellipse cx="298" cy="86" rx="6" ry="9" fill={SKIN_DARK} />
            <ellipse cx="260" cy="82" rx="37" ry="41" fill={SKIN} />
            {/* hair */}
            <path d="M222 84c-6-38 14-62 42-62s42 20 36 58c-4-14-8-22-14-26-16 4-40 2-54-4-4 10-7 22-10 34z" fill={HAIR} />
            <path d="M228 56c4-26 34-42 62-30 12 6 16 18 12 30-10-14-26-16-40-12-12 4-24 8-34 12z" fill={HAIR} />
          </g>
          {/* drawstrings */}
          <path d="M252 128v22M268 128v22" stroke={INK} strokeWidth="2" />
          <circle cx="252" cy="151" r="2.6" fill="#ffc20e" />
          <circle cx="268" cy="151" r="2.6" fill="#ffc20e" />

          <path d="M240 30c8-18 34-24 52-12-12-2-24 0-34 6z" fill="#2a1f18" />
          <path d="M252 31c12-7 28-7 40 2" stroke="#4a3a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="223" y="72" width="5" height="16" rx="2" fill={HAIR} />
          <rect x="292" y="72" width="5" height="16" rx="2" fill={HAIR} />
          <circle cx="238" cy="98" r="5" fill="#e0806a" opacity="0.35" />
          <circle cx="282" cy="98" r="5" fill="#e0806a" opacity="0.35" />

          <path d="M237 66q9-6 19-1M264 65q10-5 19 1" stroke={HAIR} strokeWidth="3.5" fill="none" strokeLinecap="round" />

          {/* eyes (blink + follow cursor) */}
          <g className="blink">
            <ellipse cx="247" cy="82" rx="6.5" ry="7" fill="#ffffff" />
            <ellipse cx="273" cy="82" rx="6.5" ry="7" fill="#ffffff" />
            <g ref={pupilsRef}>
              <circle cx="247" cy="83" r="3.6" fill={HAIR} />
              <circle cx="273" cy="83" r="3.6" fill={HAIR} />
              <circle cx="248.3" cy="81.6" r="1.1" fill="#ffffff" />
              <circle cx="274.3" cy="81.6" r="1.1" fill="#ffffff" />
            </g>
          </g>

          <g stroke={HAIR} strokeWidth="2.5" fill="#ffffff" fillOpacity="0.1">
            <rect x="236" y="72" width="22" height="20" rx="7" />
            <rect x="262" y="72" width="22" height="20" rx="7" />
            <path d="M258 80h4M236 79l-12-2M284 79l12-2" fill="none" />
          </g>

          <path d="M260 87q-3 8 2 9" stroke={SKIN_DARK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M248 102q12 13 24 0z" fill="#5a2418" />
          <path d="M250 102.5q10 4 20 0l-1 2.5q-9 3-18 0z" fill="#ffffff" />

          {/* soft light from the laptop screen */}
          <ellipse cx="260" cy="108" rx="34" ry="18" fill="url(#screen-glow)" />
        </g>
      </g>
    </svg>
  );
}
