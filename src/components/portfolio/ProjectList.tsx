import ScrollTransform from "@/components/motion/ScrollTransform";
import { localizeHref, type Lang } from "@/config/site";
import ProjectCard, { type Project } from "./ProjectCard";
import styles from "./ProjectList.module.css";

/**
 * Stacked project cards. From the second card on, each starts 180px higher
 * and slightly tilted (alternating, mirrored for Arabic) and settles into
 * place as it scrolls in, sliding out from under the card above.
 */
export default function ProjectList({
  lang,
  projects,
  fade = false,
}: {
  lang: Lang;
  projects: Project[];
  /** cards also fade in from 30% opacity (home preview) */
  fade?: boolean;
}) {
  const flip = lang === "ar" ? -1 : 1;
  return (
    <div className={styles.list}>
      {projects.map((project, i) => {
        const card = <ProjectCard project={{ ...project, href: localizeHref(project.href, lang) }} />;
        const style = { zIndex: projects.length - 1 - i };
        if (i === 0) {
          return (
            <div key={project.href} className={styles.item} style={style}>
              {card}
            </div>
          );
        }
        return (
          <ScrollTransform key={project.href} className={styles.item} style={style} from={{ y: -180, rotate: (i % 2 ? 2 : -2) * flip, opacity: fade ? 0.3 : 1 }}>
            {card}
          </ScrollTransform>
        );
      })}
    </div>
  );
}
