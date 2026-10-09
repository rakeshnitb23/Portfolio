"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// The site has no dark-mode toggle (the menu bar is the homepage's on every
// page), so the theme is pinned to light. Without the pin, a visitor who chose
// dark mode earlier would stay stuck in it with no way back. The dark styles
// in globals.css stay in place; removing forcedTheme brings dark mode back.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
