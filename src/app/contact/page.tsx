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
    <div className="max-w-[42rem] py-10">
      <h1 id="lets-talk" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-6">
        Let&apos;s talk
      </h1>
      <p className="text-foreground/70 leading-relaxed mb-10">
        Rakesh Singh is an AI Backend Engineer at Genpact, currently open to
        selective remote opportunities. Reach out about hiring,
        collaboration, or a project inquiry — response time is usually
        under 24 hours.
      </p>
      <Contact />
    </div>
  );
}
