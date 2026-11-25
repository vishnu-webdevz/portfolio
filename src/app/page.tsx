import { about, aiWorkflow, experience, projects, site, skills } from "@/content";
import { LedgeProps } from "@/components/scene";
import { SpaceBackdrop } from "@/components/space";
import { Developer } from "@/components/developer";
import { PageSky } from "@/components/page-sky";
import { WorkGrid } from "@/components/work-grid";
import { PlanetBlast } from "@/components/planet-blast";
import { Journey } from "@/components/journey";
import { ThemeSwitcher } from "@/components/theme-switcher";

const hasJourney = experience.length > 0;

const firstYear = 2019;
const companies = new Set(experience.map((j) => j.company));
const saasLabsRoles = experience.filter((j) => j.company === "SaaS Labs").length;
const stats = [
  { value: `${2026 - firstYear}+`, label: "Years writing production code" }, // bump the year as time passes
  { value: String(companies.size), label: `Companies, ${experience.length} roles` },
  { value: `${saasLabsRoles - 1}×`, label: "Promoted at SaaS Labs" },
  { value: String(aiWorkflow.length), label: "AI-powered workflows" },
];

const nav = [
  ...(hasJourney ? [{ href: "#journey", label: "Journey" }] : []),
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

function GitHubIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11.5H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.85h-4v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75v5.29h-4V9.75Z" />
    </svg>
  );
}

function DownloadIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
    </svg>
  );
}

function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function SocialLinks() {
  return (
    <ul className="flex items-center gap-2">
      {site.socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            className="grid size-11 place-items-center rounded-full border border-inverse-line text-inverse-fg transition-colors hover:border-accent hover:text-accent"
          >
            {s.label === "GitHub" ? <GitHubIcon className="size-5" /> : <LinkedInIcon className="size-5" />}
          </a>
        </li>
      ))}
    </ul>
  );
}

