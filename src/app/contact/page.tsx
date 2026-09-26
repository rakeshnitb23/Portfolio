import type { Metadata } from "next";
import Contact from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Rakesh Singh, an AI Backend Engineer at Genpact open to selective remote opportunities.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="container-constrained pt-20 md:pt-28 pb-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Let&apos;s talk
        </h1>
        <p className="text-foreground/65 max-w-[60ch] leading-relaxed">
          Rakesh Singh is an AI Backend Engineer at Genpact, currently open to
          selective remote opportunities. Reach out about hiring,
          collaboration, or a project inquiry — response time is usually
          under 24 hours.
        </p>
      </div>
      <Contact />
    </main>
  );
}
