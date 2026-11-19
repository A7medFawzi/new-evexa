/**
 * Outgoing email for contact-form submissions.
 *
 * Provider is chosen from environment variables (see .env.example):
 *   - RESEND_API_KEY                         -> Resend HTTP API
 *   - SMTP_HOST (+ SMTP_PORT/USER/PASS)      -> any SMTP mailbox
 * Recipient: CONTACT_TO_EMAIL (default info@evexa.tech). Sender: CONTACT_FROM_EMAIL.
 */
import nodemailer from "nodemailer";

const DEFAULT_TO = "info@evexa.tech";
const DEFAULT_FROM = "EVEXA Website <website@evexa.tech>";

export interface MailMessage {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST);
}

export async function sendMail(message: MailMessage): Promise<void> {
  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;

  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        subject: message.subject,
        text: message.text,
        html: message.html,
        reply_to: message.replyTo,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
    return;
  }

  if (process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 465);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await transport.sendMail({
      from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || DEFAULT_FROM,
      to,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    });
    return;
  }

  throw new Error("No email provider configured (set RESEND_API_KEY or SMTP_HOST)");
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Build the notification email for one submission. */
export function formatSubmissionEmail(fields: Array<[label: string, value: string | undefined]>, opts: { subject: string; replyTo?: string }): MailMessage {
  const rows = fields.filter(([, v]) => v && v.trim() !== "") as Array<[string, string]>;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f6fa;font-family:Arial,Helvetica,sans-serif;color:#111">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e3e6ef">
<tr><td style="padding:20px 24px;background:#0031d5;color:#fff;font-size:18px;font-weight:bold">${escapeHtml(opts.subject)}</td></tr>
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:14px 24px;border-top:1px solid #eef0f5"><div style="font-size:12px;color:#667;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px">${escapeHtml(k)}</div><div style="font-size:15px;line-height:1.55;white-space:pre-wrap">${escapeHtml(v)}</div></td></tr>`
  )
  .join("\n")}
</table></body></html>`;
  return { subject: opts.subject, text, html, replyTo: opts.replyTo };
}
