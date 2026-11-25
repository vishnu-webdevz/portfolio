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
          <text x="160" y="92" textAnchor="middle" style={{ fontFamily: "var(--font-geist), system-ui, sans-serif", fontWeight: 600, letterSpacing: "-0.04em" }} fontSize="42" fill={main}>
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
    <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => {
        const href = project.live ?? project.code;
        return (
          <li key={project.title} className="card group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-line-strong">
            <div className="relative overflow-hidden border-b border-line">
              <div className="transition-transform duration-500 group-hover:scale-[1.03]">
                <Thumb project={project} index={index} />
              </div>
              <span className="absolute right-3 top-9 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-2.5 py-0.5 font-mono text-[0.65rem] font-medium uppercase tracking-wider text-[#111113] backdrop-blur">
                <span className="size-1.5 rounded-full bg-[#f5b800]" aria-hidden="true" />
                {project.status}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-semibold tracking-[-0.02em]">
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="after:absolute after:inset-0">
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              <p className="mt-0.5 text-[0.95rem] font-medium text-accent-text">{project.subtitle}</p>
              <p className="mt-3 flex-1 leading-relaxed text-muted">{project.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
