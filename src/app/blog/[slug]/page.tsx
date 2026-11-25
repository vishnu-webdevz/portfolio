import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import { formatDate, getAllPosts, getPost, getPostSlugs } from "@/lib/blog";
import { site } from "@/content";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { PostCard } from "@/components/post-card";
import { ReadingProgress } from "@/components/reading-progress";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

async function loadPost(slug: string) {
  "use cache";
  cacheLife("max");
  return getPost(slug);
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await loadPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: `${post.title} — ${site.name}`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [{ url: post.cover, width: 1600, height: 900, alt: post.coverAlt }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.cover] },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = await loadPost((await params).slug);
  if (!post) notFound();

  const others = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 2);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${site.url}${post.cover}`,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author, url: site.url },
    keywords: post.tags.join(", "),
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <>
      <ReadingProgress targetId="post-body" />
      <SiteHeader active="Blog" />
      <main id="main" className="flex-1">
        <article>
          {/* ---------- Post header ---------- */}
          <header className="relative overflow-hidden">
            <div className="grid-bg grid-fade absolute inset-0" aria-hidden="true" />
            <div className="relative mx-auto max-w-4xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
              <Link href="/blog" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-muted transition-colors hover:text-fg">
                <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M19 12H5M11 18l-6-6 6-6" />
                </svg>
                All posts
              </Link>
              <ul className="mt-8 flex flex-wrap gap-1.5" aria-label="Tags">
                {post.tags.map((t) => (
                  <li key={t} className="chip bg-surface">{t}</li>
                ))}
              </ul>
              <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-[3.4rem]">{post.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">{post.excerpt}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-line pt-6">
                <span className="flex items-center gap-2.5">
                  <span className="grid size-9 place-items-center rounded-full bg-accent font-mono text-sm font-semibold text-accent-ink" aria-hidden="true">
                    {post.author.charAt(0)}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold">{post.author}</span>
                    <span className="block text-xs text-muted">{site.role} @ {site.company}</span>
                  </span>
                </span>
                <span className="hidden h-8 w-px bg-line sm:block" aria-hidden="true" />
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-muted">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span className="text-line-strong" aria-hidden="true">·</span>
                  <span>{post.readingTime} read</span>
                </p>
              </div>
            </div>
            <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
              <div className="card relative aspect-[16/9] overflow-hidden !rounded-2xl">
                <Image src={post.cover} alt={post.coverAlt} fill priority sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" />
              </div>
            </div>
          </header>

          {/* ---------- Body + table of contents ---------- */}
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div id="post-body" className="post-body mx-auto w-full min-w-0 max-w-[720px]" dangerouslySetInnerHTML={{ __html: post.html }} />
            {post.toc.length > 0 && (
              <aside className="hidden lg:block">
                <nav aria-label="On this page" className="sticky top-8">
                  <p className="font-mono text-xs uppercase tracking-[0.08em] text-muted">On this page</p>
                  <ol className="mt-4 space-y-2 border-l border-line text-sm">
                    {post.toc
                      .filter((t) => t.depth === 2)
                      .map((t) => (
                        <li key={t.id}>
                          <a href={`#${t.id}`} className="-ml-px block border-l border-transparent pl-4 leading-snug text-muted transition-colors hover:border-accent hover:text-fg">
                            {t.text}
                          </a>
                        </li>
                      ))}
                  </ol>
                </nav>
              </aside>
            )}
          </div>
        </article>

        {/* ---------- Author / CTA ---------- */}
        <section className="mx-auto max-w-4xl px-5 pb-16 sm:px-8">
          <div className="overflow-hidden rounded-2xl border border-inverse-line bg-inverse p-7 text-inverse-fg sm:p-10">
            <p className="eyebrow !text-accent">Written by {post.author}</p>
            <p className="mt-4 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Planning something like this? <span className="text-accent">Let&rsquo;s talk.</span>
            </p>
            <p className="mt-3 max-w-xl text-inverse-muted">
              {site.role} at {site.company}. I help teams build fast, accessible websites with Next.js, WordPress and AI-assisted workflows.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={`mailto:${site.email}`} className="btn btn-primary">Email me</a>
              <Link href="/#journey" className="btn border border-inverse-line text-inverse-fg hover:border-inverse-fg">View my journey</Link>
            </div>
          </div>
        </section>

        {others.length > 0 && (
          <section className="border-t border-line bg-bg-alt">
            <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
              <div className="flex items-end justify-between gap-4">
                <h2 className="text-3xl font-semibold tracking-[-0.03em]">Keep reading</h2>
                <Link href="/blog" className="text-sm font-medium text-muted underline decoration-line-strong underline-offset-4 hover:text-fg">All posts</Link>
              </div>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {others.map((p) => (
                  <li key={p.slug} className="flex">
                    <PostCard post={p} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
