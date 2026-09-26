import { z } from "zod";

// ─── Regex patterns for input sanitization ──────────────────────────────────────
const URL_REGEX = /https?:\/\/|www\./i;
const SCRIPT_TAG_REGEX = /<script[\s>]/i;
const NAME_REGEX = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/;

// ─── Subject options ────────────────────────────────────────────────────────────
export const SUBJECT_OPTIONS = [
  { value: "hiring", label: "Hiring Opportunity" },
  { value: "collaboration", label: "Collaboration" },
  { value: "project", label: "Project Inquiry" },
  { value: "other", label: "Other" },
] as const;

export type SubjectValue = (typeof SUBJECT_OPTIONS)[number]["value"];

// ─── Contact form schema ────────────────────────────────────────────────────────
export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be under 60 characters")
    .regex(NAME_REGEX, "Name can only contain letters and spaces"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  company: z
    .string()
    .trim()
    .max(100, "Company name must be under 100 characters")
    .optional()
    .or(z.literal("")),

  subject: z.enum(["hiring", "collaboration", "project", "other"] as const, {
    message: "Please select a subject",
  }),

  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(1000, "Message must be under 1000 characters")
    .refine((val) => !URL_REGEX.test(val), {
      message: "Links are not allowed in messages",
    })
    .refine((val) => !SCRIPT_TAG_REGEX.test(val), {
      message: "Invalid content detected",
    }),

  agreement: z
    .boolean()
    .refine((val) => val === true, {
      message: "Please agree to professional communication",
    }),

  // Honeypot — must remain empty
  _hp: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
