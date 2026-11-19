/**
 * Case-study pages (/portfolio/<slug>), both languages.
 * Images are placeholder visuals carried over from the original template.
 */
import type { Lang } from "@/config/site";

export interface CaseFact {
  label: string;
  value: string;
}

export interface CaseSubBlock {
  title: string;
  /** small blue label next to the title */
  chip?: string;
  /** may contain "• " lines separated by newlines */
  text: string;
}

export interface CaseBlock {
  title: string;
  text: string;
  subs: CaseSubBlock[];
}

export interface CaseStudyCopy {
  /** short name and topic label shown on "More Work" cards */
  name: string;
  cardTag: string;
  /** headline, one entry per line */
  title: string[];
  intro: string;
  tags: string[];
  facts: CaseFact[];
  /** external links open in a new tab */
  button: { label: string; href: string };
  /** analysis, challenge, solution */
  blocks: [CaseBlock, CaseBlock, CaseBlock];
  cta: { badge: string; title: [string, string]; text: string; button: string; href: string };
}

export interface CaseStudy {
  slug: string;
  /** template slug the page used to live at (permanently redirected) */
  legacySlug: string;
  /** key into FAQS */
  faqKey: string;
  images: { cover: string; pair: [string, string]; wide: string };
  copy: Record<Lang, CaseStudyCopy>;
}

