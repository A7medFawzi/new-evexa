import EvexaPage from "@/components/evexa/EvexaPage";
import "@/content/pages/about.css";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvexaPage page="about" lang={lang} />;
}
