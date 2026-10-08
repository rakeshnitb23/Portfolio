"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Light by default, like the reference site; a visitor's choice is remembered
// in localStorage and applied before first paint, so there is no flash.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
