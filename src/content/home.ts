/** Home page content (both languages), section by section. */
import type { Project } from "@/components/portfolio/ProjectCard";
import type { AboutCopy } from "@/content/about";
import type { Lang } from "@/config/site";

export interface HomeHeroCopy {
  badgeChip: string;
  badge: string;
  title: [string, string];
  /** desktop / tablet intro */
  intro: string;
  /** shorter intro shown on phones */
  introPhone: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
}

export interface HomeAboutCopy {
  badge: string;
  /** statement that lights up word by word while scrolling */
  statement: string;
  button: { label: string; href: string };
}

export interface SectionIntro {
  badge: string;
  title: string;
  body: string;
  button: { label: string; href: string };
}

export interface HomeFeaturesCopy {
  /** the three showcase cards: connected systems, trusted knowledge, voice */
  cards: [FeatureCard, FeatureCard, FeatureCard];
  /** rows of topic chips scrolling inside the "trusted knowledge" card */
  chipRows: string[][];
  /** label above the voice player */
  voiceLabel: string;
  points: { title: string; text: string }[];
}

export interface ServiceCard {
  title: string;
  subtitle: string;
  text: string;
  image: string;
}

export interface HomeServicesCopy {
  badge: string;
  title: [string, string];
  body: string;
  button: { label: string; href: string };
  /** every card links to the contact page */
  cards: ServiceCard[];
  tags: string[];
}

export interface HomeWorkCopy {
  badge: string;
  title: [string, string];
  body: string;
  button: { label: string; href: string };
  projects: Project[];
}

export interface HomeProductCopy {
  badge: string;
  title: [string, string];
  body: string;
  /** external product site (opens in a new tab) */
  button: { label: string; href: string };
  /** second button (site page, localized) */
  demo: { label: string; href: string };
  /** one tab per product screen, in PRODUCT_SCREENS order */
  tabs: { title: string; text: string; callout: string }[];
  /** short trust points under the showcase */
  points: string[];
}

export interface HomeProcessCopy {
  badge: string;
  title: [string, string];
  body: string;
  steps: { title: string; text: string }[];
}

export interface HomeChallengeCopy {
  badge: string;
  title: [string, string];
  text: string;
  button: { label: string; href: string };
}

export interface FeatureCard {
  title: string;
  text: string;
}

export interface HomeCopy {
  hero: HomeHeroCopy;
  about: HomeAboutCopy;
  /** heading inside the rotating image circle */
  circle: SectionIntro;
  features: HomeFeaturesCopy;
  services: HomeServicesCopy;
  work: HomeWorkCopy;
  product: HomeProductCopy;
  /** "Why EVEXA" — same layout as the about page's approach section */
  why: AboutCopy["approach"];
  integrations: { badge: string; title: [string, string]; body: string; button: { label: string; href: string } };
  process: HomeProcessCopy;
  /** split card with a video: "Where does work slow down?" */
  challenge: HomeChallengeCopy;
  faqBadge: string;
  cta: { badge: string; title: [string, string]; text: string; button: string; href: string };
}

/**
 * Images around the rotating circle, one per arm: workplaces EVEXA builds
 * for (operations, retail, healthcare, hiring, real estate, training),
 * architecture and AI visuals, toned down so the ring reads as one set.
 */
export const CIRCLE_IMAGES = Array.from({ length: 12 }, (_, i) => `/images/circle/${String(i + 1).padStart(2, "0")}.webp`);

/** Project preview images (template artwork, shared with the portfolio page). */
const WORK_IMAGES: Project["images"][] = [
  [
    { src: "/images/projects/albetar/brand.webp", alt: "Betar Store logo" },
    { src: "/images/projects/albetar/platform.webp", alt: "Betar Store workstation builder with BETO recommending the right RAM and storage" },
  ],
  [
    { src: "/images/projects/mohami-smart/brand.webp", alt: "Mohami Smart logo, a golden scale of justice" },
    { src: "/images/projects/mohami-smart/dashboard.webp", alt: "Mohami Smart dashboard with the AI legal assistant analyzing a supply contract" },
  ],
  [
    { src: "/images/projects/business-operations/hrms.webp", alt: "BDCC HRMS, the human resources management system for Bin Delamah" },
    { src: "/images/projects/business-operations/pms.webp", alt: "Bin Delamah project management system" },
  ],
];

