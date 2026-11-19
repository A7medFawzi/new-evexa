import EvexaPage from "@/components/evexa/EvexaPage";
import "@/content/pages/contact.css";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <EvexaPage page="contact" lang={lang} />;
}
