import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investments",
  description: "Angel investor and scout for Andreessen Horowitz.",
  alternates: { canonical: "/investments" },
};

interface Investment {
  name: string;
  domain: string;
  href: string;
}

const PERSONAL: Investment[] = [
  { name: "Exa", domain: "exa.ai", href: "https://exa.ai/" },
  { name: "Lovable", domain: "lovable.dev", href: "https://lovable.dev/" },
  { name: "Modal", domain: "modal.com", href: "https://modal.com/" },
  { name: "Extend", domain: "extend.ai", href: "https://www.extend.ai/" },
  { name: "Haize Labs", domain: "haizelabs.com", href: "https://haizelabs.com/" },
  { name: "Shaped AI", domain: "shaped.ai", href: "https://www.shaped.ai/" },
  {
    name: "Pydantic Logfire",
    domain: "pydantic.dev",
    href: "https://logfire.pydantic.dev/",
  },
  { name: "Vantager", domain: "vantager.com", href: "https://www.vantager.com/" },
  {
    name: "Empower Sleep",
    domain: "empowersleep.com",
    href: "https://www.empowersleep.com/",
  },
  { name: "Poke", domain: "poke.com", href: "https://poke.com/" },
  { name: "Sandbar", domain: "sandbar.com", href: "https://www.sandbar.com/" },
  {
    name: "Browserbase",
    domain: "browserbase.com",
    href: "https://www.browserbase.com/",
  },
  { name: "Julius", domain: "julius.ai", href: "https://julius.ai/" },
  {
    name: "Godel Terminal",
    domain: "godelterminal.com",
    href: "https://godelterminal.com/",
  },
  { name: "Daytona", domain: "daytona.io", href: "https://www.daytona.io/" },
  { name: "Kino.ai", domain: "kino.ai", href: "https://kino.ai/" },
];

const SCOUT_FUND: Investment[] = [
  { name: "Rork", domain: "rork.com", href: "https://rork.com/" },
  {
    name: "Raindrop.ai",
    domain: "raindrop.ai",
    href: "https://www.raindrop.ai/",
  },
  { name: "Runlayer", domain: "runlayer.com", href: "https://www.runlayer.com/" },
  { name: "Smithery.ai", domain: "smithery.ai", href: "https://smithery.ai/" },
  {
    name: "Kaizen Automation",
    domain: "kaizenautomation.com",
    href: "https://www.kaizenautomation.com/",
  },
  { name: "Effectful", domain: "effectful.co", href: "https://effectful.co/" },
];

function InvestmentList({ items }: { items: Investment[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-0 list-none p-0 m-0 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.href}
          className="flex items-center gap-2 border-b border-border py-2 last:border-b-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=32`}
            alt=""
            width={16}
            height={16}
            className="shrink-0"
          />
          <a href={item.href} target="_blank" rel="noopener noreferrer">
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function InvestmentsPage() {
  return (
    <div className="max-w-none py-10">
      <h1 id="investments" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-6">
        Investments
      </h1>

      <div className="prose-content">
        <p>
          Angel investor and scout for{" "}
          <a href="https://a16z.com/" target="_blank" rel="noopener noreferrer">
            Andreessen Horowitz
          </a>
          .
        </p>

        <h2 id="personal">Personal</h2>
        <InvestmentList items={PERSONAL} />

        <h2 id="scout-fund">Scout Fund</h2>
        <InvestmentList items={SCOUT_FUND} />
      </div>
    </div>
  );
}
