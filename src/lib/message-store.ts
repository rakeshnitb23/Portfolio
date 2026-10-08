import { neon } from "@neondatabase/serverless";

// Where contact-form messages are kept: a Postgres table on Neon
// (https://neon.tech). DATABASE_URL is Neon's connection string, set in
// .env.local locally and in Vercel's environment variables in production.
// This is the only file that knows about the database, so moving to another
// store later means changing only this file.

export interface ContactMessage {
  fullName: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
}

export function isMessageStoreConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

// Create the table on first use (once per server instance), so a new Neon
// database needs no manual setup. The same SQL can be run in Neon's SQL editor.
let tableReady: Promise<unknown> | null = null;
function ensureTable() {
  tableReady ??= db()`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id         BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      full_name  TEXT NOT NULL,
      email      TEXT NOT NULL,
      company    TEXT,
      subject    TEXT NOT NULL,
      message    TEXT NOT NULL
    )
  `.catch((err) => {
    tableReady = null; // retry on the next message
    throw err;
  });
  return tableReady;
}

/** Saves one message. Values are sent as query parameters, never spliced into SQL. */
export async function saveMessage(msg: ContactMessage): Promise<void> {
  await ensureTable();
  await db()`
    INSERT INTO contact_messages (full_name, email, company, subject, message)
    VALUES (${msg.fullName}, ${msg.email}, ${msg.company || null}, ${msg.subject}, ${msg.message})
  `;
}
