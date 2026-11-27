export const THEMES = [
  { id: "gold", label: "Light", swatch: ["#ffffff", "#f5b800"] },
  { id: "midnight", label: "Dark", swatch: ["#0c0d10", "#f5b800"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
