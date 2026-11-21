/**
 * EVEXA offices, shown on the contact page, in the footer and in the
 * home page's structured data. Addresses are written exactly as supplied.
 */
import type { Lang } from "@/config/site";

export interface Office {
  id: "riyadh" | "alexandria";
  /** for Google Maps and structured data */
  mapQuery: string;
  postal: { streetAddress: string; addressLocality: string; postalCode?: string; addressCountry: "SA" | "EG" };
  copy: Record<Lang, { country: string; city: string; address: string }>;
}

export const OFFICES: Office[] = [
  {
    id: "riyadh",
    mapQuery: "RLSC7772, 7772 509, Al Aziziyah, Riyadh 14714, Saudi Arabia",
    postal: { streetAddress: "RLSC7772, 7772 509, Al Aziziyah", addressLocality: "Riyadh", postalCode: "14714", addressCountry: "SA" },
    copy: {
      en: { country: "Saudi Arabia", city: "Riyadh", address: "RLSC7772, 7772 509, Al Aziziyah,\nRiyadh 14714, Saudi Arabia" },
      ar: { country: "المملكة العربية السعودية", city: "الرياض", address: "7772 شارع الحائر، حي المصانع،\nالرياض 14714، المملكة العربية السعودية" },
    },
  },
  {
    id: "alexandria",
    mapQuery: "144 Port Said St., El Ibrahimia Bahary, Alexandria, Egypt",
    postal: { streetAddress: "144 Port Said St., El Ibrahimia Bahary", addressLocality: "Alexandria", addressCountry: "EG" },
    copy: {
      en: { country: "Egypt", city: "Alexandria", address: "144 Port Said St., El Ibrahimia Bahary,\nAlexandria, Egypt" },
      ar: { country: "مصر", city: "الإسكندرية", address: "144 شارع بورسعيد، الإبراهيمية،\nالإسكندرية، مصر" },
    },
  },
];

export const OFFICES_COPY: Record<Lang, { badge: string; title: [string, string]; body: string; map: string }> = {
  en: {
    badge: "Our Offices",
    title: ["Two Offices.", "One Team."],
    body: "We work from Riyadh and Alexandria, with clients across the Arab world.",
    map: "Open in Google Maps",
  },
  ar: {
    badge: "مكاتبنا",
    title: ["مكتبان،", "وفريق واحد."],
    body: "نعمل من الرياض والإسكندرية، ونخدم عملاء في أنحاء الوطن العربي.",
    map: "افتح في خرائط Google",
  },
};

export function mapUrl(office: Office): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapQuery)}`;
}
