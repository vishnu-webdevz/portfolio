import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/content";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { FeaturedPostCard, PostCard } from "@/components/post-card";

export const metadata: Metadata = {
  title: `Blog — ${site.name}`,
  description: "Notes on building fast websites: headless WordPress, Next.js, design systems and AI-assisted development.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
  openGraph: {
    title: `Blog — ${site.name}`,
    description: "Notes on building fast websites: headless WordPress, Next.js, design systems and AI-assisted development.",
    type: "website",
    url: "/blog",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const [latest, ...rest] = posts;
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags)));

  return (
    <>
      <SiteHeader active="Blog" />
      <main id="main" className="flex-1">
        <section className="relative overflow-hidden">
          <div className="grid-bg grid-fade absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
            <p className="eyebrow rise">Blog</p>
            <h1 className="rise mt-4 max-w-3xl text-5xl font-semibold leading-[1] tracking-[-0.045em] [animation-delay:60ms] sm:text-6xl lg:text-7xl">
              Notes from the <span className="relative inline-block">build<span className="absolute inset-x-0 bottom-[0.06em] -z-10 h-[0.22em] rounded-sm bg-accent/35" aria-hidden="true" /></span>
              <span className="text-accent">.</span>
            </h1>
            <p className="rise mt-6 max-w-2xl text-lg leading-relaxed text-muted [animation-delay:140ms]">
              Practical write-ups on headless WordPress, Next.js, design systems and shipping faster with AI — the things I work on every day.
            </p>
            {tags.length > 0 && (
              <ul className="rise mt-8 flex flex-wrap gap-1.5 [animation-delay:200ms]" aria-label="Topics">
                {tags.map((t) => (
                  <li key={t} className="chip bg-surface">{t}</li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="border-t border-line bg-bg-alt">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            {latest ? (
              <>
                <FeaturedPostCard post={latest} />
                {rest.length > 0 && (
                  <>
                    <h2 className="eyebrow mt-16">More posts</h2>
                    <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {rest.map((p) => (
                        <li key={p.slug} className="flex">
                          <PostCard post={p} />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            ) : (
              <p className="text-muted">No posts yet — check back soon.</p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
