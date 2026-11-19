import ProjectList from "@/components/portfolio/ProjectList";
import { WorkIcon } from "@/components/ui/icons";
import { localizeHref, type Lang } from "@/config/site";
import type { HomeWorkCopy } from "@/content/home";
import SectionHeading from "./SectionHeading";
import styles from "./HomeWork.module.css";

/** "Selected Work": the stacked project cards, as on the portfolio page. */
export default function HomeWork({ copy, lang }: { copy: HomeWorkCopy; lang: Lang }) {
  return (
    <section id="work" className={styles.section}>
      <img className={styles.rays} src="/images/NciCgJXFjmPyYJqS0TeBliWluw.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className={styles.fade} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.top}>
          <SectionHeading
            icon={<WorkIcon />}
            badge={copy.badge}
            title={copy.title}
            body={copy.body}
            button={{ label: copy.button.label, href: localizeHref(copy.button.href, lang) }}
          />
        </div>
        <div className={styles.list}>
          <ProjectList lang={lang} projects={copy.projects} fade />
        </div>
      </div>
    </section>
  );
}
