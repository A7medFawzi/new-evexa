import fs from "fs";
import path from "path";
import EvexaRuntime from "@/components/evexa/EvexaRuntime";
import { SVG_TEMPLATES } from "@/content/svg-templates";

/**
 * Evexa page renderer — injects the original template DOM for the given
 * page key and mounts the shared animation runtime.
 * SSR already carries the initial hidden states (opacity 0.001 etc.),
 * exactly like the published Framer site.
 *
 * The shared SVG sprite (symbols referenced by <use href="#svg…"> across
 * every page) is appended server-side, so icons render even before
 * hydration and the client bundle stays free of asset payloads.
 */

export function readBody(page: string, lang: string = "en"): string {
  const file =
    page === "home"
      ? lang === "ar"
        ? "src/content/body-ar.html"
        : "src/content/body.html"
      : lang === "ar"
        ? `src/content/pages-ar/${page}.html`
        : `src/content/pages/${page}.html`;
  return fs.readFileSync(path.join(process.cwd(), file), "utf8");
}

export default function EvexaPage({
  page,
  lang = "en",
}: {
  page: string;
  lang?: string;
}) {
  const bodyHtml =
    readBody(page, lang) +
    // sprite holder appended (not prepended) so :first-child/:nth-child
    // CSS of the page root is never affected
    `<div id="svg-templates" style="display:none">${SVG_TEMPLATES}</div>`;

  return (
    <>
      <div id="nb-page" data-page={page} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <EvexaRuntime page={page} lang={lang} />
    </>
  );
}
