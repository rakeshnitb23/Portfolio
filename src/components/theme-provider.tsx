"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Reading themes: light (default) and dark, picked from the menu bar's theme
// switcher. Each theme is set as a class on <html>; a visitor's choice is
// remembered in localStorage and applied before first paint, so there is no
// flash. A retired "sepia" choice still saved by returning visitors renders as
// light (otherwise its raw name would land on <html> as Tailwind's sepia()
// filter class); the switcher then resets it.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      themes={["light", "dark"]}
      value={{ light: "light", dark: "dark", sepia: "light" }}
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
