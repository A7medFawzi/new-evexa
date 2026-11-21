import SectionHeading from "@/components/home/SectionHeading";
import { ArrowUpRightIcon, MapPinIcon } from "@/components/ui/icons";
import type { Lang } from "@/config/site";
import { OFFICES, OFFICES_COPY, mapUrl } from "@/content/offices";
import styles from "./OfficesSection.module.css";

/** Contact page: the two offices, each with its address and a map link. */
export default function OfficesSection({ lang }: { lang: Lang }) {
  const copy = OFFICES_COPY[lang];
  return (
    <section id="offices" className={styles.section}>
      <SectionHeading icon={<MapPinIcon />} badge={copy.badge} title={copy.title} body={copy.body} />
      <div className={styles.grid}>
        {OFFICES.map((office) => {
          const c = office.copy[lang];
          return (
            <article key={office.id} className={styles.card}>
              <span className={styles.highlight} aria-hidden="true" />
              <div className={styles.head}>
                <span className={styles.pin} aria-hidden="true">
                  <MapPinIcon size={18} />
                </span>
                <div>
                  <h3>{c.city}</h3>
                  <p className={styles.country}>{c.country}</p>
                </div>
              </div>
              <address className={styles.address}>{c.address}</address>
              <a className={styles.map} href={mapUrl(office)} target="_blank" rel="noopener noreferrer">
                {copy.map}
                <ArrowUpRightIcon size={13} />
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
