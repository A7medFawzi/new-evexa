import EvexaPage from "@/components/evexa/EvexaPage";
import "@/content/pages/portfolio.css";
import "@/content/chrome-polish.css";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvexaPage page="portfolio" lang={lang} />;
}
