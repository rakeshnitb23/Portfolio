"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  contactSchema,
  SUBJECT_OPTIONS,
} from "@/lib/contact-schema";
import { type FormStatus, type FieldErrors } from "@/types";

// ═══════════════════════════════════════
// CONSTELLATION CANVAS — Immersive Background
// ═══════════════════════════════════════

function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1, y: -1, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const particleCount = 75;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.3 + 0.1,
    }));

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const onMouseLeave = () => { mouseRef.current.active = false; };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const isDark = document.documentElement.classList.contains("dark");
      // Enhanced light mode visibility: use a richer, more opaque bronze/gold
      const baseColor = isDark ? [212, 175, 55] : [145, 115, 65]; 
      const opacityMultiplier = isDark ? 1 : 1.6; // Boost opacity in light mode

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            p.x += dx * 0.012;
            p.y += dy * 0.012;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor.join(",")}, ${Math.min(1, p.baseAlpha * opacityMultiplier)})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15 * opacityMultiplier;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${baseColor.join(",")}, ${alpha})`;
            ctx.lineWidth = isDark ? 0.5 : 0.7; // Slightly thicker lines in light mode
            ctx.stroke();
          }
        }
      });

      if (mouseRef.current.active) {
        const glow = ctx.createRadialGradient(
          mouseRef.current.x, mouseRef.current.y, 0,
          mouseRef.current.x, mouseRef.current.y, 250
        );
        glow.addColorStop(0, `rgba(${baseColor.join(",")}, ${isDark ? 0.08 : 0.12})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, W, H);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ═══════════════════════════════════════
// DIGITAL SIGNATURE CARD — Elegant Info
// ═══════════════════════════════════════

