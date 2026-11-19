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
  /** speech bubbles over the image fan (left, right) */
  bubbles: [string, string];
  cards: { title: string; text: string }[];
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
    { src: "/images/projects/albetar/platform.webp", alt: "Albetar smart hardware store with the BETO AI assistant and component customization" },
  ],
  [
    { src: "/images/projects/mohami-smart/brand.webp", alt: "Mohami Smart logo, a golden scale of justice" },
    { src: "/images/projects/mohami-smart/dashboard.webp", alt: "Mohami Smart legal dashboard for cases, documents and AI workflows" },
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
const PRODUCT_SHOTS = ["1-rfq", "2-rfq", "3-pipeline", "4-dashboard", "5-pipeline", "6-my-day", "7-my-day"];

export function productImages(lang: Lang): string[] {
  return PRODUCT_SHOTS.map((name) => `/images/dealplier/dealplier-${name}.${lang}.webp`);
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
      title: ["Put AI to work", "in your business."],
      intro: "Search company knowledge, process documents, and reduce manual work.",
      introPhone: "Built around your workflows, data, and existing tools.",
      primary: { label: "Discuss Your Project", href: "/contact" },
      secondary: { label: "See Our Work", href: "#work" },
    },
    about: {
      badge: "About EVEXA",
      statement:
        "We study how your team works before deciding what to automate, connect, or build. AI should fit your people, data, and systems—not the other way around.",
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
        { title: "Knowledge Search", subtitle: "Find What Matters", text: "Search policies and documents in natural language.", image: "/images/solutions/knowledge-search.webp" },
        { title: "AI Assistants", subtitle: "Built for Your Team", text: "Help teams ask questions and complete tasks.", image: "/images/solutions/ai-assistants.webp" },
        { title: "Document Intelligence", subtitle: "From Files to Data", text: "Extract, classify, and summarize document data.", image: "/images/solutions/document-intelligence.webp" },
        { title: "Workflow Automation", subtitle: "Less Manual Work", text: "Simplify repeat steps and route requests.", image: "/images/solutions/workflow-automation.webp" },
        { title: "AI Integration", subtitle: "Work with Your Tools", text: "Add AI to the platforms your team already uses.", image: "/images/solutions/ai-integration.webp" },
        { title: "Analytics & Forecasting", subtitle: "Insights for Planning", text: "Find patterns in business data to support planning.", image: "/images/solutions/analytics-forecasting.webp" },
      ],
      tags: ["Knowledge Search", "AI Assistants", "Document AI", "Automation", "Integrations", "Arabic NLP", "Business Data", "Analytics"],
    },
    work: {
      badge: "Selected Work",
      title: ["What we’ve built,", "and why it matters."],
      body: "AI solutions and business platforms built for real operational needs.",
      button: { label: "Explore Our Work", href: "/portfolio" },
      projects: [
        { href: "/portfolio/albetar", label: "AI", title: "Albetar AI Modules", points: ["Bilingual Product Search", "Semantic Retrieval", "AI Recommendations", "Revenue Forecasting"], tags: ["Commerce AI", "RAG"], images: WORK_IMAGES[0] },
        { href: "/portfolio/mohami-smart", label: "LEGAL", title: "Mohami Smart", points: ["AI Legal Assistant", "Document Analysis", "Legal Drafting", "Case Management"], tags: ["LegalTech", "AI Workflows"], images: WORK_IMAGES[1] },
        { href: "/portfolio/business-operations", label: "OPS", title: "Business Operations Platforms", points: ["HR Workflows", "Project Operations", "Approvals & Tracking", "Role-Based Access"], tags: ["HRMS", "PMS"], images: WORK_IMAGES[2] },
      ],
    },
    product: {
      badge: "Our Product · Built by EVEXA",
      title: ["From RFQ to follow-up.", "All in one place."],
      body: "Dealplier brings RFQs, quotations, and daily follow-ups together for B2B sales teams.",
      button: { label: "Explore Dealplier", href: "https://www.dealplier.com/" },
      bubbles: ["RFQs, organized", "Follow-up, clear"],
      cards: [
        { title: "RFQ Inbox", text: "Review requests and attachments with AI assistance." },
        { title: "Quotations", text: "Track revisions, dates, and approvals." },
        { title: "My Day", text: "See the next task and follow-up for each deal." },
      ],
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
      body: "We assess connections with CRMs, databases, documents, and internal tools.",
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
      title: ["Have a workflow", "worth improving?"],
      text: "Share your challenge. We’ll explore a practical starting point.",
      button: "Discuss Your Project",
      href: "/contact",
    },
  },
  ar: {
    hero: {
      badgeChip: "EVEXA",
      badge: "حلول ذكاء اصطناعي",
      title: ["اجعل الذكاء الاصطناعي", "جزءًا من عملك."],
      intro: "ابحث في معلومات شركتك، وتعامل مع المستندات، وقلّل المهام اليدوية.",
      introPhone: "حلول مخصصة تتكامل مع بياناتك وإجراءاتك وأنظمتك الحالية.",
      primary: { label: "ناقش مشروعك", href: "/contact" },
      secondary: { label: "استكشف أعمالنا", href: "#work" },
    },
    about: {
      badge: "عن EVEXA",
      statement:
        "نفهم طريقة عمل فريقك قبل تحديد ما يحتاج إلى أتمتة أو تكامل أو تطوير. نصمم حلول الذكاء الاصطناعي لتناسب الأشخاص والبيانات والأنظمة التي تعتمد عليها شركتك.",
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
        { title: "البحث المعرفي", subtitle: "اعثر على ما تحتاجه", text: "ابحث في السياسات والمستندات بلغة طبيعية.", image: "/images/solutions/knowledge-search.webp" },
        { title: "المساعدات الذكية", subtitle: "مصممة لفريقك", text: "مساعدات تدعم فريقك في الاستفسارات والمهام.", image: "/images/solutions/ai-assistants.webp" },
        { title: "فهم المستندات", subtitle: "من الملفات إلى المعلومات", text: "استخرج المعلومات من المستندات وصنّفها ولخّصها.", image: "/images/solutions/document-intelligence.webp" },
        { title: "أتمتة الإجراءات", subtitle: "عمل يدوي أقل", text: "بسّط المهام المتكررة ووجّه الطلبات.", image: "/images/solutions/workflow-automation.webp" },
        { title: "دمج الذكاء الاصطناعي", subtitle: "يتكامل مع أنظمتك", text: "أضف قدرات ذكية إلى أنظمتك الحالية.", image: "/images/solutions/ai-integration.webp" },
        { title: "التحليلات والتوقعات", subtitle: "رؤى تدعم التخطيط", text: "افهم أنماط البيانات وادعم قرارات التخطيط.", image: "/images/solutions/analytics-forecasting.webp" },
      ],
      tags: ["البحث المعرفي", "المساعدات الذكية", "ذكاء المستندات", "الأتمتة", "التكاملات", "معالجة العربية", "بيانات الأعمال", "التحليلات"],
    },
    work: {
      badge: "من أعمالنا",
      title: ["ما أنجزناه،", "وما يميّزه."],
      body: "حلول ذكاء اصطناعي ومنصات أعمال طُورت لاحتياجات تشغيلية فعلية.",
      button: { label: "استكشف أعمالنا", href: "/portfolio" },
      projects: [
        { href: "/portfolio/albetar", label: "AI", title: "Albetar AI Modules", points: ["بحث منتجات بلغتين", "استرجاع دلالي", "توصيات ذكية", "توقعات الإيرادات"], tags: ["ذكاء التجارة", "RAG"], images: WORK_IMAGES[0] },
        { href: "/portfolio/mohami-smart", label: "قانوني", title: "Mohami Smart", points: ["مساعد قانوني ذكي", "تحليل المستندات", "إعداد صيغ قانونية", "إدارة القضايا"], tags: ["تقنية قانونية", "إجراءات ذكية"], images: WORK_IMAGES[1] },
        { href: "/portfolio/business-operations", label: "تشغيل", title: "Business Operations Platforms", points: ["إجراءات الموارد البشرية", "العمليات والمشاريع", "الموافقات والمتابعة", "صلاحيات حسب الدور"], tags: ["HRMS", "PMS"], images: WORK_IMAGES[2] },
      ],
    },
    product: {
      badge: "منتج من تطوير EVEXA",
      title: ["من طلب التسعير", "إلى متابعة الصفقة."],
      body: "يجمع Dealplier طلبات التسعير وعروض الأسعار والمتابعات اليومية لفرق مبيعات التوريد.",
      button: { label: "اكتشف Dealplier", href: "https://www.dealplier.com/" },
      bubbles: ["طلبات منظمة", "متابعة واضحة"],
      cards: [
        { title: "طلبات التسعير", text: "راجع الطلبات والمرفقات بمساعدة الذكاء الاصطناعي." },
        { title: "عروض الأسعار", text: "تابع نسخ العروض والمواعيد والموافقات." },
        { title: "أولويات اليوم", text: "تعرّف على أولويات المتابعة لكل صفقة." },
      ],
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
      body: "ندرس الربط مع أنظمة العملاء وقواعد البيانات والمستندات والأدوات الداخلية.",
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
      title: ["هل لديك إجراء", "ترغب في تطويره؟"],
      text: "شاركنا التحدي، وسنساعدك على تحديد نقطة بداية عملية.",
      button: "ناقش مشروعك",
      href: "/contact",
    },
  },
};
