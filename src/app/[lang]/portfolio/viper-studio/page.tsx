import EvexaPage from "@/components/evexa/EvexaPage";
import "@/content/pages/portfolio-viper-studio.css";

export default async function ViperStudioPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvexaPage page="portfolio-viper-studio" lang={lang} />;
}
