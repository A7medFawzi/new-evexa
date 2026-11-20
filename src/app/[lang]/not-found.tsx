"use client";

import { usePathname } from "next/navigation";
import TopGlow from "@/components/ui/TopGlow";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { localizeHref, type Lang } from "@/config/site";
import styles from "./not-found.module.css";

const COPY: Record<Lang, { tab: string; title: string; text: string; home: string; contact: string }> = {
  en: {
    tab: "Page not found | EVEXA",
    title: "This page doesn’t exist.",
    text: "The link may be broken or the page may have moved. Let’s get you back on track.",
    home: "Back to Home",
    contact: "Contact Us",
  },
  ar: {
    tab: "الصفحة غير موجودة | EVEXA",
    title: "هذه الصفحة غير موجودة.",
    text: "ربما يكون الرابط غير صحيح أو تم نقل الصفحة. يمكنك العودة إلى الرئيسية أو التواصل معنا.",
    home: "العودة إلى الرئيسية",
    contact: "تواصل معنا",
  },
};

/** Localized 404 inside the site layout (header and footer stay). */
export default function NotFound() {
  const lang: Lang = usePathname()?.startsWith("/ar") ? "ar" : "en";
  const c = COPY[lang];
  return (
    <main className={styles.page}>
      <title>{c.tab}</title>
      <meta name="robots" content="noindex" />
      <TopGlow />
      <section className={styles.content}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.title}>{c.title}</h1>
        <p className={styles.text}>{c.text}</p>
        <div className={styles.buttons}>
          <PrimaryButton href={localizeHref("/", lang)}>{c.home}</PrimaryButton>
          <PrimaryButton href={localizeHref("/contact", lang)} tone="grey">
            {c.contact}
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}
