---
title: "Build Pages 10x Faster with AI Without Breaking Your Brand"
slug: ai-page-building-brand-guardrails
excerpt: "Let AI assemble pages from your own components, styles and animation presets, with guardrails that keep it on-brand."
tags: [AI, Design Systems, Next.js, Tailwind CSS, Brand Guidelines]
reading_time: 10 min
date: 2026-11-25
author: Vishnu
cover: /blog/ai-page-building-brand-guardrails/cover.png
cover_alt: "Six layers of guardrails between a prompt and an on-brand page."
---

Ask an AI tool to "build a landing page" and you'll get something in seconds. It will probably also use a purple gradient you've never approved, a font from nowhere, three kinds of buttons and a hero section that spins in from the left.

Speed isn't the hard part. **Consistency is.**

The fix isn't a better prompt. It's limiting what the AI is *allowed* to produce. If the only colors that exist are your brand colors, and the only animations available are the ones you've approved, the AI can't go off-brand even when it tries.

This post shows how to set that up on your existing stack. The examples use the Next.js + Tailwind frontend from our [headless WordPress migration guide](/blog/wordpress-to-headless-nextjs), and the same idea applies to any component-based system.

```
   Brand guidelines
         │
         ▼
 ┌───────────────────┐   AI can only pick from these
 │ 1. Design tokens  │◀── colors, fonts, spacing, radius, shadows
 │ 2. Components     │◀── Button, Card, Heading... with fixed variants
 │ 3. Sections       │◀── Hero, Features, CTA, FAQ... with typed props
 │ 4. Motion presets │◀── fadeUp, stagger, nothing else
 └───────────────────┘
         │
         ▼
 5. Rules file for the AI + 6. Automated checks in CI
         │
         ▼
   On-brand pages, generated fast
```

---

## Layer 1: Design tokens are the only colors that exist

Tailwind CSS v4 lets you **remove the default palette** and define only your brand values. If `bg-purple-500` doesn't exist, nobody can use it, whether that's an AI or a developer in a hurry.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Wipe the defaults: nothing off-brand is available */
  --color-*: initial;
  --font-*: initial;
  --radius-*: initial;
  --shadow-*: initial;

  /* Brand colors */
  --color-brand: #0f4c81;
  --color-brand-light: #3b7fc4;
  --color-accent: #f2a541;
  --color-ink: #1a1a2e;
  --color-muted: #6b7280;
  --color-surface: #ffffff;
  --color-surface-alt: #f5f7fa;
  --color-white: #ffffff;
  --color-transparent: transparent;

  /* Brand typography */
  --font-heading: "Poppins", sans-serif;
  --font-body: "Inter", sans-serif;

  /* Shape */
  --radius-sm: 0.375rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  --shadow-card: 0 4px 20px rgb(15 76 129 / 0.08);
}
```

Now `bg-brand`, `text-ink`, `font-heading` and `rounded-lg` work, and everything else fails to generate a style.

> **Keep tokens in one place.** Export the same values to `tokens.json` so designers (Figma Tokens or Variables), the AI rules file and your WordPress editor styles all read from one source.

## Layer 2: Components with fixed variants

Don't let anyone, human or AI, put twenty utility classes on a `<button>`. Wrap them in components that offer **named variants only**. `class-variance-authority` (CVA) works well for this:

```tsx
// components/ui/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";

