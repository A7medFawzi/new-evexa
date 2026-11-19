/**
 * Smooth-scroll to an in-page section (e.g. "faq", "services").
 * Returns false when the current page has no such section, so the caller
 * can fall back to a normal navigation.
 */
export function scrollToSection(id: string): boolean {
  const target =
    document.getElementById(id) ??
    (id === "faq" ? document.querySelector<HTMLElement>('[data-framer-name="FAQ"]') : null);
  if (!target) return false;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}
