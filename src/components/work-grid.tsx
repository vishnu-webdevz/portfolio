import type { Project } from "@/content";

/** A generated "screenshot" so projects look distinct without real images yet. */
function Thumb({ project, index }: { project: Project; index: number }) {
  const [bg, main, accent] = project.palette;
  const v = index % 3;
  return (
    <svg viewBox="0 0 320 200" className="block h-auto w-full" aria-hidden="true">
      <rect width="320" height="200" fill={bg} />
      <rect width="320" height="22" fill={main} opacity="0.18" />
      <circle cx="14" cy="11" r="4" fill={accent} />
      <circle cx="28" cy="11" r="4" fill={main} opacity="0.6" />
      <circle cx="42" cy="11" r="4" fill={main} opacity="0.35" />
      {v === 0 && (
        <>
          <rect x="22" y="44" width="150" height="20" rx="3" fill={main} />
          <rect x="22" y="72" width="110" height="10" rx="3" fill={accent} opacity="0.7" />
          <rect x="22" y="96" width="64" height="22" rx="11" fill={accent} />
          <rect x="196" y="40" width="104" height="136" rx="8" fill={main} opacity="0.9" />
          <rect x="22" y="140" width="48" height="36" rx="4" fill={main} opacity="0.35" />
          <rect x="78" y="140" width="48" height="36" rx="4" fill={main} opacity="0.35" />
          <rect x="134" y="140" width="48" height="36" rx="4" fill={main} opacity="0.35" />
        </>
      )}
      {v === 1 && (
        <>
          <text x="160" y="92" textAnchor="middle" style={{ fontFamily: "var(--font-anton), Impact, sans-serif" }} fontSize="44" fill={main}>
            {project.title.toUpperCase()}
          </text>
          <rect x="110" y="108" width="100" height="8" rx="4" fill={accent} />
          <rect x="22" y="140" width="84" height="44" rx="4" fill={main} opacity="0.85" />
          <rect x="118" y="140" width="84" height="44" rx="4" fill={accent} opacity="0.85" />
          <rect x="214" y="140" width="84" height="44" rx="4" fill={main} opacity="0.4" />
        </>
      )}
      {v === 2 && (
        <>
          <rect x="22" y="40" width="70" height="140" rx="6" fill={main} opacity="0.25" />
          <rect x="104" y="40" width="196" height="40" rx="6" fill={main} />
          <path d="M112 166 L150 130 L184 148 L226 104 L262 124 L292 96" stroke={accent} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="104" y="92" width="196" height="88" rx="6" fill="none" stroke={main} strokeOpacity="0.3" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}

export function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        const href = project.live ?? project.code;
        return (
          <li key={project.title} className="group relative">
            <div className="relative overflow-hidden rounded-sm border-[5px] border-cream bg-cream shadow-[0_10px_24px_-12px_rgba(60,30,0,0.45)] transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:-rotate-1">
              <Thumb project={project} index={index} />
              <span className="absolute right-2 top-8 rounded-full border-2 border-ink bg-yellow px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-ink">
                {project.status}
              </span>
            </div>
            <h3 className="mt-5 text-2xl font-bold tracking-tight text-oxblood">
              {href ? (
                <a href={href} target="_blank" rel="noreferrer" className="after:absolute after:inset-0">
                  {project.title}
                </a>
              ) : (
                project.title
              )}
            </h3>
            <p className="mt-0.5 font-semibold">{project.subtitle}</p>
            <p className="mt-2 leading-relaxed text-ink/80">{project.summary}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-ink/60">{project.tags.join(" · ")}</p>
          </li>
        );
      })}
    </ul>
  );
}
