import EvexaPage from "@/components/evexa/EvexaPage";
import "../evexa.css";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvexaPage page="home" lang={lang} />;
}
