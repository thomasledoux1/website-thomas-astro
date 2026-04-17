const THEME_STORAGE_KEY = "theme";

type SiteTheme = "light" | "dark";

export function getSiteTheme(): SiteTheme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function syncThemeToggleAria(): void {
  const btn = document.querySelector("[data-theme-toggle]");
  if (btn instanceof HTMLButtonElement) {
    const dark = document.documentElement.classList.contains("dark");
    btn.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme",
    );
  }
}

/** Matches ThemeToggle + Layout inline script: `dark` class + localStorage. */
export function applySiteTheme(theme: SiteTheme): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  syncThemeToggleAria();
}
