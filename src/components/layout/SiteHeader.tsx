"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { animate, motion } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
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
import styles from "./SiteHeader.module.css";

const LINK_SPRING = { type: "spring", stiffness: 400, damping: 60, mass: 1 } as const;
const BUTTON_SPRING = { type: "spring", stiffness: 200, damping: 60, mass: 1 } as const;
const MENU_EASE = [0.25, 0.1, 0.25, 1] as const;
const HIDE_AFTER_PX = 250;

/** Scroll to an in-page section; returns false when the page has none. */
function scrollToSection(id: string): boolean {
  const target =
    document.getElementById(id) ??
    document.querySelector<HTMLElement>(`[data-section="${id}"]`) ??
    document.querySelector<HTMLElement>('[data-framer-name="FAQ"]');
  if (!target) return false;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export default function SiteHeader({ lang, dict }: { lang: Lang; dict: Dictionary }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingKey, setPendingKey] = useState<NavKey | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const activeKey = pendingKey ?? activeNavKey(pathname);

  // a finished navigation settles the optimistic active item
  useEffect(() => setPendingKey(null), [pathname]);

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

  // mobile menu: height grows to its content in 0.35s, closes instantly
  const animatingRef = useRef(false);
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
                <NavLink
                  href={localizeHref(href, lang)}
                  label={dict.nav[key]}
                  active={activeKey === key}
                  onClick={onNavClick(key, href)}
                />
              </li>
            ))}
          </ul>

          <motion.div
            className={styles.ctaWrap}
            initial={false}
            whileHover={{ boxShadow: "0px 0px 0px 5px rgba(0, 49, 213, 0.3)" }}
            style={{ boxShadow: "0px 0px 0px 0px rgba(0, 49, 213, 0.3)" }}
            transition={BUTTON_SPRING}
          >
            <Link href={localizeHref(CONTACT_HREF, lang)} className={styles.cta} onClick={onNavClick("contact", CONTACT_HREF)}>
              {dict.header.cta}
            </Link>
          </motion.div>
        </nav>
      </header>
    </div>
  );
}

function NavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const [hovered, setHovered] = useState(false);
  // page changes switch the active state instantly; only hover animates
  const prevActive = useRef(active);
  const activeChanged = prevActive.current !== active;
  useEffect(() => {
    prevActive.current = active;
  });
  return (
    <Link
      href={href}
      className={styles.navLink}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <motion.span
        className={styles.navLabel}
        initial={false}
        animate={{ opacity: active || hovered ? 1 : 0.6 }}
        transition={activeChanged ? { duration: 0 } : LINK_SPRING}
      >
        {label}
      </motion.span>
    </Link>
  );
}
