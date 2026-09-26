import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteShell } from "@/components/layout/site-shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/json-ld";
import { PERSON, SITE_URL, personId } from "@/lib/site";
import { DOMAINS } from "@/data/technical-expertise";
import { buildSearchIndex } from "@/lib/search-index";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rakesh Singh — AI Backend Engineer",
    template: "%s — Rakesh Singh",
  },
  description:
    "AI Backend Engineer at Genpact. Grounded document Q&A, hybrid retrieval, and Java/Spring systems for high-throughput workloads.",
  openGraph: {
    title: "Rakesh Singh — AI Backend Engineer",
    description:
      "AI Backend Engineer at Genpact. Grounded document Q&A, hybrid retrieval, and Java/Spring systems for high-throughput workloads.",
    url: SITE_URL,
    siteName: "Rakesh Singh Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rakesh Singh — AI Backend Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rakesh Singh — AI Backend Engineer",
    description:
      "AI Backend Engineer at Genpact. Grounded document Q&A, hybrid retrieval, and Java/Spring systems for high-throughput workloads.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const knowsAbout = Array.from(
  new Set(DOMAINS.flatMap((d) => d.techs.map((t) => t.label)))
);

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personId(),
  name: PERSON.name,
  url: SITE_URL,
  email: `mailto:${PERSON.email}`,
  jobTitle: PERSON.jobTitle,
  worksFor: {
    "@type": "Organization",
    name: "Genpact",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bangalore",
    addressCountry: "IN",
  },
  sameAs: [PERSON.github, PERSON.linkedin],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: PERSON.alumniOf,
  },
  knowsAbout,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchIndex = buildSearchIndex();

  return (
    <html lang="en">
      <head>
        <JsonLd data={personJsonLd} />
      </head>
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        <SiteHeader searchIndex={searchIndex} />
        <main className="flex-1">
          <SiteShell>{children}</SiteShell>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
