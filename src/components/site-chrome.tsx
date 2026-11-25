import Link from "next/link";
import { site } from "@/content";
import { SpaceBackdrop } from "@/components/space";
import { LedgeProps } from "@/components/scene";
import { ThemeSwitcher } from "@/components/theme-switcher";

/* Header and footer for inner pages (the blog). Same look as the home page
   header, with a shorter space band and no developer illustration. */

export const siteNav = [
  { href: "/#journey", label: "Journey" },
  { href: "/blog", label: "Blog" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Logo() {
  return (
    <Link href="/" className="group block w-fit">
      <p className="flex items-center gap-2 text-[1.5rem] font-semibold tracking-[-0.04em] sm:text-[1.65rem]">
        <span className="grid size-8 place-items-center rounded-md bg-accent font-mono text-sm font-semibold text-accent-ink" aria-hidden="true">
          V
        </span>
        {site.name.toLowerCase()}
        <span className="text-accent">.</span>
      </p>
    </Link>
  );
}

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header id="top" className="relative bg-bg">
      <div className="relative h-[84px] overflow-hidden sm:h-[110px]">
        <SpaceBackdrop />
        <div className="absolute inset-x-0 bottom-0 h-[22px] bg-[var(--ledge)] sm:h-[26px]">
          <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--ledge-top)]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-[22px] mx-auto h-16 max-w-6xl sm:bottom-[26px]">
          <LedgeProps />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 border-b border-line py-5 lg:flex-row lg:items-center lg:justify-between">
          <Logo />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav aria-label="Primary" className="-mx-2 w-[calc(100%+1rem)] overflow-x-auto [scrollbar-width:none] sm:w-auto">
              <ul className="flex items-center gap-0.5 sm:gap-1">
                {siteNav.map((item) => {
                  const current = item.label === active;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        className={`block whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-3.5 ${
                          current ? "bg-accent-soft text-fg ring-1 ring-accent/40" : "text-muted hover:bg-bg-alt hover:text-fg"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-inverse-line bg-inverse text-inverse-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-7 font-mono text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© 2026 {site.name}. Built with Next.js &amp; Tailwind CSS.</p>
        <div className="flex gap-5">
          <Link href="/blog" className="hover:text-accent">Blog</Link>
          <a href="/blog/rss.xml" className="hover:text-accent">RSS</a>
          <a href="#top" className="hover:text-accent">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
