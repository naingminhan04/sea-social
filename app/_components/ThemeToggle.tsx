"use client";

import { useThemeStore } from "@/store/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme("light")}
        className={theme === "light" ? "font-bold" : ""}
      >
        Light
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={theme === "dark" ? "font-bold" : ""}
      >
        Dark
      </button>

      <button
        onClick={() => setTheme("system")}
        className={theme === "system" ? "font-bold" : ""}
      >
        System
      </button>
    </div>
  );
}
