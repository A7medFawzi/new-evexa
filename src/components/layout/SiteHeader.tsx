"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { animate } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import HoverLink from "@/components/ui/HoverLink";
import PrimaryButton from "@/components/ui/PrimaryButton";
import {
  CONTACT_HREF,
  NAV_ITEMS,
  activeNavKey,
  localizeHref,
  stripLang,
  type Lang,
  type NavKey,
} from "@/config/site";
import type { Dictionary } from "@/i18n";
import { scrollToSection } from "@/lib/scroll";
import styles from "./SiteHeader.module.css";

const MENU_EASE = [0.25, 0.1, 0.25, 1] as const;
const HIDE_AFTER_PX = 250;

export default function SiteHeader({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingKey, setPendingKey] = useState<NavKey | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const animatingRef = useRef(false);

  const activeKey = pendingKey ?? activeNavKey(pathname);

  // a finished navigation settles the optimistic active item
  useEffect(() => setPendingKey(null), [pathname]);

  // remember the visitor's language: src/proxy.ts uses it for links
  // without a language prefix
  useEffect(() => {
    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000;samesite=lax`;
  }, [lang]);

  // hide the bar while scrolling down (past 250px), reveal on scroll up
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > HIDE_AFTER_PX) shell.dataset.hidden = "true";
      else if (y < lastY || y <= HIDE_AFTER_PX) delete shell.dataset.hidden;
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // tablet/phone menu: grows to its content in 0.35s, closes instantly
  const toggleMenu = () => {
    const header = headerRef.current;
    if (!header || animatingRef.current) return;
    if (menuOpen) {
      header.style.height = "";
      setMenuOpen(false);
      return;
    }
    const from = header.getBoundingClientRect().height;
    setMenuOpen(true);
    requestAnimationFrame(() => {
      animatingRef.current = true;
      animate(header, { height: [from, header.scrollHeight] }, { duration: 0.35, ease: MENU_EASE }).then(() => {
        animatingRef.current = false;
        header.style.height = "min-content";
      });
    });
  };

  const closeMenu = () => {
    if (!menuOpen) return;
    if (headerRef.current) headerRef.current.style.height = "";
    setMenuOpen(false);
  };

  const onNavClick = (key: NavKey, href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    closeMenu();
    if (href.startsWith("/#")) {
      // every page has its own FAQ section: scroll to it when present
      if (scrollToSection(href.slice(2))) e.preventDefault();
      return;
    }
    setPendingKey(key);
  };

  const switchLang = (target: Lang) => {
    if (target === lang) return;
    const rest = stripLang(pathname);
    router.push(`/${target}${rest === "/" ? "" : rest}`);
  };

  return (
    <div ref={shellRef} className={styles.shell}>
      <header ref={headerRef} className={styles.header} data-open={menuOpen || undefined}>
        <nav className={styles.nav}>
          <div className={styles.topRow}>
            <Link href={localizeHref("/", lang)} className={styles.logo} onClick={closeMenu}>
              <img src="/images/brand/evexa-logo-white.png" width={462} height={100} alt={dict.header.logoAlt} decoding="async" />
            </Link>

            <div className={styles.langSwitch} role="group" aria-label={dict.header.langSwitcher}>
              <button type="button" className={styles.langOption} data-active={lang === "en" || undefined} onClick={() => switchLang("en")}>
                EN
              </button>
              <button type="button" className={styles.langOption} data-active={lang === "ar" || undefined} onClick={() => switchLang("ar")}>
                عربي
              </button>
            </div>

            <button
              type="button"
              className={styles.burger}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? dict.header.closeMenu : dict.header.openMenu}
              onClick={toggleMenu}
            >
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
            </button>
          </div>

          <div className={styles.divider} />

          <ul className={styles.menu}>
            {NAV_ITEMS.map(({ key, href, desktopOnly }) => (
              <li key={key} className={desktopOnly ? styles.desktopOnly : undefined}>
                <HoverLink href={localizeHref(href, lang)} active={activeKey === key} onClick={onNavClick(key, href)}>
                  {dict.nav[key]}
                </HoverLink>
              </li>
            ))}
          </ul>

          <PrimaryButton href={localizeHref(CONTACT_HREF, lang)} className={styles.cta} onClick={onNavClick("contact", CONTACT_HREF)}>
            {dict.header.cta}
          </PrimaryButton>
        </nav>
      </header>
    </div>
  );
}
