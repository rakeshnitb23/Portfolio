"use client";

import { useCallback, useState } from "react";
import { contactSchema, SUBJECT_OPTIONS } from "@/lib/contact-schema";
import { type FormStatus, type FieldErrors } from "@/types";
import { cn } from "@/lib/utils";

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-[0.1rem] border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary";

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
            setServerError(data.message || "Something went wrong. Please retry.");
            setStatus("error");
          }
          return;
        }

        setStatus("success");
        setFormData({
          fullName: "",
          email: "",
          company: "",
          subject: "",
          message: "",
          agreement: false,
          _hp: "",
        });
      } catch {
        setServerError("Network error. Please check your connection.");
        setStatus("error");
      }
    },
    [formData, status]
  );

  if (status === "success") {
    return (
      <div className="max-w-[42rem] rounded-[0.1rem] border border-border bg-muted/40 px-6 py-8">
        <p className="font-medium text-foreground">Message sent.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Thanks for reaching out — expect a response within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[42rem] space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={errors.fullName}>
          <input
            className={inputClass}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="John Doe"
          />
        </Field>
        <Field label="Email address" required error={errors.email}>
          <input
            type="email"
            className={inputClass}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Company" error={errors.company}>
          <input
            className={inputClass}
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Corp"
          />
        </Field>
        <Field label="Subject" required error={errors.subject}>
          <select
            className={cn(inputClass, "appearance-none")}
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          >
            <option value="" disabled>
              Select a subject
            </option>
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Message" required error={errors.message}>
        <textarea
          rows={5}
          className={cn(inputClass, "resize-none")}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell me about your project..."
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={formData.agreement}
          onChange={(e) => setFormData({ ...formData, agreement: e.target.checked })}
          className="h-4 w-4 rounded-sm border-border accent-[var(--md-primary)]"
        />
        I agree to be contacted about this message.
      </label>
      {errors.agreement && (
        <p className="text-xs text-destructive">{errors.agreement}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-[0.1rem] bg-[var(--md-primary)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
        {serverError && <p className="text-xs text-destructive">{serverError}</p>}
      </div>
    </form>
  );
}
