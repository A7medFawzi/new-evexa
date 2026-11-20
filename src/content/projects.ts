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
        intro: "An e-commerce platform for computers and components that combines the familiar online store with an AI assistant, helping customers describe what they need and explore hardware options with clearer configuration choices.",
        seo: { title: "Albetar | Commerce AI & Smart Hardware Shopping", description: "Explore Albetar’s BETO shopping assistant, configurable workstation journey, compatibility guidance and AI-assisted store analytics." },
        tags: ["Commerce AI", "RAG"],
        facts: [
          { label: "Services", value: "Commerce Platform & AI Modules" },
          { label: "AI Modules", value: "6 built into the store" },
          { label: "Client", value: "Albetar Trading & Retail" },
        ],
        button: { label: "Visit Live Store", href: "https://albetarstore.com/" },
        blocks: [
          {
            title: "Analysis — People Shop for the Work They Need to Do",
            text: "A customer may know their budget and software requirements without knowing which processor, memory capacity or workstation to choose. Meanwhile, the store team needs a practical way to manage products, orders, shipping and customer feedback.",
            subs: [
              { title: "Customer Experience", chip: "COMMERCE", text: "• Product pages with specifications and prices.\n• A workstation configuration flow for memory and storage.\n• Compatibility indicators and warnings for certain choices." },
              { title: "Store Operations", text: "Admin screens for sales, orders, shipping and products, plus reviews, offers, coupons, subscribers and linked products." },
            ],
          },
          {
            title: "Challenge — A Need Is Not a Product Code",
            text: "“I need a computer for design within my budget” is a clear request to a person, but it doesn’t contain a model number or an exact specification. Keyword matching and long filter lists alone make the right product harder to find, especially when components have to work together.",
            subs: [
              { title: "Understanding Intent", chip: "AI SEARCH", text: "The challenge was to connect what the customer means with concrete hardware choices they can review before buying." },
            ],
          },
          {
            title: "Solution — BETO Meets a Configurable Journey",
            text: "BETO gives customers a conversational starting point to explore their requirements and product options. The configuration screen then lets them review memory and storage alternatives, prices and compatibility notices. Behind the storefront, the admin area adds AI summaries and recommendations, revenue forecasting and unusual-activity indicators.",
            subs: [
              { title: "Key Capabilities", chip: "RAG", text: "• Conversational shopping that guides each choice.\n• Configurable workstations with visible pricing and compatibility.\n• Connected management for products, orders, shipping and promotions.\n• Summaries, recommendations and forecasts for the store team." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Customers Can’t Find", "the Right Product?"],
          text: "Tell us about your catalog and shopping journey. We’ll explore what a tailored search and recommendation experience could look like for your store.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "البيطار",
        cardTag: "تجارة ذكية",
        title: ["البيطار", "تجارة ذكية"],
        intro: "منصة تجارة إلكترونية للأجهزة وقطع الكمبيوتر، تجمع تجربة التسوق المعتادة مع مساعد ذكي يفهم احتياج العميل، ويعرض خيارات الأجهزة ومكوناتها بصورة أسهل للمقارنة والتخصيص.",
        seo: { title: "البيطار | مساعد تسوق ذكي ومنصة تجارة إلكترونية", description: "تعرّف على مشروع البيطار: مساعد BETO لتسهيل اختيار الأجهزة، وتخصيص المكونات، وتحليلات تساعد فريق المتجر على متابعة التشغيل." },
        tags: ["تجارة ذكية", "RAG"],
        facts: [
          { label: "الخدمات", value: "منصة تجارة ووحدات ذكاء اصطناعي" },
          { label: "وحدات الذكاء", value: "6 وحدات داخل المتجر" },
          { label: "العميل", value: "البيطار للتجارة والتجزئة" },
        ],
        button: { label: "زيارة المتجر", href: "https://albetarstore.com/" },
        blocks: [
          {
            title: "التحليل — شراء الأجهزة يبدأ بالاستخدام، لا باسم الموديل",
            text: "قد يعرف العميل ميزانيته والبرنامج الذي يعمل عليه، لكنه لا يعرف المعالج أو سعة الذاكرة المناسبة. وفي المقابل، يحتاج فريق المتجر إلى إدارة المنتجات والطلبات والشحن والتقييمات من مكان واضح.",
            subs: [
              { title: "تجربة الشراء", chip: "التجارة", text: "• صفحات منتجات تعرض المواصفات والأسعار.\n• مسار لتخصيص أجهزة العمل باختيار الذاكرة ووحدات التخزين.\n• مؤشرات للتوافق وتنبيهات مرتبطة ببعض الاختيارات." },
              { title: "تشغيل المتجر", text: "لوحات لإدارة المبيعات والطلبات والشحن والمنتجات، إلى جانب التقييمات والعروض والقسائم والمشتركين والمنتجات المرتبطة." },
            ],
          },
          {
            title: "التحدي — عندما يكتب العميل احتياجه بدل رقم المنتج",
            text: "عبارة مثل «أحتاج جهازًا للتصميم في حدود ميزانية محددة» لا تحتوي بالضرورة على اسم جهاز أو مواصفاته الدقيقة. والاعتماد على فلاتر كثيرة أو كلمات متطابقة فقط يجعل الوصول إلى الخيار المناسب أكثر تعقيدًا، خصوصًا عند اختيار مكونات يجب أن تعمل معًا.",
            subs: [
              { title: "فهم الاحتياج", chip: "بحث ذكي", text: "كان التحدي هو الجمع بين فهم ما يريده العميل، وإظهار خيارات ومواصفات قابلة للمراجعة قبل الشراء." },
            ],
          },
          {
            title: "الحل — BETO والتخصيص في رحلة شراء واحدة",
            text: "يتيح BETO للعميل التعبير عن احتياجه بلغة طبيعية ومناقشة الاختيارات، وتُكمل صفحة تخصيص الجهاز هذه الرحلة بعرض بدائل الذاكرة والتخزين والأسعار، مع مؤشرات توضح التوافق أو الحاجة إلى مكونات إضافية. وفي الخلفية، تعرض لوحة الإدارة ملخصات وتوصيات مبنية على بيانات المتجر، ورسومًا لتوقعات الإيرادات ورصد التغيرات غير المعتادة.",
            subs: [
              { title: "ما يميز الحل", chip: "RAG", text: "• مساعد تسوق ذكي يوجّه العميل أثناء الاختيار.\n• تكوين جهاز مخصص مع عرض التكلفة وحالة التوافق.\n• إدارة مترابطة للمنتجات والطلبات والشحن والحملات.\n• ملخصات وتوصيات وتوقعات تساعد الإدارة على متابعة الأداء." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["عملاؤك لا يجدون", "المنتج المناسب؟"],
          text: "تواصل معنا لنناقش كيفية بناء تجربة بحث وتوصية تناسب منتجاتك وطريقة عمل متجرك.",
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
        intro: "A legal workspace that brings together cases, clients, documents and schedules, with AI tools for reviewing facts, working through legal analysis and preparing drafts, while professional review and final decisions stay with the lawyer.",
        seo: { title: "Mohami Smart | AI-Assisted Legal Workflows", description: "Discover Mohami Smart’s case management, fact review, legal document workflows, draft preparation and hearing calendar." },
        tags: ["LegalTech", "AI Workflows"],
        facts: [
          { label: "Focus", value: "Legal AI & Case Workflows" },
          { label: "Workflow", value: "5 steps, upload to memo" },
          { label: "Client", value: "EGY Legal for Smart Technology" },
        ],
        button: { label: "Visit Live Platform", href: "https://mohamy-smart.com/" },
        blocks: [
          {
            title: "Analysis — A Case Is More Than a Document Folder",
            text: "Legal work moves across clients, evidence, facts, hearings and different procedural routes. Lawyers need to keep that context together as they move from understanding a file to producing legal work.",
            subs: [
              { title: "Practice Management", chip: "WORKFLOW", text: "• A dashboard with case and client management.\n• A calendar for hearings and tasks.\n• Document pages and contract drafting." },
              { title: "Legal Resources", text: "A legal library with internal regulations, powers of attorney, an inheritance calculator and bailiff documents, alongside supporting practice tools." },
            ],
          },
          {
            title: "Challenge — Turning Files Into a Structured Process",
            text: "Uploading documents is only the start. Relevant facts have to be identified and reviewed before analysis, arguments and requests can be built on them. If these stages are opaque or hard to edit, automation creates more checking work, not less.",
            subs: [
              { title: "A Reviewable Sequence", chip: "LEGAL AI", text: "The design focused on a clear sequence in which the lawyer inspects and controls content at every stage before it becomes part of a draft." },
            ],
          },
          {
            title: "Solution — Assistance at Every Step, the Lawyer in Control",
            text: "The process starts with a case record and its documents. The interface then guides the lawyer through fact review, legal analysis, defenses, requests and memo preparation, selecting and editing content along the way, and exports the memo as an editable Word file. Several routes are supported, including defense memos and statements of claim.",
            subs: [
              { title: "Key Capabilities", chip: "HUMAN REVIEW", text: "• Case records linking data, files and workflows.\n• Fact review before any analysis is built on it.\n• Suggested defenses and requests to approve and edit.\n• A conversational legal assistant alongside practice tools." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Case Files Scattered", "Across Too Many Tools?"],
          text: "Tell us how your practice works. We’ll discuss a structured legal workspace with the right human oversight.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "محامي سمارت",
        cardTag: "تقنية قانونية",
        title: ["محامي سمارت"],
        intro: "بيئة عمل قانونية تجمع القضايا والموكلين والمستندات والمواعيد، وتضيف أدوات ذكاء اصطناعي تساعد المحامي على مراجعة الوقائع وتحليلها وصياغة المسودات، مع بقاء المراجعة المهنية والقرار النهائي للمحامي.",
        seo: { title: "محامي سمارت | إدارة القضايا والتحليل القانوني المساعد", description: "اكتشف محامي سمارت: تنظيم القضايا والموكلين، ومراجعة الوقائع والمستندات، وإعداد المسودات القانونية، ومتابعة الجلسات." },
        tags: ["ذكاء قانوني", "إدارة القضايا"],
        facts: [
          { label: "المجال التقني", value: "ذكاء قانوني وإدارة قضايا" },
          { label: "مسار العمل", value: "5 خطوات من الملف إلى المذكرة" },
          { label: "العميل", value: "إيجي ليجال للتكنولوجيا الذكية" },
        ],
        button: { label: "زيارة المنصة", href: "https://mohamy-smart.com/" },
        blocks: [
          {
            title: "التحليل — القضية أكثر من مجموعة مستندات",
            text: "العمل القانوني لا يقتصر على قراءة ملف واحد؛ فهناك موكل، ووقائع ومستندات، ومواعيد جلسات، ومسارات مختلفة بحسب نوع الإجراء. ويحتاج المحامي إلى التنقل بين هذه العناصر دون أن يفقد سياق القضية.",
            subs: [
              { title: "تنظيم المكتب", chip: "مسار العمل", text: "• لوحة تحكم وإدارة للموكلين والقضايا.\n• أجندة للجلسات والأعمال.\n• صفحات للمستندات وصياغة العقود." },
              { title: "المراجع والأدوات", text: "مكتبة قانونية تضم اللوائح الداخلية والتوكيلات وحاسبة المواريث وأوراق المحضرين، إلى جانب أدوات مساعدة ضمن مساحة العمل." },
            ],
          },
          {
            title: "التحدي — تحويل المستندات إلى عمل قانوني منظم",
            text: "الجزء الأصعب ليس رفع الملف، بل تحديد الوقائع ذات الصلة ومراجعتها، ثم بناء التحليل والدفوع والطلبات عليها. وإذا تحولت هذه الخطوات إلى مسودات يصعب تتبعها أو تعديلها، فإن التقنية تزيد عبء المراجعة بدل أن تخففه.",
            subs: [
              { title: "تسلسل قابل للمراجعة", chip: "ذكاء قانوني", text: "لذلك ركّز التصميم على تسلسل واضح للعمل، يراجع فيه المحامي النتائج والاختيارات في كل مرحلة قبل الانتقال إلى المخرجات النهائية." },
            ],
          },
          {
            title: "الحل — مساعد يشارك في التحليل، لا يحل محل المحامي",
            text: "يبدأ المسار بإضافة ملف القضية وإرفاق المستندات، ثم تنتقل الواجهة عبر مراحل متتابعة: مراجعة الوقائع، والتحليل القانوني، والدفوع، والطلبات، وإعداد المذكرة. ويستعرض المحامي المقترحات، ويختار ما يعتمده منها، ويعدّل المحتوى ضمن سير العمل، ثم تُصدَّر المذكرة بصيغة Word قابلة للتعديل. وتدعم المنصة مسارات متعددة، منها مذكرة الدفاع وصحيفة الدعوى.",
            subs: [
              { title: "ما يميز الحل", chip: "مراجعة بشرية", text: "• ملف قضية يربط البيانات بالمستندات ومسارات العمل.\n• مراجعة الوقائع قبل بناء التحليل عليها.\n• دفوع وطلبات مقترحة قابلة للاعتماد والتحرير.\n• مساعد قانوني للمحادثة إلى جانب أدوات المكتب." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["ملفات قضاياك", "موزعة في كل مكان؟"],
          text: "تواصل معنا لنناقش تصميم مساحة عمل تجمع إدارة الملفات وأدوات المساعدة القانونية ضمن إجراءات فريقك.",
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
        intro: "Two business platforms for distinct needs within a contracting company: an HR and administrative system for employee-related work, and a project-management system for tasks, materials, warehouses and reporting.",
        seo: { title: "Bin Delamah | HR & Project Operations Platforms", description: "Explore BDCC HRMS and Bin Delamah PMS: employee operations, project tracking, materials, tasks, user roles and reporting." },
        tags: ["HRMS", "PMS"],
        facts: [
          { label: "Services", value: "Custom Business Platforms" },
          { label: "Scale", value: "2,100+ active employees" },
          { label: "Client", value: "Bin Delamah Cont. Co." },
        ],
        button: { label: "Discuss Your Project", href: "/contact" },
        blocks: [
          {
            title: "Analysis — Different Teams Need Different Tools",
            text: "HR teams work with employee records, leave and administrative follow-ups. Project teams work with tasks, material requests, warehouses and movements. Bringing both into one undifferentiated interface would make everyday work harder for each group.",
            subs: [
              { title: "People — BDCC HRMS", chip: "HRMS", text: "• Employee dashboards and indicators.\n• Nationality mix and Saudization views.\n• Leave, notes and administrative follow-ups." },
              { title: "Projects — Bin Delamah PMS", text: "A dashboard of projects, tasks, pending requests and stock alerts, with dedicated areas for warehouses, materials, movements, users, clients and reports." },
            ],
          },
          {
            title: "Challenge — Where Does a Request Stand?",
            text: "In contracting, an action may start with a project team and depend on information from a storekeeper or another role. When records and follow-ups are spread across files, sheets and chats, it becomes hard to get a shared view of project progress.",
            subs: [
              { title: "A Workspace for Each Role", chip: "OPS", text: "The challenge was not a long list of features, but giving each team a workspace tailored to its responsibilities, while keeping HR processes separate from site operations." },
            ],
          },
          {
            title: "Solution — Two Focused Platforms for Daily Work",
            text: "BDCC HRMS provides employee information and dashboards, with screens for leave, notes and administrative follow-ups that users can search and filter. Bin Delamah PMS brings together project summaries, tasks, requests, inventory alerts and recent activity, with separate screens for clients, user roles and reports.",
            subs: [
              { title: "Key Capabilities", chip: "SYSTEMS", text: "• Purpose-built: HRMS for people, PMS for project execution.\n• Tasks, requests, alerts and activity in one overview.\n• Dedicated modules for materials, warehouses and movements.\n• Role-based users and reports for projects, materials and tasks." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Do Your Teams Need", "a Clearer View?"],
          text: "Tell us about your HR or project operations. We’ll explore a custom platform designed around your workflows and users.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "أنظمة إدارة الأعمال",
        cardTag: "إدارة العمليات",
        title: ["منصات إدارة", "العمليات"],
        intro: "حلّان برمجيان لشركة مقاولات، لكل منهما مستخدموه وعملياته: نظام لإدارة شؤون الموظفين والإجراءات الإدارية، ونظام لمتابعة المشاريع والمهام والمواد والمستودعات والتقارير.",
        seo: { title: "بن دلامة | أنظمة الموارد البشرية وإدارة المشاريع", description: "اطّلع على منصتي BDCC HRMS وBin Delamah PMS لإدارة بيانات الموظفين ومتابعة المشاريع والمواد والمهام والتقارير." },
        tags: ["HRMS", "PMS"],
        facts: [
          { label: "الخدمات", value: "منصات أعمال مخصصة" },
          { label: "الحجم", value: "أكثر من 2,100 موظف نشط" },
          { label: "العميل", value: "شركة بن دلامة للمقاولات" },
        ],
        button: { label: "ناقش مشروعك", href: "/contact" },
        blocks: [
          {
            title: "التحليل — فرق مختلفة تحتاج أدوات مختلفة",
            text: "تتعامل الموارد البشرية مع ملفات الموظفين والإجازات والمتابعات الإدارية، بينما تعمل فرق المشاريع على المهام وطلبات المواد والمستودعات وحركة الأصناف. وجمع هذه الاحتياجات في واجهة واحدة دون فصل واضح يجعل كل فريق يتعامل مع تفاصيل لا تخص عمله اليومي.",
            subs: [
              { title: "الموارد البشرية — BDCC HRMS", chip: "HRMS", text: "• لوحات لبيانات الموظفين ومؤشراتهم.\n• توزيع الجنسيات ونسب السعودة.\n• الإجازات والملاحظات والمتابعات الإدارية." },
              { title: "تشغيل المشاريع — Bin Delamah PMS", text: "لوحة تعرض المشاريع والمهام والطلبات والتنبيهات، مع وحدات للمستودعات والمواد والحركات والمستخدمين والعملاء والتقارير." },
            ],
          },
          {
            title: "التحدي — أين وصلت المهمة أو الطلب؟",
            text: "في بيئة المقاولات، قد يبدأ العمل لدى فريق المشروع، ثم يحتاج إلى بيانات من المستودع أو إجراء من مسؤول آخر. وعندما تتوزع هذه المعلومات بين ملفات وجداول وقنوات متابعة مختلفة، يصعب تكوين صورة موحدة عن حالة المشروع.",
            subs: [
              { title: "واجهة لكل دور", chip: "التشغيل", text: "لم يكن التحدي إنشاء قائمة طويلة من الوظائف، بل تقديم واجهة مناسبة لكل دور تجعل المشروع ومواده ومهامه وتقاريره أسهل في المتابعة، مع مسار مستقل للموارد البشرية." },
            ],
          },
          {
            title: "الحل — منصتان متخصصتان ضمن بيئة العمل",
            text: "في BDCC HRMS تظهر معلومات الموظفين ولوحات المؤشرات، مع صفحات للإجازات والملاحظات والمتابعات الإدارية يمكن البحث فيها وتصفيتها. وفي Bin Delamah PMS تجمع لوحة التشغيل المشاريع والمهام والطلبات وتنبيهات المخزون والأنشطة الأخيرة، مع صفحات لإدارة العملاء والمستخدمين وصلاحياتهم والتقارير.",
            subs: [
              { title: "ما يميز الحل", chip: "الأنظمة", text: "• فصل واضح: HRMS لشؤون الموظفين وPMS لتشغيل المشاريع.\n• مؤشرات للمهام والطلبات والتنبيهات والأنشطة.\n• وحدات للمواد والمستودعات وحركة الأصناف.\n• أدوار للمستخدمين وتقارير للمشاريع والمواد والمهام." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["فرقك تحتاج", "رؤية أوضح لعملها؟"],
          text: "حدّثنا عن إجراءات الموارد البشرية أو تشغيل المشاريع، لنناقش كيف يمكن تنظيمها في أنظمة مخصصة تناسب مستخدميها.",
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
