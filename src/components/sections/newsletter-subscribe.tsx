"use client";

import * as React from "react";

// Buttondown's embed form (same endpoint and fields as its embed snippet),
// styled to match the site. It opens under the button row when the button is
// clicked; submitting opens Buttondown's confirmation page in a new tab.
const BUTTONDOWN_ACTION = "https://buttondown.com/api/emails/embed-subscribe/rakeshnitb23";
const FORM_ID = "newsletter-subscribe";

export function NewsletterSubscribe({ className }: { className: string }) {
  const [open, setOpen] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
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
          {submitted ? (
            <p className="text-sm text-foreground/70">
              Thanks! Check your inbox to confirm your subscription.
            </p>
          ) : (
            <form
              action={BUTTONDOWN_ACTION}
              method="post"
              target="_blank"
              // Swap to the thank-you note after the browser has sent the form.
              onSubmit={() => setTimeout(() => setSubmitted(true), 0)}
              className="max-w-md"
            >
              <label htmlFor="newsletter-email" className="mb-2 block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  id="newsletter-email"
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  className="h-9 min-w-0 flex-1 rounded-sm border border-input bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring"
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
          )}
        </div>
      )}
    </>
  );
}
