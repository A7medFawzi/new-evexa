import type { Metadata } from "next";
import "./fonts.css";

/*
 * Shown for URLs outside the /en and /ar trees (e.g. "/missing.txt"),
 * which never reach the language layout. Bilingual, no site chrome.
 */
export const metadata: Metadata = {
  title: "Page not found | EVEXA",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#000", color: "#fff", fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>
        <main style={{ padding: 24 }}>
          <img src="/images/brand/evexa-logo-white.png" alt="EVEXA" width={160} height={35} />
          <h1 style={{ margin: "32px 0 8px", fontSize: 40, fontWeight: 400 }}>404</h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.6)" }}>This page doesn’t exist. · هذه الصفحة غير موجودة.</p>
          <p style={{ marginTop: 28, display: "flex", gap: 16, justifyContent: "center" }}>
            <a href="/en" style={{ color: "#9fb0ff" }}>Home</a>
            <a href="/ar" style={{ color: "#9fb0ff" }} dir="rtl">الرئيسية</a>
          </p>
        </main>
      </body>
    </html>
  );
}
