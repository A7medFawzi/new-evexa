import fs from "fs";
import path from "path";
import type { Lang } from "@/config/site";
import TopGlow from "@/components/ui/TopGlow";
import { MarkdownBlocks, parseMarkdown } from "@/lib/markdown";
import styles from "./LegalPage.module.css";

export type LegalDocumentKey = "privacy" | "terms";

/** Reads src/content/legal/<doc>.<lang>.md (at build time — pages are static). */
export function loadLegalDocument(doc: LegalDocumentKey, lang: Lang) {
  const file = path.join(process.cwd(), "src/content/legal", `${doc}.${lang}.md`);
  return parseMarkdown(fs.readFileSync(file, "utf8"));
}

/** Long-form legal document page (privacy policy, terms & conditions). */
export default function LegalPage({ doc, lang }: { doc: LegalDocumentKey; lang: Lang }) {
  const { meta, blocks } = loadLegalDocument(doc, lang);

  return (
    <main className={styles.page}>
      <section className={styles.content}>
        <div className={styles.spacer} />
        <div className={styles.container}>
          <header className={styles.intro}>
            <h1 className={styles.title}>
              <span>{meta.title}</span>
            </h1>
            <p className={styles.date}>{meta.effectiveDate}</p>
          </header>
          <article className={styles.prose}>
            <MarkdownBlocks blocks={blocks} lang={lang} />
          </article>
        </div>
      </section>

      <TopGlow />
    </main>
  );
}
