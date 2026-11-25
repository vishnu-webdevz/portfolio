/* Twinkling stars and a slow meteoroid that live inside one section and scroll
   with it. Place as the first child of a `relative overflow-hidden` section;
   content after it paints on top. Pure CSS animation; never captures clicks.
   Cream-filled with a dark outline so it reads on yellow and on black. */

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function Sparkle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 1.5l2.9 7.6 7.6 2.9-7.6 2.9-2.9 7.6-2.9-7.6L1.5 12l7.6-2.9z"
        fill="#fff8e1"
        stroke="#16120f"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Meteoroid() {
  return (
    <svg width="120" height="44" viewBox="0 0 120 44" aria-hidden="true">
      <defs>
        <linearGradient id="meteor-tail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff7a1a" stopOpacity="0" />
          <stop offset="0.7" stopColor="#ff7a1a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff1c2" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path d="M4 22c30-6 58-9 84-10v20c-26-1-54-4-84-10z" fill="url(#meteor-tail)" />
      <g className="meteor-spin">
        <path d="M86 12l12-6 14 3 6 12-4 13-13 6-12-4-5-12z" fill="#3b3530" stroke="#f4f1ea" strokeWidth="1.5" />
        <circle cx="98" cy="18" r="3" fill="#29241f" />
        <circle cx="107" cy="28" r="2.2" fill="#29241f" />
        <circle cx="94" cy="30" r="1.8" fill="#29241f" />
      </g>
    </svg>
  );
}

export function PageSky({ seed }: { seed: number }) {
  const rand = rng(seed);
  // Stars mostly in the side margins so they frame the content.
  const stars = Array.from({ length: 6 }, (_, i) => ({
    top: `${(8 + rand() * 84).toFixed(1)}%`,
    left: `${(i === 5 ? 40 + rand() * 25 : i % 2 ? 1.5 + rand() * 8 : 88 + rand() * 9).toFixed(1)}%`,
    size: Math.round(20 + rand() * 12),
    delay: +(rand() * 4).toFixed(2),
  }));
  const meteor = {
    y: `${Math.round(5 + rand() * 40)}cqh`,
    duration: Math.round(24 + rand() * 12),
    delay: +(rand() * 10).toFixed(1),
    scale: +(0.65 + rand() * 0.35).toFixed(2),
  };

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden [container-type:size]">
      {stars.map((s, i) => (
        <span
          key={i}
          className="page-star absolute"
          style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s` }}
        >
          <Sparkle size={s.size} />
        </span>
      ))}
      <span
        className="meteor absolute left-0 top-0"
        style={
          {
            "--y": meteor.y,
            "--s": meteor.scale,
            animationDuration: `${meteor.duration}s`,
            animationDelay: `${meteor.delay}s`,
          } as React.CSSProperties
        }
      >
        <Meteoroid />
      </span>
    </div>
  );
}
