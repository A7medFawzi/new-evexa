import EvexaPage from "@/components/evexa/EvexaPage";
import "@/content/pages/terms-conditions.css";

export default async function TermsConditionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvexaPage page="terms-conditions" lang={lang} />;
}
