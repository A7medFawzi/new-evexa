import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { formatSubmissionEmail, isMailConfigured, sendMail } from "@/lib/mailer";

/**
 * Contact / newsletter endpoint.
 *
 * - zod-validated payload (newsletter = email only, contact = full form)
 * - each submission is emailed to CONTACT_TO_EMAIL (reply-to = the sender);
 *   without an email provider (local development) it is appended to
 *   data/contact-submissions.ndjson instead
 * - per-IP rate limiting (10 requests / minute) and a hidden honeypot
 *   field ("website") to deter spam bots
 */

const ContactSchema = z.object({
  fullName: z.string().trim().max(120).optional().default(""),
  companyName: z.string().trim().max(150).optional().default(""),
  firstName: z.string().trim().max(100).optional().default(""),
  lastName: z.string().trim().max(100).optional().default(""),
  name: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(200),
  country: z.string().trim().max(100).optional().default(""),
  interest: z.string().trim().max(100).optional().default(""),
  companyType: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().max(5000).optional().default(""),
  subscribe: z.boolean().optional().default(false),
  website: z.string().optional().default(""), // honeypot: real visitors never fill it
});

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contact-submissions.ndjson");

/* ---------------- rate limiting (in memory, per server instance) ---------------- */

const hits = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [key, entry] of hits) if (entry.reset < now) hits.delete(key);
  }
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

const json = (body: object, status = 200) => NextResponse.json(body, { status });

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return json({ ok: false, error: "Too many requests. Please try again later." }, 429);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON body." }, 400);
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "Validation failed.",
        issues: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      },
      422
    );
  }

  const d = parsed.data;

  // bots that fill the hidden field get a normal-looking success response
  if (d.website) return json({ ok: true });

  if (!d.subscribe && !d.message) {
    return json({ ok: false, error: "Message is required." }, 422);
  }

  const record = {
    at: new Date().toISOString(),
    lang: req.headers.get("x-evexa-lang") ?? undefined,
    ip,
    fullName: d.fullName || d.name || [d.firstName, d.lastName].filter(Boolean).join(" ") || undefined,
    companyName: d.companyName || undefined,
    email: d.email,
    country: d.country || undefined,
    interest: d.interest || d.companyType || undefined,
    message: d.message || undefined,
    subscribe: d.subscribe || undefined,
  };

  try {
    if (isMailConfigured()) {
      const isNewsletter = record.subscribe && !record.message;
      const subject = isNewsletter
        ? `New newsletter subscriber: ${record.email}`
        : `New project inquiry: ${record.fullName || record.email}${record.companyName ? ` (${record.companyName})` : ""}`;
      await sendMail(
        formatSubmissionEmail(
          [
            ["Name", record.fullName],
            ["Company", record.companyName],
            ["Email", record.email],
            ["Country", record.country],
            ["Area of interest", record.interest],
            ["Message", record.message],
            ["Type", isNewsletter ? "Newsletter subscription" : "Contact form"],
            ["Website language", record.lang === "ar" ? "Arabic" : record.lang === "en" ? "English" : record.lang],
            ["Received", record.at],
          ],
          { subject, replyTo: record.email }
        )
      );
    } else {
      // development fallback: no email provider configured
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.appendFileSync(DATA_FILE, JSON.stringify(record) + "\n", "utf8");
    }
  } catch (err) {
    console.error("[contact] failed to deliver submission:", err);
    return json({ ok: false, error: "Could not send the message." }, 500);
  }

  return json({ ok: true });
}
