import EvexaPage from "@/components/evexa/EvexaPage";
import "@/content/pages/portfolio-million-one.css";
import "@/content/chrome-polish.css";

export default async function MillionOnePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvexaPage page="portfolio-million-one" lang={lang} />;
}
