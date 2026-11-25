---
title: "Stuck on the Same Old WordPress Site? Go Headless with Next.js (and Keep the Editor You Love)"
slug: wordpress-to-headless-nextjs
excerpt: "Keep WordPress as your content editor, put a fast Next.js frontend in front of it, and migrate without breaking SEO. A step-by-step guide."
tags: [WordPress, Headless CMS, Next.js, WPGraphQL, Performance]
reading_time: 11 min
date: 2026-11-24
author: Vishnu
cover: /blog/wordpress-to-headless-nextjs/cover.png
cover_alt: "Editors keep wp-admin; visitors get a Next.js frontend served from the edge."
---

Your WordPress site works. It also has a theme you're scared to update, 30 plugins that each add a script to every page, and PageSpeed scores you'd rather not screenshot.

The usual answer is "rebuild on something new." The problem is your writers. They know the WordPress editor, your SEO plugin, your media library and your publish workflow. Moving them to a new tool costs months of retraining and migration.

**Headless WordPress avoids that trade-off.** WordPress stays where your team writes and manages content. Next.js takes over everything the visitor sees.

```
 Editors ──▶ WordPress (wp-admin, Gutenberg, Yoast, Media)
                    │
                    │  WPGraphQL API  (+ revalidation webhook)
                    ▼
 Visitors ◀── Next.js on the edge (static + ISR, React components)
```

## Why go headless?

| | Traditional WordPress | Headless WordPress + Next.js |
|---|---|---|
| **Speed** | PHP renders every request; plugin CSS and JS everywhere | Pages are pre-rendered and served from a CDN; you ship only the JS you need |
| **Security** | The public site *is* wp-admin's server | WordPress can sit behind a private URL or VPN; the public site is static |
| **Design freedom** | Limited by the theme and page builder | Any React component, design system or animation |
| **Scaling** | Caching plugins, bigger servers | A CDN serves traffic spikes |
| **Editor experience** | Gutenberg | **Still Gutenberg.** Nothing changes for writers |

### When *not* to go headless
Be honest about the trade-offs before you start:
- **WooCommerce-heavy stores.** Cart, checkout and account pages take real work to rebuild headless.
- **Plugins that print frontend HTML** (form builders, sliders, shortcodes) won't render on their own. Each one has to be rebuilt as a component.
- **No developer on hand.** You now run two apps. If nobody owns the frontend, stay traditional and invest in performance tuning.

---

## The migration, step by step

### Step 1: Audit what you have
Before writing code, make a list of:
- **Content types:** posts, pages, custom post types, taxonomies, ACF field groups.
- **URLs:** export every live URL (from your sitemap or Search Console). **This list protects your SEO.**
- **Plugins:** mark each one *backend only* (it keeps working: Yoast, ACF, Redirection) or *frontend* (it needs replacing: sliders, form plugins, page builders).
- **Integrations:** analytics, forms, newsletter, search, comments.

### Step 2: Turn WordPress into an API
Install these plugins on your WordPress site:

1. **WPGraphQL** adds a `/graphql` endpoint.
2. **WPGraphQL for ACF**, if you use Advanced Custom Fields.
3. **WPGraphQL Yoast SEO Addon** (or the equivalent for your SEO plugin), so titles, meta descriptions and OG tags come through the API.

Then, in **Settings → General**, keep the *WordPress Address* as your backend URL (for example `cms.yoursite.com`). The public domain will point at Next.js.

Open `https://cms.yoursite.com/graphql` with the GraphiQL IDE (under *GraphQL → GraphiQL IDE* in wp-admin) and try a query:

```graphql
query LatestPosts {
  posts(first: 10) {
    nodes {
      title
      slug
      date
      excerpt
      featuredImage { node { sourceUrl altText } }
    }
  }
}
```

If that returns your posts, the backend is ready.

### Step 3: Create the Next.js app

```bash
npx create-next-app@latest my-site --typescript --tailwind --app
```

Add the environment variables in `.env.local`:

```bash
WORDPRESS_GRAPHQL_URL=https://cms.yoursite.com/graphql
REVALIDATE_SECRET=generate-a-long-random-string
PREVIEW_SECRET=generate-another-long-random-string
```

### Step 4: Write a small, typed fetch helper

```ts
// lib/wp.ts
export async function wpQuery<T>(
  query: string,
  variables: Record<string, unknown> = {},
  { tags = [] as string[], preview = false } = {}
): Promise<T> {
  const res = await fetch(process.env.WORDPRESS_GRAPHQL_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    // Cache by tag so a webhook can refresh exactly what changed
    next: preview ? undefined : { tags: ["wp", ...tags] },
    cache: preview ? "no-store" : "force-cache",
  });

  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}
```

### Step 5: Build the routes

**Blog index**, `app/blog/page.tsx`:

```tsx
import Link from "next/link";
import { wpQuery } from "@/lib/wp";

type Data = { posts: { nodes: { title: string; slug: string; excerpt: string }[] } };

export default async function BlogIndex() {
  const { posts } = await wpQuery<Data>(
    `query { posts(first: 20) { nodes { title slug excerpt } } }`,
    {},
    { tags: ["posts"] }
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold">Blog</h1>
      <ul className="mt-8 space-y-8">
        {posts.nodes.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="text-2xl font-semibold hover:underline">
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

**Single post with SEO metadata**, `app/blog/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { Metadata } from "next";
import { wpQuery } from "@/lib/wp";

const POST_QUERY = `
  query Post($slug: ID!, $asPreview: Boolean) {
    post(id: $slug, idType: SLUG, asPreview: $asPreview) {
      title
      content
      date
      seo { title metaDesc opengraphImage { sourceUrl } }
    }
  }`;

