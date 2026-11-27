"use client";

import { useEffect, useState } from "react";
import { THEMES, type ThemeId } from "./themes";

/** Two small swatches (light / dark) that switch the site palette and remember the choice. */
export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeId>("gold");

  useEffect(() => {
    const current = document.documentElement.dataset.theme as ThemeId | undefined;
    if (current && THEMES.some((t) => t.id === current)) setTheme(current);
  }, []);

  function choose(id: ThemeId) {
    setTheme(id);
    document.documentElement.dataset.theme = id;
    try {
      localStorage.setItem("theme", id);
    } catch {}
  }

  return (
    <div role="radiogroup" aria-label="Colour theme" className={`flex items-center gap-1 rounded-full border border-line bg-surface p-1 ${className}`}>
      {THEMES.map((t) => {
        const active = t.id === theme;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${t.label} theme`}
            title={t.label}
            onClick={() => choose(t.id)}
            className={`grid size-7 place-items-center rounded-full transition-shadow ${active ? "ring-2 ring-accent ring-offset-2 ring-offset-surface" : "hover:ring-1 hover:ring-line-strong"}`}
          >
            <span
              className="size-5 rounded-full border border-black/10"
              style={{ background: `linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%)` }}
            />
          </button>
        );
      })}
    </div>
  );
}