/**
 * Fan of Dealplier screenshots (left to right), cropped from the real app
 * screens on dealplier.com: RFQ inbox and RFQ detail under "RFQs,
 * organized", the opportunities pipeline and team dashboard in the middle,
 * My Day under "Follow-up, clear". Each has an English and an Arabic copy.
 */
/** Dealplier screens shown in the product showcase, one per tab. */
export const PRODUCT_SCREENS = ["rfq", "my-day", "pipeline", "dashboard"] as const;

/** Full-size and phone-size screenshot of one screen, in the page language. */
export function productScreen(name: (typeof PRODUCT_SCREENS)[number], lang: Lang) {
  return {
    src: `/images/dealplier/screens/${name}.${lang}.webp`,
    small: `/images/dealplier/screens/${name}-900.${lang}.webp`,
  };
}

const WHY_IMAGE = { src: "/images/hZgGlHpPFf0bbzHL7dI9MolatA.webp", alt: "Man using a laptop" };

/**
 * Business tools EVEXA connects AI to (the customer's own systems: email,
 * chat, files, CRM, ERP, databases), shown in the integrations ticker.
 */
export const INTEGRATION_LOGOS: ReadonlyArray<{ src: string; name: string }> = [
  { src: "/images/integrations/microsoft365.webp", name: "Microsoft 365" },
  { src: "/images/integrations/outlook.webp", name: "Outlook" },
  { src: "/images/integrations/teams.webp", name: "Microsoft Teams" },
  { src: "/images/integrations/whatsapp.webp", name: "WhatsApp Business" },
  { src: "/images/integrations/gmail.webp", name: "Gmail" },
  { src: "/images/integrations/googledrive.webp", name: "Google Drive" },
  { src: "/images/integrations/slack.webp", name: "Slack" },
  { src: "/images/integrations/salesforce.webp", name: "Salesforce" },
  { src: "/images/integrations/hubspot.webp", name: "HubSpot" },
  { src: "/images/integrations/zoho.webp", name: "Zoho" },
  { src: "/images/integrations/odoo.webp", name: "Odoo" },
  { src: "/images/integrations/sap.webp", name: "SAP" },
  { src: "/images/integrations/sharepoint.webp", name: "SharePoint" },
  { src: "/images/integrations/excel.webp", name: "Excel" },
  { src: "/images/integrations/postgresql.webp", name: "PostgreSQL" },
  { src: "/images/integrations/mysql.webp", name: "MySQL" },
];

/** White marks of six AI platforms wired into the "Connected Systems" card. */
export const CONNECTED_TOOLS = ["openai", "claude-ai", "google-gemini", "microsoft-azure", "aws", "google-cloud"].map(
  (name) => `/images/tools/mono/${name}.webp`,
);

/**
 * Selected client and partner logos in the strip under the hero (from
 * evexa.tech): the best-known partners alternate with key clients.
 */
export const HERO_LOGOS: ReadonlyArray<{ src: string; alt: string; width: number; height: number }> = [
  { src: "/images/clients/united-nations.webp", alt: "United Nations", width: 314, height: 96 },
  { src: "/images/clients/bin-dalama.webp", alt: "Bin Delamah Contracting Co.", width: 203, height: 96 },
  { src: "/images/clients/uk-international-development.webp", alt: "UK International Development", width: 358, height: 96 },
  { src: "/images/clients/albetar-store.webp", alt: "Albetar Store", width: 225, height: 96 },
  { src: "/images/clients/ministry-youth-sports.webp", alt: "Ministry of Youth and Sports", width: 328, height: 96 },
  { src: "/images/clients/al-owaydan.webp", alt: "Abdulilah Essa Al-Owaydan Co.", width: 259, height: 96 },
  { src: "/images/clients/bibliotheca-alexandrina.webp", alt: "Bibliotheca Alexandrina", width: 228, height: 96 },
  { src: "/images/clients/samaa-al-riyadh.webp", alt: "Samaa Al Riyadh", width: 340, height: 96 },
  { src: "/images/clients/alexandria-university.webp", alt: "Alexandria University", width: 215, height: 96 },
  { src: "/images/clients/ai-industry-alliance.webp", alt: "AI Industry Alliance", width: 213, height: 96 },
];

