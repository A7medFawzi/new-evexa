import EvexaPage from "@/components/evexa/EvexaPage";
import "@/content/pages/contact.css";
import "@/content/chrome-polish.css";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvexaPage page="contact" lang={lang} />;
}
