"use client";

import * as React from "react";

// Buttondown's embed form (same endpoint and fields as its embed snippet),
// styled to match the site. Submitting opens Buttondown's confirmation page in
// a new tab. NewsletterSubscribe reveals it under a button row when clicked;
// NewsletterCard shows it inline, always open.
const BUTTONDOWN_ACTION = "https://buttondown.com/api/emails/embed-subscribe/rakeshnitb23";
const FORM_ID = "newsletter-subscribe";

export function NewsletterSubscribe({ className }: { className: string }) {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={FORM_ID}
        onClick={() => setOpen((v) => !v)}
        className={className}
      >
        Subscribe to my newsletter
      </button>

      {/* order-last + basis-full: drops below the whole button row. */}
      {open && (
        <div id={FORM_ID} className="order-last basis-full">
          <NewsletterForm inputId="newsletter-email" inputRef={inputRef} />
        </div>
      )}
    </>
  );
}

/** An always-open signup box, for the end of a list of posts. */
export function NewsletterCard() {
  return (
    <aside
      aria-labelledby="newsletter-card-title"
      data-search-ignore
      className="mt-8 rounded-sm border border-border bg-muted/40 p-5"
    >
      <p id="newsletter-card-title" className="font-medium text-foreground">
        Subscribe to my newsletter
      </p>
      <p className="mt-1 mb-4 text-sm text-foreground/70">
        New posts on RAG, reliability, and backend systems, straight to your inbox. No spam;
        unsubscribe anytime.
      </p>
      <NewsletterForm inputId="newsletter-card-email" showLabel={false} />
    </aside>
  );
}

function NewsletterForm({
  inputId,
  inputRef,
  showLabel = true,
}: {
  inputId: string;
  inputRef?: React.Ref<HTMLInputElement>;
  showLabel?: boolean;
}) {
  const [submitted, setSubmitted] = React.useState(false);

  if (submitted) {
    return (
      <p className="text-sm text-foreground/70">
        Thanks! Check your inbox to confirm your subscription.
      </p>
    );
  }

  return (
    <form
      action={BUTTONDOWN_ACTION}
      method="post"
      target="_blank"
      // Swap to the thank-you note after the browser has sent the form.
      onSubmit={() => setTimeout(() => setSubmitted(true), 0)}
      className="max-w-md"
    >
      <label
        htmlFor={inputId}
        className={showLabel ? "mb-2 block text-sm font-medium text-foreground" : "sr-only"}
      >
        Email
      </label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="h-9 min-w-0 flex-1 rounded-sm border border-input bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring"
        />
        <input type="hidden" name="embed" value="1" />
        <button
          type="submit"
          className="h-9 shrink-0 rounded-sm border border-primary bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Subscribe
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        <a
          href="https://buttondown.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Powered by Buttondown.
        </a>
      </p>
    </form>
  );
}
