import { NextResponse } from "next/server";
import { contactSchema, SUBJECT_OPTIONS } from "@/lib/contact-schema";
import { isMessageStoreConfigured, saveMessage } from "@/lib/message-store";
import { PERSON } from "@/lib/site";

// Contact form endpoint. Validates with the same schema as the form, saves the
// message to the database (lib/message-store.ts), then emails an alert through
// Resend (https://resend.com). Configuration (.env.local locally, Vercel's
// environment variables in production):
//   DATABASE_URL        required: Neon connection string; messages are saved here
//   RESEND_API_KEY      optional: enables the email alert for each new message
//   CONTACT_TO_EMAIL    inbox for alerts (default: PERSON.email)
//   CONTACT_FROM_EMAIL  alert sender (default: Resend's test sender, which can
//                       only deliver to the Resend account's own address until a
//                       domain is verified)

// Light abuse protection: at most 5 messages per sender IP per 10 minutes.
// Kept in memory, so it resets on redeploy and is per server instance.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recentByIp = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (recentByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    recentByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentByIp.set(ip, recent);
  return false;
}

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, (c) => ESCAPES[c]);

/** Emails an alert for a saved message. Best effort: failures are logged, not raised. */
async function sendAlert(fields: {
  fullName: string;
  email: string;
  company?: string;
  subjectLabel: string;
  message: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { fullName, email, company, subjectLabel, message } = fields;
  const rows: [string, string][] = [
    ["Name", fullName],
    ["Email", email],
    ...(company ? ([["Company", company]] as [string, string][]) : []),
    ["Subject", subjectLabel],
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || PERSON.email],
      reply_to: email,
      subject: `[Portfolio] New message: ${subjectLabel} — ${fullName}`,
      text: [...rows.map(([k, v]) => `${k}: ${v}`), "", message].join("\n"),
      html: `<table>${rows
        .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
        .join("")}</table><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  }).catch(() => null);

  if (!res?.ok) {
    console.error("contact: alert email failed", res?.status, await res?.text().catch(() => ""));
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Report success and drop the message.
  const hp = (body as { _hp?: unknown } | null)?._hp;
  if (typeof hp === "string" && hp.length > 0) {
    return NextResponse.json({ success: true, message: "Message sent." });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0]);
      errors[field] ??= issue.message;
    }
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many messages. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  if (!isMessageStoreConfigured()) {
    console.error("contact: DATABASE_URL is not set; message not saved");
    return NextResponse.json(
      { success: false, code: "not_configured", message: "Your message couldn't be sent right now." },
      { status: 503 }
    );
  }

  const { fullName, email, company, subject, message } = parsed.data;
  const subjectLabel = SUBJECT_OPTIONS.find((o) => o.value === subject)?.label ?? subject;

  try {
    await saveMessage({ fullName, email, company, subject: subjectLabel, message });
  } catch (err) {
    console.error("contact: saving the message failed", err);
    return NextResponse.json(
      { success: false, code: "save_failed", message: "Your message couldn't be sent right now." },
      { status: 500 }
    );
  }

  // The message is safely stored; the alert is a convenience on top.
  await sendAlert({ fullName, email, company, subjectLabel, message });

  return NextResponse.json({ success: true, message: "Message sent." });
}
