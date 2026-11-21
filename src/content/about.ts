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
      badge: "ABOUT US",
      title: [
        "Your AI Partner,",
        "From Idea to Everyday Use."
      ],
      intro: "We design, build and integrate AI solutions into business systems, from defining the need to everyday operation. We work from our offices in Riyadh and Alexandria with clients across the Arab world.",
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
            label: "Book a Discovery Call",
            href: "/contact"
          }
        }
      ]
    },
    capabilities: {
      badge: "WHAT WE BUILD",
      title: [
        "What We Build",
        "for Our Clients."
      ],
      points: [
        {
          title: "AI Assistants in Arabic & English",
          text: "Assistants that talk with your customers or team and answer accurately from your company’s data and documents."
        },
        {
          title: "Document & Workflow Automation",
          text: "Reading documents, extracting their data and turning it into workflow steps, with human review where it matters."
        },
        {
          title: "Smart Analytics & Reports",
          text: "Dashboards and reports that summarize performance, with alerts that flag what needs follow-up before it slips."
        },
        {
          title: "Integration With Your Systems",
          text: "Connecting AI to the tools you already use, such as Outlook, SAP, Salesforce and your databases."
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
        "Let’s Understand Your Work",
        "Before We Suggest Anything."
      ],
      text: "Book a free discovery session. We’ll understand your needs and suggest a practical first step.",
      button: "Book a Free Discovery Call",
      href: "/contact"
    }
  },
  ar: {
    hero: {
      badgeChip: "EVEXA",
      badge: "من نحن",
      title: [
        "شريكك في الذكاء الاصطناعي،",
        "من الفكرة إلى التشغيل."
      ],
      intro: "نصمم حلول الذكاء الاصطناعي ونطوّرها وندمجها في أنظمة الشركات، من تحديد الاحتياج حتى التشغيل اليومي. نعمل من مكتبينا في الرياض والإسكندرية مع عملاء في أنحاء الوطن العربي.",
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
            label: "احجز جلسة استكشافية",
            href: "/contact"
          }
        }
      ]
    },
    capabilities: {
      badge: "ما الذي نقدمه",
      title: [
        "ما الذي نبنيه",
        "لعملائنا."
      ],
      points: [
        {
          title: "مساعدات ذكية بالعربية والإنجليزية",
          text: "مساعدات تتحدث مع عملائك أو فريقك، وتجيب بدقة من بيانات شركتك ومستنداتها."
        },
        {
          title: "أتمتة المستندات والإجراءات",
          text: "قراءة المستندات واستخراج بياناتها وتحويلها إلى خطوات عمل، مع مراجعة بشرية حيث يلزم."
        },
        {
          title: "تحليلات وتقارير ذكية",
          text: "لوحات وتقارير تلخّص أداء العمل، وتنبيهات تكشف ما يحتاج إلى متابعة قبل أن يتأخر."
        },
        {
          title: "الربط مع أنظمتك",
          text: "ربط الذكاء الاصطناعي بالأنظمة التي تستخدمها، مثل Outlook أو SAP أو Salesforce أو قواعد البيانات."
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
        "لنتعرّف على عملك",
        "قبل أن نقترح أي شيء."
      ],
      text: "احجز جلسة استكشافية مجانية، نفهم فيها احتياجك ونقترح خطوة أولى عملية.",
      button: "احجز جلسة مجانية",
      href: "/contact"
    }
  },
};