type Post = {
  title: string; content: string; date: string;
  seo: { title: string; metaDesc: string; opengraphImage?: { sourceUrl: string } };
};

async function getPost(slug: string) {
  const { isEnabled } = await draftMode();
  const data = await wpQuery<{ post: Post | null }>(
    POST_QUERY,
    { slug, asPreview: isEnabled },
    { tags: [`post:${slug}`], preview: isEnabled }
  );
  return data.post;
}

export async function generateStaticParams() {
  const data = await wpQuery<{ posts: { nodes: { slug: string }[] } }>(
    `query { posts(first: 100) { nodes { slug } } }`
  );
  return data.posts.nodes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.seo.title,
    description: post.seo.metaDesc,
    openGraph: { images: post.seo.opengraphImage ? [post.seo.opengraphImage.sourceUrl] : [] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  return (
    <article className="prose lg:prose-lg mx-auto px-4 py-12">
      <h1>{post.title}</h1>
      <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
      {/* Gutenberg HTML: sanitize it, or map blocks to React components (see Step 8) */}
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

> **Tip:** WordPress content is HTML. If authors other than your own team can publish, sanitize it (for example with `isomorphic-dompurify`) before you render it.

### Step 6: Instant updates with on-demand revalidation
Pages are cached as static files. When an editor clicks **Update**, you want that page refreshed within seconds, without a full rebuild.

**Next.js route**, `app/api/revalidate/route.ts`:

```ts
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.headers.get("x-revalidate-secret") !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { slug } = await req.json();
  if (slug) revalidateTag(`post:${slug}`);
  revalidateTag("posts"); // listing pages
  return NextResponse.json({ ok: true });
}
```

**WordPress side.** Add this to a small custom plugin (or `functions.php`):

```php
add_action('save_post', function ($post_id, $post) {
    if (wp_is_post_revision($post_id) || $post->post_status !== 'publish') return;

    wp_remote_post('https://www.yoursite.com/api/revalidate', [
        'headers'  => [
            'Content-Type'        => 'application/json',
            'x-revalidate-secret' => NEXT_REVALIDATE_SECRET, // define in wp-config.php
        ],
        'body'     => wp_json_encode(['slug' => $post->post_name]),
        'blocking' => false,
    ]);
}, 10, 2);
```

### Step 7: Keep the Preview button working
Editors expect **Preview** to work. Point it at Next.js draft mode.

```ts
// app/api/preview/route.ts
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== process.env.PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }
  (await draftMode()).enable();
  redirect(`/blog/${searchParams.get("slug")}`);
}
```

```php
add_filter('preview_post_link', function ($link, $post) {
    return 'https://www.yoursite.com/api/preview?secret=' . NEXT_PREVIEW_SECRET
         . '&slug=' . $post->post_name;
}, 10, 2);
```

> Preview of **unpublished** drafts needs an authenticated GraphQL request, for example with the *WPGraphQL JWT Authentication* plugin or an application password, sent only from the server.

### Step 8: Render Gutenberg blocks as React components (optional, but worth it)
Plain HTML works. For full design control, map blocks to your own components. Libraries such as `html-react-parser` let you swap elements as the HTML is parsed:

```tsx
import parse, { Element } from "html-react-parser";
import Image from "next/image";

export function WPContent({ html }: { html: string }) {
  return parse(html, {
    replace(node) {
      if (node instanceof Element && node.name === "img") {
        const { src, alt, width, height } = node.attribs;
        return <Image src={src} alt={alt ?? ""} width={+width || 1200} height={+height || 800} />;
      }
    },
  });
}
```

Remember to allow your WordPress media domain in `next.config.ts` under `images.remotePatterns`.

### Step 9: Protect your SEO during the switch
SEO is where most migrations go wrong. Use this checklist:

- [ ] **Same URLs.** Match your old permalink structure (`/blog/[slug]`, `/category/[slug]`, and so on), or add a 301 for every URL that changes in `next.config.ts` `redirects()`.
- [ ] **Sitemap.** Generate one with `app/sitemap.ts` from the WPGraphQL data.
- [ ] **robots.txt.** Create `app/robots.ts`, and **block search engines from indexing `cms.yoursite.com`**.
- [ ] **Canonical tags** point to the new frontend domain.
- [ ] **Structured data.** Add JSON-LD `Article` schema to post pages.
- [ ] **RSS feed.** Add a route handler at `/feed.xml` so subscribers keep receiving posts.
- [ ] **Crawl before go-live.** Run Screaming Frog (or similar) against staging and compare the results with your URL list from Step 1.

### Step 10: Deploy and switch DNS
1. Deploy Next.js (Vercel, Netlify, Cloudflare, or your own Node server).
2. Move WordPress to `cms.yoursite.com`, and optionally restrict it to your team (IP allow-list, VPN, or basic auth on everything except `/graphql` and `/wp-content/uploads`).
3. Point `www.yoursite.com` at the Next.js deployment.
4. Submit the new sitemap in Google Search Console, and watch the *Pages* report for 404s for the first two weeks.

---

## What your team notices afterwards

- **Writers:** nothing changes. They still use the same editor, the same buttons and the same Preview.
- **Visitors:** pages load from the CDN quickly, and Core Web Vitals improve.
- **Developers:** they build with React, TypeScript and Git, without fighting a theme.
- **Security:** WordPress is no longer the public face of your site.

## Next up
A fast frontend is half the story. In the next post, we use **AI to build pages from your own component library**, with guardrails so it can't use off-brand colors, invent fonts or add distracting animations.

*Want help planning your migration? [Get in touch](/#contact).*
