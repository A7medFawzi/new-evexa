import type { CSSProperties } from "react";
import { CalendarCheckIcon, FingerprintIcon, InboxIcon, QuotationIcon } from "@/components/ui/icons";
import { PRODUCT_IMAGES, type HomeProductCopy } from "@/content/home";
import SectionHeading from "./SectionHeading";
import styles from "./HomeProduct.module.css";

/**
 * Fan layout of the seven screenshots: centre offset (px) per breakpoint
 * [desktop, tablet, phone] and tilt (deg). The centre card sits on top.
 */
const FAN: { d: [number, number]; t: [number, number]; p: [number, number]; rotate: number }[] = [
  { d: [-334, 16], t: [-194, 16], p: [-116, 2], rotate: -7 },
  { d: [-217, -12], t: [-127, 8], p: [-79, 2], rotate: -8 },
  { d: [-108, 0], t: [-68, 0], p: [-43, 2], rotate: -5 },
  { d: [0, 0], t: [0, 0], p: [0, 2], rotate: 0 },
  { d: [100, 0], t: [70, 0], p: [49, 2], rotate: 6 },
  { d: [201, 7], t: [131, 7], p: [85, 2], rotate: 7 },
  { d: [306, 8], t: [197, 18], p: [112, 7], rotate: 14 },
];

/** Icons of the three feature cards, in card order (RFQ inbox, quotations, my day). */
const CARD_ICONS = [InboxIcon, QuotationIcon, CalendarCheckIcon];

/** Dealplier, EVEXA's own product: heading, a fan of screenshots and three feature cards. */
export default function HomeProduct({ copy }: { copy: HomeProductCopy }) {
  return (
    <section className={styles.section}>
      <img className={styles.rays} src="/images/sr8vmLBhND1D86vmn1G0mLCt8.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className={styles.fade} aria-hidden="true" />
      <div className={styles.content}>
        <SectionHeading icon={<FingerprintIcon />} badge={copy.badge} title={copy.title} body={copy.body} button={copy.button} />

        <div className={styles.showcase}>
          <div className={styles.fan} aria-hidden="true">
            {PRODUCT_IMAGES.map((src, i) => {
              const f = FAN[i];
              const style = {
                "--dx": `${f.d[0]}px`,
                "--dy": `${f.d[1]}px`,
                "--dx-t": `${f.t[0]}px`,
                "--dy-t": `${f.t[1]}px`,
                "--dx-p": `${f.p[0]}px`,
                "--dy-p": `${f.p[1]}px`,
                "--rotate": `${f.rotate}deg`,
                zIndex: i,
              } as CSSProperties;
              return (
                <div key={src} className={styles.shot} style={style}>
                  <span className={styles.shotImage}>
                    <img src={src} alt="" loading="lazy" decoding="async" />
                    <span className={styles.shotShine} />
                  </span>
                </div>
              );
            })}
            <span className={`${styles.bubble} ${styles.bubbleLeft}`}>
              {copy.bubbles[0]}
              <span className={styles.bubbleTip} />
            </span>
            <span className={`${styles.bubble} ${styles.bubbleRight}`}>
              {copy.bubbles[1]}
              <span className={styles.bubbleTip} />
            </span>
          </div>

          <div className={styles.features}>
            <span className={styles.line} aria-hidden="true" />
            <div className={styles.cards}>
              {copy.cards.map((card, i) => {
                const Icon = CARD_ICONS[i];
                return (
                  <article key={card.title} className={styles.card}>
                    <img className={styles.cardGlow} src="/images/1xOqMa4sAAwBCrdkiSJfIXups.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                    <span className={styles.cardHighlight} aria-hidden="true" />
                    <div className={styles.cardHead}>
                      <span className={styles.cardIcon} aria-hidden="true">
                        {Icon && <Icon />}
                      </span>
                      <h4>{card.title}</h4>
                    </div>
                    <p>{card.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
