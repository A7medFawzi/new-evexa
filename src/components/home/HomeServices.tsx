import LightRays from "@/components/motion/LightRays";
import {
  AnalyticsIcon,
  AssistantIcon,
  AutomationIcon,
  DocumentScanIcon,
  IntegrationIcon,
  SolutionsIcon,
  SearchIcon,
  SparkleChipIcon,
} from "@/components/ui/icons";
import { localizeHref, type Lang } from "@/config/site";
import type { HomeServicesCopy } from "@/content/home";
import SectionHeading from "./SectionHeading";
import ServiceCard from "./ServiceCard";
import styles from "./HomeServices.module.css";

const CARD_ICONS = [SearchIcon, AssistantIcon, DocumentScanIcon, AutomationIcon, IntegrationIcon, AnalyticsIcon];

/** "Solutions": six service cards and a cloud of topic tags, under light rays. */
export default function HomeServices({ copy, lang }: { copy: HomeServicesCopy; lang: Lang }) {
  const contact = localizeHref(copy.button.href, lang);
  return (
    <section id="services" className={styles.section}>
      <div className={styles.container}>
        <img className={styles.dots} src="/images/1xOqMa4sAAwBCrdkiSJfIXups.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <LightRays className={styles.rays} position={50} reach={30} fallbackImage="/images/glow/glow-services.webp" />

        <SectionHeading
          icon={<SolutionsIcon />}
          badge={copy.badge}
          title={copy.title}
          body={copy.body}
          button={{ label: copy.button.label, href: contact }}
        />

        <div className={styles.cards}>
          {copy.cards.map((card, i) => {
            const Icon = CARD_ICONS[i];
            return <ServiceCard key={card.title} href={contact} icon={<Icon size={21} />} {...card} />;
          })}
        </div>

        <ul className={styles.tags}>
          {copy.tags.map((tag) => (
            <li key={tag} className={styles.tag}>
              <img className={styles.tagGlow} src="/images/1xOqMa4sAAwBCrdkiSJfIXups.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <span className={styles.tagIcon}>
                <SparkleChipIcon size={20} />
              </span>
              <span className={styles.tagLabel}>{tag}</span>
            </li>
          ))}
        </ul>
      </div>
      <span className={styles.line} aria-hidden="true" />
    </section>
  );
}
