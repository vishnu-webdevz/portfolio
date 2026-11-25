import Image from "next/image";
import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/blog";

function Meta({ post }: { post: PostMeta }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs uppercase tracking-[0.06em] text-muted">
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      {post.readingTime && (
        <>
          <span className="text-line-strong" aria-hidden="true">·</span>
          <span>{post.readingTime} read</span>
        </>
      )}
    </p>
  );
}

/** Large card for the newest post. */
export function FeaturedPostCard({ post }: { post: PostMeta }) {
  return (
    <article className="card group relative grid overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-line-strong lg:grid-cols-[1.25fr_1fr]">
      <div className="flex items-center border-b border-line bg-bg-alt p-4 sm:p-6 lg:border-b-0 lg:border-r">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-line shadow-[var(--shadow)]">
          <Image
            src={post.cover}
            alt={post.coverAlt}
            fill
            priority
            sizes="(min-width: 1024px) 620px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </div>
      <div className="flex flex-col p-6 sm:p-9">
        <p className="eyebrow">Latest post</p>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-[2rem]">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 flex-1 leading-relaxed text-muted">{post.excerpt}</p>
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((t) => (
            <li key={t} className="chip">{t}</li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-5">
          <Meta post={post} />
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text">
            Read
            <svg className="size-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="card group relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-line-strong">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-line">
        <Image
          src={post.cover}
          alt={post.coverAlt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Meta post={post} />
        <h3 className="mt-3 text-xl font-semibold leading-snug tracking-[-0.02em]">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{post.excerpt}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((t) => (
            <li key={t} className="chip">{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