/** Strings shared by every case study. */
export const CASE_STUDY_UI: Record<Lang, { badgeChip: string; badge: string; moreTitle: string; moreButton: string; faqBadge: string }> = {
  en: { badgeChip: "CASE", badge: "STUDY", moreTitle: "Explore More Work", moreButton: "View All Work", faqBadge: "FAQ" },
  ar: { badgeChip: "دراسة", badge: "حالة", moreTitle: "اكتشف أعمالًا أخرى", moreButton: "جميع الأعمال", faqBadge: "الأسئلة الشائعة" },
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "albetar",
    legacySlug: "lemonide-tech",
    faqKey: "portfolio-albetar",
    images: { cover: "/images/6igmB60fniZZ2g62iKIWQ848llo.webp", pair: ["/images/wIkfS2B4PLN8e56l2tauOjIs4.webp", "/images/EnDwPLRTX3We8xhTEDKAWKPM.webp"], wide: "/images/eMdqbqVkbMYbHIshhsnZkU0YM.webp" },
    copy: {
      en: {
        name: "Albetar",
        cardTag: "COMMERCE AI",
        title: ["Albetar", "Commerce AI"],
        intro: "An Arabic-first hardware commerce platform with intelligent search, product recommendations, and connected retail operations.",
        tags: ["Commerce AI", "RAG"],
        facts: [
          { label: "Services", value: "Commerce Platform & AI Modules" },
          { label: "Category", value: "AI-Powered E-Commerce" },
          { label: "Client", value: "Albetar Store" },
        ],
        button: { label: "Visit Live Store", href: "https://albetarstore.com/" },
        blocks: [
          {
            title: "Analysis — Understanding Hardware Retail",
            text: "Hardware shopping involves detailed specifications, product compatibility, and frequent catalog updates. We examined how customers discover products and how the store manages everyday operations.",
            subs: [
              { title: "Product Discovery", chip: "COMMERCE", text: "• Organize technical products into clear categories and filters.\n• Support device customization with compatibility checks.\n• Make specifications easier to compare before purchase." },
              { title: "Retail Operations", text: "The platform also needed practical tools for orders, stock, payments, and shipping—without separating the shopping experience from the operational workflow." },
            ],
          },
          {
            title: "Challenge — Finding the Right Product",
            text: "Customers may describe a device by purpose rather than an exact model or specification. Traditional keyword matching alone can miss relevant products, especially across Arabic and English queries.",
            subs: [
              { title: "Beyond Keyword Search", chip: "AI SEARCH", text: "The challenge was to interpret user intent, rank hardware by relevant specifications, and connect discovery to reliable product data while keeping the shopping journey straightforward." },
            ],
          },
          {
            title: "Solution — Intelligence Built Into Commerce",
            text: "The solution combines a bilingual shopping platform with AI modules for product discovery, recommendations, and business insights—connected to the store’s operational data.",
            subs: [
              { title: "Search, Recommendations & Insights", chip: "RAG", text: "Hybrid intent understanding and semantic retrieval help match product queries. Hardware-aware ranking considers technical requirements, while AI-assisted reviews, KPI summaries, and revenue forecasting support store decisions." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["A Similar Challenge?", "Let’s Explore Your Use Case."],
          text: "Tell us what you need to improve. We can start with the problem and discuss a practical next step.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "البيطار",
        cardTag: "تجارة ذكية",
        title: ["البيطار", "تجارة ذكية"],
        intro: "منصة لتجارة أجهزة الكمبيوتر تجمع بين البحث الذكي، وتوصيات المنتجات، وإدارة عمليات البيع والمخزون.",
        tags: ["تجارة ذكية", "RAG"],
        facts: [
          { label: "الخدمات", value: "منصة تجارة ووحدات ذكاء اصطناعي" },
          { label: "الفئة", value: "تجارة إلكترونية مدعومة بالذكاء" },
          { label: "العميل", value: "متجر البيطار" },
        ],
        button: { label: "زيارة المتجر", href: "https://albetarstore.com/" },
        blocks: [
          {
            title: "التحليل — فهم تجارة الأجهزة",
            text: "يتطلب شراء أجهزة الكمبيوتر معرفة المواصفات وتوافق المكونات وتحديث المنتجات باستمرار. درسنا رحلة البحث والشراء، إلى جانب احتياجات إدارة المتجر اليومية.",
            subs: [
              { title: "استكشاف المنتجات", chip: "التجارة", text: "• تنظيم الأجهزة والمكونات في فئات ومرشحات واضحة.\n• دعم تخصيص الأجهزة مع التحقق من توافق المكونات.\n• تسهيل مراجعة المواصفات والمقارنة قبل الشراء." },
              { title: "إدارة العمليات", text: "احتاجت المنصة أيضًا إلى أدوات لإدارة الطلبات والمخزون والمدفوعات والشحن، مع ربط تجربة العميل بسير العمل التشغيلي." },
            ],
          },
          {
            title: "التحدي — العثور على المنتج المناسب",
            text: "قد يصف العميل احتياجه دون معرفة اسم الجهاز أو مواصفاته الدقيقة. ولا يكفي البحث بالكلمات المفتاحية دائمًا لإظهار الخيارات الملائمة، خصوصًا بالعربية والإنجليزية.",
            subs: [
              { title: "ما بعد البحث بالكلمات المفتاحية", chip: "بحث ذكي", text: "كان التحدي هو فهم نية البحث وترتيب الأجهزة وفق متطلباتها الفنية، وربط النتائج ببيانات المنتجات مع الحفاظ على تجربة شراء واضحة." },
            ],
          },
          {
            title: "الحل — ذكاء متكامل مع التجارة",
            text: "يجمع المشروع بين منصة تجارة إلكترونية ثنائية اللغة ووحدات ذكاء اصطناعي للبحث والتوصية وتحليل الأعمال، بالاعتماد على بيانات المتجر.",
            subs: [
              { title: "البحث والتوصية وتحليل البيانات", chip: "RAG", text: "يساعد فهم الاستفسارات والبحث الدلالي في الوصول إلى المنتجات الملائمة، مع ترتيب يراعي المواصفات الفنية. وتدعم تحليلات التقييمات ومؤشرات الأداء والتنبؤ بالإيرادات قرارات الإدارة." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["لديك تحدٍ مشابه؟", "لنناقش احتياجك."],
          text: "أخبرنا بما ترغب في تطويره، ولنبدأ بفهم المشكلة ومناقشة الخطوة العملية المناسبة.",
          button: "ناقش مشروعك",
          href: "/contact",
        },
      },
    },
  },
  {
    slug: "mohami-smart",
    legacySlug: "million-one",
    faqKey: "portfolio-mohami-smart",
    images: { cover: "/images/h33bTK94GjgfacsggRpl9F5QXes.webp", pair: ["/images/cmQEswT5KlDnITTWpFJi1ycWpA.webp", "/images/y6nsXyFCXVHybL6AG2drPt8Xug.webp"], wide: "/images/nv6wvWEhx82tRYYO7GpPtdr8iq0.webp" },
    copy: {
      en: {
        name: "Mohami Smart",
        cardTag: "LEGALTECH",
        title: ["Mohami", "Smart"],
        intro: "An AI-assisted legal platform bringing case management, document analysis, and legal drafting into one workflow.",
        tags: ["LegalTech", "AI Workflows"],
        facts: [
          { label: "Focus", value: "Legal AI & Case Workflows" },
          { label: "Category", value: "LegalTech Platform" },
          { label: "Platform", value: "Mohami Smart" },
        ],
        button: { label: "Visit Live Platform", href: "https://mohamy-smart.com/" },
        blocks: [
          {
            title: "Analysis — Mapping Legal Work",
            text: "Legal work moves between case files, client records, documents, and deadlines. The platform brings these materials into a more organized daily workflow.",
            subs: [
              { title: "Cases & Clients", chip: "WORKFLOW", text: "• Organize case information in one place.\n• Keep client records and related files accessible.\n• Support follow-up across daily legal tasks." },
              { title: "Document Handling", text: "Documents, judgments, and drafts need a clear review process. The platform connects document work with the relevant legal case." },
            ],
          },
          {
            title: "Challenge — Working Through Legal Documents",
            text: "Lawyers often review lengthy files, identify relevant facts, and prepare written materials. Repeating these steps across disconnected tools makes the work harder to track.",
            subs: [
              { title: "From Files to Useful Context", chip: "LEGAL AI", text: "The challenge is to help professionals extract important points from uploaded documents while preserving the context needed for legal review and drafting." },
            ],
          },
          {
            title: "Solution — AI Assistance in Context",
            text: "Mohami Smart combines case and client management with AI-assisted legal document analysis and drafting tools, keeping professional review central to the process.",
            subs: [
              { title: "Analyze, Draft & Review", chip: "HUMAN REVIEW", text: "Users can upload case materials, request analysis of documents or judgments, and prepare draft legal texts. A qualified professional reviews the output before formal use." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["A Process to Improve?", "Let’s Explore It Together."],
          text: "Tell us where work becomes difficult. We can review the problem and discuss a practical next step.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "محامي سمارت",
        cardTag: "تقنية قانونية",
        title: ["محامي سمارت"],
        intro: "منصة قانونية مدعومة بالذكاء الاصطناعي تجمع بين إدارة القضايا وتحليل المستندات والصياغة القانونية في مسار عمل واحد.",
        tags: ["ذكاء قانوني", "إدارة القضايا"],
        facts: [
          { label: "المجال التقني", value: "ذكاء قانوني وإدارة قضايا" },
          { label: "التصنيف", value: "منصة تقنية قانونية" },
          { label: "المنصة", value: "محامي سمارت" },
        ],
        button: { label: "زيارة المنصة", href: "https://mohamy-smart.com/" },
        blocks: [
          {
            title: "التحليل — فهم دورة العمل القانوني",
            text: "يتنقل العمل القانوني يوميًا بين ملفات القضايا وسجلات الموكلين والمستندات والمواعيد. وتعمل المنصة على جمع هذه العناصر في مسار عمل يومي أكثر وضوحًا وتنظيمًا.",
            subs: [
              { title: "القضايا والموكلون", chip: "مسار العمل", text: "• تنظيم بيانات القضايا في مكان واحد.\n• إتاحة سجلات الموكلين والمستندات المرتبطة بها.\n• متابعة المهام القانونية اليومية والمواعيد." },
              { title: "إدارة المستندات", text: "تحتاج المستندات والأحكام والمسودات إلى مراجعة منظمة. وتربط المنصة التعامل مع الوثائق بملف القضية المعني." },
            ],
          },
          {
            title: "التحدي — التعامل مع الملفات القانونية",
            text: "تتطلب الملفات القانونية قراءة متأنية واستخلاص الوقائع وإعداد المستندات. ويصبح تتبّع هذه الخطوات أصعب عند توزيعها بين أدوات وملفات منفصلة.",
            subs: [
              { title: "من الوثائق إلى معلومات واضحة", chip: "ذكاء قانوني", text: "يتمثل التحدي في مساعدة المختص على استخلاص النقاط المهمة من المستندات، مع الحفاظ على السياق اللازم للمراجعة والصياغة القانونية." },
            ],
          },
          {
            title: "الحل — مساعدة ذكية في العمل القانوني",
            text: "يجمع محامي سمارت بين إدارة القضايا والموكلين وأدوات مساعدة بالذكاء الاصطناعي لتحليل المستندات وإعداد المسودات، مع بقاء المراجعة المهنية أساسية.",
            subs: [
              { title: "تحليل وصياغة ومراجعة", chip: "مراجعة بشرية", text: "يستطيع المستخدم رفع ملفات القضية وطلب تحليل المستندات أو الأحكام وإعداد مسودات قانونية. ويراجع المختص المخرجات قبل استخدامها رسميًا." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["لديك إجراء يحتاج تطويرًا؟", "لنناقش الحل المناسب."],
          text: "شاركنا التحدي الذي تواجهه، ولنبدأ بفهمه ومناقشة خطوة عملية تناسب احتياجك.",
          button: "ناقش مشروعك",
          href: "/contact",
        },
      },
    },
  },
  {
    slug: "business-operations",
    legacySlug: "viper-studio",
    faqKey: "portfolio-business-operations",
    images: { cover: "/images/oITRaXEkBVhukMYINXV2xi05PY.webp", pair: ["/images/BPEedBVqFey75HW49TPbSktrQ.webp", "/images/nIWCXDZYVF7vYxiEOoTQCy0Sdk.webp"], wide: "/images/bvayy8dANcD4eW8aJOgXk3nwM.webp" },
    copy: {
      en: {
        name: "Business Operations",
        cardTag: "OPERATIONS",
        title: ["Business Operations", "Platforms"],
        intro: "Two distinct platforms for Bin Delamah: one for HR operations, the other for construction projects.",
        tags: ["HRMS", "PMS"],
        facts: [
          { label: "Services", value: "Custom Business Platforms" },
          { label: "Category", value: "Enterprise Operations" },
          { label: "Client", value: "Bin Delamah" },
        ],
        button: { label: "Discuss Your Project", href: "/contact" },
        blocks: [
          {
            title: "Analysis — Two Operational Needs",
            text: "HR administration and construction delivery involve different teams, data, and approval paths. The published projects address these needs through two separate systems.",
            subs: [
              { title: "HR & Administration", chip: "HRMS", text: "• Employee and project-staffing records.\n• Fleet, finance, documents and audit workflows.\n• Role-based access across multiple companies." },
              { title: "Construction Operations", text: "The PMS focuses on project activity, warehouse and material flows, BOQ tracking, gate passes, approvals, and management reporting." },
            ],
          },
          {
            title: "Challenge — Keeping Work Traceable",
            text: "Operational teams need clear ownership and reliable records as requests, documents, and materials move between people and departments.",
            subs: [
              { title: "Visibility Across Workflows", chip: "OPS", text: "The HRMS addresses scattered administrative processes and manual approvals. The PMS addresses construction tracking, materials, and approval flows. Each solves a different operational problem." },
            ],
          },
          {
            title: "Solution — Platforms Built for the Work",
            text: "The HRMS brings people and administrative processes into one environment. The PMS organizes construction operations, with controls suited to project teams.",
            subs: [
              { title: "Structured, Role-Based Operations", chip: "SYSTEMS", text: "BDCC HRMS centralizes staffing, records, approvals, documents, and audit history. Bin Delamah PMS connects material and warehouse activities with BOQ tracking, gate passes, and reports within its own platform." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Complex Workflows?", "Let’s Make Them Clearer."],
          text: "Tell us where your team loses time. We can discuss a practical approach around your operations.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "أنظمة إدارة الأعمال",
        cardTag: "إدارة العمليات",
        title: ["منصات إدارة", "العمليات"],
        intro: "منصتان مستقلتان لبن دلامة: إحداهما لإدارة الموارد البشرية والعمليات، والأخرى لإدارة المشاريع الإنشائية.",
        tags: ["HRMS", "PMS"],
        facts: [
          { label: "الخدمات", value: "منصات أعمال مخصصة" },
          { label: "الفئة", value: "إدارة العمليات" },
          { label: "العميل", value: "بن دلامة" },
        ],
        button: { label: "ناقش مشروعك", href: "/contact" },
        blocks: [
          {
            title: "التحليل — احتياجان تشغيليان",
            text: "تختلف إجراءات الموارد البشرية عن متطلبات إدارة المشاريع الإنشائية، من حيث المستخدمين والبيانات والموافقات. لذلك يلبّي كل نظام احتياجًا مستقلًا.",
            subs: [
              { title: "الموارد البشرية والإدارة", chip: "HRMS", text: "• ملفات الموظفين وتوزيعهم على المشاريع.\n• الأسطول والمالية والمستندات وسجلات المراجعة.\n• صلاحيات حسب الأدوار عبر شركات متعددة." },
              { title: "عمليات المشاريع الإنشائية", text: "يركّز نظام PMS على المشاريع والمستودعات والمواد وجداول الكميات (BOQ) وتصاريح البوابات والموافقات والتقارير الإدارية." },
            ],
          },
          {
            title: "التحدي — وضوح الإجراءات وتتبعها",
            text: "تحتاج الفرق إلى مسؤوليات واضحة وسجلات يمكن الرجوع إليها مع انتقال الطلبات والمستندات والمواد بين الإدارات.",
            subs: [
              { title: "متابعة كل عملية", chip: "OPS", text: "يعالج نظام الموارد البشرية تشتت الإجراءات الإدارية والموافقات اليدوية، بينما يركّز نظام المشاريع على متابعة المواد والموافقات وسير العمل الإنشائي. ولكل منهما نطاق مستقل." },
            ],
          },
          {
            title: "الحل — نظام لكل بيئة عمل",
            text: "ينظّم نظام HRMS شؤون الموظفين والإجراءات الإدارية، بينما يدعم PMS عمليات المشاريع الإنشائية وفق صلاحيات ومسارات عمل محددة.",
            subs: [
              { title: "إدارة منظّمة وصلاحيات واضحة", chip: "الأنظمة", text: "يجمع BDCC HRMS بيانات الموظفين والموافقات والمستندات وسجلات المراجعة. ويتيح Bin Delamah PMS متابعة المواد والمستودعات والكميات وتصاريح البوابات والتقارير ضمن نظام مستقل." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["إجراءات عمل معقدة؟", "لنناقش تبسيطها."],
          text: "أخبرنا عن التحديات التشغيلية التي تواجه فريقك، ولنبحث معًا عن خطوة عملية مناسبة.",
          button: "ناقش مشروعك",
          href: "/contact",
        },
      },
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}
