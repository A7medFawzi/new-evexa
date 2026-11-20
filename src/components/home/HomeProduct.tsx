import { ProductIcon } from "@/components/ui/icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { localizeHref, type Lang } from "@/config/site";
import { PRODUCT_SCREENS, productScreen, type HomeProductCopy } from "@/content/home";
import ProductShowcase from "./ProductShowcase";
import SectionHeading from "./SectionHeading";
import styles from "./HomeProduct.module.css";

/**
 * Dealplier, EVEXA's own product: heading with two buttons, then a large
 * product window that steps through the main screens (tabs underneath),
 * and a row of trust points.
 */
export default function HomeProduct({ copy, lang }: { copy: HomeProductCopy; lang: Lang }) {
  const screens = PRODUCT_SCREENS.map((name, i) => ({ ...productScreen(name, lang), ...copy.tabs[i] }));
  return (
    <section className={styles.section} id="product">
      <img className={styles.rays} src="/images/sr8vmLBhND1D86vmn1G0mLCt8.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div className={styles.fade} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.heading}>
          <SectionHeading icon={<ProductIcon />} badge={copy.badge} title={copy.title} body={copy.body} />
          <div className={styles.buttons}>
            <PrimaryButton href={copy.button.href} external>
              {copy.button.label}
            </PrimaryButton>
            <PrimaryButton href={localizeHref(copy.demo.href, lang)} tone="grey">
              {copy.demo.label}
            </PrimaryButton>
          </div>
        </div>

        <ProductShowcase screens={screens} lang={lang} />

        <ul className={styles.points}>
          {copy.points.map((point) => (
            <li key={point}>
              <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
              </svg>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
