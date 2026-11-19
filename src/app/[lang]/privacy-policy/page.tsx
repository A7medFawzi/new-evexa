import type { Metadata } from "next";
import { PAGE_SEO } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";
import LegalPage from "@/components/legal/LegalPage";
import type { Lang } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = (await params).lang as Lang;
  return pageMetadata({ lang, route: "/privacy-policy", ...PAGE_SEO.privacy[lang] });
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalPage doc="privacy" lang={lang as Lang} />;
}
