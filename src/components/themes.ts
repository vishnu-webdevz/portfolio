export const THEMES = [
  { id: "gold", label: "Gold", swatch: ["#ffffff", "#f5b800"] },
  { id: "midnight", label: "Midnight", swatch: ["#0c0d10", "#f5b800"] },
  { id: "slate", label: "Slate", swatch: ["#0f1b2d", "#f2c94c"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