const button = cva(
  "inline-flex items-center justify-center font-heading font-semibold rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  {
    variants: {
      intent: {
        primary: "bg-brand text-white hover:bg-brand-light",
        secondary: "bg-surface text-brand ring-1 ring-brand hover:bg-surface-alt",
        accent: "bg-accent text-ink hover:opacity-90",
      },
      size: {
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: { intent: "primary", size: "md" },
  }
);

type Props = VariantProps<typeof button> & { href?: string; children: React.ReactNode };

// Note: no className prop. Styling can't be overridden from outside.
export function Button({ intent, size, href, children }: Props) {
  const cls = button({ intent, size });
  return href ? <a href={href} className={cls}>{children}</a>
              : <button className={cls}>{children}</button>;
}
```

**The key decision is leaving out `className`.** Without it, a component can only look the way your design system says it should.

## Layer 3: Sections as typed templates

Pages are made of sections, not loose components. Define each section with a **schema** (we use `zod`). That gives the AI a strict contract: choose a section, fill in its fields, and nothing more.

```ts
// sections/schemas.ts
import { z } from "zod";

export const Hero = z.object({
  type: z.literal("hero"),
  eyebrow: z.string().max(30).optional(),
  heading: z.string().min(10).max(70),        // headline length rules from the brand guide
  subheading: z.string().max(160),
  cta: z.object({ label: z.string().max(24), href: z.string() }),
  layout: z.enum(["centered", "split-image"]),
  background: z.enum(["surface", "surface-alt", "brand"]), // no free-form colors
});

export const Features = z.object({
  type: z.literal("features"),
  heading: z.string().max(60),
  items: z.array(z.object({
    icon: z.enum(["speed", "shield", "chart", "users", "sparkle"]), // approved icon set only
    title: z.string().max(40),
    body: z.string().max(140),
  })).min(3).max(6),
});

export const CTA = z.object({
  type: z.literal("cta"),
  heading: z.string().max(60),
  button: z.object({ label: z.string().max(24), href: z.string() }),
});

export const Page = z.object({
  sections: z.array(z.discriminatedUnion("type", [Hero, Features, CTA])).min(1),
});
export type PageData = z.infer<typeof Page>;
```

A single renderer turns validated JSON into a page:

```tsx
// sections/RenderPage.tsx
import { Page, type PageData } from "./schemas";
import { HeroSection, FeaturesSection, CTASection } from "./index";

const registry = { hero: HeroSection, features: FeaturesSection, cta: CTASection };

export function RenderPage({ data }: { data: unknown }) {
  const page: PageData = Page.parse(data); // throws on anything off-spec
  return page.sections.map((s, i) => {
    const Section = registry[s.type] as React.ComponentType<typeof s>;
    return <Section key={i} {...s} />;
  });
}
```

The AI's job is now small and checkable: **produce JSON that passes `Page.parse()`.** It isn't writing CSS. It's filling in a form.

> **WordPress tie-in:** register the same sections as ACF Flexible Content layouts or custom Gutenberg blocks with the same fields. Editors and AI then build pages with the same building blocks.

## Layer 4: Animation presets, nothing else

Animation is where brands drift fastest. Define a **small set of named motions** and make them the only option:

```tsx
// motion/presets.tsx
"use client";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;   // the brand easing curve
const DURATION = 0.5;                        // the maximum anywhere on the site

export const presets = {
  none:    { initial: {}, whileInView: {} },
  fadeIn:  { initial: { opacity: 0 }, whileInView: { opacity: 1 } },
  fadeUp:  { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 } },
} as const;

export type MotionPreset = keyof typeof presets;

