/** About page content (both languages). */
import type { Lang } from "@/config/site";

export interface AboutStep {
  tag: string;
  title: string;
  text: string;
  tags?: string[];
  button?: { label: string; href: string };
}

export interface AboutCopy {
  hero: { badgeChip: string; badge: string; title: [string, string]; intro: string; button: { label: string; href: string } };
  approach: { badge: string; title: [string, string]; intro: string; image: { src: string; alt: string }; steps: [AboutStep, AboutStep, AboutStep] };
  capabilities: { badge: string; title: [string, string]; points: { title: string; text: string }[]; button: { label: string; href: string }; image: { src: string; alt: string } };
  faqBadge: string;
  cta: { badge: string; title: [string, string]; text: string; button: string; href: string };
}

export const ABOUT_COPY: Record<Lang, AboutCopy> = {
  en: {
    hero: {
      badgeChip: "EVEXA",
      badge: "OUR APPROACH",
      title: [
        "AI Built for Your Business.",
        "Not the Other Way Around."
      ],
      intro: "EVEXA designs and integrates custom AI solutions around your teams, business data, and existing systems.",
      button: {
        label: "Discuss Your Project",
        href: "/contact"
      }
    },
    approach: {
      badge: "ABOUT EVEXA",
      title: [
        "Understand the Work.",
        "Then Build the AI."
      ],
      intro: "We start by understanding workflows, how information moves, and the outcomes your team needs.",
      image: {
        src: "/images/olOjtvL78KPH3QrKMQyHd6JTQ7Y.webp",
        alt: "Woman Using Laptop"
      },
      steps: [
        {
          tag: "Understand",
          title: "Business Need First",
          text: "We review workflows, users, and available data before deciding what should be automated, connected, or built.",
          tags: [
            "Workflows",
            "Use Cases"
          ]
        },
        {
          tag: "Engineer",
          title: "Built for Your Environment",
          text: "We account for existing tools, data access, user roles, and the integrations each project requires.",
          tags: [
            "Systems",
            "Data Access"
          ]
        },
        {
          tag: "Deliver",
          title: "Ready for Everyday Work",
          text: "We develop and test with practical scenarios, then prepare the solution for integration and handover.",
          button: {
            label: "Discuss Your Project",
            href: "/contact"
          }
        }
      ]
    },
    capabilities: {
      badge: "WHAT WE BUILD",
      title: [
        "Making Information Useful.",
        "Making Work Simpler."
      ],
      points: [
        {
          title: "Knowledge & Document Intelligence",
          text: "Search approved company information, extract key details, and organize documents for easier access and review."
        },
        {
          title: "AI Assistants & Workflow Automation",
          text: "Support everyday tasks with context-aware assistants and automation, while keeping people involved where review matters."
        }
      ],
      button: {
        label: "Explore AI Solutions",
        href: "/#services"
      },
      image: {
        src: "/images/sUZnn6TGtwsYPeNR8KknQbD5bI.webp",
        alt: "Team Working"
      }
    },
    faqBadge: "FAQ",
    cta: {
      badge: "LET'S TALK",
      title: [
        "A Challenge Worth Solving?",
        "Let's Explore It Together."
      ],
      text: "Tell us what you'd like to improve. We can start with the problem and explore a practical way forward.",
      button: "Discuss Your Project",
      href: "/contact"
    }
  },
  ar: {
    hero: {
      badgeChip: "EVEXA",
      badge: "نهجنا",
      title: [
        "نصمم الذكاء الاصطناعي",
        "ليناسب طريقة عملك."
      ],
      intro: "في EVEXA نصمم حلول ذكاء اصطناعي مخصصة ونربطها ببيانات شركتك وأنظمتها، بما يخدم إجراءات العمل الفعلية.",
      button: {
        label: "ناقش مشروعك",
        href: "/contact"
      }
    },
    approach: {
      badge: "عن EVEXA",
      title: [
        "نفهم عملك أولًا.",
        "ثم نطوّر الحل الذكي."
      ],
      intro: "نبدأ بفهم سير العمل وتدفّق المعلومات، وتحديد النتائج التي يحتاجها فريقك.",
      image: {
        src: "/images/olOjtvL78KPH3QrKMQyHd6JTQ7Y.webp",
        alt: "Woman Using Laptop"
      },
      steps: [
        {
          tag: "فهم",
          title: "الاحتياج قبل التقنية",
          text: "ندرس الإجراءات والمستخدمين والبيانات المتاحة قبل تحديد ما يحتاج إلى أتمتة أو تكامل أو تطوير.",
          tags: [
            "إجراءات العمل",
            "حالات الاستخدام"
          ]
        },
        {
          tag: "تنفيذ",
          title: "حلول تناسب بيئة عملك",
          text: "نراعي الأنظمة الحالية وإمكانات الوصول إلى البيانات وصلاحيات المستخدمين والتكاملات اللازمة.",
          tags: [
            "الأنظمة",
            "الوصول للبيانات"
          ]
        },
        {
          tag: "تسليم",
          title: "جاهزة للاستخدام اليومي",
          text: "نطوّر الحل ونختبره على سيناريوهات عملية، ثم نجهّزه للتكامل والتسليم.",
          button: {
            label: "ناقش مشروعك",
            href: "/contact"
          }
        }
      ]
    },
    capabilities: {
      badge: "ما الذي نقدمه",
      title: [
        "معلومات أكثر فائدة.",
        "وعمل أكثر سلاسة."
      ],
      points: [
        {
          title: "البحث المعرفي وفهم المستندات",
          text: "نطوّر حلولًا للبحث في معلومات الشركة المعتمدة واستخراج البيانات من المستندات وتنظيمها."
        },
        {
          title: "المساعدات الذكية وأتمتة العمل",
          text: "نصمم مساعدين ذكيين وأتمتة تدعم المهام اليومية، مع إبقاء المراجعة البشرية حيث تكون ضرورية."
        }
      ],
      button: {
        label: "استكشف حلولنا",
        href: "/#services"
      },
      image: {
        src: "/images/sUZnn6TGtwsYPeNR8KknQbD5bI.webp",
        alt: "Team Working"
      }
    },
    faqBadge: "الأسئلة الشائعة",
    cta: {
      badge: "لنتحدث",
      title: [
        "لديك تحدٍّ في أعمالك؟",
        "لنبحث الحل المناسب."
      ],
      text: "حدثنا عما ترغب في تطويره، ولنبدأ بفهم التحدي واستكشاف خطوة عملية تناسب احتياجاتك.",
      button: "ناقش مشروعك",
      href: "/contact"
    }
  },
};
