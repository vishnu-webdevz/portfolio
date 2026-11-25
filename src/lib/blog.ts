import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Root, Element } from "hast";

/* Blog posts are Markdown files in /content/blog. Add a file with the same
   frontmatter fields to publish a new post; the slug comes from the file name. */

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  date: string; // YYYY-MM-DD
  author: string;
  cover: string;
  coverAlt: string;
};

export type TocItem = { id: string; text: string; depth: 2 | 3 };
export type Post = PostMeta & { html: string; toc: TocItem[] };

function toISODate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "").slice(0, 10);
}

function readMeta(slug: string): { meta: PostMeta; body: string } {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: String(data.title),
      excerpt: String(data.excerpt ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      readingTime: String(data.reading_time ?? ""),
      date: toISODate(data.date),
      author: String(data.author ?? "Vishnu"),
      cover: String(data.cover ?? ""),
      coverAlt: String(data.cover_alt ?? data.title),
    },
    body: content,
  };
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** All posts, newest first. */
export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => readMeta(slug).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Collects h2/h3 for the table of contents and opens external links in a new tab. */
function rehypeCollect(toc: TocItem[]) {
  return () => (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if ((node.tagName === "h2" || node.tagName === "h3") && node.properties?.id) {
        toc.push({ id: String(node.properties.id), text: toString(node), depth: node.tagName === "h2" ? 2 : 3 });
      }
      if (node.tagName === "a" && typeof node.properties?.href === "string" && /^https?:/.test(node.properties.href)) {
        node.properties.target = "_blank";
        node.properties.rel = ["noreferrer"];
      }
    });
  };
}

export async function getPost(slug: string): Promise<Post | null> {
  if (!getPostSlugs().includes(slug)) return null;
  const { meta, body } = readMeta(slug);
  const toc: TocItem[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: { light: "github-light", dark: "github-dark-dimmed" },
      keepBackground: false,
      defaultLang: "plaintext",
    })
    .use(rehypeCollect(toc))
    .use(rehypeStringify)
    .process(body);
  return { ...meta, html: String(file), toc };
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
