/** Portfolio page content (both languages). */
import type { Project } from "@/components/portfolio/ProjectCard";
import type { Lang } from "@/config/site";

export interface PortfolioCopy {
  hero: { badgeChip: string; badge: string; title: [string, string]; intro: string; button: { label: string; href: string } };
  projects: Project[];
  faqBadge: string;
  cta: { badge: string; title: [string, string]; text: string; button: string; href: string };
}

/** Project images (shared by both languages). Note: placeholder visuals carried over from the original template. */
const IMAGES = [
  [
    "/images/projects/albetar/brand.webp",
    "/images/projects/albetar/platform.webp"
  ],
  [
    "/images/projects/mohami-smart/brand.webp",
    "/images/projects/mohami-smart/dashboard.webp"
  ],
  [
    "/images/projects/business-operations/hrms.webp",
    "/images/projects/business-operations/pms.webp"
  ]
] as const;

const images = (i: number): Project["images"] => [
  { src: IMAGES[i][0], alt: "" },
  { src: IMAGES[i][1], alt: "" },
];

export const PORTFOLIO_COPY: Record<Lang, PortfolioCopy> = {
  en: {
    hero: {
      badgeChip: "EVEXA",
      badge: "BROWSE OUR WORK",
      title: ["Selected Work.", "Built for Real Needs."],
      intro: "A selection of AI solutions and business platforms designed around real workflows and operational needs.",
      button: { label: "Discuss Your Project", href: "/contact" },
    },
    projects: [
    { href: "/portfolio/albetar", label: "AI", title: "Albetar AI Modules", points: ["Arabic & English search", "Semantic product matching", "Review sentiment analysis", "Revenue forecasting"], tags: ["Commerce AI", "RAG & Search"], images: images(0) },
    { href: "/portfolio/mohami-smart", label: "LEGAL", title: "Mohami Smart", points: ["Case & client management", "AI legal assistance", "Document analysis", "Legal drafting support"], tags: ["LegalTech", "AI Workflows"], images: images(1) },
    { href: "/portfolio/business-operations", label: "OPS", title: "Business Operations Platforms", points: ["HR & employee records", "Approvals & documents", "Construction workflows", "Materials & BOQ tracking"], tags: ["HRMS", "Construction PMS"], images: images(2) },
    ],
    faqBadge: "FAQ",
    cta: {
      badge: "LET’S TALK",
      title: ["Have a Similar Challenge?", "Let’s Discuss the Next Step."],
      text: "Tell us what your team needs to improve. We can start by defining a practical approach.",
      button: "Discuss Your Project",
      href: "/contact",
    },
  },
  ar: {
    hero: {
      badgeChip: "EVEXA",
      badge: "تصفّح أعمالنا",
      title: ["أعمال مختارة.", "صُممت لاحتياجات حقيقية."],
      intro: "نماذج من حلول الذكاء الاصطناعي وأنظمة الأعمال المصممة لتلبية احتياجات تشغيلية محددة.",
      button: { label: "ناقش مشروعك", href: "/contact" },
    },
    projects: [
    { href: "/portfolio/albetar", label: "AI", title: "Albetar AI Modules", points: ["بحث بالعربية والإنجليزية", "مطابقة دلالية للمنتجات", "تحليل آراء العملاء", "التنبؤ بالإيرادات"], tags: ["ذكاء التجارة", "البحث الدلالي"], images: images(0) },
    { href: "/portfolio/mohami-smart", label: "قانوني", title: "Mohami Smart", points: ["إدارة القضايا والموكلين", "مساعد قانوني ذكي", "تحليل المستندات", "دعم الصياغة القانونية"], tags: ["تقنية قانونية", "إجراءات ذكية"], images: images(1) },
    { href: "/portfolio/business-operations", label: "تشغيل", title: "أنظمة إدارة الأعمال", points: ["إدارة الموارد البشرية", "الموافقات والمستندات", "عمليات المشاريع الإنشائية", "المواد وجداول الكميات"], tags: ["نظام الموارد البشرية", "إدارة المشاريع"], images: images(2) },
    ],
    faqBadge: "الأسئلة الشائعة",
    cta: {
      badge: "لنتحدث",
      title: ["لديك تحدٍّ مشابه؟", "لنناقش الخطوة التالية."],
      text: "أخبرنا بما تريد تطويره في عملك، ولنبدأ بتحديد الخطوة العملية المناسبة.",
      button: "ناقش مشروعك",
      href: "/contact",
    },
  },
};
