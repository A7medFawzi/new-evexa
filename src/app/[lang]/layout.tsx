import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Alexandria } from "next/font/google";
import "../globals.css";
import "../ar-typography.css";

export const LANGS = ["en", "ar"] as const;
export type Lang = (typeof LANGS)[number];

/*
 * Alexandria (Google Fonts) — the approved Arabic identity font.
 * Self-hosted by next/font: no runtime requests to Google, automatic
 * preload and fallback-metric adjustment (no font flash / layout shift).
 * Weights 400/500/600 only; arabic+latin subsets so Latin words such as
 * "EVEXA" and "Dealplier" render in the same family inside Arabic text.
 * The font variable is attached to RTL pages only, so English typography
 * keeps loading exactly as before.
 */
const alexandria = Alexandria({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-alexandria",
  display: "swap",
});

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

const META: Record<Lang, { title: string; desc: string }> = {
  en: {
    title: "Evexa - Premium AI Agency & Studio",
    desc: "Evexa is a premium AI agency and studio crafting intelligent products, brands and digital experiences.",
  },
  ar: {
    title: "Evexa - وكالة واستوديو ذكاء اصطناعي",
    desc: "Evexa وكالة ذكاء اصطناعي متميزة تصمّم منتجات ذكية وعلامات تجارية وتجارب رقمية.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const meta = META[lang as Lang] ?? META.en;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.desc,
    icons: {
      icon: "/images/brand/favicon-32.png",
      apple: "/images/brand/favicon-192.png",
    },
    openGraph: {
      title: meta.title,
      description: meta.desc,
      images: ["/images/brand/favicon-512.png"],
      type: "website",
    },
    alternates: {
      languages: { en: "/en", ar: "/ar", "x-default": "/en" },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();
  const dir = lang === "ar" ? "rtl" : "ltr";
  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={lang === "ar" ? alexandria.variable : undefined}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
