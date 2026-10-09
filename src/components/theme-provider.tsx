"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Reading themes: light (default), sepia (warm paper) and dark, picked from the
// menu bar's theme switcher. Each theme is set as a class on <html>; a
// visitor's choice is remembered in localStorage and applied before first
// paint, so there is no flash. Sepia's class is "theme-sepia", not "sepia",
// because "sepia" is Tailwind's sepia() filter utility and would tint the page.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      themes={["light", "sepia", "dark"]}
      value={{ light: "light", sepia: "theme-sepia", dark: "dark" }}
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
