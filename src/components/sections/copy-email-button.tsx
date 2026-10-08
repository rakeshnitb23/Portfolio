"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

// Copies an email address in one click (no mail app, no new tab). If the
// clipboard is unavailable, the button shows the address so it can be copied by hand.
export function CopyEmailButton({ email, className }: { email: string; className: string }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("manual");
    }
  };

  return (
    <button type="button" onClick={copy} aria-live="polite" className={className}>
      {state === "copied" ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      {state === "copied" ? "Copied" : state === "manual" ? email : "Copy email"}
    </button>
  );
}
