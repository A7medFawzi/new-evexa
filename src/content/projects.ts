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
  /** search-result title (site name is appended) and description */
  seo: { title: string; description: string };
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
  /** card: image on other case studies' "Explore More Work" cards (defaults to cover) */
  /** tall: cover/wide images are 4:3 instead of 16:9 (shown uncropped) */
  images: { cover: string; pair: [string, string]; wide: string; card?: string; tall?: boolean };
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
    images: {
      card: "/images/projects/albetar/brand.webp",
      cover: "/images/projects/albetar/cover.webp",
      pair: ["/images/projects/albetar/retail-analysis.webp", "/images/projects/albetar/custom-build.webp"],
      wide: "/images/projects/albetar/beto-assistant.webp",
    },
    copy: {
      en: {
        name: "Albetar",
        cardTag: "COMMERCE AI",
        title: ["Albetar", "Commerce AI"],
        intro: "A hardware e-commerce platform that brings product discovery and workstation configuration together with BETO, a shopping assistant that talks customers through their requirements.",
        seo: { title: "Albetar | BETO, Hardware Configuration & Commerce AI", description: "Explore the Albetar platform, featuring BETO, workstation configuration, compatibility notices and store operations analytics." },
        tags: ["Commerce AI", "RAG"],
        facts: [
          { label: "Services", value: "Commerce Platform & AI Modules" },
          { label: "AI Modules", value: "6 built into the store" },
          { label: "Client", value: "Albetar Trading & Retail" },
        ],
        button: { label: "Visit Live Store", href: "https://albetarstore.com/" },
        blocks: [
          {
            title: "Analysis — How Customers Choose Hardware",
            text: "Customers often know the software they use and what they can spend, but not the exact machine they need. Store teams also need practical tools for maintaining products and monitoring operations.",
            subs: [
              { title: "Configuration With Context", chip: "SHOPPING", text: "The workstation configurator shows memory and storage alternatives, their prices and selection states, alongside compatibility indicators, so customers can review every change before ordering.\n• RAM and storage alternatives.\n• Price visibility with every choice.\n• Compatibility notices." },
              { title: "Visibility for the Store Team", text: "Beyond the storefront, the platform has administration areas for products, orders, reviews and promotions, plus dashboards with operational summaries and revenue forecasting." },
            ],
          },
          {
            title: "Challenge — A Requirement Is Not a Model Number",
            text: "“I need a workstation for design within my budget” describes an outcome, not a product code. Without useful guidance, comparing systems and compatible components becomes unnecessarily difficult.",
            subs: [
              { title: "A Clearer Path to the Right Choice", chip: "AI SEARCH", text: "The design connects natural customer questions with real product specifications, while keeping choices, pricing and compatibility information in view." },
            ],
          },
          {
            title: "Solution — BETO Meets a Configurable Store",
            text: "BETO provides a conversational entry point. Product and configuration pages then show concrete choices, while the store’s administration area supports day-to-day management and insight.",
            subs: [
              { title: "Two Sides of the Same Experience", chip: "RAG", text: "The platform combines the BETO chat interface, workstation configuration and compatibility notices with product, order and promotions management, plus AI-assisted summaries and forecasts." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Customers Can’t Find", "the Right Product?"],
          text: "Tell us how your catalog works. We’ll explore a guided shopping and configuration experience for your store.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "البيطار",
        cardTag: "تجارة ذكية",
        title: ["البيطار", "تجارة ذكية"],
        intro: "متجر إلكتروني للأجهزة وقطع الكمبيوتر يتيح للعميل استكشاف المنتجات وتخصيص مكونات جهازه، مع مساعد BETO الذي يحاوره حول احتياجه ويرشده إلى الاختيار المناسب.",
        seo: { title: "البيطار | BETO وتخصيص الأجهزة والتجارة الذكية", description: "مشروع البيطار: مساعد BETO، وتخصيص أجهزة الكمبيوتر، ومؤشرات توافق المكونات، وإدارة المتجر وتحليلاته." },
        tags: ["تجارة ذكية", "RAG"],
        facts: [
          { label: "الخدمات", value: "منصة تجارة ووحدات ذكاء اصطناعي" },
          { label: "وحدات الذكاء", value: "6 وحدات داخل المتجر" },
          { label: "العميل", value: "البيطار للتجارة والتجزئة" },
        ],
        button: { label: "زيارة المتجر", href: "https://albetarstore.com/" },
        blocks: [
          {
            title: "التحليل — فهم طريقة اختيار الأجهزة",
            text: "العميل غالبًا يعرف ما يريد إنجازه وميزانيته، لكنه قد لا يعرف اسم الجهاز أو مواصفاته المناسبة. وفريق المتجر يحتاج في الوقت نفسه إلى أدوات واضحة لإدارة المنتجات ومتابعة الأداء.",
            subs: [
              { title: "تخصيص يمكن مراجعته", chip: "تجربة الشراء", text: "تعرض واجهة تكوين الجهاز بدائل الذاكرة والتخزين وأسعارها، مع حالة الاختيار ومؤشرات التوافق، فيرى العميل ما تغيّر في التكوين قبل إكمال الطلب.\n• بدائل RAM والتخزين.\n• إظهار التكلفة مع كل اختيار.\n• تنبيهات مرتبطة بالتوافق." },
              { title: "رؤية لفريق المتجر", text: "إلى جانب واجهة التسوق، تتضمن المنصة صفحات لإدارة المنتجات والطلبات والتقييمات والعروض، ولوحات تلخص بيانات التشغيل وتعرض توقعات الإيرادات." },
            ],
          },
          {
            title: "التحدي — عندما يصف العميل احتياجه لا رقم المنتج",
            text: "طلب مثل «أحتاج محطة عمل للتصميم بميزانية محددة» يوضح الغرض، لكنه لا يحدد جهازًا بعينه. وقد تتحول المقارنة بين المكونات إلى عملية مربكة دون إرشاد ومعلومات توافق واضحة.",
            subs: [
              { title: "تقليل المسافة بين السؤال والاختيار", chip: "بحث ذكي", text: "كان المطلوب ربط لغة العميل اليومية ببيانات المنتجات الفعلية، وإبقاء الأسعار والمواصفات واختيارات المكونات أمامه بصورة يمكن فهمها والتحقق منها." },
            ],
          },
          {
            title: "الحل — BETO وتخصيص الجهاز في تجربة واحدة",
            text: "يتيح BETO للعميل طرح الأسئلة حول احتياجه، بينما تعرض صفحات المنتج وتكوينه الخيارات المتاحة. ويستكمل جانب الإدارة التجربة بأدوات للمتابعة وقراءة أداء المتجر.",
            subs: [
              { title: "مساعدة العميل والفريق دون تعقيد", chip: "RAG", text: "تجمع المنصة بين محادثة BETO، وتكوين الأجهزة مع مؤشرات التوافق، وإدارة المنتجات والطلبات والعروض، وملخصات وتوقعات ذكية داخل لوحة الإدارة." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["عملاؤك لا يجدون", "المنتج المناسب؟"],
          text: "احكِ لنا عن منتجاتك وطريقة الشراء الحالية، لنناقش تجربة بحث وتخصيص تناسب متجرك.",
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
    images: {
      card: "/images/projects/mohami-smart/brand.webp",
      cover: "/images/projects/mohami-smart/cover.webp",
      pair: ["/images/projects/mohami-smart/legal-work.webp", "/images/projects/mohami-smart/legal-documents.webp"],
      wide: "/images/projects/mohami-smart/legal-workflow.webp",
      tall: true,
    },
    copy: {
      en: {
        name: "Mohami Smart",
        cardTag: "LEGALTECH",
        title: ["Mohami", "Smart"],
        intro: "A legal workspace that brings cases, clients, documents and hearings together, with AI-assisted steps for fact review and draft preparation while lawyers keep professional control.",
        seo: { title: "Mohami Smart | Case Management & AI-Assisted Legal Work", description: "Explore Mohami Smart’s case management, fact review, AI-assisted legal workflows, drafting support and hearing calendar." },
        tags: ["LegalTech", "AI Workflows"],
        facts: [
          { label: "Focus", value: "Legal AI & Case Workflows" },
          { label: "Workflow", value: "5 steps, upload to memo" },
          { label: "Client", value: "EGY Legal for Smart Technology" },
        ],
        button: { label: "Visit Live Platform", href: "https://mohamy-smart.com/" },
        blocks: [
          {
            title: "Analysis — A Lawyer’s Daily Workflow",
            text: "A case is more than a PDF. It involves a client, facts, supporting documents, hearings and different procedural routes, all of which need context before legal analysis begins.",
            subs: [
              { title: "Cases and Clients", chip: "PRACTICE", text: "Dedicated case and client areas bring records and related work into one structured legal workspace.\n• Case and client records.\n• Documents in context.\n• Case-specific workflows." },
              { title: "Schedules and Supporting Tools", text: "A hearing calendar supports follow-up. The platform also includes document areas, contract drafting and a legal library of practice resources." },
            ],
          },
          {
            title: "Challenge — Turning Documents Into Legal Work",
            text: "Uploading a case file is only the start. Facts need to be reviewed, then connected to analysis, arguments and requests before a draft can be prepared. Unclear stages make review harder.",
            subs: [
              { title: "Review Built Into the Flow", chip: "LEGAL AI", text: "The goal was a sequence where lawyers inspect facts and suggested content, make selections and edit their work before producing a draft." },
            ],
          },
          {
            title: "Solution — A Guided, Reviewable Drafting Workflow",
            text: "The workflow starts with case details and supporting documents, then moves through fact review, legal analysis, arguments, requests and preparation of a working draft, exported as an editable Word file.",
            subs: [
              { title: "The Lawyer Stays in Control", chip: "HUMAN REVIEW", text: "Lawyers review the facts, select and edit suggested arguments, then prepare the draft. Separate areas cover clients, cases, scheduling and a conversational legal assistant." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Case Files Scattered", "Across Too Many Tools?"],
          text: "Tell us how your team works. We’ll explore a legal workspace built around it, with professional review at its core.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "محامي سمارت",
        cardTag: "تقنية قانونية",
        title: ["محامي سمارت"],
        intro: "منصة تجمع القضايا والموكلين والمستندات والجلسات، وتضيف مسارًا ذكيًا لتحليل الوقائع وإعداد المسودات القانونية، مع بقاء المراجعة والقرار للمحامي.",
        seo: { title: "محامي سمارت | إدارة القضايا والمساعدة القانونية الذكية", description: "تعرّف على محامي سمارت: إدارة القضايا والموكلين، ومراجعة الوقائع، ومسارات التحليل وإعداد المسودات القانونية." },
        tags: ["ذكاء قانوني", "إدارة القضايا"],
        facts: [
          { label: "المجال التقني", value: "ذكاء قانوني وإدارة قضايا" },
          { label: "مسار العمل", value: "5 خطوات من الملف إلى المذكرة" },
          { label: "العميل", value: "إيجي ليجال للتكنولوجيا الذكية" },
        ],
        button: { label: "زيارة المنصة", href: "https://mohamy-smart.com/" },
        blocks: [
          {
            title: "التحليل — فهم العمل اليومي للمحامي",
            text: "القضية ليست ملف PDF منفصلًا؛ هناك موكل ووقائع ومستندات وجلسات وإجراءات مختلفة. وتحتاج هذه العناصر إلى تنظيم واضح قبل البدء في التحليل أو الصياغة.",
            subs: [
              { title: "القضايا والموكلون", chip: "إدارة المكتب", text: "تخصص المنصة ملفات للموكلين والقضايا ومعلوماتها، مع لوحة تجمع مساحات العمل المرتبطة بكل منها بدل توزيع المتابعة بين أدوات متعددة.\n• ملفات القضايا والموكلين.\n• إدارة المستندات.\n• مسارات مرتبطة بكل قضية." },
              { title: "المواعيد والعمل المرتبط", text: "تضم مساحة العمل تقويمًا للجلسات والمتابعات، إلى جانب أدوات للمستندات وصياغة العقود، ومكتبة قانونية تشمل نماذج وموارد مساعدة." },
            ],
          },
          {
            title: "التحدي — تحويل المستند إلى عمل قانوني مترابط",
            text: "رفع الملف لا يكفي. يجب قراءة الوقائع ومراجعتها، ثم بناء التحليل والدفوع والطلبات قبل صياغة المسودة. وأي خطوة غير واضحة تزيد عبء التحقق على المحامي.",
            subs: [
              { title: "المراجعة جزء من المسار", chip: "ذكاء قانوني", text: "كان المطلوب تنظيم المراحل بوضوح، مع إتاحة فحص الوقائع والمقترحات وتعديلها قبل أن تدخل في مستند قانوني نهائي قابل للمراجعة." },
            ],
          },
          {
            title: "الحل — مساعدة قانونية ضمن خطوات واضحة",
            text: "يبدأ المسار بإضافة بيانات القضية ومستنداتها، ثم يمر بمراجعة الوقائع والتحليل القانوني والدفوع والطلبات، وصولًا إلى مسودة تُصدَّر بصيغة Word قابلة للتحرير والمراجعة.",
            subs: [
              { title: "المحامي يحتفظ بالقرار", chip: "مراجعة بشرية", text: "يطّلع المحامي على الوقائع، ويراجع الدفوع المقترحة ويختار منها، ثم يعدّ المسودة. وتضم المنصة أيضًا مساعدًا قانونيًا للمحادثة، وأدوات للقضايا والموكلين والمواعيد." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["ملفات قضاياك", "موزعة في كل مكان؟"],
          text: "تواصل معنا لنناقش مساحة عمل منظمة لقضايا فريقك، مع أدوات مساعدة تُبقي المراجعة القانونية في يد المختص.",
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
    images: {
      card: "/images/projects/business-operations/hrms.webp",
      cover: "/images/projects/business-operations/cover.webp",
      pair: ["/images/projects/business-operations/project-operations.webp", "/images/projects/business-operations/teams-clients.webp"],
      wide: "/images/projects/business-operations/setup-to-delivery.webp",
      tall: true,
    },
    copy: {
      en: {
        name: "Business Operations",
        cardTag: "OPERATIONS",
        title: ["Business Operations", "Platforms"],
        intro: "Two custom platforms for a contracting business: BDCC HRMS for employee and administrative work, and Bin Delamah PMS for projects, tasks, materials, warehouses and reporting.",
        seo: { title: "Bin Delamah | HR & Project Operations Platforms", description: "Discover BDCC HRMS for employee administration and Bin Delamah PMS for project tracking, materials, warehouses and reporting." },
        tags: ["HRMS", "PMS"],
        facts: [
          { label: "Services", value: "Custom Business Platforms" },
          { label: "Scale", value: "2,100+ active employees" },
          { label: "Client", value: "Bin Delamah Cont. Co." },
        ],
        button: { label: "Discuss Your Project", href: "/contact" },
        blocks: [
          {
            title: "Analysis — Different Teams, Different Needs",
            text: "HR teams maintain employee records, leave and administrative follow-ups. Project teams track tasks, materials and warehouses. Each needed a workspace suited to its responsibilities.",
            subs: [
              { title: "People and Administration", chip: "HRMS", text: "HRMS screens bring together employee records and indicators, nationality and Saudization views, leave and notes.\n• Employee records and indicators.\n• Leave and notes.\n• Administrative follow-ups." },
              { title: "Projects, Materials and Reports", text: "PMS shows project summaries, tasks, requests and alerts, along with materials, warehouses, movements, clients, users and reporting options." },
            ],
          },
          {
            title: "Challenge — Where Does a Task or Request Stand?",
            text: "A construction workflow may involve a project team, warehouse staff and administrators. When updates are spread across different channels, request and material status become harder to follow.",
            subs: [
              { title: "A Clear View for Each Responsibility", chip: "OPS", text: "The aim was to organize tasks, requests and inventory information in PMS, while keeping employee administration in its own HRMS workspace." },
            ],
          },
          {
            title: "Solution — Two Platforms Built for Contracting",
            text: "BDCC HRMS covers employee and administrative work. Bin Delamah PMS organizes project summaries, tasks, requests, warehouses, users and reporting in a dedicated operational interface.",
            subs: [
              { title: "Focused Screens for Daily Work", chip: "SYSTEMS", text: "HRMS covers leave, notes and employee indicators. PMS offers project and request views, stock alerts, users, clients and report selectors." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Do Your Teams Need", "a Clearer View?"],
          text: "Tell us how your HR or project operations run. We’ll explore a platform designed for those workflows.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "أنظمة إدارة الأعمال",
        cardTag: "إدارة العمليات",
        title: ["منصات إدارة", "العمليات"],
        intro: "حلّان مخصصان لشركة مقاولات: BDCC HRMS لإدارة شؤون الموظفين والمتابعات الإدارية، وBin Delamah PMS لمتابعة المشاريع والمهام والمواد والمستودعات والتقارير.",
        seo: { title: "بن دلامة | نظام الموارد البشرية وإدارة المشاريع", description: "نظامان لبيئة المقاولات: BDCC HRMS لشؤون الموظفين، وBin Delamah PMS للمشاريع والمهام والمواد والتقارير." },
        tags: ["HRMS", "PMS"],
        facts: [
          { label: "الخدمات", value: "منصات أعمال مخصصة" },
          { label: "الحجم", value: "أكثر من 2,100 موظف نشط" },
          { label: "العميل", value: "شركة بن دلامة للمقاولات" },
        ],
        button: { label: "ناقش مشروعك", href: "/contact" },
        blocks: [
          {
            title: "التحليل — احتياجات مختلفة لفرق مختلفة",
            text: "إدارة الموارد البشرية تتعامل مع ملفات الموظفين والإجازات والمتابعات الإدارية، بينما تعمل فرق المشاريع على المهام والمواد والمستودعات. لذلك احتاج كل فريق إلى نظام يناسب عمله.",
            subs: [
              { title: "شؤون الموظفين والإدارة", chip: "HRMS", text: "تجمع واجهات HRMS بيانات الموظفين، ومؤشرات الجنسيات والسعودة، والملاحظات والإجازات.\n• سجلات الموظفين ومؤشراتهم.\n• الإجازات والملاحظات.\n• المتابعات الإدارية." },
              { title: "المشاريع والمواد والتقارير", text: "يعرض PMS المشاريع والمهام والطلبات والتنبيهات، ويتضمن مساحات للمواد والمستودعات والحركات، إلى جانب إدارة العملاء والمستخدمين وتقارير التشغيل." },
            ],
          },
          {
            title: "التحدي — أين وصلت المهمة أو طلب المواد؟",
            text: "يتنقل العمل بين مسؤول المشروع والمستودع والإدارة. وحين تتوزع المتابعة على قنوات مختلفة، تصبح رؤية الطلبات وحركة المواد وحالة المهام أقل وضوحًا.",
            subs: [
              { title: "مساحة مناسبة لكل مسؤولية", chip: "التشغيل", text: "الهدف هو عرض المهام والطلبات ومعلومات المخزون بصورة منظمة داخل PMS، مع إبقاء إجراءات الموارد البشرية داخل HRMS دون خلط الوظائف." },
            ],
          },
          {
            title: "الحل — منصتان متخصصتان لبيئة المقاولات",
            text: "يخصص BDCC HRMS واجهاته للموظفين وإجراءات الإدارة، بينما يجمع Bin Delamah PMS متابعة المشاريع والمهام والطلبات والمستودعات والمستخدمين في بيئة تشغيلية مستقلة.",
            subs: [
              { title: "كل فريق يرى ما يحتاجه", chip: "الأنظمة", text: "تشمل واجهات HRMS الإجازات والملاحظات ومؤشرات الموظفين، ويعرض PMS حالات المشاريع والطلبات وتنبيهات المخزون وصفحات العملاء والمستخدمين وخيارات التقارير." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["فرقك تحتاج", "رؤية أوضح لعملها؟"],
          text: "حدّثنا عن إجراءات الموظفين أو المشاريع لديك، لنناقش منصة مصممة بحسب طريقة عمل فريقك.",
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
