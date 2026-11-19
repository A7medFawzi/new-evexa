"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { scrollToSection } from "@/lib/scroll";
import styles from "./PrimaryButton.module.css";

/**
 * Site button (brand-blue gradient, or white / grey in the hero).
 * Hover: the button lifts 2px, brightens and gets a glow (a blue ring for
 * the brand button); pressing pushes it back down. Keyboard focus shows a
 * ring. All of it is CSS (PrimaryButton.module.css).
 */
export default function PrimaryButton({
  href,
  children,
  arrow = false,
  thin = false,
  tone = "purple",
  external = false,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  /** trailing ↗ arrow that nudges on hover */
  arrow?: boolean;
  /** 1px border (header/footer) instead of the 3px used in page sections */
  thin?: boolean;
  tone?: "purple" | "white" | "grey";
  /** opens in a new tab (links to other sites) */
  external?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const buttonClass = [styles.button, thin && styles.thin, tone !== "purple" && styles[tone]].filter(Boolean).join(" ");
  return (
    <div className={[styles.wrap, styles[`${tone}Wrap`], className].filter(Boolean).join(" ")}>
      <Link
        href={href}
        className={buttonClass}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        onClick={(e) => {
          onClick?.(e);
          // in-page anchors ("#section") scroll smoothly
          if (!e.defaultPrevented && href.startsWith("#") && scrollToSection(href.slice(1))) e.preventDefault();
        }}
      >
        {children}
        {arrow && (
          <svg className={styles.arrow} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7" />
            <path d="M9 7h8v8" />
          </svg>
        )}
      </Link>
    </div>
  );
}
