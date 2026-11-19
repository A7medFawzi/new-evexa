import EvexaPage from "@/components/evexa/EvexaPage";
import "@/content/pages/portfolio-lemonide-tech.css";

export default async function LemonideTechPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvexaPage page="portfolio-lemonide-tech" lang={lang} />;
}
