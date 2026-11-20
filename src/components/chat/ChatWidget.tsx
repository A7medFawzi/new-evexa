"use client";

import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Lang } from "@/config/site";
import styles from "./ChatWidget.module.css";

type Msg = { role: "user" | "assistant"; content: string };

const COPY: Record<Lang, {
  open: string; close: string; reset: string; title: string; subtitle: string; greeting: string;
  chips: string[]; placeholder: string; send: string; error: string; rate: string; note: string;
}> = {
  en: {
    open: "Chat with EVEXA",
    close: "Close chat",
    reset: "New conversation",
    title: "EVEXA Assistant",
    subtitle: "Available 24/7",
    greeting: "Hi! I’m EVEXA’s assistant. Ask me about our AI solutions, our projects, or how we could help your business.",
    chips: ["What solutions do you offer?", "Show me your projects", "How do we start a project?"],
    placeholder: "Type your message…",
    send: "Send",
    error: "Sorry, something went wrong. Please try again, or reach us at info@evexa.tech.",
    rate: "You’ve sent a lot of messages. Please try again in a few minutes.",
    note: "AI answers can be wrong. For a quote, contact our team.",
  },
  ar: {
    open: "تحدث مع EVEXA",
    close: "إغلاق المحادثة",
    reset: "محادثة جديدة",
    title: "مساعد EVEXA",
    subtitle: "متاح على مدار الساعة",
    greeting: "هلا وغلا! معك مساعد EVEXA. اسألني عن حلول الذكاء الاصطناعي اللي نقدمها، أو مشاريعنا، أو كيف نقدر نخدم شركتك.",
    chips: ["وش الحلول اللي تقدمونها؟", "ورني مشاريعكم", "كيف نبدأ مشروع معكم؟"],
    placeholder: "اكتب رسالتك هنا…",
    send: "إرسال",
    error: "المعذرة، صار خطأ. جرّب مرة ثانية، أو راسلنا على info@evexa.tech.",
    rate: "أرسلت رسائل كثير. جرّب مرة ثانية بعد دقايق.",
    note: "قد تخطئ إجابات المساعد الذكي. للتسعير تواصل مع فريقنا.",
  },
};

/** One saved conversation per language, kept for the browser tab. */
const storeKey = (lang: Lang) => `evexa-chat-${lang}`;

/** Text with **bold** spans (the model's Markdown emphasis), without the asterisks. */
function withBold(text: string, key: number): ReactNode {
  const parts = text.split(/\*\*([^*\n]+)\*\*/g);
  if (parts.length === 1) return <Fragment key={key}>{text.replace(/\*\*/g, "")}</Fragment>;
  return (
    <Fragment key={key}>
      {parts.map((p, i) => (i % 2 ? <strong key={i}>{p}</strong> : p.replace(/\*\*/g, "")))}
    </Fragment>
  );
}

/** Plain text with clickable URLs and emails and **bold**, keeping line breaks. */
function richText(text: string): ReactNode {
  const parts = text.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      const clean = part.replace(/[.,،]+$/, "");
      return (
        <Fragment key={i}>
          <a href={clean} target={clean.includes("evexa.tech") ? undefined : "_blank"} rel="noopener noreferrer">
            {clean.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
          {part.slice(clean.length)}
        </Fragment>
      );
    }
    if (/@/.test(part) && /^[\w.+-]+@/.test(part)) {
      const clean = part.replace(/[.,،]+$/, "");
      return (
        <Fragment key={i}>
          <a href={`mailto:${clean}`}>{clean}</a>
          {part.slice(clean.length)}
        </Fragment>
      );
    }
    return withBold(part, i);
  });
}

/**
 * Floating chat assistant. Shown only when the server has a chat key
 * (GET /api/chat). The conversation is kept for the browser tab session.
 */
export default function ChatWidget({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => setEnabled(Boolean(d?.enabled)))
      .catch(() => {});
    try {
      const saved = sessionStorage.getItem(storeKey(lang));
      if (saved) setMessages(JSON.parse(saved));
    } catch {
      /* storage unavailable */
    }
    // restore once per language (the layout remounts on a language switch)
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(storeKey(lang), JSON.stringify(messages.slice(-30)));
    } catch {
      /* storage unavailable */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, lang]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history: Msg[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    const show = (reply: string) =>
      setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: reply }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, messages: history.slice(-16) }),
      });
      if (res.status === 429) return show(c.rate);
      if (!res.ok || !res.body) return show(c.error);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        show(reply);
      }
      if (!reply.trim()) show(c.error);
    } catch {
      show(c.error);
    } finally {
      setBusy(false);
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  if (!enabled) return null;

  return (
    <div className={styles.root}>
      {open && (
        <section className={styles.panel} role="dialog" aria-label={c.title}>
          <header className={styles.head}>
            <span className={styles.avatar} aria-hidden="true">
              <img src="/images/brand/evexa-icon.png" alt="" width={20} height={21} />
            </span>
            <div className={styles.headText}>
              <strong>{c.title}</strong>
              <span className={styles.status}>{c.subtitle}</span>
            </div>
            {messages.length > 0 && (
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setMessages([])}
                disabled={busy}
                aria-label={c.reset}
                title={c.reset}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </button>
            )}
            <button type="button" className={styles.iconButton} onClick={() => setOpen(false)} aria-label={c.close} title={c.close}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div className={styles.list} ref={listRef} aria-live="polite">
            <div className={`${styles.bubble} ${styles.bot}`}>{c.greeting}</div>
            {messages.length === 0 && (
              <div className={styles.chips}>
                {c.chips.map((chip) => (
                  <button key={chip} type="button" className={styles.chip} onClick={() => send(chip)}>
                    {chip}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) =>
              m.role === "assistant" && !m.content ? (
                <div key={i} className={`${styles.bubble} ${styles.bot} ${styles.typing}`} aria-label="…">
                  <span />
                  <span />
                  <span />
                </div>
              ) : (
                <div key={i} dir="auto" className={`${styles.bubble} ${m.role === "user" ? styles.user : styles.bot}`}>
                  {m.role === "assistant" ? richText(m.content) : m.content}
                </div>
              )
            )}
          </div>

          <form className={styles.form} onSubmit={onSubmit}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              rows={1}
              maxLength={1500}
              placeholder={c.placeholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <button type="submit" className={styles.send} disabled={busy || !input.trim()} aria-label={c.send}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.4 20.4 21.9 12 3.4 3.6l-.01 6.53L16.5 12 3.39 13.87z" />
              </svg>
            </button>
          </form>
          <p className={styles.note}>{c.note}</p>
        </section>
      )}

      <button
        type="button"
        className={styles.launcher}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? c.close : c.open}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.4 1.1 4.6 3 6.2L4.3 21l3.8-1.7c1.2.4 2.5.6 3.9.6 5.5 0 10-3.9 10-8.7S17.5 3 12 3Z" />
            </svg>
            <span className={styles.launcherLabel}>{c.open}</span>
          </>
        )}
      </button>
    </div>
  );
}
