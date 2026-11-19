import LegalPage from "@/components/legal/LegalPage";
import type { Lang } from "@/config/site";

export default async function TermsConditionsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalPage doc="terms" lang={lang as Lang} />;
}
