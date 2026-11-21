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
        title: ["From a Need to", "the Right Hardware."],
        intro: "A hardware e-commerce platform that brings product discovery and workstation configuration together with BETO, a shopping assistant that helps customers discuss their requirements.",
        seo: { title: "Albetar | BETO, Hardware Configuration & Commerce AI", description: "Explore the Albetar platform, featuring BETO, workstation configuration, compatibility notices and store operations analytics." },
        tags: ["BETO", "Hardware Configuration", "Store Analytics"],
        facts: [
          { label: "Services", value: "AI & Platform Development" },
          { label: "Category", value: "Intelligent Commerce" },
          { label: "Client", value: "Albetar Trading & Retail" },
        ],
        button: { label: "Visit Live Store", href: "https://albetarstore.com/" },
        blocks: [
          {
            title: "How customers choose hardware",
            text: "Customers often know the software they use and what they can spend, but not the exact machine they need. Store teams also need practical tools for maintaining products and monitoring operations.",
            subs: [
              { title: "Configuration with context", chip: "SHOPPING EXPERIENCE", text: "The workstation configurator displays memory and storage alternatives, their prices and selection states, alongside compatibility indicators. Customers can review changes before proceeding.\n• RAM and storage alternatives.\n• Price visibility while selecting.\n• Compatibility-related notices." },
              { title: "Visibility for store teams", text: "Beyond the storefront, the platform has administration areas for products, orders, reviews and promotions, plus dashboards with operational summaries and revenue forecasting views." },
            ],
          },
          {
            title: "A requirement is not a model number",
            text: "“I need a workstation for design within my budget” describes an outcome, not a product code. Without useful guidance, comparing systems and compatible components becomes unnecessarily difficult.",
            subs: [
              { title: "Make the path to selection clearer", chip: "THE CHALLENGE", text: "The design connects natural customer questions with actual product specifications while keeping choices, pricing and compatibility information available for review." },
            ],
          },
          {
            title: "BETO meets a configurable store",
            text: "BETO provides a conversational entry point. Product and configuration pages then show concrete choices, while the store’s administration area supports day-to-day management and insight.",
            subs: [
              { title: "Two sides of the same experience", chip: "THE BUILD", text: "The platform combines the BETO chat interface, workstation configuration and compatibility notices with product, order and promotions management, plus AI-assisted summaries and forecasts." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Are Customers Struggling", "to Find the Right Product?"],
          text: "Tell us how your catalog works. We’ll explore a guided shopping and configuration experience for your business.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "البيطار",
        cardTag: "تجارة ذكية",
        title: ["من الاحتياج", "إلى الجهاز", "المناسب."],
        intro: "متجر إلكتروني للأجهزة وقطع الكمبيوتر يتيح للعميل استكشاف المنتجات وتخصيص مكونات جهازه، مع مساعد BETO الذي يدعم الحوار حول الاحتياج والاختيار.",
        seo: { title: "البيطار | BETO وتخصيص الأجهزة والتجارة الذكية", description: "مشروع البيطار: مساعد BETO، تخصيص أجهزة الكمبيوتر، مؤشرات توافق المكونات، وإدارة وتحليلات المتجر." },
        tags: ["BETO", "تخصيص الأجهزة", "تحليل المتجر"],
        facts: [
          { label: "الخدمات", value: "تطوير منصات وتطبيقات الذكاء الاصطناعي" },
          { label: "المجال", value: "التجارة الإلكترونية الذكية" },
          { label: "العميل", value: "البيطار للتجارة والتجزئة" },
        ],
        button: { label: "زيارة المتجر", href: "https://albetarstore.com/" },
        blocks: [
          {
            title: "فهم طريقة اختيار الأجهزة",
            text: "العميل غالبًا يعرف ما يريد إنجازه وميزانيته، لكنه قد لا يعرف اسم الجهاز أو مواصفاته المناسبة. وفريق المتجر يحتاج في الوقت نفسه إلى أدوات واضحة لإدارة المنتجات ومتابعة الأداء.",
            subs: [
              { title: "تخصيص يمكن مراجعته", chip: "تجربة الشراء", text: "تُظهر واجهة تكوين الجهاز بدائل الذاكرة والتخزين وأسعارها، مع حالة الاختيار ومؤشرات التوافق. يرى العميل ما تغيّر في التكوين قبل أن يُكمل الطلب.\n• بدائل RAM والتخزين.\n• إظهار التكلفة مع الاختيار.\n• تنبيهات مرتبطة بالتوافق." },
              { title: "رؤية لفريق المتجر", text: "إلى جانب واجهة التسوق، تتضمن المنصة صفحات لإدارة المنتجات والطلبات والتقييمات والعروض، ولوحات تلخص بيانات التشغيل وتعرض توقعات الإيرادات." },
            ],
          },
          {
            title: "عندما يصف العميل احتياجه لا رقم المنتج",
            text: "طلب مثل «أحتاج محطة عمل للتصميم بميزانية محددة» يوضح الغرض، لكنه لا يحدد جهازًا بعينه. وقد تتحول المقارنة بين المكونات إلى عملية مربكة دون إرشاد ومعلومات توافق واضحة.",
            subs: [
              { title: "تقليل المسافة بين السؤال والاختيار", chip: "التحدي", text: "المطلوب ربط لغة العميل اليومية ببيانات المنتجات الفعلية، وإبقاء الأسعار والمواصفات واختيارات المكونات أمامه بصورة يمكن فهمها والتحقق منها." },
            ],
          },
          {
            title: "BETO وتخصيص الجهاز في تجربة واحدة",
            text: "يتيح BETO للعميل طرح الأسئلة حول احتياجه، بينما تعرض صفحات المنتج وتكوينه الخيارات المتاحة. ويستكمل جانب الإدارة التجربة بأدوات للمتابعة وقراءة أداء المتجر.",
            subs: [
              { title: "مساعدة العميل والفريق دون تعقيد", chip: "ما تم بناؤه", text: "تجمع المنصة بين محادثة BETO، وتكوين الأجهزة مع مؤشرات التوافق، وإدارة المنتجات والطلبات والعروض، وملخصات وتوقعات ذكية داخل لوحة الإدارة." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["هل يجد عملاؤك صعوبة", "في اختيار المنتج المناسب؟"],
          text: "احكِ لنا عن منتجاتك وطريقة الشراء الحالية، ولنناقش تجربة بحث وتخصيص تناسب متجرك.",
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
        title: ["From Case Documents", "to a Reviewable Draft."],
        intro: "A legal workspace that brings cases, clients, documents and hearings together, with AI-assisted steps for fact review and draft preparation while lawyers retain professional control.",
        seo: { title: "Mohami Smart | Case Management & AI-Assisted Legal Work", description: "Explore Mohami Smart’s case management, fact review, AI-assisted legal workflows, drafting support and hearing calendar." },
        tags: ["Case Management", "Document Review", "Draft Preparation"],
        facts: [
          { label: "Services", value: "Legal Platform & AI Assistance" },
          { label: "Category", value: "LegalTech" },
          { label: "Client", value: "EGY Legal for Smart Technology" },
        ],
        button: { label: "Visit Live Platform", href: "https://mohamy-smart.com/" },
        blocks: [
          {
            title: "Understanding a lawyer’s daily workflow",
            text: "A case is more than a PDF. It involves a client, facts, supporting documents, hearings and different procedural routes—all of which need context before legal analysis begins.",
            subs: [
              { title: "Cases and clients", chip: "PRACTICE MANAGEMENT", text: "The platform provides dedicated case and client areas, bringing records and related work into a structured legal workspace.\n• Case and client records.\n• Documents in context.\n• Case-specific workflows." },
              { title: "Schedules and supporting tools", text: "A hearing calendar supports follow-up. The platform also includes document areas, contract drafting and a legal library of practice resources." },
            ],
          },
          {
            title: "Turning documents into legal work",
            text: "Uploading a case file is only the start. Facts need to be reviewed, then connected to analysis, arguments and requests before a draft can be prepared. Unclear stages make review harder.",
            subs: [
              { title: "Build professional review into the flow", chip: "THE CHALLENGE", text: "The goal was a sequence where lawyers could inspect facts and suggested content, make selections and edit their work before producing a draft." },
            ],
          },
          {
            title: "A guided, reviewable drafting workflow",
            text: "The workflow starts with case details and supporting documents, then moves through fact review, legal analysis, arguments, requests and preparation of a working draft.",
            subs: [
              { title: "The lawyer stays in control", chip: "THE BUILD", text: "Lawyers review the facts, select and edit suggested arguments, then prepare the draft and export it to Word. The platform also includes a conversational legal assistant and tools for clients, cases and scheduling." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Are Case Files Spread", "Across Too Many Tools?"],
          text: "Let’s explore a legal workspace built around your team’s workflow, with professional review at its core.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "محامي سمارت",
        cardTag: "تقنية قانونية",
        title: ["من ملف القضية", "إلى مسودة", "قابلة للمراجعة."],
        intro: "منصة تجمع القضايا والموكلين والمستندات والجلسات، وتضيف مسارًا مساعدًا لتحليل الوقائع وإعداد المسودات القانونية مع بقاء المراجعة والقرار للمحامي.",
        seo: { title: "محامي سمارت | إدارة القضايا والمساعدة القانونية الذكية", description: "تعرّف على محامي سمارت: إدارة القضايا والموكلين، مراجعة الوقائع، مسارات التحليل وإعداد المسودات القانونية." },
        tags: ["إدارة القضايا", "تحليل المستندات", "صياغة مسودات"],
        facts: [
          { label: "الخدمات", value: "منصة قانونية ومساعد ذكي" },
          { label: "المجال", value: "تقنية قانونية" },
          { label: "العميل", value: "إيجي ليجال للتكنولوجيا الذكية" },
        ],
        button: { label: "زيارة المنصة", href: "https://mohamy-smart.com/" },
        blocks: [
          {
            title: "فهم العمل اليومي للمحامي",
            text: "القضية ليست ملف PDF منفصلًا؛ هناك موكل ووقائع ومستندات وجلسات وإجراءات مختلفة. وتحتاج هذه العناصر إلى تنظيم واضح قبل البدء في التحليل أو الصياغة.",
            subs: [
              { title: "القضايا والموكلون", chip: "إدارة المكتب", text: "تخصص المنصة ملفات للموكلين والقضايا ومعلوماتها، مع لوحة تجمع مساحات العمل المرتبطة بكل منها بدل توزيع المتابعة بين أدوات متعددة.\n• ملفات قضايا وموكلين.\n• إدارة المستندات.\n• مسارات مرتبطة بكل قضية." },
              { title: "المواعيد والعمل المرتبط", text: "تضم مساحة العمل تقويمًا للجلسات والمتابعات، إلى جانب أدوات للمستندات وصياغة العقود ومكتبة قانونية تشمل نماذج وموارد مساعدة." },
            ],
          },
          {
            title: "تحويل المستند إلى عمل قانوني مترابط",
            text: "رفع الملف لا يكفي. يجب قراءة الوقائع ومراجعتها، ثم بناء التحليل والدفوع والطلبات قبل صياغة المسودة. وأي خطوة غير واضحة تزيد عبء التحقق على المحامي.",
            subs: [
              { title: "المراجعة جزء من المسار", chip: "التحدي", text: "كان المطلوب تنظيم المراحل بوضوح، مع إتاحة فحص الوقائع والمقترحات وتعديلها قبل أن تدخل في مستند قانوني نهائي قابل للمراجعة." },
            ],
          },
          {
            title: "مساعدة قانونية ضمن خطوات واضحة",
            text: "يبدأ المسار بإضافة بيانات القضية ومستنداتها، ثم يمر بمراجعة الوقائع والتحليل القانوني والدفوع والطلبات وصولًا إلى إعداد مسودة يمكن تحريرها ومراجعتها.",
            subs: [
              { title: "المحامي يحتفظ بالقرار", chip: "ما تم بناؤه", text: "يطّلع المحامي على الوقائع، ويراجع الدفوع المقترحة ويختار منها، ثم يعدّ المسودة ويصدّرها بصيغة Word. وتتضمن المنصة أيضًا مساعدًا قانونيًا للمحادثة، وأدوات للقضايا والموكلين والمواعيد." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["هل تتوزع ملفات القضايا", "بين أدوات كثيرة؟"],
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
        title: ["One System for People.", "Another for Projects."],
        intro: "Two custom platforms for a contracting business: BDCC HRMS for employee and administrative work, and Bin Delamah PMS for projects, tasks, materials, warehouses and reporting.",
        seo: { title: "Bin Delamah | HR & Project Operations Platforms", description: "Discover BDCC HRMS for employee administration and Bin Delamah PMS for project tracking, materials, warehouses and reporting." },
        tags: ["HRMS", "PMS", "Operational Reporting"],
        facts: [
          { label: "Services", value: "Custom Business Platforms" },
          { label: "Category", value: "HR & Project Operations" },
          { label: "Client", value: "Bin Delamah Cont. Co." },
        ],
        button: { label: "Discuss Your Project", href: "/contact" },
        blocks: [
          {
            title: "Different teams, different needs",
            text: "HR teams maintain employee records, leave and administrative follow-ups. Project teams track tasks, materials and warehouses. Each needed a workspace suited to its responsibilities.",
            subs: [
              { title: "People and administration", chip: "BDCC HRMS", text: "HRMS screens include employee records and indicators, nationality and Saudization views, leave and notes.\n• Employee records and indicators.\n• Leave and notes.\n• Administrative follow-ups." },
              { title: "Projects, materials and reports", text: "PMS shows project summaries, tasks, requests and alerts, along with materials, warehouses, movements, clients, users and reporting options." },
            ],
          },
          {
            title: "Where does a task or request stand?",
            text: "A construction workflow may involve a project team, warehouse staff and administrators. When updates are spread across different channels, request and material status become harder to follow.",
            subs: [
              { title: "A clear view for each responsibility", chip: "THE CHALLENGE", text: "The aim was to organize tasks, requests and inventory information in PMS, while keeping employee administration in its own HRMS workspace." },
            ],
          },
          {
            title: "Two platforms built for contracting workflows",
            text: "BDCC HRMS covers employee and administrative views. Separately, Bin Delamah PMS organizes project summaries, tasks, requests, warehouses, users and reporting in a dedicated operational interface.",
            subs: [
              { title: "Focused screens for daily work", chip: "THE BUILD", text: "HRMS covers leave, notes and employee indicators. PMS offers project and request views, stock alerts, users, clients and report selectors." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Do Your Teams Need", "Software Built for Them?"],
          text: "Tell us how your HR or project operations run. We’ll explore a platform designed for those workflows.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "أنظمة إدارة الأعمال",
        cardTag: "إدارة العمليات",
        title: ["نظام للموظفين،", "وآخر لتشغيل", "المشاريع."],
        intro: "حلّان مخصصان لشركة مقاولات: BDCC HRMS لإدارة شؤون الموظفين والمتابعات الإدارية، ونظام Bin Delamah PMS لمتابعة المشاريع والمهام والمواد والمستودعات والتقارير.",
        seo: { title: "بن دلامة | نظام الموارد البشرية وإدارة المشاريع", description: "نظامان لبيئة المقاولات: BDCC HRMS لشؤون الموظفين وBin Delamah PMS للمشاريع والمهام والمواد والتقارير." },
        tags: ["HRMS", "PMS", "تقارير تشغيلية"],
        facts: [
          { label: "الخدمات", value: "تطوير أنظمة أعمال مخصصة" },
          { label: "المجال", value: "موارد بشرية وإدارة مشاريع" },
          { label: "العميل", value: "شركة بن دلامة للمقاولات" },
        ],
        button: { label: "ناقش مشروعك", href: "/contact" },
        blocks: [
          {
            title: "احتياجات مختلفة لفرق مختلفة",
            text: "إدارة الموارد البشرية تتعامل مع ملفات الموظفين والإجازات والمتابعات الإدارية، بينما تعمل فرق المشاريع على المهام والمواد والمستودعات. لذلك احتاج كل فريق إلى نظام يناسب عمله.",
            subs: [
              { title: "شؤون الموظفين والإدارة", chip: "BDCC HRMS", text: "تعرض واجهات HRMS بيانات الموظفين، ومؤشرات الجنسيات والسعودة، والملاحظات والإجازات.\n• سجلات ومؤشرات الموظفين.\n• الإجازات والمتابعات.\n• المتابعات الإدارية." },
              { title: "المشاريع والمواد والتقارير", text: "يعرض PMS المشاريع والمهام والطلبات والتنبيهات، ويتضمن مساحات للمواد والمستودعات والحركات، إلى جانب إدارة العملاء والمستخدمين وتقارير التشغيل." },
            ],
          },
          {
            title: "أين وصلت المهمة أو طلب المواد؟",
            text: "يتنقل العمل بين مسؤول المشروع والمستودع والإدارة. وحين تتوزع المتابعة على قنوات مختلفة، تصبح رؤية الطلبات وحركة المواد وحالة المهام أقل وضوحًا.",
            subs: [
              { title: "مساحة مناسبة لكل مسؤولية", chip: "التحدي", text: "الهدف هو عرض المهام والطلبات ومعلومات المخزون بصورة منظمة داخل PMS، مع إبقاء إجراءات الموارد البشرية داخل HRMS دون خلط الوظائف." },
            ],
          },
          {
            title: "منصتان متخصصتان لبيئة المقاولات",
            text: "يخصص BDCC HRMS واجهاته للموظفين وإجراءات الإدارة، بينما يجمع Bin Delamah PMS متابعة المشاريع والمهام والطلبات والمستودعات والمستخدمين في بيئة تشغيلية منفصلة.",
            subs: [
              { title: "كل فريق يرى ما يحتاجه", chip: "ما تم بناؤه", text: "تشمل واجهات HRMS الإجازات والملاحظات ومؤشرات الموظفين، ويعرض PMS حالات المشاريع والطلبات وتنبيهات المخزون وصفحات العملاء والمستخدمين وخيارات التقارير." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["هل تحتاج فرقك إلى", "أنظمة تناسب مهامها؟"],
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
