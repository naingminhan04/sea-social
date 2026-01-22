"use client";

import { useThemeStore } from "@/store/theme";
import { Sun, MoonStar, Monitor } from "lucide-react";

const positions = {
  light: "translate-x-0",
  system: "translate-x-full",
  dark: "translate-x-[200%]",
};

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  return (
    <div
      className="
        relative flex items-center h-10
        bg-white dark:bg-neutral-900 rounded-full p-1
      "
    >
      <div
        className={`
          absolute top-1 left-1 w-10 h-8 rounded-full
          bg-blue-400 dark:bg-black shadow
          transition-transform duration-300 ease-out
          ${positions[theme]}
        `}
      />

      <button
        onClick={() => setTheme("light")}
        className="relative z-10 w-10 h-8 flex items-center justify-center "
        aria-label="Light theme"
      >
        <Sun size={18} />
      </button>

      <button
        onClick={() => setTheme("system")}
        className="relative z-10 w-10 h-8 flex items-center justify-center "
        aria-label="System theme"
      >
        <Monitor size={18} />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className="relative z-10 w-10 h-8 flex items-center justify-center "
        aria-label="Dark theme"
      >
        <MoonStar size={18} />
      </button>
    </div>
  );
}
