import { Suspense } from "react";
import { Inter, Lora } from "next/font/google";
import { HomeHeader } from "@/components/home/home-header";
import { PhoneMenu } from "@/components/home/phone-menu";
import { SiteShell } from "@/components/layout/site-shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SearchHighlighter } from "@/components/layout/search-highlighter";
import { buildSearchIndex } from "@/lib/search-index";

// The homepage's typefaces: Lora for reading text, Inter for interface text.
// Applied through .site-theme in globals.css.
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-lora" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

// Every page except the homepage: the homepage's menu bar on top, then the
// page with its table of contents, then the footer.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const searchIndex = buildSearchIndex();

  return (
    <div className={`${lora.variable} ${inter.variable} site-theme flex flex-1 flex-col`}>
      <HomeHeader searchIndex={searchIndex} nameAs="p">
        <PhoneMenu />
      </HomeHeader>
      <main className="flex-1">
        <SiteShell>{children}</SiteShell>
      </main>
      <SiteFooter />
      {/* Reads ?h= from the URL, so it renders client-side only. */}
      <Suspense fallback={null}>
        <SearchHighlighter />
      </Suspense>
    </div>
  );
}