export function Reveal({ preset = "fadeUp", delay = 0, children }: {
  preset?: MotionPreset; delay?: 0 | 0.1 | 0.2; children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const p = reduce ? presets.none : presets[preset];
  return (
    <motion.div {...p} viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: DURATION, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}
```

The rules this enforces:
- **Three presets.** No spins, bounces, parallax or flips.
- **One easing curve and a 0.5s maximum duration.**
- **Delays limited to 0, 0.1 and 0.2.** Staggers stay subtle.
- **`prefers-reduced-motion` is respected automatically.**
- Sections take an optional `animation: z.enum(["none", "fadeIn", "fadeUp"])` field, so the AI can choose a preset but can't create one.

## Layer 5: A rules file the AI reads every time

Most AI coding tools read a project instruction file automatically: `CLAUDE.md` for Claude Code, `.cursor/rules` for Cursor, `.github/copilot-instructions.md` for Copilot. Put your brand rules there so the AI starts from your guidelines instead of guessing.

```markdown
# Brand & UI rules (read before any UI change)

## Build pages from sections
- New pages = JSON that validates against `sections/schemas.ts`. Do not write ad-hoc JSX layouts.
- Need something no section covers? Propose a new section schema first; don't improvise.

## Styling
- Use only components from `components/ui`. Never add a `className` prop to them.
- Colors: only brand tokens (`brand`, `brand-light`, `accent`, `ink`, `muted`, `surface`, `surface-alt`).
- Never use arbitrary values (`bg-[#...]`, `p-[13px]`), inline `style={{}}`, or new CSS files.
- Fonts: `font-heading` for headings, `font-body` for everything else.

## Motion
- Animate only with `<Reveal preset="..." />`. Never import `motion` directly in sections.
- Maximum one animated element per viewport row. No looping animations.

## Voice
- Headlines: sentence case, max 70 chars, no exclamation marks.
- CTAs: verb first, max 3 words ("Book a demo", "Start free").

## Accessibility (non-negotiable)
- Text contrast at least 4.5:1. Every image has meaningful `alt` text.
- One `<h1>` per page.
```

## Layer 6: Automated checks, because rules files are only advice

An AI usually follows the rules. **CI makes sure it always does.** Add a check that fails the build on any off-brand code:

```js
// scripts/brand-guard.mjs
import { readFileSync } from "node:fs";
import { globSync } from "glob";

const rules = [
  { re: /\b[a-z-]+-\[[^\]]+\]/g,                  msg: "Arbitrary Tailwind value" },
  { re: /style=\{\{/g,                            msg: "Inline style" },
  { re: /#[0-9a-fA-F]{3,8}\b/g,                   msg: "Hard-coded hex color" },
  { re: /from ["'](motion\/react|framer-motion)["']/g, msg: "Direct motion import (use <Reveal>)",
    allow: ["motion/presets.tsx"] },
];

let failures = 0;
for (const file of globSync("{app,components,sections}/**/*.{ts,tsx}")) {
  const src = readFileSync(file, "utf8");
  for (const { re, msg, allow = [] } of rules) {
    if (allow.some((a) => file.endsWith(a))) continue;
    for (const m of src.matchAll(re)) {
      console.error(`✖ ${file}: ${msg} → ${m[0]}`);
      failures++;
    }
  }
}
if (failures) { console.error(`\n${failures} brand violation(s).`); process.exit(1); }
console.log("✔ Brand guard passed");
```

```json
// package.json
"scripts": { "brand-guard": "node scripts/brand-guard.mjs", "lint": "next lint && npm run brand-guard" }
```

Add to CI:
- **Visual regression tests** (Playwright screenshots or Chromatic) on every section.
- **Accessibility checks** (`@axe-core/playwright`) for contrast, alt text and heading order.
- **Lighthouse CI budgets**, so performance can't quietly drop.

---

## Putting it together: a page from one prompt

With the guardrails in place, a request like this:

> *"Create a landing page for our new SEO audit service. Audience: small business owners. Include a hero, 4 features and a CTA."*

produces **JSON, not freehand code**:

```json
{
  "sections": [
    {
      "type": "hero",
      "eyebrow": "New service",
      "heading": "Find out what's holding your site back in Google",
      "subheading": "A full technical and content SEO audit with a prioritized fix list, delivered in 5 days.",
      "cta": { "label": "Book an audit", "href": "/contact" },
      "layout": "split-image",
      "background": "surface"
    },
    {
      "type": "features",
      "heading": "What the audit covers",
      "items": [
        { "icon": "speed",  "title": "Core Web Vitals",   "body": "Find the scripts, images and fonts slowing your pages." },
        { "icon": "chart",  "title": "Keyword gaps",      "body": "See the searches your competitors rank for and you don't." },
        { "icon": "shield", "title": "Technical health",  "body": "Broken links, redirect chains, indexing and crawl errors." },
        { "icon": "users",  "title": "Content quality",   "body": "Which pages to update, merge or retire, ranked by impact." }
      ]
    },
    {
      "type": "cta",
      "heading": "Get your audit started this week",
      "button": { "label": "Book an audit", "href": "/contact" }
    }
  ]
}
```

It passes validation, renders with your components, uses your colors and animates the way your brand does. A page that used to take a day of design and development back-and-forth is ready for review in minutes. Your team's time goes into **reviewing and refining** instead of pushing pixels.

## Where to start

1. **This week:** move colors, fonts and spacing into tokens and remove the Tailwind defaults.
2. **Next week:** wrap your five most-used UI pieces (Button, Card, Heading, Section, Container) in fixed-variant components.
3. **Week 3:** define schemas for 4–6 core sections, and add the motion presets.
4. **Week 4:** write the AI rules file and add the brand guard to CI.

Once the guardrails exist, **adding AI is the easy part.**
