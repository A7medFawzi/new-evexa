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
    title: "EVEXA - Practical AI Solutions for Business",
    description:
      "EVEXA designs and integrates custom AI solutions around your teams, data and existing systems: knowledge search, document intelligence and workflow automation.",
  },
  ar: {
    title: "EVEXA - حلول ذكاء اصطناعي عملية للأعمال",
    description:
      "تصمم EVEXA حلول ذكاء اصطناعي مخصصة وتربطها ببيانات شركتك وأنظمتها: البحث المعرفي، وفهم المستندات، وأتمتة سير العمل.",
  },
};

export const PAGE_SEO: Record<SeoPageKey, Record<Lang, PageSeo>> = {
  home: {
    en: {
      title: "EVEXA - Practical AI Solutions for Business",
      description:
        "Put AI to work in your business. EVEXA builds AI assistants, knowledge search and document processing around your workflows, data and existing tools.",
    },
    ar: {
      title: "EVEXA - حلول ذكاء اصطناعي عملية للأعمال",
      description:
        "سخّر الذكاء الاصطناعي لخدمة أعمالك. تبني EVEXA مساعدات ذكية وبحثًا معرفيًا ومعالجة للمستندات حول سير عملك وبياناتك وأنظمتك الحالية.",
    },
  },
  about: {
    en: {
      title: "About Us",
      description:
        "EVEXA designs and integrates custom AI solutions around your teams, business data and existing systems, starting from the business need, not the technology.",
    },
    ar: {
      title: "من نحن",
      description:
        "في EVEXA نصمم حلول ذكاء اصطناعي مخصصة ونربطها ببيانات شركتك وأنظمتها، ونبدأ دائمًا من احتياج العمل قبل التقنية.",
    },
  },
  portfolio: {
    en: {
      title: "Our Work",
      description:
        "Selected AI solutions and business platforms by EVEXA: Albetar AI modules, Mohami Smart legal platform, and HR and construction operations systems.",
    },
    ar: {
      title: "أعمالنا",
      description:
        "نماذج من حلول الذكاء الاصطناعي وأنظمة الأعمال من EVEXA: وحدات البيطار الذكية، ومنصة محامي سمارت، وأنظمة الموارد البشرية وإدارة المشاريع الإنشائية.",
    },
  },
  contact: {
    en: {
      title: "Contact Us",
      description:
        "Have a project in mind? Tell EVEXA what you want to improve. We’ll review your needs and discuss a practical next step.",
    },
    ar: {
      title: "تواصل معنا",
      description:
        "لديك مشروع أو تحدٍّ؟ أخبر EVEXA بما ترغب في تطويره، ولنبدأ بفهم احتياجك ومناقشة الخطوة العملية المناسبة.",
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
