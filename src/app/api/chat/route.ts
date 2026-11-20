import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SITE_URL } from "@/config/site";
import { chatSystemPrompt } from "@/lib/chatbot";

/**
 * Website chat assistant, through any OpenAI-compatible chat-completions API
 * (OpenRouter by default).
 *
 * Env:
 *   CHATBOT_API_KEY         API key (OPENROUTER_API_KEY is read as a fallback).
 *                           Without one the endpoint answers 503 and the widget
 *                           stays hidden.
 *   CHATBOT_API_URL         chat-completions URL (default: OpenRouter)
 *   CHATBOT_MODEL           model id on that provider
 *   CHATBOT_FALLBACK_MODEL  model tried once if the main one fails. Defaults to
 *                           "openrouter/free" on OpenRouter, none elsewhere.
 *
 * Streams plain text back to the browser. Per-IP rate limit and message
 * size limits keep the cost bounded.
 */

const ENDPOINT = process.env.CHATBOT_API_URL || "https://openrouter.ai/api/v1/chat/completions";
const IS_OPENROUTER = ENDPOINT.includes("openrouter.ai");
const DEFAULT_MODEL = "google/gemma-4-31b-it:free";
const FALLBACK_MODEL = process.env.CHATBOT_FALLBACK_MODEL ?? (IS_OPENROUTER ? "openrouter/free" : "");
const apiKey = () => process.env.CHATBOT_API_KEY || process.env.OPENROUTER_API_KEY;
const MAX_TURNS = 16;

const ChatSchema = z.object({
  lang: z.enum(["en", "ar"]).optional(),
  /** diagnostics: answer with JSON (reply, finish reason, token usage) instead of a stream */
  debug: z.boolean().optional(),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1500) }))
    .min(1)
    .max(MAX_TURNS),
});

/* ---------------- rate limiting (in memory, per server instance) ---------------- */
const RATE_LIMIT = 20;
const WINDOW_MS = 10 * 60_000;
const hits = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, e] of hits) if (e.reset < now) hits.delete(k);
  const e = hits.get(ip);
  if (!e || e.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  e.count += 1;
  return e.count > RATE_LIMIT;
}

const json = (body: object, status = 200) => NextResponse.json(body, { status });

/** The provider's short error code from an error body (never its message text). */
function errorCode(text: string): string | undefined {
  try {
    const e = JSON.parse(text)?.error;
    const code = e?.code ?? e?.type;
    return code === undefined ? undefined : String(code).slice(0, 60);
  } catch {
    return undefined;
  }
}

/** GET: lets the widget know whether the assistant is available. */
export function GET() {
  return json({ enabled: Boolean(apiKey()) });
}

export async function POST(req: NextRequest) {
  const key = apiKey();
  if (!key) return json({ error: "Chat is not configured." }, 503);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }
  const parsed = ChatSchema.safeParse(body);
  if (!parsed.success) return json({ error: "Invalid request." }, 422);
  const { messages, lang, debug } = parsed.data;
  if (messages[messages.length - 1].role !== "user") return json({ error: "Invalid request." }, 422);

  const system =
    chatSystemPrompt() + `\n\nThe visitor is browsing the ${lang === "ar" ? "Arabic" : "English"} version of the site.`;

  const call = (model: string) =>
    fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": SITE_URL,
        "X-Title": "EVEXA Website",
      },
      body: JSON.stringify({
        model,
        stream: true,
        // Reasoning models (e.g. Claude Haiku 5.5) think before answering and
        // that counts toward max_tokens: keep thinking light and leave room
        // for the reply. Ignored by models without reasoning.
        max_tokens: 2000,
        reasoning: { effort: "low", exclude: true },
        temperature: 0.4,
        messages: [{ role: "system", content: system }, ...messages],
        usage: { include: true },
      }),
    });

  const primary = process.env.CHATBOT_MODEL || DEFAULT_MODEL;
  let served = primary;
  let primaryError = "";
  let upstream: Response;
  try {
    upstream = await call(primary);
    if ((!upstream.ok || !upstream.body) && FALLBACK_MODEL) {
      const text = await upstream.text().catch(() => "");
      console.error("[chat] primary model failed:", upstream.status, text);
      primaryError = `${upstream.status} ${errorCode(text) ?? ""}`.trim();
      served = FALLBACK_MODEL;
      upstream = await call(FALLBACK_MODEL);
    }
  } catch (err) {
    console.error("[chat] request failed:", err);
    return json({ error: "upstream" }, 502);
  }
  if (!upstream.ok || !upstream.body) {
    const text = await upstream.text().catch(() => "");
    console.error("[chat] model failed:", upstream.status, text);
    // Only the provider's status and error code go back (no message text, no secrets),
    // so a failing setup can be diagnosed from the browser.
    return json({ error: "upstream", status: upstream.status, code: errorCode(text), model: served }, 502);
  }

  // Turn the OpenAI-style SSE stream into a plain text stream.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = upstream.body.getReader();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      let reply = "";
      let finish: unknown;
      let usage: unknown;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let nl: number;
          while ((nl = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, nl).trim();
            buffer = buffer.slice(nl + 1);
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const chunk = JSON.parse(data);
              const choice = chunk?.choices?.[0];
              if (choice?.finish_reason) finish = choice.finish_reason;
              if (chunk?.usage) usage = chunk.usage;
              const delta = choice?.delta?.content;
              if (typeof delta === "string" && delta) {
                reply += delta;
                if (!debug) controller.enqueue(encoder.encode(delta));
              }
            } catch {
              /* keep-alive comments and partial lines */
            }
          }
        }
      } catch (err) {
        console.error("[chat] stream error:", err);
      } finally {
        if (finish === "length") console.warn("[chat] reply hit max_tokens", usage);
        if (debug) controller.enqueue(encoder.encode(JSON.stringify({ model: served, finish, usage, reply })));
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
      // which model was asked to answer (the fallback router may pick any free model)
      "X-Chat-Model": served,
      "X-Chat-Build": (process.env.VERCEL_GIT_COMMIT_SHA || "local").slice(0, 7),
      // why the main model was skipped, when the fallback answered (status + provider code only)
      ...(primaryError ? { "X-Chat-Primary-Error": primaryError } : {}),
    },
  });
}
