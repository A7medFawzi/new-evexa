import LegalPage from "@/components/legal/LegalPage";
import type { Lang } from "@/config/site";

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalPage doc="privacy" lang={lang as Lang} />;
}
