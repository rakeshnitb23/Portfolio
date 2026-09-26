"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, User, ScrollText, Mail, Home } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { name: "Projects", href: "/projects", id: "projects", icon: Briefcase },
  { name: "Writing",  href: "/writing",  id: "writing",  icon: ScrollText },
  { name: "About",    href: "/about",    id: "about",    icon: User },
  { name: "Contact",  href: "/contact",  id: "contact",  icon: Mail },
];

// ─── Desktop animated letter link ─────────────────────────────────────────────

const AnimatedNavLink = ({
  title,
  href,
  isActive,
  onClick,
  className,
  underlineClassName,
}: {
  title: string;
  href: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string;
  underlineClassName?: string;
}) => (
  <Link href={href} onClick={onClick} className={cn("group relative flex overflow-hidden", className)}>
    <motion.div initial="initial" whileHover="hovered" className="relative flex overflow-hidden">
      <div className="flex">
        {title.split("").map((letter, i) => (
          <motion.span
            key={i}
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{ duration: 0.38, ease: [0.33, 1, 0.68, 1], delay: i * 0.022 }}
            className="inline-block whitespace-pre"
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0 flex text-foreground">
        {title.split("").map((letter, i) => (
          <motion.span
            key={`overlay-${i}`}
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{ duration: 0.38, ease: [0.33, 1, 0.68, 1], delay: i * 0.022 }}
            className="inline-block whitespace-pre"
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </motion.div>
    <span
      className={cn(
        "absolute -bottom-2 left-0 h-[1.5px] transition-all duration-300 ease-out",
        "bg-gradient-to-r from-accent/80 via-accent to-accent/80",
        isActive ? "w-full" : "w-0 group-hover:w-full",
        underlineClassName
      )}
    />
  </Link>
);

// ─── Mobile dock item ──────────────────────────────────────────────────────────

const DockItem = ({
  link,
  isActive,
}: {
  link: (typeof NAV_LINKS)[number];
  isActive: boolean;
}) => {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      className="relative flex flex-col px-2 items-center justify-center flex-1 py-1 group"
    >
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="dock-bubble"
            className="absolute inset-x-1 inset-y-0.5 rounded-2xl bg-foreground/10 dark:bg-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          />
        )}
      </AnimatePresence>

      <motion.div
        whileTap={{ scale: 0.82 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        className="relative z-10"
      >
        <Icon
          strokeWidth={isActive ? 2 : 1.4}
          className={cn(
            "h-[22px] w-[22px] transition-colors duration-300",
            isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/70"
          )}
        />
      </motion.div>

      <span
        className={cn(
          "relative z-10 mt-0.5 text-[10px] tracking-wide transition-colors duration-300",
          isActive ? "text-foreground font-semibold" : "text-muted-foreground font-medium"
        )}
      >
        {link.name}
      </span>

      {isActive && (
        <motion.span
          layoutId="dock-dot"
          className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-accent"
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      )}
    </Link>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection Observer for active sections
  React.useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_LINKS.forEach((link) => {
      if (link.id && link.href.startsWith("/#")) {
        const el = document.getElementById(link.id);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [pathname]);

  const isLinkActive = (link: typeof NAV_LINKS[0]) => {
    if (link.href === pathname) return true;
    if (pathname === "/" && activeSection === link.id) return true;
    return false;
  };

  return (
    <>
      {/* ══════════════════════════════════════════════
          DESKTOP — md and above
          Locked h-[56px]. layout.tsx applies
          md:pt-[56px] on <main> to offset content.
          No spacer div needed here at all.
      ══════════════════════════════════════════════ */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.1 }}
        className={cn(
          "fixed top-0 z-50 w-full hidden md:flex transition-all duration-500 py-2 " ,
          scrolled
            ? "bg-background/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)]"
            : "bg-background/80 backdrop-blur-md"
        )}
      >
        {/* Top shimmer */}
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--accent-glow) 30%, var(--accent) 50%, var(--accent-glow) 70%, transparent 100%)",
          }}
        />

        <div className="mx-auto flex h-[56px] w-full max-w-[var(--container-max-width)] items-center justify-between px-6 md:px-10 lg:px-14">
          {/* Logo */}
          <Link href="/">
            <motion.div
              initial="initial"
              whileHover="hovered"
              className="relative flex cursor-pointer overflow-hidden font-serif text-3xl font-black tracking-tighter text-foreground"
            >
              <div className="flex ">
                {["R", "S", "."].map((letter, i) => (
                  <motion.span
                    key={i}
                    variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
                    transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1], delay: i * 0.05 }}
                    className={cn(
                      "inline-block",
                      letter === "S" && "italic font-light",
                      letter === "." && "text-amber-400"
                    )}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              <div className="absolute inset-0 flex">
                {["R", "S", "."].map((letter, i) => (
                  <motion.span
                    key={`o-${i}`}
                    variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
                    transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1], delay: i * 0.05 }}
                    className={cn(
                      "inline-block",
                      letter === "S" && "italic font-light",
                      letter === "." && "text-accent"
                    )}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <AnimatedNavLink
                key={link.name}
                href={link.href}
                title={link.name}
                isActive={isLinkActive(link)}
                className={cn(
                  "text-[clamp(0.75rem,0.9vw,0.85rem)] font-semibold tracking-[0.22em] uppercase transition-colors duration-300",
                  isLinkActive(link) ? "text-foreground" : "text-muted-foreground"
                )}
              />
            ))}
          </nav>

          <ThemeToggle />
        </div>

        {/* Bottom border */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-[1px] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,0,0,0.07) 30%, rgba(0,0,0,0.07) 70%, transparent)",
          }}
        />
      </motion.header>

      {/* ══════════════════════════════════════════════
          MOBILE floating bottom dock — below md
          layout.tsx adds pb-28 on mobile so page
          content is never hidden behind the dock.
      ══════════════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-6 inset-x-0 z-50 flex justify-center pointer-events-none   ">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.2 }}
          className="pointer-events-auto relative flex items-stretch  "
          style={{ willChange: "transform" }}
        >
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-[28px] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 100% at 50% 60%, var(--accent-glow) 0%, transparent 80%)",
              filter: "blur(8px)",
            }}
          />

          {/* Pill surface */}
          <div
            className={cn(
              "relative flex   items-stretch rounded-[22px] px-2 py-1.5",
              "bg-background/80 dark:bg-zinc-900/85 backdrop-blur-2xl",
              "border border-white/20 dark:border-white/10",
              "shadow-[0_8px_32px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.15)]",
              "dark:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]"
            )}
          >
            {/* Inner top highlight */}
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-6 h-[1px] rounded-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.55) 60%, transparent)",
              }}
            />

            {/* Home */}
            <Link
              href="/"
              className="relative flex flex-col items-center justify-center px-4 py-1 group"
            >
              <AnimatePresence>
                {pathname === "/" && (
                  <motion.span
                    layoutId="dock-bubble"
                    className="absolute inset-x-1 inset-y-0.5 rounded-2xl bg-foreground/10 dark:bg-white/10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
              </AnimatePresence>
              <motion.div
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                className="relative z-10"
              >
                <Home
                  strokeWidth={pathname === "/" ? 2 : 1.4}
                  className={cn(
                    "h-[22px] w-[22px] transition-colors duration-300",
                    pathname === "/" ? "text-foreground" : "text-muted-foreground"
                  )}
                />
              </motion.div>
              <span
                className={cn(
                  "relative z-10 mt-0.5 text-[10px] tracking-wide transition-colors duration-300",
                  pathname === "/" ? "text-foreground font-semibold" : "text-muted-foreground font-medium"
                )}
              >
                Home
              </span>
              {pathname === "/" && (
                <motion.span
                  layoutId="dock-dot"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
            </Link>

            <div className="w-[1px] self-stretch my-2 bg-border/50 mx-0.5" />

            {NAV_LINKS.map((link) => (
              <DockItem key={link.name} link={link} isActive={isLinkActive(link)} />
            ))}

            <div className="w-[1px] self-stretch my-2 bg-border/50 mx-0.5" />

            <div className="flex items-center px-2">
              <ThemeToggle />
            </div>
          </div>
        </motion.nav>
      </div>
    </>
  );
}