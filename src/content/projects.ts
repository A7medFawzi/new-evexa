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
        intro: "A computer store where customers can describe what they need, in Arabic or English, and get the right machine back.",
        tags: ["Commerce AI", "RAG"],
        facts: [
          { label: "Services", value: "Commerce Platform & AI Modules" },
          { label: "Category", value: "AI-Powered E-Commerce" },
          { label: "Client", value: "Albetar Store" },
        ],
        button: { label: "Visit Live Store", href: "https://albetarstore.com/" },
        blocks: [
          {
            title: "Analysis — How People Actually Buy Hardware",
            text: "Most customers don’t shop by model number. They come with a budget and a job in mind: editing, gaming, an office of ten. We spent time on how they search, and on how the team runs orders and stock behind the scenes.",
            subs: [
              { title: "Finding the Product", chip: "COMMERCE", text: "• Clear categories and filters for thousands of specs.\n• Build-your-own PC with automatic compatibility checks.\n• Side-by-side specs before anyone pays." },
              { title: "Running the Store", text: "Orders, stock, payments and shipping live in the same platform, so what the customer sees and what the warehouse has never drift apart." },
            ],
          },
          {
            title: "Challenge — “I need a laptop for design”",
            text: "Type that into a normal store search and you get nothing, or the wrong thing. Customers write the way they talk, often mixing Arabic and English, and keyword search can’t follow.",
            subs: [
              { title: "Search That Understands Intent", chip: "AI SEARCH", text: "The store had to understand what the customer is trying to do, match it to real specifications, and only show products that are actually in the catalog, without making the journey longer." },
            ],
          },
          {
            title: "Solution — Meet BETO",
            text: "We built a bilingual store with an assistant, BETO, at its center. Customers ask in their own words; BETO asks a follow-up if needed and suggests machines that fit, from live store data.",
            subs: [
              { title: "Smarter Search, Smarter Decisions", chip: "RAG", text: "Semantic search ranks products by the specs that matter for the task. On the management side, the team gets review sentiment, KPI summaries and revenue forecasts, so restocking and promotions are based on data, not guesswork." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Customers Can’t Find", "What They’re Looking For?"],
          text: "Tell us about your store. We’ll show you what an assistant like BETO could do with your catalog.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "البيطار",
        cardTag: "تجارة ذكية",
        title: ["البيطار", "تجارة ذكية"],
        intro: "متجر أجهزة كمبيوتر يكتب فيه العميل احتياجه بكلامه، بالعربي أو بالإنجليزي، ويوصله الجهاز المناسب.",
        tags: ["تجارة ذكية", "RAG"],
        facts: [
          { label: "الخدمات", value: "منصة تجارة ووحدات ذكاء اصطناعي" },
          { label: "الفئة", value: "تجارة إلكترونية مدعومة بالذكاء" },
          { label: "العميل", value: "متجر البيطار" },
        ],
        button: { label: "زيارة المتجر", href: "https://albetarstore.com/" },
        blocks: [
          {
            title: "التحليل — كيف يشتري الناس الأجهزة فعلًا",
            text: "أغلب العملاء ما يعرفون اسم الموديل. يجون بميزانية وشغل محدد: مونتاج، ألعاب، أو مكتب لعشرة موظفين. درسنا طريقة بحثهم، وكيف يدير الفريق الطلبات والمخزون من الخلف.",
            subs: [
              { title: "الوصول للمنتج", chip: "التجارة", text: "• فئات وفلاتر واضحة لآلاف المواصفات.\n• تجميع جهاز مخصص مع فحص تلقائي لتوافق القطع.\n• مقارنة المواصفات جنبًا إلى جنب قبل الدفع." },
              { title: "إدارة المتجر", text: "الطلبات والمخزون والدفع والشحن في نفس المنصة، فاللي يشوفه العميل دايمًا مطابق للموجود فعلًا في المستودع." },
            ],
          },
          {
            title: "التحدي — «أبغى لابتوب للتصميم»",
            text: "لو كتبتها في بحث متجر عادي، يا ما يطلع شي، يا يطلع شي غلط. العميل يكتب مثل ما يتكلم، وأحيانًا يخلط عربي وإنجليزي، والبحث بالكلمات ما يلحقه.",
            subs: [
              { title: "بحث يفهم المقصود", chip: "بحث ذكي", text: "كان لازم المتجر يفهم وش يبي العميل يسوي، ويربطه بمواصفات حقيقية، ويعرض بس المنتجات الموجودة فعلًا، بدون ما تطول رحلة الشراء." },
            ],
          },
          {
            title: "الحل — تعرّف على BETO",
            text: "بنينا متجرًا بلغتين، وفي قلبه مساعد اسمه BETO. يسأله العميل بكلامه، فيسأل سؤال توضيحي لو احتاج، ويقترح الأجهزة المناسبة من بيانات المتجر الحية.",
            subs: [
              { title: "بحث أذكى وقرارات أوضح", chip: "RAG", text: "البحث الدلالي يرتب المنتجات حسب المواصفات اللي تهم الاستخدام. ومن جهة الإدارة، يشوف الفريق تحليل آراء العملاء وملخص المؤشرات وتوقعات الإيرادات، فتكون قرارات المخزون والعروض مبنية على بيانات." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["عملاؤك ما يلاقون", "اللي يدورون عليه؟"],
          text: "كلمنا عن متجرك، ونوريك وش ممكن يسوي مساعد مثل BETO مع منتجاتك.",
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
        intro: "A legal workspace where a lawyer uploads a case file and starts from a first draft, not a blank page.",
        tags: ["LegalTech", "AI Workflows"],
        facts: [
          { label: "Focus", value: "Legal AI & Case Workflows" },
          { label: "Category", value: "LegalTech Platform" },
          { label: "Platform", value: "Mohami Smart" },
        ],
        button: { label: "Visit Live Platform", href: "https://mohamy-smart.com/" },
        blocks: [
          {
            title: "Analysis — A Lawyer’s Day, Up Close",
            text: "We followed how a case actually moves: the file arrives, someone reads it, facts get pulled out, deadlines get tracked, a memo gets written. Most of it happened across folders, email and memory.",
            subs: [
              { title: "Cases & Clients", chip: "WORKFLOW", text: "• Every case, client and file in one place.\n• Hearings and deadlines on one calendar.\n• A dashboard of what’s open, closed or on hold." },
              { title: "Documents in Context", text: "Contracts, rulings and drafts stay attached to their case, so nobody has to ask which version is the latest." },
            ],
          },
          {
            title: "Challenge — Reading the Same File Three Times",
            text: "Before writing a single line, a lawyer reads the contract to understand it, again to pull the facts, and again to build the argument. That’s where the hours go.",
            subs: [
              { title: "Let the Lawyer Do the Law", chip: "LEGAL AI", text: "The goal was to take the reading and sorting off their plate, while keeping every fact traceable to the original document, so the lawyer can check it in seconds." },
            ],
          },
          {
            title: "Solution — From Upload to Memo",
            text: "Upload the document and Mohami Smart pulls out the parties, dates and facts, analyzes the legal position, suggests claims and defenses, and prepares a draft memo, in Arabic.",
            subs: [
              { title: "The Lawyer Has the Final Word", chip: "HUMAN REVIEW", text: "Every step is shown and editable: the extracted facts, the analysis, each claim. The lawyer reviews, adjusts and approves. The platform prepares; the professional decides." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Your Team Spends Hours", "Reading Documents?"],
          text: "Tell us what kind of files you work with. We’ll show you how much of that reading AI can take on.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "محامي سمارت",
        cardTag: "تقنية قانونية",
        title: ["محامي سمارت"],
        intro: "منصة قانونية يرفع فيها المحامي ملف القضية، ويبدأ من مسودة جاهزة بدل صفحة فاضية.",
        tags: ["ذكاء قانوني", "إدارة القضايا"],
        facts: [
          { label: "المجال التقني", value: "ذكاء قانوني وإدارة قضايا" },
          { label: "التصنيف", value: "منصة تقنية قانونية" },
          { label: "المنصة", value: "محامي سمارت" },
        ],
        button: { label: "زيارة المنصة", href: "https://mohamy-smart.com/" },
        blocks: [
          {
            title: "التحليل — يوم المحامي من قريب",
            text: "تابعنا كيف تمشي القضية فعلًا: يوصل الملف، أحد يقرأه، تُستخرج الوقائع، تُتابع المواعيد، وتُكتب المذكرة. وأغلب هذا كان موزعًا بين المجلدات والإيميل والذاكرة.",
            subs: [
              { title: "القضايا والموكلون", chip: "مسار العمل", text: "• كل قضية وموكل وملف في مكان واحد.\n• الجلسات والمواعيد في تقويم واحد.\n• لوحة توضح المفتوح والمغلق والمؤجل." },
              { title: "المستندات في مكانها", text: "العقود والأحكام والمسودات مرتبطة بقضيتها، فما يحتاج أحد يسأل: وين آخر نسخة؟" },
            ],
          },
          {
            title: "التحدي — قراءة نفس الملف ثلاث مرات",
            text: "قبل ما يكتب سطر واحد، يقرأ المحامي العقد مرة ليفهمه، ومرة ليستخرج الوقائع، ومرة ليبني الدفوع. وهنا تروح الساعات.",
            subs: [
              { title: "خلّ المحامي يركّز على القانون", chip: "ذكاء قانوني", text: "الهدف كان نشيل عنه القراءة والفرز، مع إن كل معلومة تبقى مربوطة بمكانها في المستند الأصلي، يتأكد منها بثواني." },
            ],
          },
          {
            title: "الحل — من رفع الملف إلى المذكرة",
            text: "يرفع المحامي المستند، فيستخرج محامي سمارت الأطراف والتواريخ والوقائع، ويحلل الموقف القانوني، ويقترح الطلبات والدفوع، ويجهز مسودة المذكرة بالعربي.",
            subs: [
              { title: "الكلمة الأخيرة للمحامي", chip: "مراجعة بشرية", text: "كل خطوة واضحة وقابلة للتعديل: الوقائع، والتحليل، وكل طلب. المحامي يراجع ويعدل ويعتمد. المنصة تجهّز، والمختص يقرر." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["فريقك يقضي ساعات", "في قراءة المستندات؟"],
          text: "قل لنا وش نوع الملفات اللي تشتغلون عليها، ونوريك كم من هالقراءة يقدر الذكاء الاصطناعي يشيلها عنكم.",
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
        intro: "Two systems for a contracting company: one for its people, one for its sites. Paper and spreadsheets out, one source of truth in.",
        tags: ["HRMS", "PMS"],
        facts: [
          { label: "Services", value: "Custom Business Platforms" },
          { label: "Category", value: "Enterprise Operations" },
          { label: "Client", value: "Bin Delamah" },
        ],
        button: { label: "Discuss Your Project", href: "/contact" },
        blocks: [
          {
            title: "Analysis — Two Very Different Problems",
            text: "The HR office and the construction sites have different users, data and approval paths. Forcing both into one tool would have served neither, so we built two systems.",
            subs: [
              { title: "People & Admin", chip: "HRMS", text: "• Employee files and who works on which project.\n• Fleet, finance requests and documents.\n• Access by role, across the group’s companies." },
              { title: "Sites & Materials", text: "On the projects side: tasks, warehouses, material requests and movements, BOQ quantities, gate passes and the reports management asks for every week." },
            ],
          },
          {
            title: "Challenge — “Who approved this?”",
            text: "A material request leaves the site, waits on someone’s desk, gets signed, and the steel arrives late. When requests live on paper and in chats, nobody can say where they are.",
            subs: [
              { title: "Every Request, Visible", chip: "OPS", text: "The goal: every request, approval and movement recorded with a name and a time, from HR paperwork to a truck leaving the warehouse, so the team can see what’s stuck and why." },
            ],
          },
          {
            title: "Solution — One Screen for Each Team",
            text: "BDCC HRMS runs people and admin. Bin Delamah PMS runs the sites. Each user sees only what their role needs: project managers, store keepers, file closers and admins.",
            subs: [
              { title: "From Request to Report", chip: "SYSTEMS", text: "A request is raised, approved and tracked in one flow, and every step lands in the audit history. Stock alerts flag low materials early, and reports on projects, materials and tasks are ready to export." },
            ],
          },
        ],
        cta: {
          badge: "LET’S TALK",
          title: ["Still Chasing Approvals", "on WhatsApp?"],
          text: "Tell us how requests move in your company today. We’ll show you what it looks like on one screen.",
          button: "Discuss Your Project",
          href: "/contact",
        },
      },
      ar: {
        name: "أنظمة إدارة الأعمال",
        cardTag: "إدارة العمليات",
        title: ["منصات إدارة", "العمليات"],
        intro: "نظامان لشركة مقاولات: واحد لموظفيها وواحد لمواقعها. بدل الورق والإكسل، مرجع واحد للكل.",
        tags: ["HRMS", "PMS"],
        facts: [
          { label: "الخدمات", value: "منصات أعمال مخصصة" },
          { label: "الفئة", value: "إدارة العمليات" },
          { label: "العميل", value: "بن دلامة" },
        ],
        button: { label: "ناقش مشروعك", href: "/contact" },
        blocks: [
          {
            title: "التحليل — مشكلتين مختلفتين تمامًا",
            text: "مكتب الموارد البشرية ومواقع المشاريع لكل منهم مستخدمين وبيانات وموافقات مختلفة. لو جمعناهم في أداة وحدة ما بتخدم أحد، فبنينا نظامين.",
            subs: [
              { title: "الموظفين والإدارة", chip: "HRMS", text: "• ملفات الموظفين ومين يشتغل في أي مشروع.\n• الأسطول والطلبات المالية والمستندات.\n• صلاحيات حسب الدور عبر شركات المجموعة." },
              { title: "المواقع والمواد", text: "ومن جهة المشاريع: المهام، والمستودعات، وطلبات المواد وحركتها، وجداول الكميات، وتصاريح البوابات، والتقارير اللي تطلبها الإدارة كل أسبوع." },
            ],
          },
          {
            title: "التحدي — «مين وافق على هذا؟»",
            text: "طلب مواد يطلع من الموقع، يجلس على مكتب أحد، يتوقع، والحديد يوصل متأخر. ولما تكون الطلبات بالورق وفي المحادثات، ما أحد يعرف وين وصلت.",
            subs: [
              { title: "كل طلب واضح", chip: "OPS", text: "الهدف: كل طلب وموافقة وحركة تنسجل باسم صاحبها ووقتها، من أوراق الموارد البشرية لين شاحنة تطلع من المستودع، فيشوف الفريق وش المتعطل وليش." },
            ],
          },
          {
            title: "الحل — شاشة واحدة لكل فريق",
            text: "BDCC HRMS يدير الموظفين والإدارة، وBin Delamah PMS يدير المواقع. وكل مستخدم يشوف اللي يحتاجه دوره بس: مدير المشروع، وأمين المستودع، ومسؤول إغلاق الملفات، والإدارة.",
            subs: [
              { title: "من الطلب إلى التقرير", chip: "الأنظمة", text: "الطلب يُرفع ويُعتمد ويُتابع في مسار واحد، وكل خطوة تنحفظ في سجل المراجعة. وتنبيهات المخزون تنبه على نقص المواد بدري، وتقارير المشاريع والمواد والمهام جاهزة للتصدير." },
            ],
          },
        ],
        cta: {
          badge: "لنتحدث",
          title: ["لسه تلاحقون الموافقات", "على الواتساب؟"],
          text: "قل لنا كيف تمشي الطلبات عندكم اليوم، ونوريك كيف تصير في شاشة وحدة.",
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
