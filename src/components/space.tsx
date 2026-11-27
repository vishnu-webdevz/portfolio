"use client";

import { useRef, useState } from "react";

/* Header backdrop. Light theme: a day sky with the sun, clouds and birds (the
   sun flares on click). Dark theme: deep space with the moon, planets,
   asteroids, a comet and a UFO (stars burst on click; the UFO zips off).
   Both are drawn; CSS fades between them from the html data-theme. */

// Deterministic pseudo-random so server and client render the same stars.
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

type Star = { id: number; x: number; y: number; r: number; delay: number };

const STARS: Star[] = (() => {
  const rand = rng(42);
  return Array.from({ length: 70 }, (_, id) => ({
    id,
    x: Math.round(rand() * 1440),
    y: Math.round(rand() * 200),
    r: +(0.8 + rand() * 1.6).toFixed(2),
    delay: +(rand() * 4).toFixed(2),
  }));
})();

// Daytime clouds and birds (light theme).
const CLOUDS = [
  { x: 430, y: 70, s: 1 },
  { x: 640, y: 150, s: 0.7 },
  { x: 900, y: 50, s: 0.85 },
  { x: 1120, y: 120, s: 1.1 },
  { x: 1330, y: 60, s: 0.8 },
  { x: 90, y: 160, s: 0.6 },
];
const BIRDS = [
  { x: 540, y: 52 },
  { x: 566, y: 64 },
  { x: 1010, y: 88 },
  { x: 1034, y: 98 },
];

const SPARKS = Array.from({ length: 10 }, (_, i) => i * 36);

type Burst = { key: number; x: number; y: number };

