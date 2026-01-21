export const applyTheme = (theme: "light" | "dark" | "system") => {
  const root = document.documentElement;

  root.classList.remove("dark");

  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }

  if (theme === "system") {
    const isDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (isDark) {
      root.classList.add("dark");
    }
  }
};
