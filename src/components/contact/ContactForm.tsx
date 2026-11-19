"use client";

import Link from "next/link";
import { animate } from "framer-motion";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { localizeHref, type Lang } from "@/config/site";
import { COUNTRIES, INTERESTS, type ContactCopy } from "@/content/contact";
import Select from "./Select";
import styles from "./ContactForm.module.css";

const HOVER_SPRING = { type: "spring", stiffness: 400, damping: 60, mass: 1 } as const;
const BUTTON_SHADOW =
  "0px 8px 40px 0px rgba(0, 49, 213, 0.5), inset 0px 0px 10px 1px rgba(255, 255, 255, 0), 0px 0px 0px 1px rgba(0, 49, 213, 0.12), inset 0px -12px 20px 0px rgba(255, 255, 255, 0.25)";
const BUTTON_SHADOW_HOVER =
  "0px 0.6021873017743928px 3.010936508871964px 0px rgba(0, 49, 213, 0.04), 0px 2.288533303243457px 11.442666516217285px 0px rgba(0, 49, 213, 0.16), 0px 10px 50px 0px rgba(0, 49, 213, 0.7)";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = { type: "success" | "error"; message: string } | null;

const EMPTY = { fullName: "", companyName: "", email: "", country: "", interest: "", message: "", website: "" };

/** Project inquiry form — posts to /api/contact (delivered by email). */
export default function ContactForm({ lang, copy }: { lang: Lang; copy: ContactCopy }) {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<Status>(null);
  const [sending, setSending] = useState(false);
  const [buttonLabel, setButtonLabel] = useState(copy.submit);
  const revertTimer = useRef<number>(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => () => window.clearTimeout(revertTimer.current), []);

  const set = (field: keyof typeof EMPTY) => (value: string) => setValues((v) => ({ ...v, [field]: value }));

  const flashLabel = (text: string, ms: number) => {
    setButtonLabel(text);
    window.clearTimeout(revertTimer.current);
    revertTimer.current = window.setTimeout(() => setButtonLabel(copy.submit), ms);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = Object.fromEntries(Object.entries(values).map(([k, x]) => [k, x.trim()])) as typeof EMPTY;

    if (!v.fullName || !v.companyName || !v.email || !v.message) {
      setStatus({ type: "error", message: copy.errors.required });
      return;
    }
    if (!EMAIL_RE.test(v.email)) {
      setStatus({ type: "error", message: copy.errors.email });
      return;
    }

    setStatus(null);
    setSending(true);
    setButtonLabel(copy.sending);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-evexa-lang": lang },
        body: JSON.stringify(v),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error || String(res.status));
      setValues(EMPTY);
      setStatus({ type: "success", message: copy.success });
      flashLabel(copy.sent, 5000);
    } catch (err) {
      console.error("[contact submit error]", err);
      setStatus({ type: "error", message: copy.errors.failed });
      flashLabel(copy.failedButton, 4000);
    } finally {
      setSending(false);
    }
  };

  const hover = (on: boolean) => {
    if (buttonRef.current) animate(buttonRef.current, { boxShadow: on ? BUTTON_SHADOW_HOVER : BUTTON_SHADOW }, HOVER_SPRING);
    if (labelRef.current) animate(labelRef.current, { color: on ? "rgb(196, 196, 196)" : "rgb(255, 255, 255)" }, HOVER_SPRING);
  };

  return (
    <form id="evexa-contact-form" className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.row}>
        <Field label={copy.labels.fullName}>
          <input type="text" name="fullName" required autoComplete="name" placeholder={copy.placeholders.fullName} value={values.fullName} onChange={(e) => set("fullName")(e.target.value)} />
        </Field>
        <Field label={copy.labels.companyName}>
          <input type="text" name="companyName" required autoComplete="organization" placeholder={copy.placeholders.companyName} value={values.companyName} onChange={(e) => set("companyName")(e.target.value)} />
        </Field>
      </div>

      <Field label={copy.labels.email}>
        <input type="email" name="email" required autoComplete="email" dir="ltr" placeholder={copy.placeholders.email} value={values.email} onChange={(e) => set("email")(e.target.value)} />
      </Field>

      <div className={styles.row}>
        <Field label={copy.labels.country} plain>
          <Select name="country" placeholder={copy.placeholders.country} groups={COUNTRIES[lang]} value={values.country} onChange={set("country")} />
        </Field>
        <Field label={copy.labels.interest} plain>
          <Select name="interest" placeholder={copy.placeholders.interest} options={INTERESTS[lang]} value={values.interest} onChange={set("interest")} />
        </Field>
      </div>

      <Field label={copy.labels.message} tall>
        <textarea name="message" required placeholder={copy.placeholders.message} value={values.message} onChange={(e) => set("message")(e.target.value)} />
      </Field>

      {/* spam trap: hidden from people, tempting for bots */}
      <input className={styles.honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={values.website} onChange={(e) => set("website")(e.target.value)} />

      {status && (
        <div className={styles.status} data-type={status.type} role={status.type === "error" ? "alert" : "status"}>
          {status.message}
        </div>
      )}

      <button ref={buttonRef} type="submit" className={styles.submit} disabled={sending} style={{ boxShadow: BUTTON_SHADOW }} onPointerEnter={() => hover(true)} onPointerLeave={() => hover(false)}>
        <span ref={labelRef}>{buttonLabel}</span>
      </button>

      <p className={styles.consent}>
        {copy.consent[0]}
        <Link href={localizeHref("/privacy-policy", lang)}>{copy.consent[1]}</Link>
        {copy.consent[2]}
      </p>
    </form>
  );
}

function Field({ label, plain, tall, children }: { label: string; plain?: boolean; tall?: boolean; children: React.ReactNode }) {
  if (plain) {
    return (
      <div className={styles.field} role="group" aria-label={label}>
        <span className={styles.label}>{label}</span>
        {children}
      </div>
    );
  }
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      <span className={tall ? `${styles.input} ${styles.tall}` : styles.input}>{children}</span>
    </label>
  );
}