function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  center = false,
  inverse = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  center?: boolean;
  inverse?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "flex flex-wrap items-end justify-between gap-6"}>
      <div>
        <p className={`eyebrow ${inverse ? "!text-accent" : ""}`}>
          {index} / {eyebrow}
        </p>
        <h2 className={`mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl ${inverse ? "text-inverse-fg" : ""}`}>{title}</h2>
      </div>
      {description && (
        <p className={`max-w-md text-[1.05rem] leading-relaxed ${center ? "mx-auto mt-4" : ""} ${inverse ? "text-inverse-muted" : "text-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Skip to content
      </a>

      {/* ---------- Illustrated header ---------- */}
      <header id="top" className="relative bg-bg">
        <div className="relative h-[170px] overflow-hidden sm:h-[260px]">
          <SpaceBackdrop />
          {/* desk ledge the developer sits on */}
          <div className="absolute inset-x-0 bottom-0 h-[30px] bg-[var(--ledge)] sm:h-[38px]">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--ledge-top)]" />
            <div className="absolute inset-x-0 top-[3px] h-px bg-white/10" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-[30px] mx-auto h-16 max-w-6xl sm:bottom-[38px]">
            <LedgeProps />
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          {/* The developer sits on the ledge; legs hang over the page. */}
          <Developer className="pointer-events-none absolute -top-[140px] right-0 w-[286px] sm:-top-[218px] sm:left-1/2 sm:right-auto sm:w-[468px] sm:-translate-x-1/2" />

          <div className="flex flex-col gap-5 border-b border-line pb-5 pt-6 sm:pt-[108px] xl:flex-row xl:items-end xl:justify-between xl:pt-[92px]">
            <a href="#top" className="group block max-w-full pr-[150px] sm:w-fit sm:pr-0">
              <p className="flex items-center gap-2 text-[1.65rem] font-semibold tracking-[-0.04em] sm:text-3xl">
                <span className="grid size-8 place-items-center rounded-md bg-accent font-mono text-sm font-semibold text-accent-ink sm:size-9" aria-hidden="true">
                  V
                </span>
                {site.name.toLowerCase()}
                <span className="text-accent">.</span>
              </p>
              <p className="mt-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted sm:text-xs">
                {site.tagline.join("  /  ")}
              </p>
            </a>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <nav aria-label="Primary" className="-mx-2 w-[calc(100%+1rem)] overflow-x-auto [scrollbar-width:none] sm:w-auto">
                <ul className="flex items-center gap-0.5 sm:gap-1">
                  {nav.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-bg-alt hover:text-fg sm:px-3.5"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="flex items-center gap-3">
                <ThemeSwitcher />
                <a href={site.resumeUrl} download className="btn btn-secondary hidden !py-2 !text-sm sm:inline-flex">
                  Résumé
                  <DownloadIcon className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden">
          <div className="grid-bg grid-fade absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="rise inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-xs text-muted shadow-[var(--shadow)]">
                <span className="relative flex size-2" aria-hidden="true">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                <span className="text-fg">{site.role}</span>
                <span>@ {site.company}</span>
                <span className="text-line-strong">·</span>
                <span>{site.location}</span>
              </p>
              <h1 className="rise mt-7 text-[3.6rem] font-semibold leading-[0.95] tracking-[-0.05em] [animation-delay:60ms] sm:text-[5.25rem] lg:text-[6rem]">
                <span className="block text-muted">Hi, I&rsquo;m</span>
                <span className="relative inline-block">
                  {site.name}
                  <span className="text-accent">.</span>
                  <span className="absolute inset-x-0 bottom-[0.08em] -z-10 h-[0.22em] rounded-sm bg-accent/35" aria-hidden="true" />
                </span>
              </h1>
              <p className="rise mt-6 text-xl font-medium tracking-[-0.01em] [animation-delay:140ms] sm:text-2xl">{site.subline}</p>
              <p className="rise mt-4 max-w-xl text-[1.05rem] leading-relaxed text-muted [animation-delay:200ms] sm:text-lg">{site.intro}</p>
              <div className="rise mt-9 flex flex-wrap items-center gap-3 [animation-delay:260ms]">
                <a href="#work" className="btn btn-primary">
                  See my work
                  <ArrowIcon />
                </a>
                <a href={site.resumeUrl} download className="btn btn-secondary">
                  Résumé
                  <DownloadIcon />
                </a>
                <a href="#contact" className="ml-2 text-[0.95rem] font-medium text-muted underline decoration-line-strong underline-offset-[6px] transition-colors hover:text-fg hover:decoration-accent">
                  Get in touch
                </a>
              </div>
            </div>

            <div className="rise mx-auto [animation-delay:350ms]">
              <PlanetBlast items={site.strengths} />
            </div>
          </div>
        </section>

        {/* ---------- Numbers ---------- */}
        <section aria-label="At a glance" className="border-y border-line bg-surface">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col-reverse justify-end border-line px-5 py-8 sm:px-8 sm:py-10 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
              >
                <dt className="mt-2 font-mono text-xs uppercase tracking-[0.06em] text-muted">{s.label}</dt>
                <dd className="text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
                  {s.value.replace(/[+×]$/, "")}
                  <span className="text-accent">{s.value.match(/[+×]$/)?.[0]}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Journey ---------- */}
        {hasJourney && (
          <section id="journey" className="topo relative overflow-hidden">
            <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
              <SectionHeader center index="01" eyebrow="The road so far" title="Career journey" description="Seven years, five roles. Scroll and walk the road with me." />
              <div className="mt-24 sm:mt-28">
                <Journey items={experience} />
              </div>
            </div>
          </section>
        )}

        {/* ---------- Toolbox ---------- */}
        <section id="skills" className="relative border-t border-line">
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <SectionHeader index="02" eyebrow="Toolbox" title="What I build with" description="The languages, frameworks and habits I use every day." />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((group, gi) => (
                <div key={group.group} className="card p-6">
                  <h3 className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold tracking-[-0.01em]">{group.group}</span>
                    <span className="font-mono text-xs text-accent-text">0{gi + 1}</span>
                  </h3>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {group.items.map((item, i) => (
                      <li
                        key={item}
                        className={`rounded-md px-2.5 py-1 text-[0.82rem] font-medium ${
                          i < 2 ? "bg-accent-soft text-fg ring-1 ring-accent/40" : "bg-bg-alt text-muted ring-1 ring-line"
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* AI-powered workflow */}
            <div className="mt-16 overflow-hidden rounded-2xl border border-inverse-line bg-inverse p-6 text-inverse-fg sm:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow !text-accent">Supercharged with AI</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">AI-powered workflow</h3>
                </div>
                <p className="max-w-sm text-inverse-muted">
                  I use AI tools across the whole build — from the first page to review, release and project tracking.
                </p>
              </div>
              <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-inverse-line bg-inverse-line sm:grid-cols-2 lg:grid-cols-3">
                {aiWorkflow.map((item, i) => (
                  <li key={item.tool} className="group bg-inverse p-6 transition-colors hover:bg-white/[0.03]">
                    <p className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{item.tool}</span>
                      <span className="font-mono text-xs text-inverse-muted transition-colors group-hover:text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </p>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-inverse-muted">{item.what}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- Work ---------- */}
        <section id="work" className="relative border-t border-line bg-bg-alt">
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <SectionHeader
              index="03"
              eyebrow="Selected work"
              title="Things I’m building"
              description="Senior-level products in progress — each one a deep dive into a hard problem."
            />
            <WorkGrid projects={projects} />
          </div>
        </section>

        {/* ---------- About ---------- */}
        <section id="about" className="relative border-t border-line">
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-20">
            <div>
              <p className="eyebrow">04 / About</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">A little about me</h2>
              <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
                {about.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
            <div className="card p-7">
              <p className="font-mono text-xs uppercase tracking-[0.08em] text-accent-text">When I&rsquo;m not coding</p>
              <ul className="mt-5 divide-y divide-line">
                {about.outside.map((item) => (
                  <li key={item} className="flex items-center gap-3 py-3 font-medium first:pt-0 last:pb-0">
                    <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="relative overflow-hidden bg-inverse text-inverse-fg">
          <PageSky seed={23} />
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <p className="eyebrow !text-accent">05 / Contact</p>
            <h2 className="mt-5 text-[2.9rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-7xl">
              Let&rsquo;s build something
              <br />
              <span className="text-accent">together.</span>
            </h2>
            <p className="mt-7 max-w-xl text-lg text-inverse-muted">
              Have a project, a role or just a question? Send a message — I usually reply within a couple of days.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href={`mailto:${site.email}`} className="btn btn-primary max-w-full break-all">
                {site.email}
                <ArrowIcon />
              </a>
              {site.resumeUrl && (
                <a
                  href={site.resumeUrl}
                  className="btn border border-inverse-line text-inverse-fg hover:border-inverse-fg"
                >
                  Download résumé
                  <DownloadIcon />
                </a>
              )}
              <SocialLinks />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-inverse-line bg-inverse text-inverse-muted">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-7 font-mono text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 {site.name}. Built with Next.js &amp; Tailwind CSS.</p>
          <a href="#top" className="hover:text-accent">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