export function SpaceBackdrop() {
  const [popped, setPopped] = useState<Set<number>>(new Set());
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [count, setCount] = useState(0);
  const [flare, setFlare] = useState(0);
  const [ufoGone, setUfoGone] = useState(false);
  const burstId = useRef(0);

  function explode(star: Star) {
    if (popped.has(star.id)) return;
    const key = ++burstId.current;
    setPopped((s) => new Set(s).add(star.id));
    setBursts((b) => [...b, { key, x: star.x, y: star.y }]);
    setCount((c) => c + 1);
    // remove the burst, then let the star fade back in
    setTimeout(() => setBursts((b) => b.filter((x) => x.key !== key)), 900);
    setTimeout(
      () =>
        setPopped((s) => {
          const next = new Set(s);
          next.delete(star.id);
          return next;
        }),
      2600,
    );
  }

  return (
    <div className="absolute inset-0">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 260"
        preserveAspectRatio="xMidYMax slice"
        role="img"
        aria-label="Sky scene: a sunny day in the light theme, a starry night with the moon in the dark theme"
      >
        <defs>
          <linearGradient id="space" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#060a1c" />
            <stop offset="0.6" stopColor="#0f1a3a" />
            <stop offset="1" stopColor="#1d2c52" />
          </linearGradient>
          <linearGradient id="day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5fb6ea" />
            <stop offset="0.6" stopColor="#a9dcf6" />
            <stop offset="1" stopColor="#fff1c9" />
          </linearGradient>
          <radialGradient id="sunGlow">
            <stop offset="0" stopColor="#ffd96b" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffb020" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="haze" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#2b4a7a" stopOpacity="0.5" />
            <stop offset="1" stopColor="#2b4a7a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="comet" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff6d8" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* ================= DAY (light theme) ================= */}
        <g className="sky-day">
          <rect width="1440" height="260" fill="url(#day)" />
        </g>

        {/* ================= NIGHT (dark theme) ================= */}
        <g className="sky-night">
        <rect width="1440" height="260" fill="url(#space)" />
        <ellipse cx="620" cy="120" rx="360" ry="110" fill="url(#haze)" />
        <ellipse cx="1180" cy="60" rx="240" ry="80" fill="url(#haze)" />

        {/* ---------- stars (click to explode) ---------- */}
        {STARS.map((s) => {
          const gone = popped.has(s.id);
          return (
            <g
              key={s.id}
              onClick={() => explode(s)}
              className="cursor-pointer"
              style={{ pointerEvents: gone ? "none" : "auto" }}
            >
              <circle cx={s.x} cy={s.y} r="9" fill="transparent" />
              <circle
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="#fff8e1"
                className={gone ? "star-gone" : "twinkle star-hover"}
                style={{ animationDelay: `${s.delay}s` }}
              />
            </g>
          );
        })}

        {/* ---------- comet ---------- */}
        <g className="comet">
          <path d="M0 0h90" stroke="url(#comet)" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="90" cy="0" r="3" fill="#fffbea" />
        </g>

        </g>

        {/* ---------- day: sun (click to flare), clouds and birds ---------- */}
        <g className="sky-day">
        {CLOUDS.map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
            <g className="cloud" style={{ animationDelay: `${-i * 4}s` }}>
              <ellipse cx="0" cy="0" rx="48" ry="15" fill="#ffffff" />
              <circle cx="-20" cy="-9" r="17" fill="#ffffff" />
              <circle cx="8" cy="-16" r="22" fill="#ffffff" />
              <circle cx="31" cy="-6" r="14" fill="#ffffff" />
              <ellipse cx="0" cy="8" rx="46" ry="6" fill="#d7ecf8" opacity="0.8" />
            </g>
          </g>
        ))}
        {BIRDS.map((b, i) => (
          <path
            key={i}
            className="bird"
            d={`M${b.x} ${b.y}q6 -6 12 0q6 -6 12 0`}
            stroke="#2c4458"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
        <g className="sun-group cursor-pointer" onClick={() => setFlare((f) => f + 1)}>
          <circle cx="230" cy="78" r="80" fill="url(#sunGlow)" pointerEvents="none" className="sun-glow" />
          <g key={flare} className={flare ? "sun-flare" : ""} style={{ transformOrigin: "230px 78px" }}>
            <g className="sun-rays" style={{ transformOrigin: "230px 78px" }}>
              {Array.from({ length: 12 }, (_, i) => (
                <path
                  key={i}
                  d="M230 28l5 14h-10z"
                  fill="#ffc20e"
                  transform={`rotate(${i * 30} 230 78)`}
                />
              ))}
            </g>
            <circle cx="230" cy="78" r="32" fill="#ffc20e" />
            <circle cx="230" cy="78" r="24" fill="#ffd54a" />
            <circle cx="221" cy="70" r="7" fill="#ffe58a" opacity="0.8" />
          </g>
        </g>

        </g>

        {/* ---------- night: moon, planets, asteroids, UFO ---------- */}
        <g className="sky-night">
        {/* ---------- moon ---------- */}
        <g className="float-slow" style={{ transformOrigin: "470px 60px" }}>
          <g className="planet-hover moon-hover">
            <circle cx="470" cy="60" r="24" fill="#d9dbe2" />
            <circle cx="461" cy="52" r="5" fill="#b9bcc7" />
            <circle cx="479" cy="66" r="7" fill="#b9bcc7" />
            <circle cx="466" cy="72" r="3" fill="#b9bcc7" />
            <circle cx="481" cy="49" r="2.5" fill="#b9bcc7" />
            <path d="M470 36a24 24 0 0 1 0 48a30 30 0 0 0 0-48z" fill="#000" opacity="0.12" />
          </g>
        </g>

        {/* small blue planet + red planet (bigger invisible hit areas) */}
        <g className="planet-hover blue-hover">
          <circle cx="575" cy="34" r="18" fill="transparent" />
          <circle cx="575" cy="34" r="11" fill="#4f8fd6" />
          <path d="M566 30q9 3 18 0M565 37q10 3 20 0" stroke="#7fb3ea" strokeWidth="2" fill="none" />
        </g>
        <g className="planet-hover red-hover">
          <circle cx="905" cy="40" r="16" fill="transparent" />
          <circle cx="905" cy="40" r="8" fill="#d0613c" />
          <circle cx="902" cy="37" r="2" fill="#a8482a" />
        </g>

        {/* ---------- ringed planet ---------- */}
        <g className="float" style={{ transformOrigin: "1080px 92px" }}>
          <g className="planet-hover ringed-hover">
          <ellipse cx="1080" cy="92" rx="62" ry="13" fill="none" stroke="#e8c27a" strokeWidth="5" transform="rotate(-14 1080 92)" />
          <circle cx="1080" cy="92" r="30" fill="#f0a64a" />
          <path d="M1052 84q28 8 56 0M1051 96q29 8 58 0" stroke="#d98a30" strokeWidth="4" fill="none" />
          {/* front half of the ring over the planet */}
          <path d="M1020 107a62 13 -14 0 0 120 -30" fill="none" stroke="#f5d391" strokeWidth="5" transform="rotate(-14 1080 92)" />
          </g>
        </g>

        {/* ---------- asteroids ---------- */}
        {[
          { x: 360, y: 150, s: 1, d: 0 },
          { x: 800, y: 120, s: 0.7, d: 2 },
          { x: 960, y: 170, s: 1.2, d: 1 },
          { x: 1340, y: 150, s: 0.9, d: 3 },
          { x: 150, y: 175, s: 0.6, d: 1.5 },
        ].map((a, i) => (
          <g key={i} transform={`translate(${a.x} ${a.y}) scale(${a.s})`}>
            <g className="drift" style={{ animationDelay: `${a.d}s` }}>
              <path d="M-12 -4l6-8 10 1 8 7-2 10-9 5-10-2-5-7z" fill="#6b7287" />
              <circle cx="-3" cy="-2" r="2.5" fill="#545a6d" />
              <circle cx="5" cy="4" r="1.8" fill="#545a6d" />
            </g>
          </g>
        ))}

        {/* ---------- UFO (click to zip away) ---------- */}
        <g
          className={`cursor-pointer ${ufoGone ? "ufo-zip" : "float"}`}
          style={{ transformOrigin: "1270px 50px" }}
          onClick={() => {
            if (ufoGone) return;
            setUfoGone(true);
            setTimeout(() => setUfoGone(false), 2200);
          }}
        >
          <g className="ufo-hover">
            <path className="ufo-beam" d="M1258 58l-14 40h52l-14-40z" fill="#ffe27a" />
            <ellipse cx="1270" cy="46" rx="10" ry="9" fill="#9be7ff" opacity="0.85" />
            <ellipse cx="1270" cy="54" rx="26" ry="8" fill="#b8c0cc" />
            <ellipse cx="1270" cy="52" rx="26" ry="4" fill="#d5dbe3" />
            <circle cx="1255" cy="56" r="2" fill="#ffc20e" />
            <circle cx="1270" cy="58" r="2" fill="#ffc20e" />
            <circle cx="1285" cy="56" r="2" fill="#ffc20e" />
          </g>
        </g>

        </g>

        {/* ---------- star bursts ---------- */}
        {bursts.map((b) => (
          <g key={b.key} transform={`translate(${b.x} ${b.y})`} pointerEvents="none">
            <circle r="7" fill="#ffe27a" className="burst-flash" />
            {SPARKS.map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <circle cx="0" cy="0" r="3" fill={deg % 72 === 0 ? "#ffc20e" : "#fff8e1"} className="spark" />
              </g>
            ))}
          </g>
        ))}
      </svg>

      <p className="sky-night pointer-events-none absolute right-3 top-2 font-sans text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/45 sm:right-5 sm:top-3">
        ✦ Click the stars{count > 0 && ` · ${count} popped`}
      </p>
      <p className="sky-day pointer-events-none absolute right-3 top-2 font-sans text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#1f3a52]/55 sm:right-5 sm:top-3">
        ☀ Click the sun
      </p>
    </div>
  );
}
