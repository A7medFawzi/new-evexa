import EvexaPage from "@/components/evexa/EvexaPage";
import "@/content/pages/privacy-policy.css";
import "@/content/chrome-polish.css";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvexaPage page="privacy-policy" lang={lang} />;
}