export const HOME_COPY: Record<Lang, HomeCopy> = {
  en: {
    hero: {
      badgeChip: "EVEXA",
      badge: "Custom AI Solutions",
      title: ["AI built around", "how you work."],
      intro: "We build AI assistants and business systems that work on your documents, data and existing tools, in Arabic and English.",
      introPhone: "AI assistants and business systems that work on your data and tools.",
      primary: { label: "Book a Discovery Call", href: "/contact" },
      secondary: { label: "See Our Work", href: "#work" },
    },
    about: {
      badge: "About EVEXA",
      statement:
        "Before we suggest any technology, we learn how your team works and where its time goes. Then we build the solution that fixes exactly that.",
      button: { label: "About EVEXA", href: "/about" },
    },
    circle: {
      badge: "Features",
      title: "More than a clever answer.",
      body: "Useful AI helps your team find information and get work done.",
      button: { label: "Explore Solutions", href: "#services" },
    },
    features: {
      cards: [
        { title: "Connected Systems", text: "Link AI to existing tools through available APIs." },
        { title: "Trusted Knowledge", text: "Ground answers in approved company sources." },
        { title: "Voice Interaction", text: "Enable speech input where the workflow calls for it." },
      ],
      chipRows: [
        ["Knowledge Search", "AI Assistants", "Document AI", "Automation", "Business Data", "Integrations"],
        ["Integrations", "Business Data", "Automation", "Document AI", "AI Assistants", "Knowledge Search"],
        ["AI Assistants", "Automation", "Integrations", "Knowledge Search", "Document AI", "Business Data"],
        ["Knowledge Search", "AI Assistants", "Automation", "Business Data", "Document AI", "Integrations"],
        ["Integrations", "Automation", "AI Assistants", "Business Data", "Document AI", "Knowledge Search"],
      ],
      voiceLabel: "Speech Recognition",
      points: [
        { title: "Role-Based Access", text: "Permissions designed around team roles." },
        { title: "Arabic & English", text: "Experiences designed for both languages." },
        { title: "Document Handling", text: "Extract and organize useful information." },
        { title: "Human Review", text: "Keep people involved in key decisions." },
      ],
    },
    services: {
      badge: "Solutions",
      title: ["Practical AI for", "real business needs."],
      body: "From knowledge search to automation, we build around real work.",
      button: { label: "Discuss Your Needs", href: "/contact" },
      cards: [
        { title: "Knowledge Search", subtitle: "Find What Matters", text: "Search policies and documents in natural language.", image: "/images/solutions/knowledge-search.en.webp" },
        { title: "AI Assistants", subtitle: "Built for Your Team", text: "Help teams ask questions and complete tasks.", image: "/images/solutions/ai-assistants.en.webp" },
        { title: "Document Intelligence", subtitle: "From Files to Data", text: "Extract, classify, and summarize document data.", image: "/images/solutions/document-intelligence.en.webp" },
        { title: "Workflow Automation", subtitle: "Less Manual Work", text: "Simplify repeat steps and route requests.", image: "/images/solutions/workflow-automation.en.webp" },
        { title: "AI Integration", subtitle: "Work with Your Tools", text: "Add AI to the platforms your team already uses.", image: "/images/solutions/ai-integration.en.webp" },
        { title: "Analytics & Forecasting", subtitle: "Insights for Planning", text: "Find patterns in business data to support planning.", image: "/images/solutions/analytics-forecasting.en.webp" },
      ],
      tags: ["Knowledge Search", "AI Assistants", "Document AI", "Automation", "Integrations", "Arabic NLP", "Business Data", "Analytics"],
    },
    work: {
      badge: "Selected Work",
      title: ["From retail to legal", "and construction."],
      body: "A selection of our projects: an AI shopping assistant, a legal platform, and operations systems for a contracting company.",
      button: { label: "Explore Our Work", href: "/portfolio" },
      projects: [
        { href: "/portfolio/albetar", label: "AI", title: "Albetar", points: ["Bilingual Product Search", "Semantic Retrieval", "AI Recommendations", "Revenue Forecasting"], tags: ["Commerce AI", "RAG"], images: WORK_IMAGES[0] },
        { href: "/portfolio/mohami-smart", label: "LEGAL", title: "Mohami Smart", points: ["AI Legal Assistant", "Document Analysis", "Legal Drafting", "Case Management"], tags: ["LegalTech", "AI Workflows"], images: WORK_IMAGES[1] },
        { href: "/portfolio/business-operations", label: "OPS", title: "Bin Delamah", points: ["HR Workflows", "Project Operations", "Smart Reports & Alerts", "Role-Based Access"], tags: ["HRMS", "PMS"], images: WORK_IMAGES[2] },
      ],
    },
    product: {
      badge: "Our Product · AI Sales Assistant",
      title: ["Every RFQ followed up.", "Every quotation closed."],
      body: "Dealplier is the AI sales assistant we built for B2B suppliers. It reads RFQ emails and quotation PDFs, pulls out the details, and gives every salesperson one daily follow-up list, in Arabic and English.",
      button: { label: "Explore Dealplier", href: "https://www.dealplier.com/" },
      demo: { label: "Book a Demo", href: "/contact" },
      tabs: [
        { title: "RFQ Inbox", text: "AI reads RFQ emails and attachments and pulls out the company, project, reference and deadline, each with its source.", callout: "Detected from the email · please confirm" },
        { title: "My Day", text: "Each morning, every salesperson sees what is overdue, what is due today, and a suggested next step for each deal.", callout: "Suggested next step · accept or dismiss" },
        { title: "Opportunities", text: "Every open RFQ and quotation in one list, ranked by what needs attention, with the next action and its owner.", callout: "Deal at risk · follow-up 4 days overdue" },
        { title: "Team Dashboard", text: "Managers see the pipeline, the workload, and why deals were won or lost, calculated from current records.", callout: "Overdue follow-ups escalate on their own" },
      ],
      points: ["Arabic & English", "Every value shows its source", "Nothing saved until a person confirms", "Each company's data isolated"],
    },
    why: {
      badge: "Why EVEXA",
      title: ["We build for what happens", "after the demo."],
      intro: "Beyond a prototype: integration, permissions, and everyday use.",
      image: WHY_IMAGE,
      steps: [
        { tag: "Focus", title: "Business Need First", text: "Agree on the problem and outcome before choosing technology.", tags: ["Use Case", "Clear Outcome"] },
        { tag: "Fit", title: "Built for Your Environment", text: "Design around your existing systems, data, and processes.", tags: ["Your Systems", "Your Data"] },
        { tag: "Deliver", title: "Built to Work in Practice", text: "Handle the software and integration needed for daily work.", button: { label: "Discuss Your Project", href: "/contact" } },
      ],
    },
    integrations: {
      badge: "Integrations",
      title: ["Connect AI to the tools", "you already use."],
      body: "We connect AI to the systems you already use, such as Outlook, SAP, Salesforce and your databases, without changing how your team works.",
      button: { label: "Talk About Integration", href: "/contact" },
    },
    process: {
      badge: "Our Process",
      title: ["From business challenge", "to working AI."],
      body: "We define, build, test, integrate, and prepare the solution for use.",
      steps: [
        { title: "Understand", text: "Map workflows, users, data, and success criteria." },
        { title: "Build & Test", text: "Develop the solution and validate real scenarios." },
        { title: "Integrate & Deliver", text: "Connect systems and agree on handover steps." },
      ],
    },
    challenge: {
      badge: "Let’s Start with the Problem",
      title: ["Where does work", "slow down?"],
      text: "Tell us what takes too long. We’ll explore if AI can help.",
      button: { label: "Discuss Your Challenge", href: "/contact" },
    },
    faqBadge: "FAQ",
    cta: {
      badge: "Let’s Talk",
      title: ["Got work that takes", "longer than it should?"],
      text: "Tell us what it is. We’ll get back to you within two working days with a clear view of what we can build.",
      button: "Start the Conversation",
      href: "/contact",
    },
  },
  ar: {
    hero: {
      badgeChip: "EVEXA",
      badge: "حلول ذكاء اصطناعي",
      title: ["حلول ذكاء اصطناعي", "مبنية على طريقة عملك."],
      intro: "نبني مساعدات ذكية وأنظمة أعمال تعمل على مستنداتك وبياناتك وأنظمتك الحالية، بالعربية والإنجليزية.",
      introPhone: "مساعدات ذكية وأنظمة أعمال تعمل على بياناتك وأنظمتك الحالية.",
      primary: { label: "احجز جلسة استكشافية", href: "/contact" },
      secondary: { label: "استكشف أعمالنا", href: "#work" },
    },
    about: {
      badge: "عن EVEXA",
      statement:
        "قبل أن نقترح أي تقنية، نفهم كيف يعمل فريقك وأين يضيع وقته، ثم نبني الحل الذي يعالج ذلك تحديدًا.",
      button: { label: "عن EVEXA", href: "/about" },
    },
    circle: {
      badge: "المميزات",
      title: "أكثر من مجرد إجابة ذكية.",
      body: "الذكاء الاصطناعي المفيد يساعد فريقك على الوصول للمعلومات وإنجاز العمل.",
      button: { label: "استكشف الحلول", href: "#services" },
    },
    features: {
      cards: [
        { title: "أنظمة مترابطة", text: "اربط الذكاء الاصطناعي بأدواتك\nعبر واجهات الربط المتاحة." },
        { title: "معلومات موثوقة", text: "إجابات تستند إلى مصادر\nالشركة المعتمدة." },
        { title: "التفاعل الصوتي", text: "أضف الإدخال الصوتي\nعندما يناسب طبيعة العمل." },
      ],
      chipRows: [
        ["البحث المعرفي", "المساعدات الذكية", "ذكاء المستندات", "الأتمتة", "بيانات الأعمال", "التكاملات"],
        ["التكاملات", "بيانات الأعمال", "الأتمتة", "ذكاء المستندات", "المساعدات الذكية", "البحث المعرفي"],
        ["المساعدات الذكية", "الأتمتة", "التكاملات", "البحث المعرفي", "ذكاء المستندات", "بيانات الأعمال"],
        ["البحث المعرفي", "المساعدات الذكية", "الأتمتة", "بيانات الأعمال", "ذكاء المستندات", "التكاملات"],
        ["التكاملات", "الأتمتة", "المساعدات الذكية", "بيانات الأعمال", "ذكاء المستندات", "البحث المعرفي"],
      ],
      voiceLabel: "التعرف على الصوت",
      points: [
        { title: "صلاحيات حسب الدور", text: "صلاحيات تتناسب مع أدوار المستخدمين." },
        { title: "العربية والإنجليزية", text: "تجربة مصممة للعمل باللغتين." },
        { title: "معالجة المستندات", text: "استخراج المعلومات وتنظيمها من المستندات." },
        { title: "مراجعة بشرية", text: "إشراك الفريق في مراجعة القرارات المهمة." },
      ],
    },
    services: {
      badge: "حلولنا",
      title: ["حلول ذكاء اصطناعي", "لاحتياجات أعمالك."],
      body: "من البحث المعرفي إلى الأتمتة، نقدم حلولًا تناسب سير العمل الفعلي.",
      button: { label: "ناقش احتياجك", href: "/contact" },
      cards: [
        { title: "البحث المعرفي", subtitle: "اعثر على ما تحتاجه", text: "ابحث في السياسات والمستندات بلغة طبيعية.", image: "/images/solutions/knowledge-search.ar.webp" },
        { title: "المساعدات الذكية", subtitle: "مصممة لفريقك", text: "مساعدات تدعم فريقك في الاستفسارات والمهام.", image: "/images/solutions/ai-assistants.ar.webp" },
        { title: "فهم المستندات", subtitle: "من الملفات إلى المعلومات", text: "استخرج المعلومات من المستندات وصنّفها ولخّصها.", image: "/images/solutions/document-intelligence.ar.webp" },
        { title: "أتمتة الإجراءات", subtitle: "عمل يدوي أقل", text: "بسّط المهام المتكررة ووجّه الطلبات.", image: "/images/solutions/workflow-automation.ar.webp" },
        { title: "دمج الذكاء الاصطناعي", subtitle: "يتكامل مع أنظمتك", text: "أضف قدرات ذكية إلى أنظمتك الحالية.", image: "/images/solutions/ai-integration.ar.webp" },
        { title: "التحليلات والتوقعات", subtitle: "رؤى تدعم التخطيط", text: "افهم أنماط البيانات وادعم قرارات التخطيط.", image: "/images/solutions/analytics-forecasting.ar.webp" },
      ],
      tags: ["البحث المعرفي", "المساعدات الذكية", "ذكاء المستندات", "الأتمتة", "التكاملات", "معالجة العربية", "بيانات الأعمال", "التحليلات"],
    },
    work: {
      badge: "من أعمالنا",
      title: ["من التجارة إلى القانون", "والمقاولات."],
      body: "نماذج مختارة من مشاريعنا: مساعد تسوق ذكي، ومنصة قانونية، وأنظمة تشغيل لشركة مقاولات.",
      button: { label: "استكشف أعمالنا", href: "/portfolio" },
      projects: [
        { href: "/portfolio/albetar", label: "AI", title: "Albetar", points: ["بحث منتجات بلغتين", "استرجاع دلالي", "توصيات ذكية", "توقعات الإيرادات"], tags: ["ذكاء التجارة", "RAG"], images: WORK_IMAGES[0] },
        { href: "/portfolio/mohami-smart", label: "قانوني", title: "Mohami Smart", points: ["مساعد قانوني ذكي", "تحليل المستندات", "إعداد صيغ قانونية", "إدارة القضايا"], tags: ["تقنية قانونية", "إجراءات ذكية"], images: WORK_IMAGES[1] },
        { href: "/portfolio/business-operations", label: "تشغيل", title: "Bin Delamah", points: ["إجراءات الموارد البشرية", "العمليات والمشاريع", "تقارير وتنبيهات ذكية", "صلاحيات حسب الدور"], tags: ["HRMS", "PMS"], images: WORK_IMAGES[2] },
      ],
    },
    product: {
      badge: "منتجنا · مساعد مبيعات بالذكاء الاصطناعي",
      title: ["ولا طلب تسعير يضيع،", "ولا عرض سعر يُنسى."],
      body: "Dealplier مساعد مبيعات بالذكاء الاصطناعي بنيناه لشركات التوريد. يقرأ إيميلات طلبات التسعير وملفات عروض الأسعار، ويستخرج تفاصيلها، ويعطي كل مندوب قائمة متابعة يومية، بالعربي والإنجليزي.",
      button: { label: "اكتشف Dealplier", href: "https://www.dealplier.com/" },
      demo: { label: "اطلب عرضًا تجريبيًا", href: "/contact" },
      tabs: [
        { title: "صندوق طلبات التسعير", text: "يقرأ الذكاء الاصطناعي إيميلات الطلبات ومرفقاتها، ويستخرج الشركة والمشروع والمرجع والموعد النهائي، مع مصدر كل قيمة.", callout: "تم الاستخراج من الإيميل · بانتظار تأكيدك" },
        { title: "يومي", text: "كل صباح يشوف المندوب المتأخر والمستحق اليوم، مع خطوة مقترحة لكل صفقة.", callout: "خطوة مقترحة · اقبلها أو تجاهلها" },
        { title: "الفرص", text: "كل الطلبات والعروض المفتوحة في قائمة وحدة، مرتبة حسب الأولوية، مع الإجراء التالي والمسؤول عنه.", callout: "صفقة في خطر · متابعة متأخرة 4 أيام" },
        { title: "لوحة الفريق", text: "يتابع المدير خط المبيعات وتوزيع الشغل وأسباب الفوز والخسارة، محسوبة من البيانات الحالية.", callout: "المتابعات المتأخرة تتصعّد تلقائيًا" },
      ],
      points: ["عربي وإنجليزي", "كل قيمة تظهر مع مصدرها", "ما ينحفظ شي قبل تأكيد الموظف", "بيانات كل شركة معزولة"],
    },
    why: {
      badge: "لماذا EVEXA",
      title: ["نهتم بما يحدث", "بعد العرض التجريبي."],
      intro: "ما بعد النموذج التجريبي: تكامل وصلاحيات واستخدام عملي.",
      image: WHY_IMAGE,
      steps: [
        { tag: "الاحتياج", title: "احتياجات العمل أولًا", text: "نحدد المشكلة والنتيجة المطلوبة قبل اختيار التقنية.", tags: ["حالة استخدام", "نتيجة واضحة"] },
        { tag: "الملاءمة", title: "مناسب لبيئة عملك", text: "نصمم الحل وفق الأنظمة والبيانات وإجراءات العمل.", tags: ["أنظمتك", "بياناتك"] },
        { tag: "التنفيذ", title: "جاهز للاستخدام الفعلي", text: "ننفذ البرمجيات والتكاملات اللازمة للعمل اليومي.", button: { label: "ناقش مشروعك", href: "/contact" } },
      ],
    },
    integrations: {
      badge: "التكاملات",
      title: ["اربط الذكاء الاصطناعي", "بأنظمتك الحالية."],
      body: "نربط الذكاء الاصطناعي بأنظمتك الحالية، مثل Outlook أو SAP أو Salesforce أو قواعد البيانات، دون أن تغيّر طريقة عمل فريقك.",
      button: { label: "ناقش متطلبات التكامل", href: "/contact" },
    },
    process: {
      badge: "منهجيتنا",
      title: ["من تحديات العمل", "إلى حلول عملية."],
      body: "نحدد الاحتياج، ونطوّر الحل ونختبره، ثم نجهزه للتكامل والتسليم.",
      steps: [
        { title: "فهم الاحتياج", text: "ندرس الإجراءات والمستخدمين والبيانات والنتائج المطلوبة." },
        { title: "التطوير والاختبار", text: "نطور الحل ونختبره على سيناريوهات واقعية." },
        { title: "التكامل والتسليم", text: "نربط الأنظمة ونجهز التسليم والخطوات التالية." },
      ],
    },
    challenge: {
      badge: "لنبدأ من التحدي",
      title: ["أين تتباطأ", "إجراءات العمل؟"],
      text: "حدثنا عما يستغرق وقتًا طويلًا، لنحدد أين يمكن للذكاء الاصطناعي أن يساعد.",
      button: { label: "ناقش التحدي", href: "/contact" },
    },
    faqBadge: "الأسئلة الشائعة",
    cta: {
      badge: "لنتحدث",
      title: ["هل لديك عمل يستغرق", "وقتًا أطول مما يجب؟"],
      text: "أخبرنا ما هو، ونعود إليك خلال يومي عمل بتصوّر واضح لما يمكن تنفيذه.",
      button: "ابدأ المحادثة",
      href: "/contact",
    },
  },
};
