import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Alexandria } from "next/font/google";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import ChatWidget from "@/components/chat/ChatWidget";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LANGS, SITE_NAME, SITE_URL, dirOf, isLang } from "@/config/site";
import { SITE_SEO } from "@/content/seo";
import { getDictionary } from "@/i18n";
import { OG_IMAGE } from "@/lib/seo";
import "../fonts.css";
import "../globals.css";
import "../ar-typography.css";

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

/** Site-wide defaults; each page adds its own title, canonical and hreflang (lib/seo.ts). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const site = SITE_SEO[isLang(lang) ? lang : "en"];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: site.title, template: `%s | ${SITE_NAME}` },
    description: site.description,
    applicationName: SITE_NAME,
    icons: {
      icon: "/images/brand/favicon-32.png",
      apple: "/images/brand/favicon-192.png",
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: site.title,
      description: site.description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
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
  if (!isLang(lang)) notFound();
  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      suppressHydrationWarning
      className={lang === "ar" ? alexandria.variable : undefined}
    >
      <body suppressHydrationWarning>
        <SiteHeader lang={lang} dict={getDictionary(lang)} />
        {children}
        <SiteFooter lang={lang} dict={getDictionary(lang)} />
        <ChatWidget lang={lang} />
        {/* Vercel Web Analytics (cookie-free visit stats) and Speed Insights (real-user performance) */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
