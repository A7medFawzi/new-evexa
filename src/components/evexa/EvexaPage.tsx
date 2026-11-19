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

export const PAGE_TITLES: Record<string, string> = {
  home: "Evexa - Premium AI Agency & Studio",
  about: "Evexa - Premium AI Agency & Studio",
  portfolio: "Evexa - Premium AI Agency & Studio",
  contact: "Evexa - Premium AI Agency & Studio",
  "terms-conditions": "Evexa - Premium AI Agency & Studio",
  "privacy-policy": "Evexa - Premium AI Agency & Studio",
  "portfolio-lemonide-tech": "Evexa - Premium AI Agency & Studio",
  "portfolio-million-one": "Evexa - Premium AI Agency & Studio",
  "portfolio-viper-studio": "Evexa - Premium AI Agency & Studio",
};

export function applyActiveNav(html: string, pageKey: string): string {
  let targetPath: string | null = null;
  if (pageKey === "home") {
    targetPath = "/";
  } else if (pageKey === "about") {
    targetPath = "/about";
  } else if (pageKey === "portfolio" || pageKey.startsWith("portfolio-") || pageKey.startsWith("portfolio/")) {
    targetPath = "/portfolio";
  } else if (pageKey === "contact") {
    targetPath = "/contact";
  }

  return html.replace(/<header\b([\s\S]*?)<\/header>/g, (headerMatch) => {
    return headerMatch.replace(/<a\b([^>]*\bclass="[^"]*framer-i9k05o[^"]*"[^>]*)>([\s\S]*?)<\/a>/g, (aMatch, attrs, innerHtml) => {
      const hrefMatch = attrs.match(/\bhref="([^"]*)"/);
      const rawHref = hrefMatch ? hrefMatch[1] : "";
      
      const isFaq = rawHref.includes("#faq") || rawHref === "/#faq";
      const cleanPath = rawHref.replace(/^\/(?:ar|en)(?=\/|$)/, "").split("#")[0] || "/";
      
      const shouldBeActive = !isFaq && targetPath !== null && (
        targetPath === "/" ? cleanPath === "/" : cleanPath === targetPath
      );

      let newAttrs = attrs;
      let newInner = innerHtml;

      if (shouldBeActive) {
        if (/data-framer-name="[^"]*"/.test(newAttrs)) {
          newAttrs = newAttrs.replace(/data-framer-name="[^"]*"/, 'data-framer-name="Active"');
        } else {
          newAttrs += ' data-framer-name="Active"';
        }
        newAttrs = newAttrs.replace(/\bframer-v-a47mct\b/g, "framer-v-11z3ns5");
        if (!/data-framer-page-link-current/.test(newAttrs)) {
          newAttrs += ' data-framer-page-link-current="true"';
        }
        newInner = newInner.replace(/style="([^"]*opacity:\s*0\.6[^"]*)"/, (m, s) => {
          return `style="${s.replace(/opacity:\s*0\.6/, "opacity:1")}"`;
        });
      } else {
        if (/data-framer-name="[^"]*"/.test(newAttrs)) {
          newAttrs = newAttrs.replace(/data-framer-name="[^"]*"/, 'data-framer-name="In-Active"');
        } else {
          newAttrs += ' data-framer-name="In-Active"';
        }
        newAttrs = newAttrs.replace(/\bframer-v-11z3ns5\b/g, "framer-v-a47mct");
        newAttrs = newAttrs.replace(/\s*data-framer-page-link-current="[^"]*"/g, "");
        newInner = newInner.replace(/style="([^"]*opacity:\s*1[^"]*)"/, (m, s) => {
          return `style="${s.replace(/opacity:\s*1/, "opacity:0.6")}"`;
        });
      }

      return `<a${newAttrs}>${newInner}</a>`;
    });
  });
}

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
    applyActiveNav(readBody(page, lang), page) +
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
