"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import HoverLink from "@/components/ui/HoverLink";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { CONTACT_HREF, localizeHref, type Lang } from "@/config/site";
import { SOCIAL_LINKS } from "@/config/social";
import type { Dictionary } from "@/i18n";
import { scrollToSection } from "@/lib/scroll";
import styles from "./SiteFooter.module.css";

const EXPLORE_LINKS = [
  { key: "home", href: "/" },
  { key: "solutions", href: "/#services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
] as const;

const PRODUCT_URL = "https://www.dealplier.com/";
const SOFTWARE_HOUSE_URL = "https://www.valien.tech/";

/** In-page anchors scroll when the section exists on the current page. */
function onAnchorClick(href: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("/#") && scrollToSection(href.slice(2))) e.preventDefault();
  };
}

function ExternalArrow() {
  return (
    <svg className={styles.extArrow} viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export default function SiteFooter({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const t = dict.footer;
  const to = (href: string) => localizeHref(href, lang);

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        {/* brand */}
        <div className={styles.brand}>
          <Link href={to("/")} className={styles.logo}>
            <img src="/images/brand/evexa-logo-white.png" width={462} height={100} alt="Evexa" decoding="async" loading="lazy" />
          </Link>
          <div className={styles.brandDivider} />
          <div className={styles.brandText}>
            <p>{t.tagline}</p>
            <p>{t.location}</p>
          </div>
        </div>

        <div className={styles.columns}>
          {/* explore */}
          <div className={styles.column}>
            <h4 className={styles.heading}>{t.exploreTitle}</h4>
            <ul className={styles.linkList}>
              {EXPLORE_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <HoverLink href={to(href)} restOpacity={0.8} onClick={onAnchorClick(href)}>
                    {t.explore[key]}
                  </HoverLink>
                </li>
              ))}
            </ul>
          </div>

          {/* product & software house */}
          <div className={`${styles.column} ${styles.ventures}`}>
            <h4 className={styles.heading}>{t.productTitle}</h4>
            <div className={styles.venture}>
              <HoverLink href={PRODUCT_URL} external restOpacity={0.92} labelClassName={styles.ventureName} after={<ExternalArrow />} className={styles.ventureLink}>
                Dealplier
              </HoverLink>
              <p className={styles.ventureText}>{t.productDescription}</p>
            </div>

            <h4 className={`${styles.heading} ${styles.secondHeading}`}>{t.softwareHouseTitle}</h4>
            <div className={styles.venture}>
              <HoverLink href={SOFTWARE_HOUSE_URL} external restOpacity={0.92} labelClassName={styles.ventureName} after={<ExternalArrow />} className={styles.ventureLink}>
                Valien
              </HoverLink>
              <p className={styles.ventureText}>{t.softwareHouseDescription}</p>
            </div>
          </div>

          {/* contact */}
          <div className={`${styles.column} ${styles.contact}`}>
            <h4 className={`${styles.heading} ${styles.headingFill}`}>{t.ctaTitle}</h4>
            <p className={styles.contactText}>{t.ctaText}</p>
            <PrimaryButton thin href={to(CONTACT_HREF)} arrow>
              {t.ctaButton}
            </PrimaryButton>
            <div className={styles.socials}>
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a key={label} className={styles.social} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                    <path d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomDivider} />
        <div className={styles.bottomRow}>
          <HoverLink href={to("/")} className={styles.copyright}>
            {t.copyright}
          </HoverLink>
          <div className={styles.legal}>
            <HoverLink href={to("/privacy-policy")}>{t.privacy}</HoverLink>
            <span className={styles.legalDivider} />
            <HoverLink href={to("/terms-conditions")}>{t.terms}</HoverLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
