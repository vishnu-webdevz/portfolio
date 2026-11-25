import { about, aiWorkflow, experience, projects, site, skills } from "@/content";
import { LedgeProps } from "@/components/scene";
import { SpaceBackdrop } from "@/components/space";
import { Developer } from "@/components/developer";
import { PageSky } from "@/components/page-sky";
import { WorkGrid } from "@/components/work-grid";
import { PlanetBlast } from "@/components/planet-blast";
import { Journey } from "@/components/journey";

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

function SocialCircles({ dark = false }: { dark?: boolean }) {
  return (
    <ul className="flex items-center gap-2">
      {site.socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            className={`grid size-11 place-items-center rounded-full transition-transform hover:-translate-y-0.5 ${
              dark ? "bg-yellow text-ink" : "bg-ink text-yellow"
            }`}
          >
            {s.label === "GitHub" ? <GitHubIcon className="size-5" /> : <LinkedInIcon className="size-5" />}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-yellow"
      >
        Skip to content
      </a>

      {/* ---------- Illustrated header ---------- */}
      <header id="top" className="relative">
        <div className="relative h-[170px] overflow-hidden sm:h-[260px]">
          <SpaceBackdrop />
          <div className="absolute inset-x-0 bottom-0 h-[34px] sm:h-[44px]">
            <div className="absolute inset-x-0 -top-px h-[6px] bg-[#c99a1e]" />
            <div className="absolute inset-0 top-[5px] bg-mustard" />
            <div className="absolute inset-x-0 bottom-0 h-[6px] bg-[#6b4e08]" />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-[34px] mx-auto h-16 max-w-6xl sm:bottom-[44px]">
            <LedgeProps />
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          {/* The developer sits on the ledge; legs hang into the yellow. */}
          {/* Seat (y=200 of 420) lines up with the ledge top at every size. */}
          <Developer className="pointer-events-none absolute -top-[144px] right-0 w-[286px] sm:-top-[224px] sm:left-1/2 sm:right-auto sm:w-[468px] sm:-translate-x-1/2" />

          <div className="flex flex-col gap-6 border-b-2 border-ink/10 pb-6 pt-6 sm:pt-8 xl:flex-row xl:items-end xl:justify-between">
            <a href="#top" className="block max-w-full pr-[150px] sm:w-fit sm:pr-0">
              <p className="font-display text-[3.4rem] uppercase leading-[0.9] tracking-[-0.01em] sm:text-7xl">
                {site.name}
              </p>
              <p className="mt-2 text-[0.7rem] font-extrabold uppercase tracking-[0.06em] sm:text-sm">
                {site.tagline.map((t, i) => (
                  <span key={t} className="whitespace-nowrap">
                    {i > 0 && " • "}
                    {t}
                  </span>
                ))}
              </p>
            </a>

            <nav aria-label="Primary" className="-mx-2 overflow-x-auto [scrollbar-width:none]">
              <ul className="flex items-center gap-1 sm:gap-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block whitespace-nowrap rounded-md px-3 py-2 text-sm font-extrabold uppercase tracking-wide transition-colors hover:bg-yellow-tab sm:px-4 sm:text-[0.95rem]"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="hidden sm:block">
                  <a
                    href={site.resumeUrl}
                    download
                    className="ml-1 inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-ink px-5 py-2 text-[0.95rem] font-extrabold uppercase tracking-wide text-yellow transition-transform hover:-translate-y-0.5"
                  >
                    Résumé
                    <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
                    </svg>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* ---------- Hero ---------- */}
        <section className="doodle doodle-yellow relative overflow-hidden">
          <PageSky seed={3} />
          <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="rise inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl bg-ink sm:rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-yellow sm:text-sm">
                <span className="size-2 rounded-full bg-yellow" aria-hidden="true" />
                {site.role} @ {site.company}
                <span className="text-yellow/60">· {site.location}</span>
              </p>
              <h1 className="rise mt-6 font-display text-[4.6rem] uppercase leading-[0.9] tracking-[-0.01em] [animation-delay:60ms] sm:text-[7rem] lg:text-[8rem]">
                <span className="block">Hi, I&rsquo;m</span>
                <span className="block text-oxblood">{site.name}.</span>
              </h1>
              <p className="rise mt-5 text-sm font-extrabold uppercase tracking-[0.16em] text-ink/80 [animation-delay:140ms] sm:text-base">
                {site.subline}
              </p>
              <p className="rise mt-6 max-w-lg text-lg font-medium leading-relaxed [animation-delay:200ms] sm:text-xl">
                {site.intro}
              </p>
              <div className="rise mt-9 flex flex-wrap items-center gap-4 [animation-delay:260ms]">
                <a
                  href="#work"
                  className="rounded-xl bg-ink px-8 py-4 text-base font-extrabold uppercase tracking-wide text-yellow shadow-[0_6px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_rgba(0,0,0,0.25)]"
                >
                  See my work
                </a>
                <a
                  href={site.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-xl border-[3px] border-ink bg-cream px-6 py-[13px] text-base font-extrabold uppercase tracking-wide shadow-[0_6px_0_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_rgba(0,0,0,0.25)]"
                >
                  Résumé
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
                  </svg>
                </a>
                <a href="#contact" className="font-extrabold uppercase tracking-wide underline decoration-2 underline-offset-[6px] hover:decoration-4">
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
        <section aria-label="At a glance" className="bg-ink text-cream">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col-reverse justify-end border-cream/10 px-5 py-8 sm:px-8 sm:py-10 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
              >
                <dt className="mt-2 text-xs font-extrabold uppercase tracking-[0.16em] text-cream/60">{s.label}</dt>
                <dd className="font-display text-5xl text-yellow sm:text-6xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- Journey ---------- */}
        {hasJourney && (
          <section id="journey" className="topo relative overflow-hidden border-y-2 border-ink/10">
              <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
              <div className="text-center">
                <p className="font-script text-4xl text-oxblood">the road so far</p>
                <h2 className="font-display text-6xl uppercase leading-none sm:text-7xl">My journey</h2>
                <p className="mx-auto mt-3 max-w-md font-medium text-ink/75">Scroll down and walk the road with me.</p>
              </div>
              <div className="mt-14">
                <Journey items={experience} />
              </div>
            </div>
          </section>
        )}

        {/* ---------- Toolbox ---------- */}
        <section id="skills" className="doodle doodle-deep relative overflow-hidden">
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <h2 className="font-display text-6xl uppercase leading-none sm:text-7xl">Toolbox</h2>
            <p className="mt-3 max-w-md font-medium text-ink/80">The languages, frameworks and habits I use every day.</p>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {skills.map((group, gi) => (
                <div key={group.group}>
                  <h3 className="flex items-center gap-3 text-sm font-extrabold uppercase tracking-[0.14em]">
                    <span className="font-display text-2xl text-oxblood">0{gi + 1}</span>
                    {group.group}
                  </h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {group.items.map((item, i) => (
                      <li
                        key={item}
                        className={`rounded-full px-4 py-2 text-sm font-bold ${
                          i < 2 ? "bg-ink text-yellow" : "border-2 border-ink/80 text-ink"
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
            <div className="mt-16 rounded-3xl border-[3px] border-ink bg-ink p-6 text-cream shadow-[8px_8px_0_rgba(22,18,15,0.35)] sm:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-script text-3xl text-yellow">supercharged with</p>
                  <h3 className="font-display text-4xl uppercase leading-none text-cream sm:text-5xl">AI-powered workflow</h3>
                </div>
                <p className="max-w-sm text-cream/70">
                  I use AI tools across the whole build — from the first page to review, release and project tracking.
                </p>
              </div>
              <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {aiWorkflow.map((item) => (
                  <li
                    key={item.tool}
                    className="group rounded-2xl border-2 border-cream/15 bg-cream/[0.04] p-5 transition-colors hover:border-yellow hover:bg-yellow/[0.07]"
                  >
                    <p className="flex items-center gap-2 font-extrabold uppercase tracking-wide text-yellow">
                      <span className="size-2.5 rounded-full bg-yellow transition-transform group-hover:scale-150" aria-hidden="true" />
                      {item.tool}
                    </p>
                    <p className="mt-2 leading-relaxed text-cream/80">{item.what}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- Work ---------- */}
        <section id="work" className="relative overflow-hidden border-t-2 border-ink/10">
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-script text-4xl text-oxblood">things I&rsquo;m building</p>
                <h2 className="font-display text-6xl uppercase leading-none sm:text-7xl">Selected work</h2>
              </div>
              <p className="max-w-sm font-medium text-ink/75">
                Senior-level products I&rsquo;m building now — each one a deep dive into a hard problem.
              </p>
            </div>
            <WorkGrid projects={projects} />
          </div>
        </section>

        {/* ---------- About ---------- */}
        <section id="about" className="relative overflow-hidden">
          <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[3fr_2fr] lg:items-center lg:gap-20">
            <div>
              <p className="font-script text-4xl text-oxblood">a little about</p>
              <h2 className="font-display text-6xl uppercase leading-none sm:text-7xl">About me</h2>
              <div className="mt-8 space-y-5 text-lg font-medium leading-relaxed text-ink/85">
                {about.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
            <div className="-rotate-1 rounded-2xl bg-cream p-6 shadow-[6px_6px_0_var(--ink)]">
              <p className="font-script text-3xl text-oxblood">When I&rsquo;m not coding…</p>
              <ul className="mt-3 space-y-2 font-semibold">
                {about.outside.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="doodle doodle-ink relative overflow-hidden text-cream">
          <PageSky seed={23} />
          <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <h2 className="relative w-fit">
              <span className="block font-display text-[3.8rem] uppercase leading-[0.9] text-yellow sm:text-[7.5rem]">
                Let&rsquo;s build
                <br />
                something
              </span>
              <span className="absolute -bottom-7 right-0 -rotate-6 font-script text-5xl text-cream sm:-bottom-10 sm:text-7xl">
                together
              </span>
            </h2>
            <p className="mt-16 max-w-xl text-lg text-cream/80">
              Have a project, a role or just a question? Send a message — I usually reply within a couple of days.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <a
                href={`mailto:${site.email}`}
                className="max-w-full break-all rounded-xl bg-yellow px-6 py-4 text-base font-extrabold tracking-wide text-ink shadow-[0_6px_0_#b8860b] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_2px_0_#b8860b] sm:px-8"
              >
                {site.email}
              </a>
              {site.resumeUrl && (
                <a href={site.resumeUrl} className="font-extrabold uppercase tracking-wide underline decoration-2 underline-offset-[6px]">
                  Download résumé
                </a>
              )}
              <SocialCircles dark />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink text-cream/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 border-t border-cream/10 px-5 py-7 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 {site.name}. Designed &amp; built with Next.js and Tailwind CSS.</p>
          <a href="#top" className="font-semibold hover:text-yellow">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
