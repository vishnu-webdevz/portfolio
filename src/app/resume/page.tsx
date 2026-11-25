import type { Metadata } from "next";
import { aiWorkflow, experience, site, skills } from "@/content";

export const metadata: Metadata = {
  title: `${site.name} — Résumé`,
  description: `Résumé of ${site.name}, ${site.role} at ${site.company}.`,
};

/* Printable résumé built from the same content as the site.
   `public/vishnu-resume.pdf` is exported from this page. */
export default function Resume() {
  const jobs = [...experience].reverse(); // newest first
  return (
    <main className="min-h-screen bg-[#e9e4d8] py-10 print:bg-white print:py-0">
      <article className="mx-auto w-[210mm] max-w-full bg-white px-[13mm] py-[10mm] text-[9.8pt] leading-snug text-ink shadow-xl print:shadow-none">
        {/* header */}
        <header className="flex items-end justify-between gap-6 border-b-[3px] border-ink pb-4">
          <div>
            <h1 className="font-display text-[30pt] uppercase leading-none">{site.name} Vardhan</h1>
            <p className="mt-1 text-[11pt] font-extrabold uppercase tracking-[0.12em] text-oxblood">
              {site.role} · {site.company}
            </p>
          </div>
          <ul className="text-right text-[9.5pt] leading-relaxed">
            <li>{site.location}, India</li>
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href}>{s.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}</a>
              </li>
            ))}
          </ul>
        </header>

        {/* summary */}
        <section className="mt-4">
          <h2 className="resume-h">Summary</h2>
          <p className="mt-1.5">{site.intro}</p>
        </section>

        {/* experience */}
        <section className="mt-4">
          <h2 className="resume-h">Experience</h2>
          <ol className="mt-2 space-y-2.5">
            {jobs.map((job) => (
              <li key={job.role + job.period} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[11.5pt] font-bold">
                    {job.role} <span className="font-semibold text-oxblood">· {job.company}</span>
                  </h3>
                  <p className="shrink-0 text-[9.5pt] font-bold uppercase tracking-wide text-ink/70">{job.period}</p>
                </div>
                {job.location && <p className="text-[9pt] text-ink/60">{job.location}</p>}
                <p className="mt-1">{job.summary}</p>
                {job.highlights && (
                  <p className="mt-1 text-[9pt] text-ink/70">
                    <span className="font-bold text-ink">Stack:</span> {job.highlights.join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* skills */}
        <section className="mt-4 break-inside-avoid">
          <h2 className="resume-h">Skills</h2>
          <dl className="mt-2 grid grid-cols-[9rem_1fr] gap-x-4 gap-y-1">
            {skills.map((g) => (
              <div key={g.group} className="contents">
                <dt className="font-bold">{g.group}</dt>
                <dd>{g.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* AI workflow */}
        <section className="mt-4 break-inside-avoid">
          <h2 className="resume-h">AI-powered workflow</h2>
          <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-[9pt]">
            {aiWorkflow.map((a) => (
              <li key={a.tool}>
                <span className="font-bold">{a.tool}</span> — {a.what}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