function DigitalSignature() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [10, -10]), { stiffness: 150, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-10, 10]), { stiffness: 150, damping: 25 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const onMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative w-full max-w-[340px] aspect-[4/5] rounded-[32px] p-8
        bg-white/40 dark:bg-black/40 backdrop-blur-2xl
        border border-white/50 dark:border-white/10
        shadow-[0_24px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)]
        flex flex-col justify-between overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
            <span className="text-xs font-bold text-accent">RS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground/60 dark:text-muted-foreground/80">
              Identity
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-green-500 uppercase tracking-wider">Live Connection</span>
            </div>
          </div>
        </div>

        <h3 className="text-3xl font-bold leading-tight font-serif text-foreground">
          Rakesh
          <br />
          <span className="text-accent">Singh</span>
        </h3>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="h-px w-12 bg-accent/30" />
        <p className="text-sm leading-relaxed text-muted-foreground font-mono">
          Architecting scalable systems
          <br />
          with precision and purpose.
        </p>

        <div className="flex flex-col gap-2">
          {[
            { label: "Role", value: "AI Backend Engineer" },
            { label: "Status", value: "Available for Project" },
            { label: "Location", value: "Bangalore, India" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground/60 uppercase tracking-tighter">{item.label}</span>
              <span className="text-accent font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
}

// ═══════════════════════════════════════
// FLOATING LABEL INPUT
// ═══════════════════════════════════════

function FormInput({
  label, name, type = "text", required = false,
  value, error, onChange, placeholder,
}: {
  label: string; name: string; type?: string; required?: boolean;
  value: string; error?: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || (value && value.length > 0);

  return (
    <div className="relative">
      <div className={`
        relative rounded-xl overflow-hidden transition-all duration-300
        ${error
          ? "ring-1 ring-red-400/40"
          : focused
            ? "ring-1 ring-accent/50 shadow-[0_0_0_3px_rgba(198,169,105,0.08)]"
            : "ring-1 ring-foreground/10"
        }
        bg-secondary/50
      `}>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ""}
          autoComplete="off"
          className={`
            w-full bg-transparent px-4 pb-3 text-sm outline-none
            text-foreground
            placeholder:text-muted-foreground/40
            transition-all duration-200
            ${active ? "pt-6" : "pt-4"}
          `}
          style={{ fontFamily: "'DM Mono', monospace" }}
        />
        <label
          htmlFor={name}
          className={`
            absolute left-4 pointer-events-none transition-all duration-200 select-none
            ${active
              ? "top-2 text-[9px] tracking-[0.22em] text-[#C6A969]"
              : "top-1/2 -translate-y-1/2 text-[11px] tracking-[0.15em] text-[#1C1C1C]/35 dark:text-[#F3F3F3]/30"
            }
          `}
          style={{ fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}
        >
          {label}{required && <span className="text-[#C6A969]/60 ml-0.5">*</span>}
        </label>
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent via-accent/60 to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="text-[11px] mt-1.5 px-1 text-red-500/80"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            ↳ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// CUSTOM DROPDOWN
// ═══════════════════════════════════════

function CustomDropdown({
  label, name, required = false, value, error, onChange, options,
}: {
  label: string; name: string; required?: boolean; value: string;
  error?: string; onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label || "";
  const active = focused || open || !!selectedLabel;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className={`
        relative rounded-xl overflow-visible transition-all duration-300
        ${error
          ? "ring-1 ring-red-400/40"
          : open || focused
            ? "ring-1 ring-accent/50 shadow-[0_0_0_3px_rgba(198,169,105,0.08)]"
            : "ring-1 ring-foreground/10"
        }
        bg-secondary/50 rounded-xl
      `}>
        <button
          type="button"
          onClick={() => { setOpen(!open); setFocused(true); }}
          onFocus={() => setFocused(true)}
          onBlur={() => { if (!open) setFocused(false); }}
          className={`
            w-full bg-transparent px-4 pb-3 text-left text-sm outline-none
            flex items-center justify-between cursor-pointer rounded-xl
            transition-all duration-200
            ${active ? "pt-6" : "pt-4"}
          `}
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          <span className={selectedLabel ? "text-foreground" : "text-transparent"}>
            {selectedLabel || "placeholder"}
          </span>
          <motion.svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.22 }}
            className="text-accent/50 flex-shrink-0"
          >
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>

        <label
          className={`
            absolute left-4 pointer-events-none transition-all duration-200 select-none
            ${active
              ? "top-2 text-[10px] tracking-widest text-accent"
              : "top-1/2 -translate-y-1/2 text-[11px] tracking-widest text-muted-foreground/60"
            }
          `}
          style={{ fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}
        >
          {label}{required && <span className="text-accent/60 ml-0.5">*</span>}
        </label>

        <motion.div
          className="absolute bottom-0 left-0 h-[2px] rounded-b-xl bg-gradient-to-r from-accent via-accent/60 to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: open || focused ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <select name={name} value={value} onChange={(e) => onChange(e.target.value)}
        tabIndex={-1} aria-hidden className="sr-only">
        <option value="" />
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 z-50 origin-top rounded-xl overflow-hidden
              bg-card
              ring-1 ring-accent/15
              shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
          >
            {options.map((opt, i) => (
              <motion.button
                key={opt.value}
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => { onChange(opt.value); setOpen(false); setFocused(false); }}
                className={`
                  w-full text-left px-4 py-3 text-[12.5px] cursor-pointer
                  flex items-center gap-3 transition-colors duration-150
                  ${value === opt.value
                    ? "bg-accent/15 text-accent"
                    : "text-muted-foreground/60 hover:bg-accent/8"
                  }
                `}
                style={{ fontFamily: "'DM Mono', monospace", letterSpacing: "0.03em" }}
              >
                <span className={`w-1 h-1 rounded-full flex-shrink-0
                  ${value === opt.value ? "bg-accent" : "bg-foreground/15"}`}
                />
                {opt.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="text-[11px] mt-1.5 px-1 text-red-500/80"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            ↳ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// TEXTAREA
// ═══════════════════════════════════════

function FormTextarea({
  label, name, required = false, value, error, onChange, placeholder,
}: {
  label: string; name: string; required?: boolean;
  value: string; error?: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || (value && value.length > 0);

  return (
    <div className="relative">
      <div className={`
        relative rounded-xl transition-all duration-300
        ${error
          ? "ring-1 ring-red-400/40"
          : focused
            ? "ring-1 ring-accent/50 shadow-[0_0_0_3px_rgba(198,169,105,0.08)]"
            : "ring-1 ring-foreground/10"
        }
        bg-secondary/50
      `}>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={active ? placeholder : ""}
          rows={5}
          className={`
            w-full bg-transparent px-4 pb-3 text-sm resize-none outline-none
            text-foreground
            placeholder:text-muted-foreground/40
            transition-all duration-200
            ${active ? "pt-7" : "pt-4"}
          `}
          style={{ fontFamily: "'DM Mono', monospace", minHeight: "130px" }}
        />
        <label
          htmlFor={name}
          className={`
            absolute left-4 pointer-events-none transition-all duration-200 select-none
            ${active
              ? "top-2 text-[10px] tracking-widest text-accent"
              : "top-4 text-[11px] tracking-[0.15em] text-muted-foreground/60"
            }
          `}
          style={{ fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}
        >
          {label}{required && <span className="text-accent/60 ml-0.5">*</span>}
        </label>
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] rounded-b-xl bg-gradient-to-r from-accent via-accent/60 to-transparent"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
        <div
          className="absolute bottom-3 right-4 text-[10px] tabular-nums text-muted-foreground/40 pointer-events-none"
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {value?.length || 0}/1000
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="text-[11px] mt-1.5 px-1 text-red-500/80"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            ↳ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════
// SUBMIT BUTTON
// ═══════════════════════════════════════

function SubmitButton({ status, disabled }: { status: FormStatus; disabled: boolean }) {
  const [hovered, setHovered] = useState(false);

  const label = useMemo(() => {
    switch (status) {
      case "submitting": return "Transmitting";
      case "success": return "Received";
      default: return "Send Message";
    }
  }, [status]);

  return (
    <motion.button
      type="submit"
      disabled={disabled}
      onHoverStart={() => !disabled && setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      className={`
        relative group inline-flex items-center justify-center gap-3
        h-14 px-10 rounded-2xl overflow-hidden cursor-pointer
        transition-[opacity] duration-300
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      <div className="absolute inset-0 rounded-2xl bg-foreground/5 border border-accent/20" />
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent via-accent/80 to-accent/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
            }}
            initial={{ x: "-150%" }}
            animate={{ x: "150%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {status === "submitting" && (
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-accent"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "linear" }}
        />
      )}

      <span
        className={`relative z-10 text-[11.5px] tracking-widest uppercase font-semibold transition-colors duration-300
          ${hovered ? "text-[#111]" : "text-foreground"}`}
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {status === "success" ? "✓ " : ""}{label}
      </span>

      {status === "idle" && (
        <motion.span
          className={`relative z-10 text-[16px] leading-none transition-colors duration-300
            ${hovered ? "text-[#111]" : "text-accent"}`}
          animate={hovered ? { x: 2, y: -2 } : { x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          ↗
        </motion.span>
      )}
      {status === "submitting" && (
        <motion.span
          className="relative z-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            className="text-foreground">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"
              strokeDasharray="20 12" strokeLinecap="round" />
          </svg>
        </motion.span>
      )}
    </motion.button>
  );
}

// ═══════════════════════════════════════
// SUCCESS STATE
// ═══════════════════════════════════════

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 18 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-10 flex items-center justify-center w-24 h-24">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-accent/20"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1 + i * 0.4, opacity: 0 }}
            transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, ease: "easeOut" }}
            style={{ width: "100%", height: "100%" }}
          />
        ))}
        <motion.div
          className="relative z-10 w-16 h-16 rounded-full
            bg-gradient-to-br from-accent/20 to-accent/5
            border border-accent/30 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        >
          <motion.svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <motion.path
              d="M6 13.5L11.5 19L20 8"
              stroke="currentColor"
              className="text-accent"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.svg>
        </motion.div>
      </div>

      <h3
        className="text-[clamp(1.6rem,3.5vw,2.2rem)] font-bold tracking-[-0.03em]
          text-foreground mb-3"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Signal Received.
      </h3>
      <p
        className="text-xs tracking-widest leading-[1.85]
          text-muted-foreground/60 max-w-[280px]"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        Communication established.
        <br />
        Expect a response within 24h.
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════
// MAIN CONTACT COMPONENT
// ═══════════════════════════════════════

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    agreement: false,
    _hp: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (status === "submitting" || status === "success") return;

      setErrors({});
      setServerError("");

      // 1. Client-side validation
      const result = contactSchema.safeParse(formData);
      if (!result.success) {
        const fieldErrors: FieldErrors = {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FieldErrors;
          if (!fieldErrors[field]) fieldErrors[field] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      setStatus("submitting");

      try {
        // 2. Server-side submission
        const apiBase = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiBase}/api/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
          if (data.errors) {
            setErrors(data.errors);
            setStatus("idle");
          } else {
            setServerError(data.message || "Transmission failed. Please retry.");
            setStatus("error");
          }
          return;
        }

        setStatus("success");
        // Reset form on success
        setFormData({
          fullName: "", email: "", company: "",
          subject: "", message: "", agreement: false, _hp: "",
        });
      } catch (err) {
        setServerError("Network error. Please check your connection.");
        setStatus("error");
      }
    },
    [formData, status]
  );

  return (
    <section id="contact" className="relative min-h-screen w-full flex items-center justify-center py-24 overflow-hidden bg-background">
      {/* Immersive Background */}
      <ConstellationCanvas />

      <div className="container relative z-10 px-6 mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          
          {/* Left Side: Digital Signature Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0"
          >
            <DigitalSignature />
          </motion.div>

          {/* Right Side: Contact Form in Glass Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[580px]"
          >
            <div className="relative p-[1.5px] rounded-[40px] bg-gradient-to-br from-accent/30 to-transparent dark:from-white/10 dark:to-transparent shadow-2xl">
              <div className="bg-white/70 dark:bg-black/40 backdrop-blur-3xl rounded-[39px] p-8 lg:p-12 border border-white/40 dark:border-white/5">
                
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-[42px] font-bold tracking-tight font-serif text-foreground leading-none mb-4">
                    Send a <span className="text-accent">Signal</span>
                  </h2>
                  <p className="text-[13px] text-muted-foreground/60 font-mono tracking-wide uppercase">
                    Initialize communication protocol.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <SuccessState key="success" />
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Full Name"
                          name="fullName"
                          required
                          value={formData.fullName}
                          error={errors.fullName}
                          onChange={(v) => setFormData({ ...formData, fullName: v })}
                          placeholder="John Doe"
                        />
                        <FormInput
                          label="Email Address"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          error={errors.email}
                          onChange={(v) => setFormData({ ...formData, email: v })}
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                          label="Company"
                          name="company"
                          value={formData.company}
                          error={errors.company}
                          onChange={(v) => setFormData({ ...formData, company: v })}
                          placeholder="Acme Corp"
                        />
                        <CustomDropdown
                          label="Subject"
                          name="subject"
                          required
                          value={formData.subject}
                          error={errors.subject}
                          options={SUBJECT_OPTIONS}
                          onChange={(v) => setFormData({ ...formData, subject: v })}
                        />
                      </div>

                      <FormTextarea
                        label="Message"
                        name="message"
                        required
                        value={formData.message}
                        error={errors.message}
                        onChange={(v) => setFormData({ ...formData, message: v })}
                        placeholder="Tell me about your project..."
                      />

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                        <motion.label
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="agreement"
                              checked={formData.agreement}
                              onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
                              className="sr-only"
                            />
                            <div className={`
                              w-5 h-5 rounded border transition-all duration-200
                              flex items-center justify-center
                              ${formData.agreement 
                                ? "bg-accent border-accent" 
                                : "border-foreground/10 bg-foreground/5"}
                            `}>
                              {formData.agreement && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground/60 uppercase tracking-widest font-mono select-none">
                            I agree to terms
                          </span>
                        </motion.label>

                        <SubmitButton
                          status={status}
                          disabled={status === "submitting"}
                        />
                      </div>

                      {serverError && (
                        <p className="text-[11px] text-red-500 text-center font-mono">
                          ↳ {serverError}
                        </p>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}