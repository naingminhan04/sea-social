"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme";
import { applyTheme } from "@/libs/applyTheme";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <>{children}</>;
}
