import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";

/**
 * Contact / newsletter endpoint.
 *
 * - zod-validated payload (newsletter = email only, contact = full form)
 * - submissions appended as NDJSON to data/contact-submissions.ndjson
 *   (one JSON object per line — trivially importable into any CRM later)
 * - light per-IP rate limiting (10 req / minute) to deter spam bots
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
});

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contact-submissions.ndjson");

// naive in-memory rate limiter (resets on server restart — fine for spam deterrence)
const hits = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = ContactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        issues: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 422 }
    );
  }

  const {
    fullName: rawFullName,
    companyName,
    firstName,
    lastName,
    name: rawName,
    email,
    country,
    interest: rawInterest,
    companyType,
    message,
    subscribe,
  } = parsed.data;

  if (!subscribe && !message) {
    return NextResponse.json(
      { ok: false, error: "Message is required." },
      { status: 422 }
    );
  }

  const resolvedFullName =
    rawFullName || rawName || [firstName, lastName].filter(Boolean).join(" ");
  const resolvedInterest = rawInterest || companyType;

  const record = {
    at: new Date().toISOString(),
    lang: req.headers.get("x-evexa-lang") ?? undefined,
    ip,
    fullName: resolvedFullName || undefined,
    companyName: companyName || undefined,
    email,
    country: country || undefined,
    interest: resolvedInterest || undefined,
    message: message || undefined,
    subscribe: subscribe || undefined,
  };

  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.appendFileSync(DATA_FILE, JSON.stringify(record) + "\n", "utf8");
  } catch (err) {
    console.error("[contact] failed to persist submission:", err);
    return NextResponse.json(
      { ok: false, error: "Could not store the submission." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
