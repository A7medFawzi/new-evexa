/**
 * Minimal Markdown renderer for the site's long-form documents
 * (privacy policy, terms). Supports exactly what those documents use:
 *
 *   ---                       front matter (key: value lines)
 *   ## Heading                section heading  -> <h2>
 *   ### Heading               sub-heading      -> <h3>
 *   - item                    bullet list
 *   paragraph text            <p>
 *   **bold**  *italic*  `code`  [text](href)
 *
 * Internal links ("/contact") are prefixed with the page language.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { localizeHref, type Lang } from "@/config/site";

export type Block =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] };

export interface MarkdownDocument {
  meta: Record<string, string>;
  blocks: Block[];
}

export function parseMarkdown(source: string): MarkdownDocument {
  const meta: Record<string, string> = {};
  let body = source.replace(/\r\n/g, "\n");

  const fm = body.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) {
    for (const line of fm[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    body = body.slice(fm[0].length);
  }

  const blocks: Block[] = [];
  for (const chunk of body.split(/\n{2,}/)) {
    const lines = chunk.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) continue;
    if (lines.every((l) => l.startsWith("- "))) {
      blocks.push({ type: "ul", items: lines.map((l) => l.slice(2)) });
    } else if (lines[0].startsWith("### ")) {
      blocks.push({ type: "h3", text: lines.join(" ").slice(4) });
    } else if (lines[0].startsWith("## ")) {
      blocks.push({ type: "h2", text: lines.join(" ").slice(3) });
    } else {
      blocks.push({ type: "p", text: lines.join(" ") });
    }
  }
  return { meta, blocks };
}

const INLINE = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*([^*]+)\*/;

function renderInline(text: string, lang: Lang, keyPrefix = ""): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  let n = 0;
  while (rest) {
    const m = INLINE.exec(rest);
    if (!m) {
      out.push(rest);
      break;
    }
    if (m.index > 0) out.push(rest.slice(0, m.index));
    const key = `${keyPrefix}${n++}`;
    const [, bold, code, linkText, href, em] = m;
    if (bold !== undefined) {
      out.push(<strong key={key}>{renderInline(bold, lang, `${key}.`)}</strong>);
    } else if (code !== undefined) {
      out.push(<code key={key}>{code}</code>);
    } else if (linkText !== undefined) {
      const children = renderInline(linkText, lang, `${key}.`);
      if (href.startsWith("/")) {
        out.push(<Link key={key} href={localizeHref(href, lang)}>{children}</Link>);
      } else if (href.startsWith("http")) {
        out.push(<a key={key} href={href} target="_blank" rel="noopener noreferrer">{children}</a>);
      } else {
        out.push(<a key={key} href={href}>{children}</a>);
      }
    } else if (em !== undefined) {
      out.push(<em key={key}>{renderInline(em, lang, `${key}.`)}</em>);
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

export function MarkdownBlocks({ blocks, lang }: { blocks: Block[]; lang: Lang }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return <h2 key={i}>{renderInline(block.text, lang)}</h2>;
          case "h3":
            return <h3 key={i}>{renderInline(block.text, lang)}</h3>;
          case "p":
            return <p key={i}>{renderInline(block.text, lang)}</p>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{renderInline(item, lang)}</li>
                ))}
              </ul>
            );
        }
      })}
    </>
  );
}
