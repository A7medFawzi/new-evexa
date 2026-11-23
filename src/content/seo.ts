/**
 * Search / social metadata for every static page, both languages.
 * Titles are page-specific (the " | EVEXA" suffix is added by the layout's
 * title template); descriptions are written for search results (~150 chars).
 * Case-study pages take their title and description from content/projects.ts.
 */
import type { Lang } from "@/config/site";

export type SeoPageKey = "home" | "about" | "portfolio" | "contact" | "privacy" | "terms";

export interface PageSeo {
  title: string;
  description: string;
}

export const SITE_SEO: Record<Lang, PageSeo> = {
  en: {
    title: "EVEXA - Custom AI Solutions for Business",
    description:
      "EVEXA builds custom AI for businesses: Arabic and English assistants, document automation, smart reports and integrations. Offices in Riyadh and Alexandria.",
  },
  ar: {
    title: "EVEXA - حلول ذكاء اصطناعي مخصصة للشركات",
    description:
      "تبني EVEXA حلول ذكاء اصطناعي مخصصة للشركات: مساعدات ذكية بالعربية والإنجليزية، وأتمتة المستندات، وتقارير ذكية، وربط مع أنظمتك. مكاتبنا في الرياض والإسكندرية.",
  },
};

export const PAGE_SEO: Record<SeoPageKey, Record<Lang, PageSeo>> = {
  home: {
    en: {
      title: "EVEXA - Custom AI Solutions for Business",
      description:
        "EVEXA builds custom AI for businesses: Arabic and English assistants, document automation, smart reports and integrations. Offices in Riyadh and Alexandria.",
    },
    ar: {
      title: "EVEXA - حلول ذكاء اصطناعي مخصصة للشركات",
      description:
        "تبني EVEXA حلول ذكاء اصطناعي مخصصة للشركات: مساعدات ذكية بالعربية والإنجليزية، وأتمتة المستندات، وتقارير ذكية، وربط مع أنظمتك. مكاتبنا في الرياض والإسكندرية.",
    },
  },
  about: {
    en: {
      title: "About Us",
      description:
        "Your AI partner from idea to everyday use. EVEXA designs, builds and integrates AI into business systems, from offices in Riyadh and Alexandria.",
    },
    ar: {
      title: "من نحن",
      description:
        "شريكك في الذكاء الاصطناعي من الفكرة إلى التشغيل. تصمم EVEXA حلول الذكاء الاصطناعي وتطوّرها وتدمجها في أنظمة الشركات، من الرياض والإسكندرية.",
    },
  },
  portfolio: {
    en: {
      title: "Our Work",
      description:
        "Selected EVEXA projects: Albetar’s AI shopping assistant, the Mohami Smart legal platform, and Bin Delamah’s HR and project platforms.",
    },
    ar: {
      title: "أعمالنا",
      description:
        "مشاريع مختارة من EVEXA: مساعد التسوق الذكي في البيطار، ومنصة محامي سمارت القانونية، ومنصتا الموارد البشرية والمشاريع لشركة بن دلامة.",
    },
  },
  contact: {
    en: {
      title: "Contact Us",
      description:
        "Tell EVEXA what you want to improve and book a free discovery session. We reply within two working days. Offices in Riyadh and Alexandria.",
    },
    ar: {
      title: "تواصل معنا",
      description:
        "أخبر EVEXA بما ترغب في تطويره واحجز جلسة استكشافية مجانية، ونعود إليك خلال يومي عمل. مكاتبنا في الرياض والإسكندرية.",
    },
  },
  privacy: {
    en: {
      title: "Privacy Policy",
      description: "How EVEXA collects, uses and protects the information you share through our website and services.",
    },
    ar: {
      title: "سياسة الخصوصية",
      description: "كيف تجمع EVEXA المعلومات التي تشاركها عبر موقعنا وخدماتنا، وكيف تستخدمها وتحميها.",
    },
  },
  terms: {
    en: {
      title: "Terms & Conditions",
      description: "The terms and conditions that apply to using the EVEXA website and services.",
    },
    ar: {
      title: "الشروط والأحكام",
      description: "الشروط والأحكام المنظمة لاستخدام موقع EVEXA وخدماتها.",
    },
  },
};
