"use client";

/**
 * Evexa animation runtime (per page).
 *
 * Recreates every animation / interaction of the original Framer site with
 * the exact parameters extracted from its runtime bundles:
 *
 *  - Appear sequences per page (spring damping 60, stiffness 200, mass 1):
 *    badge .2s → text1 .5s → text2 .7s → body/buttons 1.1s → bottom 1.0s.
 *    About "Bottom" flips in: rotateX 0 → 30, transformPerspective 4000.
 *    Home hero background: spring(duration 3, bounce 0), scale 1.1 → 1.
 *  - Word-by-word reveal: blur(10px) + y:10 + opacity .001 → spring
 *    (stiffness 300, damping 50), stagger 0.05s/word, inView threshold 0.5,
 *    startDelay 0 / 0.2.
 *  - Scroll-linked char fill (exact original "Qt" component math):
 *    per-word progress window L/N…(L+1)/N, per-char sub-window, #666666 →
 *    #FFFFFF, chars < 40 forced #FFFFFF, offset ["start 0.75","start 0.15"],
 *    color tween 0.3s easeInOut.
 *  - Header / navigation bar: see components/layout/SiteHeader.tsx.
 *  - Real page navigation (/, /about, /portfolio, /contact, /#faq …).
 *  - Tickers, FAQ accordion, testimonial drag slider, light rays canvas,
 *    video autoplay, star spin-ins, purple ring loop.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { animate } from "framer-motion";
import { ROUTES } from "@/config/site";
import { SVG_TEMPLATES } from "@/content/svg-templates";
import { ABOUT_CARD_ICONS } from "@/content/about-card-icons";

/*
 * Container fills — the original Framer runtime fills ~199 empty
 * "framer-*-container" slots (icon tiles, card arrows ↗, logos…) with
 * SVG markup captured per breakpoint variant ("ssr-variant hidden-*"
 * signature). The captured data lives in /fills/{en,ar}.json and is
 * fetched lazily ONCE per language (never bundled: ~1.6 MB raw, gzipped
 * over the wire, cached by the browser), then applied by fillContainers.
 */

/* ------------------------------------------------------------------ */
/* lifecycle tracking — prevents cross-navigation leaks                */
/*                                                                     */
/* Every listener / infinite animation / observer created by the       */
/* runtime is registered here and released when the page effect        */
/* re-runs or unmounts. Without this, client-side navigations          */
/* accumulate listeners and rAF loops from every previously visited    */
/* page (verified: 22 addEventListener calls, no removals).            */
/* ------------------------------------------------------------------ */

let GEN = 0;
const CLEANUPS: Array<() => void> = [];

function on<E extends Event>(
  target: EventTarget,
  type: string,
  fn: (e: E) => void,
  opts?: AddEventListenerOptions | boolean
) {
  target.addEventListener(type, fn as EventListener, opts);
  CLEANUPS.push(() => target.removeEventListener(type, fn as EventListener, opts));
}

/** Register an arbitrary teardown (stop an animation, disconnect an observer…). */
function onCleanup(fn: () => void) {
  CLEANUPS.push(fn);
}

const SPRING = { type: "spring", stiffness: 200, damping: 60, mass: 1 } as const;
const WORD_SPRING = { type: "spring", stiffness: 300, damping: 50, mass: 1 } as const;

/* ------------------------------------------------------------------ */
/* per-page appear maps: [selector, delay, initialRotateX?]            */
/* ------------------------------------------------------------------ */

type AppearEntry = [string, number, number?];

const PAGE_APPEAR: Record<string, AppearEntry[]> = {
  home: [
    ['[data-framer-appear-id="16birka"]', 0.2],
    ['[data-framer-appear-id="5hbeit"]', 0.5],
    ['[data-framer-appear-id="j0exq4"]', 0.7],
    ['[data-framer-appear-id="1df8tgi"]', 1.1],
    ['[data-framer-appear-id="1jq7msv"]', 1.2],
    ['[data-framer-appear-id="vh16f5"]', 1.0],
  ],
  about: [
    ['[data-framer-appear-id="1w47gc4"]', 0.2],
    ['[data-framer-appear-id="1epm5vf"]', 0.5],
    ['[data-framer-appear-id="b6y8g6"]', 0.7],
    ['[data-framer-appear-id="2g87xj"]', 1.1],
    ['[data-framer-appear-id="1kehpu3"]', 1.0, 30],
  ],
  portfolio: [
    ['[data-framer-appear-id="127bxxk"]', 0.2],
    ['[data-framer-appear-id="1cbtiid"]', 0.5],
    ['[data-framer-appear-id="5qx8y2"]', 0.7],
    ['[data-framer-appear-id="15iea0f"]', 1.1],
    ['[data-framer-appear-id="1s8q2e8"]', 1.0],
  ],
  contact: [
    ['[data-framer-appear-id="v0gqac"]', 0.2],
    ['[data-framer-appear-id="ngp4ar"]', 0.5],
    ['[data-framer-appear-id="13ympta"]', 0.7],
    ['[data-framer-appear-id="rkm0zu"]', 1.1],
    ['[data-framer-appear-id="4t83n5"]', 1.0],
  ],
  "portfolio-lemonide-tech": [
    ['[data-framer-appear-id="1ruvc2z"]', 0.2],
    ['[data-framer-appear-id="10bkfar"]', 0.5],
    ['[data-framer-appear-id="eo4mtq"]', 1.1],
    ['[data-framer-appear-id="f76vpe"]', 1.3],
    ['[data-framer-appear-id="ktt5yz"]', 1.0],
  ],
};

// the three portfolio detail pages share the same appear ids
PAGE_APPEAR["portfolio-million-one"] = PAGE_APPEAR["portfolio-lemonide-tech"];
PAGE_APPEAR["portfolio-viper-studio"] = PAGE_APPEAR["portfolio-lemonide-tech"];

const FAQ: Array<[string, string]> = [
  [
    "Will we need new software?",
    "Not necessarily. We review the systems you use and the options for integration first.",
  ],
  [
    "Does it work in Arabic and English?",
    "Yes, where the use case requires it. We test quality using representative business content.",
  ],
  [
    "What is needed to start?",
    "A short description of the workflow or problem is enough for an initial discussion.",
  ],
  [
    "How do you handle our data?",
    "We agree on data sources, access permissions, hosting, and security requirements in scope.",
  ],
  [
    "How long does a project take?",
    "It depends on complexity, data readiness, and integrations. We propose a plan after scoping.",
  ],
  [
    "Do you also build products?",
    "Yes. Custom AI is our core focus. We also build specialized products, including Dealplier.",
  ],
];

/* Arabic FAQ (same order — the runtime pairs DOM question i with entry i) */
const FAQ_AR: Array<[string, string]> = [
  [
    "هل نحتاج إلى تغيير أنظمتنا؟",
    "ليس بالضرورة. نراجع أنظمتكم الحالية وإمكانات ربطها قبل تحديد الحل.",
  ],
  [
    "هل يدعم العربية والإنجليزية؟",
    "نعم، وفق متطلبات المشروع، مع اختبار الجودة باستخدام محتوى من بيئة العمل.",
  ],
  [
    "ما المطلوب للبدء؟",
    "يكفي وصف مختصر للإجراء أو التحدي، ثم نحدد المتطلبات معًا.",
  ],
  [
    "كيف تتعاملون مع بياناتنا؟",
    "نحدد مصادر البيانات والصلاحيات والاستضافة ومتطلبات الأمان ضمن نطاق المشروع.",
  ],
  [
    "كم يستغرق تنفيذ المشروع؟",
    "يعتمد على تعقيد الحل وجاهزية البيانات والتكاملات، ونحدد الجدول بعد دراسة النطاق.",
  ],
  [
    "هل تطوّرون منتجات أيضًا؟",
    "نعم. نركز على الحلول المخصصة، ونطوّر منتجات متخصصة من بينها Dealplier.",
  ],
];

/* About page FAQ — English (EVEXA_ABOUT_FINAL_CONTENT_EN_AR.json) */
const FAQ_ABOUT: Array<[string, string]> = [
  [
    "Do we need to replace our existing software?",
    "Not necessarily. We first review the systems you use and the integration options they offer.",
  ],
  [
    "Can the solution work in Arabic and English?",
    "Yes, when the use case requires it. We test language quality using representative business content.",
  ],
  [
    "What do you need from us to get started?",
    "A description of the process or problem is enough for an initial discussion. We can define the data and technical requirements together.",
  ],
  [
    "How do you approach data privacy and access?",
    "We agree on data sources, user permissions, hosting, and security requirements as part of the project scope.",
  ],
  [
    "How long does a project take?",
    "It depends on data readiness, complexity, and integrations. We propose a delivery plan after understanding the scope.",
  ],
  [
    "Do you offer products as well as custom AI solutions?",
    "Yes. Custom AI solutions are our core focus. We also develop specialized products such as Dealplier for B2B sales teams.",
  ],
];

/* About page FAQ — Arabic (EVEXA_ABOUT_FINAL_CONTENT_EN_AR.json) */
const FAQ_ABOUT_AR: Array<[string, string]> = [
  [
    "هل نحتاج إلى استبدال أنظمتنا الحالية؟",
    "ليس بالضرورة. نراجع الأنظمة المستخدمة وإمكانات ربطها قبل تحديد الحل.",
  ],
  [
    "هل يمكن أن يعمل الحل بالعربية والإنجليزية؟",
    "نعم، بحسب متطلبات المشروع، مع اختبار جودة الاستجابات باستخدام محتوى ممثل لبيئة العمل.",
  ],
  [
    "ما الذي تحتاجونه منّا للبدء؟",
    "يكفي وصف المشكلة أو الإجراء المراد تحسينه، ثم نحدد معًا البيانات والمتطلبات التقنية.",
  ],
  [
    "كيف تتعاملون مع خصوصية البيانات والصلاحيات؟",
    "نتفق على مصادر البيانات والصلاحيات والاستضافة ومتطلبات الأمان ضمن نطاق المشروع.",
  ],
  [
    "كم يستغرق تنفيذ المشروع؟",
    "يعتمد على جاهزية البيانات وتعقيد الحل والتكاملات. نضع خطة تنفيذ بعد فهم المتطلبات.",
  ],
  [
    "هل تقدم EVEXA منتجات إلى جانب الحلول المخصصة؟",
    "نعم. نركز على حلول الذكاء الاصطناعي المخصصة، ونطوّر كذلك منتجات متخصصة مثل Dealplier لدعم فرق مبيعات الشركات.",
  ],
];

/* Portfolio / Our Work page FAQ — English (EVEXA_OUR_WORK_CONTENT_FIT_V1_EN_AR.json) */
const FAQ_PORTFOLIO: Array<[string, string]> = [
  [
    "What kinds of projects are featured?",
    "Selected AI solutions and operational platforms created for specific business needs.",
  ],
  [
    "Is every featured project AI-powered?",
    "No. We distinguish AI capabilities from business platforms that focus on structured workflows.",
  ],
  [
    "Can a solution connect to existing systems?",
    "Depending on the systems and available access, we assess integration options at the start.",
  ],
  [
    "Can we see a project demonstration?",
    "Public examples can be shared when available. Access to private systems depends on client permission.",
  ],
  [
    "Can you explain the technical approach?",
    "We can discuss relevant design and integration choices without exposing confidential project data.",
  ],
  [
    "How do we start a similar project?",
    "Tell us about your process, users, and challenges. We will help define the initial requirements.",
  ],
];

/* Portfolio / Our Work page FAQ — Arabic (EVEXA_OUR_WORK_CONTENT_FIT_V1_EN_AR.json) */
const FAQ_PORTFOLIO_AR: Array<[string, string]> = [
  [
    "ما نوع المشاريع المعروضة؟",
    "نماذج من حلول الذكاء الاصطناعي وأنظمة تشغيل الأعمال، صُممت لاحتياجات محددة.",
  ],
  [
    "هل تعتمد جميع المشاريع على الذكاء الاصطناعي؟",
    "لا. نوضح الفرق بين المزايا الذكية والأنظمة المخصصة لتنظيم إجراءات العمل.",
  ],
  [
    "هل يمكن ربط الحل بأنظمتنا الحالية؟",
    "نقيّم إمكانات الربط حسب الأنظمة المستخدمة والصلاحيات المتاحة ومتطلبات المشروع.",
  ],
  [
    "هل يمكن الاطلاع على عرض تجريبي؟",
    "نشارك العروض المتاحة للنشر، أما الأنظمة الداخلية فتخضع لموافقة أصحابها.",
  ],
  [
    "هل يمكن معرفة التفاصيل التقنية؟",
    "يمكننا مناقشة منهجية التطوير والتكامل دون كشف بيانات أو معلومات سرية.",
  ],
  [
    "كيف نبدأ مشروعًا مشابهًا؟",
    "أخبرنا بالإجراءات والمستخدمين والتحديات، لنحدد المتطلبات الأولية معًا.",
  ],
];

/* Contact page FAQ — English (EVEXA_CONTACT_FINAL_COPY_EN_AR.json) */
const FAQ_CONTACT: Array<[string, string]> = [
  [
    "What should I include in my message?",
    "Tell us what your business is trying to improve, how the work is handled today, and what outcome you have in mind. A short description is enough to start.",
  ],
  [
    "Do I need a complete project brief?",
    "No. We can begin with an initial conversation and work through the scope, data needs, and relevant systems together.",
  ],
  [
    "Can you work with our current systems?",
    "We assess integration options based on your existing software, available access, and project requirements. Not every system supports the same connections.",
  ],
  [
    "Can I discuss a confidential project?",
    "Yes. Start with a general description. Please do not send passwords, sensitive records, or confidential files through this form; we can discuss a suitable process for sharing details.",
  ],
  [
    "Can I ask about Dealplier?",
    "Yes. Mention Dealplier in your message, or visit dealplier.com to learn about the product.",
  ],
  [
    "What happens after I submit the form?",
    "Once your submission is confirmed, our team will review it and follow up through the email address you provided.",
  ],
];

/* Contact page FAQ — Arabic (EVEXA_CONTACT_FINAL_COPY_EN_AR.json) */
const FAQ_CONTACT_AR: Array<[string, string]> = [
  [
    "ماذا أذكر في رسالتي؟",
    "اذكر ما ترغب في تحسينه في أعمالك، وكيف تُدار العملية حاليًا، والنتيجة التي تسعى إليها. يكفي وصف مختصر للبدء.",
  ],
  [
    "هل أحتاج إلى متطلبات جاهزة؟",
    "لا. يمكننا البدء بمناقشة أولية ثم تحديد نطاق العمل والبيانات والأنظمة المرتبطة بالاحتياج.",
  ],
  [
    "هل يمكن ربط الحل بأنظمتنا الحالية؟",
    "نقيّم خيارات الربط وفق الأنظمة المستخدمة والصلاحيات المتاحة ومتطلبات المشروع؛ فإمكانات التكامل تختلف من نظام إلى آخر.",
  ],
  [
    "هل يمكن مناقشة مشروع يتضمن معلومات سرية؟",
    "نعم، ابدأ بوصف عام، وتجنّب إرسال كلمات المرور أو البيانات الحساسة أو الملفات السرية عبر النموذج. ويمكننا مناقشة وسيلة مناسبة لمشاركة التفاصيل.",
  ],
  [
    "هل يمكنني الاستفسار عن Dealplier؟",
    "نعم. اذكر Dealplier في رسالتك، أو اطّلع على تفاصيل المنتج من خلال موقعه.",
  ],
  [
    "ماذا يحدث بعد إرسال النموذج؟",
    "بعد تأكيد استلام الرسالة، يراجع فريقنا طلبك ويتواصل معك عبر البريد الإلكتروني الذي أدخلته.",
  ],
];

/* Albetar case study FAQ — English (ALBETAR_CASE_FINAL_COPY_EN_AR.json) */
const FAQ_ALBETAR: Array<[string, string]> = [
  [
    "What was built for Albetar?",
    "An Arabic-first hardware commerce platform with customer shopping flows, a retail operations dashboard, and integrated AI modules for search and insights.",
  ],
  [
    "What does the AI search do?",
    "It interprets product queries in Arabic and English and uses semantic retrieval and hardware-aware ranking to surface relevant items.",
  ],
  [
    "Can shoppers configure hardware?",
    "The platform includes a device customization flow with compatibility checks for supported hardware choices.",
  ],
  [
    "How does AI support the store team?",
    "AI modules provide review analysis, business data Q&A, KPI summaries, and revenue forecasting to support day-to-day decisions.",
  ],
  [
    "Does the platform support both Arabic and English?",
    "Yes. The experience is designed bilingual with full right-to-left layout support for Arabic.",
  ],
  [
    "Can a similar solution be built for our business?",
    "We can assess your store's technical requirements, catalog complexity, and operational workflows to scope a tailored platform.",
  ],
];

/* Albetar case study FAQ — Arabic (ALBETAR_CASE_FINAL_COPY_EN_AR.json) */
const FAQ_ALBETAR_AR: Array<[string, string]> = [
  [
    "ما الذي تم بناؤه لمشروع البيطار؟",
    "منصة تجارة أجهزة كمبيوتر باللغة العربية أولًا، تتضمن مسار تسوق متكامل، ولوحة تحكم لإدارة العمليات، ووحدات ذكاء اصطناعي مدمجة للبحث والتحليل.",
  ],
  [
    "ما وظيفة البحث الذكي في المتجر؟",
    "يفهم استفسارات المنتجات بالعربية والإنجليزية، ويعتمد على البحث الدلالي وترتيب الأجهزة وفق المواصفات للوصول إلى خيارات دقيقة.",
  ],
  [
    "هل يمكن للمشتري تخصيص مواصفات الجهاز؟",
    "تتضمن المنصة مسارًا لتخصيص الأجهزة مع التحقق من توافق المكونات المدعومة.",
  ],
  [
    "كيف يساعد الذكاء الاصطناعي فريق المتجر؟",
    "تدعم الوحدات الذكية تحليل التقييمات، والاستفسار عن بيانات الأعمال، وتلخيص المؤشرات، والتنبؤ بالإيرادات للمساعدة في اتخاذ القرارات.",
  ],
  [
    "هل تدعم المنصة العربية والإنجليزية؟",
    "نعم، يتضمن المشروع واجهة باللغتين، مع دعم اتجاه العرض من اليمين إلى اليسار في العربية.",
  ],
  [
    "هل يمكن تطوير حل مشابه لشركتنا؟",
    "يمكننا دراسة احتياج شركتك وأنظمتها وبياناتها لتحديد المكونات المناسبة لحل مخصص.",
  ],
];

/* Mohami Smart case study FAQ — English (MOHAMY_SMART_FINAL_CONTENT_EN_AR.json) */
const FAQ_MOHAMY: Array<[string, string]> = [
  [
    "What is Mohami Smart?",
    "An AI-assisted legal platform with tools for managing cases and clients, analyzing documents, and preparing draft legal materials.",
  ],
  [
    "Which legal workflows does it support?",
    "The official platform describes case and client records, document uploads, judgment analysis, drafting support, and a legal AI assistant.",
  ],
  [
    "Does AI replace the lawyer’s judgment?",
    "No. Generated analysis and drafts are assistance tools; the lawyer remains responsible for reviewing the content and deciding how to use it.",
  ],
  [
    "Can it work with uploaded case documents?",
    "Yes. The documented workflow allows users to add case files and documents, then request AI-assisted analysis and drafting.",
  ],
  [
    "Is the platform focused on Egyptian law?",
    "The official documentation describes support for Egyptian legislation. Any wider jurisdictional coverage should be confirmed with the platform operator.",
  ],
  [
    "Can we discuss a similar AI workflow?",
    "Yes. Share your use case, documents, and review requirements with EVEXA so we can discuss whether a custom solution would be appropriate.",
  ],
];

/* Mohami Smart case study FAQ — Arabic (MOHAMY_SMART_FINAL_CONTENT_EN_AR.json) */
const FAQ_MOHAMY_AR: Array<[string, string]> = [
  [
    "ما هي منصة محامي سمارت؟",
    "منصة قانونية مدعومة بأدوات ذكاء اصطناعي لإدارة القضايا والموكلين، وتحليل المستندات، والمساعدة في إعداد المسودات القانونية.",
  ],
  [
    "ما العمليات القانونية التي تدعمها؟",
    "يذكر الموقع الرسمي إدارة الملفات والموكلين ورفع المستندات وتحليل الأحكام والمساعدة في الصياغة والمحادثة الذكية.",
  ],
  [
    "هل يحل الذكاء الاصطناعي محل المحامي؟",
    "لا. تظل المخرجات أدوات مساعدة، ويتحمل المحامي مسؤولية مراجعتها وتقييمها واتخاذ القرار المهني.",
  ],
  [
    "هل يمكن تحليل مستندات القضايا المرفوعة؟",
    "نعم، تتضمن رحلة الاستخدام إضافة المستندات والأحكام إلى ملف القضية، ثم طلب التحليل والصياغة بمساعدة الذكاء الاصطناعي.",
  ],
  [
    "هل تدعم المنصة التشريعات المصرية؟",
    "يوضح الموقع الرسمي أن تركيز المنصة الحالي على القوانين المصرية. ويجب التأكد من مشغلها بشأن أي تغطية قانونية لدول أخرى.",
  ],
  [
    "هل يمكن مناقشة حل مشابه لأعمالنا؟",
    "نعم. يمكنكم مشاركة طبيعة العمل والمستندات ومتطلبات المراجعة مع EVEXA لمناقشة مدى ملاءمة حل ذكاء اصطناعي مخصص.",
  ],
];

/* Business Operations Platforms case study FAQ — English (BUSINESS_OPERATIONS_FINAL_CONTENT_EN_AR.json) */
const FAQ_BUSINESS: Array<[string, string]> = [
  [
    "Are the HRMS and PMS one system?",
    "No. BDCC HRMS and Bin Delamah PMS are two distinct platforms serving separate HR and construction workflows. The published case studies do not document an integration between them.",
  ],
  [
    "What does the HRMS cover?",
    "It brings together employee records, project staffing, HR requests, fleet and finance processes, documents, and audit history.",
  ],
  [
    "What does the PMS manage?",
    "The PMS covers materials, warehouses, approvals, gate passes, BOQ tracking, and executive project reporting.",
  ],
  [
    "How is access managed?",
    "Both case studies describe role-based access. The PMS also lists row-level security, while the HRMS supports access across multiple companies.",
  ],
  [
    "Do these projects include AI features?",
    "The published case studies describe operational software, not AI functionality. We present them as examples of business-systems engineering.",
  ],
  [
    "Could we explore similar workflows?",
    "Yes. Share the operational processes you want to improve, and we can explore a practical scope. Any AI capabilities can be evaluated separately where they make sense.",
  ],
];

/* Business Operations Platforms case study FAQ — Arabic (BUSINESS_OPERATIONS_FINAL_CONTENT_EN_AR.json) */
const FAQ_BUSINESS_AR: Array<[string, string]> = [
  [
    "هل HRMS وPMS نظام واحد؟",
    "لا. هما منصتان مستقلتان؛ الأولى للموارد البشرية والعمليات الإدارية، والثانية للمشاريع الإنشائية. ولا تذكر دراستا الحالة المنشورتان وجود تكامل بينهما.",
  ],
  [
    "ما الذي يديره نظام HRMS؟",
    "يدعم ملفات الموظفين وتوزيعهم على المشاريع وإجراءات الموارد البشرية والأسطول والمالية والمستندات وسجلات المراجعة.",
  ],
  [
    "ما الذي يغطيه نظام PMS؟",
    "يشمل إدارة المواد والمستودعات والموافقات وتصاريح البوابات وتتبع جداول الكميات (BOQ) والتقارير التنفيذية.",
  ],
  [
    "كيف تُدار صلاحيات المستخدمين؟",
    "يدعم النظامان صلاحيات مبنية على الأدوار. ويذكر توثيق PMS كذلك حماية البيانات على مستوى الصفوف، بينما يدعم HRMS العمل عبر شركات متعددة.",
  ],
  [
    "هل تتضمن المنصتان مزايا ذكاء اصطناعي؟",
    "لا تتضمن دراستا الحالة المنشورتان وصفًا لمزايا ذكاء اصطناعي. نعرض المشروعين بوصفهما مثالين على تطوير أنظمة الأعمال.",
  ],
  [
    "هل يمكن مناقشة احتياج مشابه؟",
    "نعم. شاركنا طبيعة الإجراءات والتحديات التي تواجه فريقك، لنناقش نطاق الحل المناسب. وتُدرس أي إمكانات ذكاء اصطناعي بشكل مستقل عند الحاجة.",
  ],
];

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function sectionByName(root: ParentNode, name: string): HTMLElement | null {
  const els = root.querySelectorAll<HTMLElement>(
    `[data-framer-name="${name}"]`
  );
  return els.length ? els[0] : null;
}

/*
 * The About-Us support cards (framer-p4mmvm-container): the three breakpoint
 * variants of EACH card are adjacent in the DOM, so the generic DOM-order
 * cycling picks the wrong icons. Fill them by the card's Grey Linear Tag
 * text instead (Assist / Guide / Resolve), exactly as the original shows.
 */
function fixAboutCardIcons(root: ParentNode) {
  root
    .querySelectorAll<HTMLElement>(".framer-p4mmvm-container")
    .forEach((el) => {
      if (el.querySelector("svg")) return;
      const card = el.closest('[data-framer-name="Primary"]');
      if (!card) return;
      const tag = [...card.querySelectorAll("p")].find((p) =>
        /^(Assist|Guide|Resolve)$/.test(p.textContent?.trim() || "")
      );
      const fill = tag ? ABOUT_CARD_ICONS[tag.textContent!.trim()] : null;
      if (fill) el.innerHTML = fill;
    });
}

/* ------------------------------------------------------------------ */
/* SVG sprite (SSR-injected; runtime only as a fallback) + RTL glyphs  */
/* ------------------------------------------------------------------ */

function ensureSprite(root: ParentNode) {
  if (document.getElementById("svg-templates")) return;
  const holder = document.createElement("div");
  holder.id = "svg-templates";
  holder.style.display = "none";
  holder.innerHTML = SVG_TEMPLATES;
  // appended (not prepended) so :first-child/:nth-child CSS of the page
  // root is never affected by the sprite holder
  root.appendChild(holder);
}

// The Phosphor arrow-up-right (↗) on the service cards reads "backwards"
// in an RTL page — mirror it to ↖ (scaleX(-1)) so it points with the
// Arabic reading flow, matching the card's already-mirrored position.
function flipRtlArrows(root: ParentNode) {
  if (document.documentElement.dir !== "rtl") return;
  const UP_RIGHT = "M200,64V168a8,8,0,0,1-16,0V83.31L69.66";
  root.querySelectorAll<SVGPathElement>("svg path").forEach((pth) => {
    if (!(pth.getAttribute("d") || "").startsWith(UP_RIGHT)) return;
    const svg = pth.closest("svg");
    if (svg && !svg.getAttribute("style")?.includes("scaleX")) {
      svg.style.transform = "scaleX(-1)";
    }
  });
}

/*
 * Breakpoint-variant signature of an element: the nearest ancestor with an
 * "ssr-variant" class contributes its sorted `hidden-*` classes. The fills
 * JSON keys containers by exactly this signature, so each breakpoint gets
 * its captured icon set.
 */
function variantSig(el: HTMLElement): string {
  let n: HTMLElement | null = el;
  while (n && n !== document.body) {
    const cn = n.className?.toString?.() || "";
    if (cn.includes("ssr-variant")) {
      return cn
        .split(" ")
        .filter((c) => c.startsWith("hidden-"))
        .sort()
        .join(" ");
    }
    n = n.parentElement;
  }
  return "";
}

/*
 * Lazily fetch + cache the captured container fills for one language.
 * The JSON (~1.6 MB raw, heavily gzippable) is served from /fills/ as a
 * static asset with immutable caching — never re-downloaded on navigation
 * and never part of the JS bundle.
 */
type FillsByClass = Record<string, Record<string, string[]>>;
const FILLS_CACHE: Record<string, FillsByClass | null> = {};
let FILLS_INFLIGHT: Record<string, Promise<FillsByClass | null>> = {};

function buildFills(
  data: Record<string, string[]>,
  target: FillsByClass
): void {
  Object.entries(data).forEach(([k, list]) => {
    const i = k.indexOf("|");
    const cls = k.slice(0, i);
    const sig = k.slice(i + 1);
    (target[cls] ||= {})[sig] = list;
  });
}

function loadFills(lang: SiteLang): Promise<FillsByClass | null> {
  if (FILLS_CACHE[lang]) return Promise.resolve(FILLS_CACHE[lang]);
  FILLS_INFLIGHT[lang] ||= fetch(`/fills/${lang}.json`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((data: Record<string, string[]>) => {
      const target: FillsByClass = {};
      buildFills(data, target);
      FILLS_CACHE[lang] = target;
      return target;
    })
    .catch(() => {
      FILLS_CACHE[lang] = null;
      return null;
    })
    .finally(() => {
      delete FILLS_INFLIGHT[lang];
    });
  return FILLS_INFLIGHT[lang];
}

/*
 * Fill empty "framer-*-container" slots with their captured SVG content —
 * the icon tiles, service-card arrows (↗) and logo marks missing from the
 * static export. Consumes the fills per (class, variant) in DOM order: the
 * SSR markup order matches the original site, so the Nth empty slot gets
 * the Nth captured fill.
 */
function fillContainers(
  root: ParentNode,
  fillsByClass: FillsByClass | null
): void {
  if (!fillsByClass) return;

  const counters = new Map<string, number>();
  root.querySelectorAll<HTMLElement>('div[class*="-container"]').forEach(
    (el) => {
      const cls = (
        el.className.toString().match(/framer-[\w-]+-container/) || [""]
      )[0];
      if (
        !cls ||
        // glow canvases are painted by the LightRays painter instead
        (cls in LIGHT_RAYS_HOSTS)
      )
        return;
      const bySig = fillsByClass[cls];
      if (!bySig) return;

      const needFill =
        !el.querySelector("svg,img,video,canvas,iframe,source") &&
        (el.textContent || "").trim().length === 0;
      if (!needFill) return;

      const sig = variantSig(el);
      const list =
        bySig[sig] ?? bySig[""] ?? Object.values(bySig)[0] ?? [];
      if (!list.length) return;

      const ck = cls + "|" + sig;
      const idx = counters.get(ck) ?? 0;
      counters.set(ck, idx + 1);
      el.innerHTML = list[idx % list.length];
    }
  );
}

/* ------------------------------------------------------------------ */
/* word-by-word reveal                                                 */
/* ------------------------------------------------------------------ */

function isFramerToken(el: Element): boolean {
  if (el.tagName !== "SPAN") return false;
  const s = (el as HTMLElement).style;
  return s.opacity === "0.001" && (s.filter ?? "").includes("blur");
}

function setupWordReveal(root: ParentNode) {
  /*
   * The original Framer runtime only applies the word-appear effect to text
   * components that carry it — and it pre-tokenizes EXACTLY those in the SSR
   * HTML (spans with opacity 0.001 + blur). Every other text ships plain and
   * never animates. So we only animate pre-tokenized elements: no guessing,
   * no over-animation, identical to the original.
   */
  const targets: HTMLElement[] = [];
  const seen = new Set<Element>();

  root
    .querySelectorAll<HTMLElement>("section p, section h1, section h2, section h3, section h4")
    .forEach((el) => {
      if (seen.has(el)) return;
      if ([...targets].some((t) => t !== el && t.contains(el))) return;
      const framerTokens = [...el.querySelectorAll<HTMLElement>("span")].filter(isFramerToken);
      if (framerTokens.length === 0) return; // no effect configured → static text
      seen.add(el);
      targets.push(el);
    });

  targets.forEach((el, idx) => {
    const words = [...el.querySelectorAll<HTMLElement>("span")].filter(isFramerToken);
    if (!words.length) return;
    const startDelay = idx % 2 === 0 ? 0 : 0.2;

    // Choose an observable element + threshold that can actually trigger:
    // - the paragraph itself when it has a box (normal case);
    // - a rendered descendant when the paragraph is display:contents
    //   (zero box, never intersects);
    // - threshold 0 when the only box available is huge (tall section).
    const vh = window.innerHeight || 800;
    let obs: HTMLElement = el;
    let threshold = 0.5;
    if (obs.getBoundingClientRect().height === 0) {
      const desc = el.querySelector<HTMLElement>("span");
      if (desc && desc.getBoundingClientRect().height > 0) {
        obs = desc;
      } else {
        let node = el.parentElement;
        while (
          node &&
          node !== document.body &&
          (node.getBoundingClientRect().height === 0 ||
            node.getBoundingClientRect().height > vh * 1.5)
        ) {
          node = node.parentElement;
        }
        obs = node && node !== document.body ? node : el;
      }
    }
    if (obs.getBoundingClientRect().height > vh * 1.5) threshold = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          onCleanup(() => io.disconnect());
          words.forEach((w, i) => {
            animate(
              w,
              { opacity: [0.001, 1], y: [10, 0], filter: ["blur(10px)", "blur(0px)"] },
              { ...WORD_SPRING, delay: startDelay + i * 0.05 }
            );
          });
        });
      },
      { threshold }
    );

    io.observe(obs);
  });
}

/* ------------------------------------------------------------------ */
/* per-page appear sequence                                            */
/* ------------------------------------------------------------------ */

function setupAppear(page: string, root: ParentNode) {
  const entries = PAGE_APPEAR[page];
  if (!entries) return;

  entries.forEach(([selector, delay, initialRotateX]) => {
    // Framer SSR duplicates appear elements across breakpoint variants —
    // animate every match so resize variants are never stuck hidden.
    const els = [...root.querySelectorAll<HTMLElement>(selector)];
    if (!els.length) return;

    els.forEach((el) => {
      if (initialRotateX) {
        el.style.transform = `perspective(4000px) rotateX(${initialRotateX}deg)`;
        animate(
          el,
          { opacity: [0.001, 1], rotateX: [initialRotateX, 0] },
          { ...SPRING, delay }
        );
        return;
      }

      el.style.opacity = "0.001";
      animate(el, { opacity: [0.001, 1] }, { ...SPRING, delay });
    });
  });

  // home hero background: opacity .001 + scale 1.1 → spring(duration 3, bounce 0)
  // (every breakpoint variant instance — the visible one differs per viewport)
  if (page === "home") {
    root
      .querySelectorAll<HTMLElement>('[data-framer-appear-id="cjfzm3"]')
      .forEach((bg) => {
        bg.style.opacity = "0.001";
        bg.style.transform = "scale(1.1)";
        animate(
          bg,
          { opacity: [0.001, 1], scale: [1.1, 1] },
          { type: "spring", duration: 3, bounce: 0 }
        );
      });
  }
}

/* ------------------------------------------------------------------ */
/* scroll-linked char fill (exact Framer "Qt" component)               */
/* ------------------------------------------------------------------ */

function setupScrollReveal(root: ParentNode) {
  const paragraphs = [...root.querySelectorAll<HTMLElement>("p")].filter((p) => {
    const style = p.getAttribute("style") || "";
    return style.includes("#666666") && style.includes("flex");
  });
  if (!paragraphs.length) return;

  const START_INDEX = 40; // original: transitionStartIndex 40
  const WORD_START_INDEX = 5; // word-level (Arabic): first 5 words white, mirrors EN prefix

  paragraphs.forEach((el) => {
    el.classList.add("nb-reveal-text");

    const wordSpans = [...el.children].filter(
      (c) => c.tagName === "SPAN"
    ) as HTMLElement[];
    if (!wordSpans.length) return;

    const N = wordSpans.length;
    const chars: { span: HTMLElement; start: number; end: number; index: number }[] =
      [];
    let charIndex = 0;
    let wordLevel = false;

    wordSpans.forEach((ws, L) => {
      const starting = L / N;
      const ending = (L + 1) / N;
      const cSpans = [...ws.children].filter(
        (c): c is HTMLElement => c.tagName === "SPAN" && !!(c as HTMLElement).style.color
      );
      if (!cSpans.length) {
        // Word-level paragraphs (Arabic): splitting the joined Arabic script
        // into per-char spans would break letter shaping, so the whole word
        // is the smallest safe unit — it fades 666→fff inside its own
        // window. Gradient/clip-text words (e.g. "Evexa") keep their style.
        wordLevel = true;
        const isGradient =
          !!ws.style.backgroundImage ||
          ws.style.webkitBackgroundClip === "text" ||
          ws.style.color === "transparent";
        if (!isGradient) {
          chars.push({ span: ws, start: starting, end: ending, index: L });
          ws.style.transition = "color 0.3s ease-in-out";
        }
        return;
      }
      const len = cSpans.length;
      const cr = (ending - starting) / len;
      cSpans.forEach((cs, i) => {
        chars.push({
          span: cs,
          start: starting + cr * i,
          end: starting + cr * (i + 1),
          index: charIndex + i,
        });
        cs.style.transition = "color 0.3s ease-in-out";
      });
      charIndex += len + 1;
    });

    const startIdx = wordLevel ? WORD_START_INDEX : START_INDEX;

    const mix = (t: number) => {
      const v = Math.round(0x66 + (0xff - 0x66) * t);
      return `rgb(${v}, ${v}, ${v})`;
    };

    const paint = (progress: number) => {
      chars.forEach(({ span, start, end, index }) => {
        if (index < startIdx) {
          span.style.color = "#FFFFFF";
          return;
        }
        const t = Math.min(1, Math.max(0, (progress - start) / (end - start)));
        span.style.color = mix(t);
      });
    };

    paint(0);
    // Scroll-linked progress, computed manually. framer-motion's scroll()
    // fails silently here: the Framer-exported containers are position:static,
    // so its offset math bails out (console warning "non-static position")
    // and the progress callback never fires — the text never lit up.
    // Same semantics as offset ["start 0.75", "start 0.15"]:
    //   progress 0 when the paragraph top = 75% of viewport height,
    //   progress 1 when the paragraph top = 15% of viewport height.
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, (0.75 * vh - r.top) / (0.6 * vh)));
      paint(p);
    };
    let raf = 0;
    const onScrollPaint = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    on(window, "scroll", onScrollPaint, { passive: true });
    on(window, "resize", onScrollPaint);
    update();
  });
}

/* ------------------------------------------------------------------ */
/* tickers (marquees)                                                  */
/*                                                                     */
/* Measured from the original published site:                          */
/*  - word-chip rows (AI bento card): ~22px/s, directions alternate     */
/*    per row starting RIGHT (row1 →, row2 ←, row3 → …)                */
/*  - all other tickers (hero strip, wide marquees): ~24px/s, leftward  */
/* ------------------------------------------------------------------ */

const TICKER_SPEED_GENERIC = 24;
const TICKER_SPEED_WORDS = 22;

function setupTickers(root: ParentNode) {
  // word-chip rows alternate direction per visible row, first row → right
  const wordRows: HTMLElement[] = [];

  root.querySelectorAll<HTMLElement>("section").forEach((sec) => {
    if (sec.style.opacity !== "0") return;
    const list = sec.querySelector("ul, ol");
    if (!list) return;
    sec.style.opacity = "1";
    const lis = list.querySelectorAll("li");
    const isWordRow =
      lis.length > 0 &&
      !list.querySelector("li img") &&
      (list.textContent || "").trim().length > 0;
    if (isWordRow && sec.offsetParent) wordRows.push(list as HTMLElement);
    startMarquee(
      list as HTMLElement,
      sec,
      isWordRow ? { speed: TICKER_SPEED_WORDS } : { speed: TICKER_SPEED_GENERIC }
    );
  });

  wordRows.forEach((list, i) => {
    if (i % 2 === 0) list.classList.add("nb-marquee-right");
  });

  root
    .querySelectorAll<HTMLElement>('[data-framer-name="Ticker"]')
    .forEach((ticker) => {
      const list = ticker.querySelector("ul, ol");
      if (list) {
        startMarquee(list as HTMLElement, ticker, {
          speed: TICKER_SPEED_GENERIC,
        });
        return;
      }
      const inner = ticker.firstElementChild as HTMLElement | null;
      if (!inner || ticker.dataset.nbTicker) return;
      ticker.dataset.nbTicker = "1";
      const track = document.createElement("div");
      track.className = "nb-ticker-track";
      while (inner.firstChild) track.appendChild(inner.firstChild);
      inner.appendChild(track);
      inner.classList.add("nb-ticker-viewport");
      const clone = track.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      inner.appendChild(clone);
      requestAnimationFrame(() => {
        const w = track.scrollWidth || 1;
        const duration = Math.max(6, w / TICKER_SPEED_GENERIC);
        inner.querySelectorAll<HTMLElement>(".nb-ticker-track").forEach((t) => {
          t.style.animationDuration = `${duration}s`;
        });
      });
    });
}

function startMarquee(
  list: HTMLElement,
  viewport: HTMLElement,
  opts: { speed?: number } = {}
) {
  if (list.dataset.nbMarquee) return;
  list.dataset.nbMarquee = "1";
  viewport.classList.add("nb-ticker-viewport");
  list.classList.add("nb-ticker-track");

  // Measure inside rAF (layout settled), then clone whole content sets until
  // the track covers the viewport plus one set — with only two copies a wide
  // viewport outruns the track and the strip runs dry on the right for most
  // of each cycle (measured 428px hole @1200px). The shift is expressed as a
  // percentage of the track's own (max-content) width — exactly one set —
  // so the loop stays seamless at any breakpoint without re-measuring.
  const items = [...list.children];

  requestAnimationFrame(() => {
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const setW =
      items.reduce((s, k) => s + k.getBoundingClientRect().width, 0) +
      gap * items.length;
    const vpW = viewport.clientWidth;
    const copies =
      vpW > 0 && setW > 0 ? Math.max(2, Math.ceil((vpW + setW) / setW)) : 2;
    for (let c = 1; c < copies; c++) {
      items.forEach((li) => {
        const clone = li.cloneNode(true) as HTMLElement;
        clone.setAttribute("aria-hidden", "true");
        list.appendChild(clone);
      });
    }
    // RTL pages lay the track out right-aligned inside the viewport, so the
    // marquee must travel rightward (positive shift) to keep the far edge
    // covered — mirroring the LTR leftward motion.
    const rtl = getComputedStyle(list).direction === "rtl";
    list.style.setProperty("--nb-shift", `${rtl ? "" : "-"}${100 / copies}%`);
    list.style.setProperty("--nb-gap", `${gap}px`);
    const duration = Math.max(6, setW / (opts.speed ?? TICKER_SPEED_GENERIC));
    list.style.animationDuration = `${duration}s`;
  });
}

/* ------------------------------------------------------------------ */
/* audio waves — Speech Recognition card playback loop                  */
/*                                                                     */
/* Exact original behaviour (framer-hK4SY "Audio Waves", Start/Stop):  */
/*  Start state: mask 2px wide (all bars grey), playhead at left:0.     */
/*  After 1s → switch to Stop: mask grows 2px→100% and the purple       */
/*  playhead line (with diamond) rides the wipe front over 10s linear.  */
/*  After the sweep → instant reset to Start. Loop = 11s.               */
/* ------------------------------------------------------------------ */

const WAVE_SWEEP_MS = 10000;
const WAVE_REST_MS = 1000;

function setupAudioWaves(root: ParentNode) {
  const waves = [...root.querySelectorAll<HTMLElement>(".framer-hK4SY")];
  const states = waves
    .map((el) => {
      if ((el as any).__nbWave) return null;
      (el as any).__nbWave = true;
      return {
        el,
        mask: el.querySelector<HTMLElement>(".framer-qjsdc9"),
        line: el.querySelector<HTMLElement>(".framer-skmche"),
        anims: [] as Animation[],
        timer: 0 as number,
      };
    })
    .filter((s): s is NonNullable<typeof s> => !!s && !!s.mask && !!s.line);
  if (!states.length) return;

  // RTL: mirror the whole bar strip (symmetric bars) so the wipe + playhead
  // travel right→left with the Arabic reading direction. Animating the
  // inner `left` values directly fights the RTL over-constrained box
  // resolution (left is ignored when right is set), so a container mirror
  // is the robust equivalent. If the player container is explicitly LTR, keep it unmirrored.
  if (document.documentElement.dir === "rtl") {
    states.forEach((s) => {
      const isLtr =
        s.el.closest('[style*="direction:ltr"], [style*="direction: ltr"]') !==
          null || window.getComputedStyle(s.el).direction === "ltr";
      if (!isLtr) {
        s.el.style.transform = "scaleX(-1)";
      }
    });
  }

  const reset = (s: (typeof states)[number]) => {
    s.anims.forEach((a) => a.cancel());
    s.anims = [];
    s.mask!.style.width = "";
    s.line!.style.left = "";
  };

  const sweep = (s: (typeof states)[number]) => {
    if (!s.el.isConnected || !s.el.offsetParent) return; // hidden SSR variant
    const w = s.el.getBoundingClientRect().width;
    if (!w) return;
    // playhead ends at calc(99.51456310679615% - 2px/2) of the waves root
    const endLeft = w * 0.99514556310679615 - 2;
    s.mask!.style.width = "2px";
    s.line!.style.left = "0px";
    s.anims = [
      s.mask!.animate(
        [{ width: "2px" }, { width: `${w}px` }],
        { duration: WAVE_SWEEP_MS, easing: "linear", fill: "forwards" }
      ),
      s.line!.animate(
        [{ left: "0px" }, { left: `${endLeft}px` }],
        { duration: WAVE_SWEEP_MS, easing: "linear", fill: "forwards" }
      ),
    ];
  };

  const cycle = (s: (typeof states)[number]) => {
    if (!s.el.isConnected) return;
    reset(s);
    s.timer = window.setTimeout(() => {
      sweep(s);
      s.timer = window.setTimeout(() => cycle(s), WAVE_SWEEP_MS + 1);
    }, WAVE_REST_MS);
  };

  states.forEach(cycle);
}

/* ------------------------------------------------------------------ */
/* integration curves — SVG path shimmer                                */
/*                                                                     */
/* Original "SVG Path Shimmer" component per curve:                     */
/*  base path: rgba(255,255,255,0.15), 1.5px, round caps                */
/*  shimmer path: purple rgba(0, 49, 213), pathLength 100,                */
/*  strokeDasharray "30 100", dashoffset animated linearly over 2s      */
/*  (first curve default 160→30, the other five reverse 30→160),        */
/*  0.3s delay between loops, endless. Pulse flows icon → stack icon.   */
/* ------------------------------------------------------------------ */

const SHIMMER_DASH = 30;
const SHIMMER_FROM = 100 + SHIMMER_DASH * 2; // 160
const SHIMMER_TO = SHIMMER_DASH; // 30
const SHIMMER_SWEEP_MS = 2000;
const SHIMMER_GAP_MS = 300;

function setupCurveShimmers(root: ParentNode) {
  root
    .querySelectorAll<HTMLElement>('[data-framer-name="SVG Path"]')
    .forEach((wrapper) => {
      const paths = [
        ...wrapper.querySelectorAll<SVGPathElement>('path[pathLength="100"]'),
      ];
      if (!paths.length) return;
      paths.forEach((path, i) => {
        if ((path as any).__nbShimmer) return;
        (path as any).__nbShimmer = true;
        const reverse = i > 0; // first curve "default", rest "reverse"
        const kfs = reverse
          ? [
              { strokeDashoffset: SHIMMER_TO, offset: 0 },
              {
                strokeDashoffset: SHIMMER_FROM,
                offset: SHIMMER_SWEEP_MS /
                  (SHIMMER_SWEEP_MS + SHIMMER_GAP_MS),
              },
              { strokeDashoffset: SHIMMER_FROM, offset: 1 },
            ]
          : [
              { strokeDashoffset: SHIMMER_FROM, offset: 0 },
              {
                strokeDashoffset: SHIMMER_TO,
                offset: SHIMMER_SWEEP_MS /
                  (SHIMMER_SWEEP_MS + SHIMMER_GAP_MS),
              },
              { strokeDashoffset: SHIMMER_TO, offset: 1 },
            ];
        path.animate(kfs, {
          duration: SHIMMER_SWEEP_MS + SHIMMER_GAP_MS,
          iterations: Infinity,
          easing: "linear",
        });
      });
    });
}

/* ------------------------------------------------------------------ */
/* FAQ accordion — exact original "FAQ/FAQ Single" component           */
/*                                                                     */
/* (chunk-W2X7TJDH.mjs): tap toggles Question ↔ Answer variants with   */
/* spring { stiffness: 500, damping: 60, mass: 1 }. On open:           */
/*   • the 24×24 plus-icon holder rotates 0 → 45°                      */
/*   • card border-color rgba(255,255,255,.07) → .15                   */
/*   • a 17px gap appears and the answer (DM Sans 16px, white 50%)     */
/*     expands below the row.                                          */
/* ------------------------------------------------------------------ */

const FAQ_SPRING = { type: "spring", stiffness: 500, damping: 60, mass: 1 } as const;

function setupFaq(root: ParentNode, lang: SiteLang = "en", page: string = "home") {
  const faq = page === "about"
    ? (lang === "ar" ? FAQ_ABOUT_AR : FAQ_ABOUT)
    : page === "portfolio"
    ? (lang === "ar" ? FAQ_PORTFOLIO_AR : FAQ_PORTFOLIO)
    : page === "contact"
    ? (lang === "ar" ? FAQ_CONTACT_AR : FAQ_CONTACT)
    : (page === "portfolio-lemonide-tech" || page === "lemonide-tech")
    ? (lang === "ar" ? FAQ_ALBETAR_AR : FAQ_ALBETAR)
    : (page === "portfolio-million-one" || page === "million-one")
    ? (lang === "ar" ? FAQ_MOHAMY_AR : FAQ_MOHAMY)
    : (page === "portfolio-viper-studio" || page === "viper-studio")
    ? (lang === "ar" ? FAQ_BUSINESS_AR : FAQ_BUSINESS)
    : (lang === "ar" ? FAQ_AR : FAQ);
  const faqSection = sectionByName(root, "FAQ");
  if (!faqSection) return;

  const cards = [
    ...faqSection.querySelectorAll<HTMLElement>(
      '[data-framer-name="Question"][tabindex="0"]'
    ),
  ];

  cards.forEach((card, i) => {
    if ((card as any).__nbFaq) return;
    (card as any).__nbFaq = true;
    const q = faq[i % faq.length];
    if (!q) return;
    const row = card.querySelector<HTMLElement>('[data-framer-name="Row"]');
    if (!row) return;
    card.style.cursor = "pointer";

    const qEl = row.querySelector<HTMLElement>('[data-framer-name="Question"] p') || row.querySelector<HTMLElement>('p');
    if (qEl && q[0]) {
      qEl.textContent = q[0];
    }

    /* icon holder — the small 24×24 container at the end of the Row
       (framer-gzi45z-container). Rotate THE HOLDER only, never the row. */
    let icon =
      row.querySelector<HTMLElement>(".framer-gzi45z-container") ??
      (row.lastElementChild as HTMLElement | null);
    if (icon && !icon.querySelector("svg") && !icon.querySelector(".nb-faq-icon")) {
      const el = document.createElement("div");
      el.className = "nb-faq-icon";
      icon.appendChild(el);
    }

    /* answer — mounted below the Row (Framer only renders it in the open
       state); 17px gap via padding-top, text = preset-x0s9r5 white 50% */
    const answer = document.createElement("div");
    answer.className = "nb-faq-answer";
    answer.style.height = "0px";
    answer.style.opacity = "0";
    const p = document.createElement("p");
    p.className = "framer-text framer-styles-preset-x0s9r5 nb-faq-text";
    p.style.cssText =
      "--framer-text-color:rgba(255,255,255,0.5);padding:17px 0 0 0;margin:0;";
    p.textContent = q[1];
    answer.appendChild(p);
    card.appendChild(answer);

    /* resolve the CSS-var border colors to plain rgba strings so
       framer-motion can interpolate them */
    if (!card.style.getPropertyValue("--border-color").includes("rgba")) {
      card.style.setProperty("--border-color", "rgba(255, 255, 255, 0.07)");
    }

    let open = false;
    on(card, "click", () => {
      open = !open;
      if (open) {
        const h = p.scrollHeight;
        animate(answer, { height: [0, h], opacity: [0, 1] }, FAQ_SPRING);
        animate(
          card,
          { "--border-color": "rgba(255, 255, 255, 0.15)" } as any,
          FAQ_SPRING
        );
      } else {
        animate(answer, { height: [answer.scrollHeight, 0], opacity: [1, 0] }, FAQ_SPRING);
        animate(
          card,
          { "--border-color": "rgba(255, 255, 255, 0.07)" } as any,
          FAQ_SPRING
        );
      }
      if (icon) animate(icon, { rotate: open ? 45 : 0 }, FAQ_SPRING);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Circle Ticker wheel (the "Packed with Innovation" arc)              */
/*                                                                     */
/* Original loop config (page-home.mjs):                               */
/*   __framer__loop: { rotate: 360 }                                   */
/*   __framer__loopTransition: { delay: 0, duration: 50,               */
/*                               ease: [0,0,1,1], type: "tween" }      */
/*   repeatType: "loop", repeatDelay: 0 — a full turn every 50s.       */
/* ------------------------------------------------------------------ */

function setupCircleTicker(root: ParentNode) {
  root
    .querySelectorAll<HTMLElement>('[data-framer-name="Circle"]')
    .forEach((circle) => {
      if ((circle as any).__nbWheel) return;
      (circle as any).__nbWheel = true;
      const ctrl = animate(
        circle,
        { rotate: [0, 360] },
        { duration: 50, ease: [0, 0, 1, 1], repeat: Infinity, repeatDelay: 0 }
      );
      onCleanup(() => ctrl.stop());
    });
}

/* ------------------------------------------------------------------ */
/* Pulse rings behind the integrations logo ticker                     */
/*                                                                     */
/* Three purple 74px circles loop: opacity 1→0, scale 1→2.8/3/3.2,     */
/* rotate 0→360, tween 2s ease [0.44,0,0.56,1] with 0.5s delay and     */
/* repeat delays .2/.1/0 (page-home.mjs: wl/bl/vl + Ba).               */
/* ------------------------------------------------------------------ */

const PULSE_RINGS: Array<{ cls: string; scale: number; repeatDelay: number }> = [
  { cls: "framer-12ga4v9", scale: 2.8, repeatDelay: 0.2 },
  { cls: "framer-nkdin0", scale: 3, repeatDelay: 0.1 },
  { cls: "framer-u6tfun", scale: 3.2, repeatDelay: 0 },
];

function setupPulses(root: ParentNode) {
  PULSE_RINGS.forEach(({ cls, scale, repeatDelay }) => {
    root.querySelectorAll<HTMLElement>(`.` + cls).forEach((el) => {
      if ((el as any).__nbPulse) return;
      (el as any).__nbPulse = true;
      if (!el.offsetParent) return; // hidden breakpoint variant
      const ctrl = animate(
        el,
        { opacity: [1, 0], scale: [1, scale], rotate: [0, 360] },
        {
          duration: 2,
          ease: [0.44, 0, 0.56, 1],
          delay: 0.5,
          repeat: Infinity,
          repeatDelay,
        }
      );
      onCleanup(() => ctrl.stop());
    });
  });
}

/* ------------------------------------------------------------------ */
/* Custom cursor — the original Framer cursor system                   */
/*                                                                     */
/* The page root registers cursor "1bf4dyq": a white 14px dot that     */
/* follows the pointer (spring 400/60, positioned bottom-center of the */
/* pointer), native cursor stays visible. Portfolio/next-project cards */
/* register "8bnwio"/"850utj": the pill variant — white "View Now"     */
/* (DM Sans 700 16px #131313, radius 45px, padding 5px 15px, shadow    */
/* 0 4px 12px rgba(0,0,0,.1)) centered ON the pointer while the native */
/* cursor is hidden. Variant change spring { bounce: .2, duration:.4 } */
/* Opacity: tween .2s in on move, out on mouseleave. Off on touch.     */
/* ------------------------------------------------------------------ */

const CURSOR_PILL_IDS = new Set(["8bnwio", "850utj"]);

function cursorIdAt(x: number, y: number): string | null {
  let n = document.elementFromPoint(x, y) as HTMLElement | null;
  while (n) {
    const c = n.getAttribute?.("data-framer-cursor");
    if (c) return c;
    n = n.parentElement;
  }
  return null;
}

function setupCursor() {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(any-hover: none)").matches) return;
  if (document.getElementById("nb-cursor")) return;

  const VARIANT_SPRING = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

  /* dot (default) */
  const dot = document.createElement("div");
  dot.id = "nb-cursor";
  dot.style.cssText =
    "position:fixed;top:0;left:0;width:14px;height:14px;border-radius:20px;" +
    "background:#FFFFFF;box-shadow:none;z-index:13;pointer-events:none;opacity:0;" +
    "will-change:transform;margin:-0px 0 0 -7px;";
  document.body.appendChild(dot);

  /* pill (hover variant) */
  const pill = document.createElement("div");
  pill.id = "nb-cursor-pill";
  pill.setAttribute("data-framer-name", "Hover");
  pill.style.cssText =
    "position:fixed;top:0;left:0;z-index:13;pointer-events:none;opacity:0;" +
    "display:flex;align-items:center;justify-content:center;white-space:pre;" +
    "background-color:#FFFFFF;border-radius:45px;padding:5px 15px 5px 15px;" +
    "box-shadow:0px 4px 12px 0px rgba(0,0,0,0.1);will-change:transform;";
  const pillText = document.createElement("p");
  pillText.className = "nb-cursor-text";
  pillText.textContent = "View Now";
  pill.appendChild(pillText);
  document.body.appendChild(pill);

  let raf = 0;
  const g = GEN;
  let px = -100, py = -100; // pointer
  let x = -100, y = -100;   // dot spring state
  let vx = 0, vy = 0;
  let last = 0;
  let pillX = -100, pillY = -100;
  let mode: "dot" | "pill" | null = null;
  let visible = false;

  onCleanup(() => {
    cancelAnimationFrame(raf);
    dot.remove();
    pill.remove();
    document.body.classList.remove("framer-cursor-none");
  });

  /* spring integrator (stiffness 400, damping 60, mass 1) */
  const stepSpring = (
    pos: number, vel: number, target: number, dt: number
  ): [number, number] => {
    const stiffness = 400, damping = 60, mass = 1;
    const F = -stiffness * (pos - target) - damping * vel;
    const a = F / mass;
    const nVel = vel + a * dt;
    const nPos = pos + nVel * dt;
    return [nPos, nVel];
  };

  const frame = (now: number) => {
    if (g !== GEN) return; // page changed — stop the loop
    const dt = Math.min(0.032, (now - last) / 1000) || 0.016;
    last = now;

    if (mode === "pill") {
      pillX = px;
      pillY = py;
      pill.style.transform = `translate(${pillX}px, ${pillY}px) translate(-50%, -50%)`;
    } else {
      [x, vx] = stepSpring(x, vx, px, dt);
      [y, vy] = stepSpring(y, vy, py, dt);
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, 0%)`;
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  last = performance.now();

  const show = () => {
    if (visible) return;
    visible = true;
    const el = mode === "pill" ? pill : dot;
    animate(el, { opacity: [0, 1] }, { duration: 0.2, ease: "linear" });
  };
  const hide = () => {
    if (!visible) return;
    visible = false;
    animate(dot, { opacity: 0 }, { duration: 0.2, ease: "linear" });
    animate(pill, { opacity: 0 }, { duration: 0.2, ease: "linear" });
  };

  const setMode = (next: "dot" | "pill") => {
    if (mode === next) return;
    const prev = mode;
    mode = next;
    if (next === "pill") {
      // pill grows out of the dot (variant spring, origin at pointer)
      const w = pill.offsetWidth || 100;
      const h = pill.offsetHeight || 36;
      pill.style.transformOrigin = "center";
      animate(pill, { opacity: [0, 1], scaleX: [14 / w, 1], scaleY: [14 / h, 1] }, VARIANT_SPRING);
      animate(dot, { opacity: [1, 0] }, { duration: 0.15, ease: "linear" });
      document.body.classList.add("framer-cursor-none");
      x = px; y = py; vx = 0; vy = 0;
    } else {
      animate(dot, { opacity: [0, 1] }, { duration: 0.2, ease: "linear" });
      animate(pill, { opacity: [1, 0], scaleX: 14 / (pill.offsetWidth || 100) }, { duration: 0.15, ease: "linear" });
      document.body.classList.remove("framer-cursor-none");
    }
    void prev;
  };

  let modeRaf = 0;
  on(
    window,
    "pointermove",
    (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px = e.clientX;
      py = e.clientY;
      show();
      // rate-limit the elementFromPoint walk
      if (!modeRaf) {
        modeRaf = requestAnimationFrame(() => {
          modeRaf = 0;
          const id = cursorIdAt(px, py);
          setMode(id && CURSOR_PILL_IDS.has(id) ? "pill" : "dot");
        });
      }
    },
    { passive: true }
  );

  /* pressed state — the dot shrinks to 10px (pressed gesture on Default) */
  on(window, "pointerdown", () => {
    if (mode !== "dot") return;
    animate(dot, { width: 10, height: 10, margin: "-0px 0 0 -5px" }, VARIANT_SPRING);
  });
  on(window, "pointerup", () => {
    if (mode !== "dot") return;
    animate(dot, { width: 14, height: 14, margin: "-0px 0 0 -7px" }, VARIANT_SPRING);
  });

  on(document.documentElement, "mouseleave", hide);
  on(window, "blur", hide);
}

/* ------------------------------------------------------------------ */
/* Hover interactions — every hover variant of the original, with its  */
/* exact spring transition:                                            */
/*   • Purple buttons: boxShadow 0 → 0 0 0 5px rgba(0, 49, 213,.3)      */
/*     (spring 200/60)                                                 */
/*   • Grey / White buttons: opacity → .6 (spring 200/60)              */
/*   • Subscribe button: purple glow + label #C4C4C4 (spring 400/60)   */
/*   • Contact submit: purple glow + label #C4C4C4                     */
/*   • Service cards: arrow opacity .2 → 1 (spring 200/60)             */
/*   • Service small cards: social icon opacity .6 → 1                 */
/*   • Support cards: social icon opacity .2 → .9                      */
/*   • Portfolio / next-project cards: image scale 1 → 1.1             */
/*     (spring 250/60)                                                 */
/* ------------------------------------------------------------------ */

function bindHover(
  el: Element | null,
  enter: (el: HTMLElement) => void,
  leave: (el: HTMLElement) => void,
  id = "__nbHover"
) {
  if (!el) return;
  if ((el as any)[id]) return;
  (el as any)[id] = true;
  on(el, "pointerenter", () => enter(el as HTMLElement));
  on(el, "pointerleave", () => leave(el as HTMLElement));
}

function setupHovers(root: ParentNode) {
  const SPRING200 = { type: "spring", stiffness: 200, damping: 60, mass: 1 } as const;
  const SPRING250 = { type: "spring", stiffness: 250, damping: 60, mass: 1 } as const;
  const SPRING400 = { type: "spring", stiffness: 400, damping: 60, mass: 1 } as const;

  /* purple buttons — glow ring on hover */
  root
    .querySelectorAll<HTMLElement>('a[data-framer-name="Purple"]')
    .forEach((btn) => {
      bindHover(
        btn,
        (el) =>
          animate(
            el,
            { boxShadow: "0px 0px 0px 5px rgba(0, 49, 213, 0.3)" },
            SPRING200
          ),
        (el) =>
          animate(
            el,
            { boxShadow: "0px 0px 0px 0px rgba(0, 49, 213, 0.3)" },
            SPRING200
          )
      );
    });

  /* grey / white buttons — dim to .6 */
  root
    .querySelectorAll<HTMLElement>(
      'a[data-framer-name="Grey"], a[data-framer-name="White"]'
    )
    .forEach((btn) => {
      bindHover(
        btn,
        (el) => animate(el, { opacity: 0.6 }, SPRING200),
        (el) => animate(el, { opacity: 1 }, SPRING200)
      );
    });

  /* subscribe / submit buttons — purple glow + label #C4C4C4 */
  root
    .querySelectorAll<HTMLElement>(
      'form button[type="submit"], form button:not([type])'
    )
    .forEach((btn) => {
      const base = getComputedStyle(btn).boxShadow;
      const label = btn.querySelector("p, span") as HTMLElement | null;
      bindHover(
        btn,
        (el) => {
          animate(
            el,
            {
              boxShadow:
                "0px 0.6021873017743928px 3.010936508871964px 0px rgba(0, 49, 213, 0.04), 0px 2.288533303243457px 11.442666516217285px 0px rgba(0, 49, 213, 0.16), 0px 10px 50px 0px rgba(0, 49, 213, 0.7)",
            },
            SPRING400
          );
          if (label) animate(label, { color: "rgb(196, 196, 196)" }, SPRING400);
        },
        (el) => {
          animate(el, { boxShadow: base }, SPRING400);
          if (label)
            animate(label, { color: "rgb(255, 255, 255)" }, SPRING400);
        }
      );
    });

  /* service cards — arrow appears (opacity .2 → 1) */
  root
    .querySelectorAll<HTMLElement>(".framer-1atxxt1, a.framer-3lxv5q")
    .forEach((card) => {
      const arrow = card.querySelector<HTMLElement>(".framer-1d1pnhs");
      if (!arrow) return;
      bindHover(
        card,
        () => animate(arrow, { opacity: 1 }, SPRING200),
        () => animate(arrow, { opacity: 0.2 }, SPRING200)
      );
    });

  /* service small cards — social icon .6 → 1 */
  root
    .querySelectorAll<HTMLElement>(".framer-PxhKK")
    .forEach((card) => {
      const icon = card.querySelector<HTMLElement>(".framer-f6dhjq");
      if (!icon) return;
      bindHover(
        card,
        () => animate(icon, { opacity: 1 }, SPRING200),
        () => animate(icon, { opacity: 0.6 }, SPRING200)
      );
    });

  /* support cards — social icon .2 → .9 */
  root
    .querySelectorAll<HTMLElement>(".framer-vqNyI")
    .forEach((card) => {
      const icon = card.querySelector<HTMLElement>(".framer-dgrz5q");
      if (!icon) return;
      bindHover(
        card,
        () => animate(icon, { opacity: 0.9 }, SPRING200),
        () => animate(icon, { opacity: 0.2 }, SPRING200)
      );
    });

  /* portfolio cards (home preview + portfolio page) — image scales to 1.1 */
  root
    .querySelectorAll<HTMLElement>('[data-framer-cursor="8bnwio"]')
    .forEach((card) => {
      const img = card.querySelector<HTMLElement>(
        ".framer-1206r8s, .framer-vk9m4r"
      );
      if (!img) return;
      bindHover(
        card,
        () => animate(img, { scale: 1.1 }, SPRING250),
        () => animate(img, { scale: 1 }, SPRING250)
      );
    });

  /* next-project cards on detail pages — image dims to .6 */
  root
    .querySelectorAll<HTMLElement>('[data-framer-cursor="850utj"]')
    .forEach((card) => {
      const img = card.querySelector<HTMLElement>(".framer-pd56mf");
      if (!img) return;
      bindHover(
        card,
        () => animate(img, { opacity: 0.6 }, SPRING250),
        () => animate(img, { opacity: 1 }, SPRING250)
      );
    });
}

/* ------------------------------------------------------------------ */
/* Light Rays — the ORIGINAL Framer "Light Rays" Three.js component    */
/*                                                                     */
/* Extracted verbatim from the published site bundle                   */
/* (chunk-BS7EWRWF.mjs): fragment shader `j0` + uniforms. Every glow   */
/* host on the site uses the same config: intensity 20, rays 30,       */
/* purple rgba(0, 49, 213), animation { animate: true, speed: 10 }.      */
/* The u_time uniform advances dt_ms * speed / 1e3 / 10 (≈1 per s).    */
/* ------------------------------------------------------------------ */

/* ONLY these four containers carry the animated ray canvas in the original
 * runtime (verified against the shipped EvexaRuntime + user confirmation).
 * The other section-level "Light Rays" layers (Circle Ticker, Portfolio,
 * Support, About-Us, Process, above-FAQ) keep ONLY their frozen glow
 * backdrop image from the export — no canvas was ever attached there. */
const LIGHT_RAYS_HOSTS: Record<string, { position: number; reach: number; img: string }> = {
  "framer-1opuij9-container": { position: 50, reach: 30, img: "/images/glow/glow-services.webp" },
  "framer-14gb8d7-container": { position: 50, reach: 30, img: "/images/glow/glow-faq.webp" },
  "framer-apnosk-container": { position: 100, reach: 0, img: "/images/glow/glow-launch.webp" },
  "framer-vu8s90-container": { position: 50, reach: 30, img: "/images/glow/glow-cta.webp" },
};

const LIGHT_RAYS_SPEED = 10;
const LIGHT_RAYS_INTENSITY = 20;
const LIGHT_RAYS_COUNT = 30;
/* single color mode: rgba(0, 49, 213) — the Evexa Royal Blue token */
const LIGHT_RAYS_COLOR: [number, number, number, number] = [0 / 255, 49 / 255, 213 / 255, 1];

const LIGHT_RAYS_VERT = "attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.,1.);}";

/* Exact fragment shader of the original component (unused noise helpers removed) */
const LIGHT_RAYS_FRAG = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform vec2 u_rayPos1;
uniform vec2 u_rayPos2;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed)
{
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
    float diagonal = length(u_resolution);
    return clamp(
        (.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
        u_reach, 1.0) *
        clamp((diagonal - length(sourceToCoord)) / diagonal, u_reach, 1.0);
}

void main()
{
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0 - uv.y;
    vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    float speed = u_rays * 10.0;

    vec2 rayPos1 = u_rayPos1;
    vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
    float raySeedA1 = 36.2214*speed;
    float raySeedB1 = 21.11349*speed;
    float raySpeed1 = 1.5*speed;

    vec2 rayPos2 = u_rayPos2;
    vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
    float raySeedA2 = 22.39910*speed;
    float raySeedB2 = 18.0234*speed;
    float raySpeed2 = 1.1*speed;

    float strength1 = rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
    float strength2 = rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);

    float brightness = 1.0*u_reach - (coord.y / u_resolution.y);
    float attenuation = clamp(brightness + (0.5 + u_intensity), 0.0, 1.0);

    float alpha1 = strength1 * attenuation * u_colors[0].a;
    float alpha2 = strength2 * attenuation * u_colors[1].a;

    vec3 premultColor1 = u_colors[0].rgb * alpha1;
    vec3 premultColor2 = u_colors[1].rgb * alpha2;

    vec3 blendedColor = premultColor1 + premultColor2;
    float blendedAlpha = alpha1 + alpha2 * (1.0 - alpha1);

    vec3 finalRGB = blendedColor / max(blendedAlpha, 0.0001);

    gl_FragColor = vec4(finalRGB * blendedAlpha, blendedAlpha);
}
`;

function setupLightRays(root: ParentNode) {
  Object.entries(LIGHT_RAYS_HOSTS).forEach(([cls, opts]) => {
    root
      .querySelectorAll<HTMLElement>(`.` + cls)
      .forEach((host) => {
        if (host.querySelector("canvas")) return;
        if (!host.offsetParent) return; // hidden breakpoint variant
        host.style.pointerEvents = "none";
        // host opacity comes from the DOM (0.8 on apnosk / vu8s90, 1 elsewhere)

        const canvas = document.createElement("canvas");
        canvas.style.cssText =
          "position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;";
        host.insertBefore(canvas, host.firstChild);

        const gl = canvas.getContext("webgl", {
          alpha: true,
          premultipliedAlpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
        });

        if (!gl) {
          // WebGL unavailable → static captured field fallback
          canvas.remove();
          const img = document.createElement("img");
          img.src = opts.img;
          img.alt = "";
          img.setAttribute("aria-hidden", "true");
          img.style.cssText =
            "position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;";
          host.insertBefore(img, host.firstChild);
          return;
        }

        const compile = (type: number, src: string) => {
          const sh = gl.createShader(type)!;
          gl.shaderSource(sh, src);
          gl.compileShader(sh);
          return sh;
        };
        const prog = gl.createProgram()!;
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, LIGHT_RAYS_VERT));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, LIGHT_RAYS_FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          canvas.remove();
          return;
        }
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const U = (n: string) => gl.getUniformLocation(prog, n);
        const uRes = U("u_resolution");
        const uTime = U("u_time");
        const uColors = U("u_colors[0]");
        const uIntensity = U("u_intensity");
        const uRays = U("u_rays");
        const uReach = U("u_reach");
        const uPos1 = U("u_rayPos1");
        const uPos2 = U("u_rayPos2");

        // uniform maths — exactly the original component:
        // intensity 20 -> 20/100*.5 = .1 ; rays 30 -> 30/100*.3 = .09 ; reach 30 -> .15
        gl.uniform4fv(uColors, [...LIGHT_RAYS_COLOR, ...LIGHT_RAYS_COLOR]);
        gl.uniform1f(uIntensity, (LIGHT_RAYS_INTENSITY / 100) * 0.5);
        gl.uniform1f(uRays, (LIGHT_RAYS_COUNT / 100) * 0.3);
        gl.uniform1f(uReach, (opts.reach / 100) * 0.5);

        let time = Math.random() * 10000; // original starts u_time at random*1e4
        let raf = 0;
        let last = performance.now();
        let running = true;
        const g = GEN;

        const resize = () => {
          const w = Math.max(1, Math.round(host.clientWidth));
          const h = Math.max(1, Math.round(host.clientHeight));
          if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
          }
          gl.viewport(0, 0, w, h);
          gl.uniform2f(uRes, w, h);
          // original: rayPos1=[position/100*w, -0.4*h], rayPos2=[(position/100+.02)*w, -0.5*h]
          gl.uniform2f(uPos1, (opts.position / 100) * w, -0.4 * h);
          gl.uniform2f(uPos2, (opts.position / 100 + 0.02) * w, -0.5 * h);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(host);

        const frame = (now: number) => {
          if (!running || g !== GEN) return; // paused off-screen or page changed
          const dt = now - last;
          last = now;
          // original: u_time += dt_ms * speed / 1e3 / 10  →  ≈1 per second at speed 10
          time += dt * (LIGHT_RAYS_SPEED / 1e3 / 10);
          gl.uniform1f(uTime, time);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          raf = requestAnimationFrame(frame);
        };
        raf = requestAnimationFrame(frame);

        // pause off-screen (the original keeps a single rAF per canvas too)
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !running) {
                running = true;
                last = performance.now();
                raf = requestAnimationFrame(frame);
              } else if (!entry.isIntersecting && running) {
                running = false;
                cancelAnimationFrame(raf);
              }
            });
          },
          { rootMargin: "100px" }
        );
        io.observe(host);
        onCleanup(() => {
          running = false;
          cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
        });
      });
  });
}

function frac(x: number) {
  return x - Math.floor(x);
}

function setupDecor(root: ParentNode) {
  const ring = root.querySelector<HTMLElement>('img[alt="Purple Ring"]');
  if (ring && !(ring as any).__nbDecor) {
    (ring as any).__nbDecor = true;
    const ctrl = animate(
      ring,
      { opacity: [1, 0.8], rotate: [0, -3], skewY: [0, 2], y: [0, 6] },
      { duration: 1.5, ease: [0, 0, 1, 1], repeat: Infinity, repeatType: "mirror" }
    );
    onCleanup(() => ctrl.stop());
  }

  /* NOTE: the "Rays" images (About/FAQ/Circle-Ticker light beams) are STATIC
     in the original — only their wrapper carries opacity .7. No appear effect.
     (verified: no initial/effect/loop props on any alt:"Rays" instance) */

  // Stars: both the alt="Star" images and the fill-injected
  // [data-framer-name="Star"] SVG holders (testimonial / rating stars)
  // spin in once, exactly like the original's appear effect.
  const stars = [
    ...root.querySelectorAll<HTMLElement>(
      'img[alt="Star"], svg[alt="Star"], [data-framer-name="Star"]'
    ),
  ];
  stars.forEach((star, i) => {
    if ((star as any).__nbDecor) return;
    (star as any).__nbDecor = true;
    star.style.opacity = "0.001";
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          animate(
            star,
            { opacity: [0.001, 1], rotate: [0, 360] },
            { ...WORD_SPRING, delay: (i % 5) * 0.05 }
          );
        });
      },
      { threshold: 0.5 }
    );
    io.observe(star);
    onCleanup(() => io.disconnect());
  });
}

/* ------------------------------------------------------------------ */
/* video                                                               */
/* ------------------------------------------------------------------ */

function setupVideo(root: ParentNode) {
  root.querySelectorAll<HTMLVideoElement>("video").forEach((video) => {
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    // metadata only: the full 12 MB launch video must not start downloading
    // on page load; playback begins when the section scrolls into view.
    video.preload = "metadata";
    if (!video.getAttribute("src") && video.querySelector("source")) {
      video.load();
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(video);
    onCleanup(() => {
      io.disconnect();
      video.pause();
    });
  });
}

/* ------------------------------------------------------------------ */
/* language helpers                                                    */
/* ------------------------------------------------------------------ */

type SiteLang = "en" | "ar";

/** Prefix an internal href with the active language segment. */
function withLang(href: string, lang: SiteLang): string {
  // Always prefix the locale: client-side navigations then hit the real
  // route directly instead of bouncing through the locale redirect in
  // src/proxy.ts (which only serves unprefixed, e.g. first-visit links).
  if (href.startsWith("/#")) return `/${lang}#${href.slice(2)}`;
  if (href === "/") return `/${lang}`;
  if (href.startsWith(`/${lang}/`) || href === `/${lang}`) return href;
  return `/${lang}${href}`;
}

/* ------------------------------------------------------------------ */
/* navigation                                                          */
/* ------------------------------------------------------------------ */

function setupLinksAndForms(
  root: ParentNode,
  navigate: (href: string) => void,
  lang: SiteLang = "en"
) {
  /* ---------------- real page navigation ---------------------------- */
  root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
    const href = a.getAttribute("href") ?? "";
    if (href.startsWith("http") || href.startsWith("mailto")) return;

    on(a, "click", (e) => {
      // hash-only or same-page hash links: smooth scroll within the page
      if (href.startsWith("#") || href.startsWith("/#") || (href.includes("#") && (href.startsWith("/contact#") || href.startsWith(`/${lang}/contact#`)))) {
        const hashIdx = href.indexOf("#");
        const id = href.slice(hashIdx + 1);
        const pathPart = href.slice(0, hashIdx);
        // If on same page or contact page hash anchor
        if (!pathPart || pathPart === "/" || pathPart === "/contact" || pathPart === `/${lang}/contact` || window.location.pathname.endsWith("/contact")) {
          e.preventDefault();
          const target = (id ? document.getElementById(id) : null) ?? document.getElementById("evexa-contact-form") ?? document.getElementById("form") ?? sectionByName(root, "FAQ");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
        }
        if (id) {
          const sec = (id ? document.getElementById(id) : null) ?? sectionByName(root, "FAQ");
          if (sec) {
            e.preventDefault();
            sec.scrollIntoView({ behavior: "smooth", block: "start" });
            return;
          }
        }
        window.location.href = withLang("/#" + id, lang);
        return;
      }
      // internal route links ("/", "/about", …): Next.js client-side
      // navigation — no full reload, matching Framer's instant transitions.
      let resolvedHref = href;
      if (resolvedHref.startsWith("../")) {
        resolvedHref = resolvedHref.replace(/^\.\.\/?/, "/");
      }
      if (resolvedHref.startsWith("/")) {
        e.preventDefault();
        navigate(withLang(resolvedHref, lang));
      }
    });
  });

  // hash scroll on load (e.g. /#faq or #evexa-contact-form)
  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    window.setTimeout(() => {
      const sec =
        (id ? document.getElementById(id) : null) ??
        document.getElementById("evexa-contact-form") ??
        document.getElementById("form") ??
        sectionByName(root, "FAQ");
      sec?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  }

  /* ---------------- subscribe / contact forms ------------------------ */
  /* The contact form carries a message textarea; newsletter forms are
   * email-only. Both POST to /api/contact (zod-validated, NDJSON-backed);
   * feedback updates buttons and inline status matching approved copy. */
  root.querySelectorAll("form").forEach((form) => {
    const isContact = form.id === "evexa-contact-form" || !!form.querySelector("textarea");
    const isAr = lang === "ar" || document.documentElement.lang === "ar" || !!form.closest('[dir="rtl"]');

    const email = form.querySelector<HTMLInputElement>('input[type="email"], input[name="email"]');
    const textarea = form.querySelector<HTMLTextAreaElement>("textarea");
    const fullNameInput = form.querySelector<HTMLInputElement>('input[name="fullName"], input[name="firstName"], input[name="name"]');
    const companyNameInput = form.querySelector<HTMLInputElement>('input[name="companyName"], input[name="lastName"]');
    const countrySelect = form.querySelector<HTMLSelectElement>('select[name="country"], select[name="Location"]:first-of-type');
    const interestSelect = form.querySelector<HTMLSelectElement>('select[name="interest"], select[name="companyType"]');
    const buttons = [...form.querySelectorAll<HTMLButtonElement>("button[type='submit'], button")];

    if (!email || buttons.length === 0) return;

    const oldLabel = buttons[0]?.textContent?.trim() ?? "";

    const setButtonsLabel = (text: string, revertMs?: number) => {
      buttons.forEach((b) => {
        const p = b.querySelector("p");
        if (p) p.textContent = text;
        else b.textContent = text;
      });
      if (revertMs) {
        window.setTimeout(() => {
          buttons.forEach((b) => {
            const p = b.querySelector("p");
            if (p) p.textContent = oldLabel;
            else b.textContent = oldLabel;
          });
        }, revertMs);
      }
    };

    // Dedicated status container for contact form feedback
    let statusEl = form.querySelector<HTMLElement>(".evexa-form-status");
    if (isContact && !statusEl) {
      statusEl = document.createElement("div");
      statusEl.className = "evexa-form-status";
      statusEl.style.display = "none";
      const submitVariant = form.querySelector(".ssr-variant");
      if (submitVariant && submitVariant.parentElement) {
        submitVariant.parentElement.insertBefore(statusEl, submitVariant);
      } else {
        form.appendChild(statusEl);
      }
    }

    const showStatus = (type: "error" | "success", msg: string) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.style.display = "block";
      if (type === "success") {
        statusEl.style.cssText = `display:block;color:#4ade80;font-size:14px;margin:14px 0;padding:12px 16px;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);border-radius:8px;line-height:1.5;text-align:${isAr ? "right" : "left"};font-family:${isAr ? "Alexandria, sans-serif" : "inherit"};`;
      } else {
        statusEl.style.cssText = `display:block;color:#ff6b6b;font-size:14px;margin:14px 0;padding:10px 14px;background:rgba(255,70,70,0.1);border:1px solid rgba(255,70,70,0.25);border-radius:8px;line-height:1.4;text-align:${isAr ? "right" : "left"};font-family:${isAr ? "Alexandria, sans-serif" : "inherit"};`;
      }
    };

    on(form, "submit", (e: Event) => {
      e.preventDefault();

      if (isContact) {
        const fullName = fullNameInput?.value.trim() ?? "";
        const companyName = companyNameInput?.value.trim() ?? "";
        const emailVal = email.value.trim();
        const country = countrySelect?.value.trim() ?? "";
        const interest = interestSelect?.value.trim() ?? "";
        const message = textarea?.value.trim() ?? "";

        // Check required fields (fullName, companyName, email, message)
        if (!fullName || !companyName || !emailVal || !message) {
          const msg = isAr ? "يرجى تعبئة هذا الحقل." : "Please complete this field.";
          showStatus("error", msg);
          return;
        }

        // Email format check - accept any valid domain
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
          const msg = isAr ? "يرجى إدخال بريد إلكتروني صحيح." : "Enter a valid email address.";
          showStatus("error", msg);
          return;
        }

        if (statusEl) statusEl.style.display = "none";
        buttons.forEach((b) => (b.disabled = true));
        setButtonsLabel(isAr ? "جارٍ الإرسال…" : "Sending…");

        const payload = {
          fullName,
          companyName,
          name: fullName,
          email: emailVal,
          country,
          interest,
          companyType: interest,
          message,
        };

        fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-evexa-lang": lang,
          },
          body: JSON.stringify(payload),
        })
          .then((res) => {
            if (!res.ok) throw new Error(String(res.status));
            return res.json();
          })
          .then((data) => {
            if (!data?.ok) throw new Error(data?.error || "Failed");
            form.reset();
            buttons.forEach((b) => (b.disabled = false));
            setButtonsLabel(isAr ? "تم الإرسال!" : "Message Sent!");
            showStatus(
              "success",
              isAr
                ? "تم إرسال رسالتك بنجاح. سنتواصل معك عبر البريد الإلكتروني الذي أدخلته."
                : "Your message has been sent. We’ll contact you using the email address provided."
            );
            window.setTimeout(() => setButtonsLabel(oldLabel), 5000);
          })
          .catch((err) => {
            console.error("[contact submit error]", err);
            buttons.forEach((b) => (b.disabled = false));
            setButtonsLabel(isAr ? "تعذّر الإرسال — حاول ثانية" : "Error — try again", 4000);
            showStatus(
              "error",
              isAr
                ? "تعذّر إرسال رسالتك. يرجى المحاولة مرة أخرى."
                : "We couldn’t send your message. Please try again."
            );
          });
      } else {
        const emailVal = email.value.trim();
        if (!emailVal) return;
        setButtonsLabel(isAr ? "جارٍ الاشتراك…" : "Subscribing…");
        fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-evexa-lang": lang,
          },
          body: JSON.stringify({ email: emailVal, subscribe: true }),
        })
          .then((res) => {
            if (!res.ok) throw new Error(String(res.status));
            email.value = "";
            setButtonsLabel(isAr ? "تم الاشتراك!" : "Subscribed!", 3000);
          })
          .catch(() => setButtonsLabel(isAr ? "خطأ — حاول ثانية" : "Error — try again", 3000));
      }
    });
  });
}

/* ------------------------------------------------------------------ */
/* scroll-linked transform effects (exact Framer "styleTransform")     */
/*                                                                     */
/* Framer marks elements with __framer__transformTargets + trigger     */
/* "onInView": values interpolate between target[0] and target[1]     */
/* while the element travels from "start end" to "end end" relative    */
/* to the viewport. Extracted verbatim from the original page bundles. */
/* ------------------------------------------------------------------ */

type XTarget = Partial<{
  opacity: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
}>;

const TRANSFORM_EFFECTS: Record<
  string,
  { from: XTarget; to: XTarget; appear?: boolean; spring?: object }
> = {
  // home — portfolio preview cards (slide up + un-rotate while entering)
  "framer-dz2cqt-container": {
    from: { opacity: 0.3, rotate: 2, y: -180 },
    to: { opacity: 1, rotate: 0, y: 0 },
  },
  "framer-1b1npw3-container": {
    from: { opacity: 0.3, rotate: -2, y: -180 },
    to: { opacity: 1, rotate: 0, y: 0 },
  },
  // home — section zoom-ins (scale .9 → 1 while entering)
  "framer-1m5ax3o-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  "framer-1ad9dhx-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  "framer-tf4iar-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  // about — same zoom-in treatment
  "framer-x3f56l-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  "framer-19rrn65-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  "framer-t31ig5-container": { from: { scale: 0.9 }, to: { scale: 1 } },
  // portfolio grid cards
  "framer-17cqt85-container": {
    from: { rotate: 2, y: -180 },
    to: { rotate: 0, y: 0 },
  },
  "framer-7xq6g6-container": {
    from: { rotate: -2, y: -180 },
    to: { rotate: 0, y: 0 },
  },
  // shared — badge "Blue Line" glow (pop in once fully in view)
  "framer-1ahrcnp": {
    from: { opacity: 0, scale: 0.3 },
    to: { opacity: 1, scale: 1 },
    appear: true,
    spring: { type: "spring", stiffness: 300, damping: 60, mass: 1, delay: 0.2 },
  },
};

function applyX(el: HTMLElement, v: Required<XTarget>) {
  const parts: string[] = [];
  if (v.x || v.y) parts.push(`translate(${v.x}px, ${v.y}px)`);
  if (v.rotate) parts.push(`rotate(${v.rotate}deg)`);
  if (v.scale !== 1) parts.push(`scale(${v.scale})`);
  el.style.transform = parts.length ? parts.join(" ") : "none";
  el.style.opacity = String(v.opacity);
}

function setupTransformEffects(root: ParentNode, lang: SiteLang = "en") {
  const flip = lang === "ar" ? -1 : 1; // mirror tilt direction for RTL
  Object.entries(TRANSFORM_EFFECTS).forEach(([cls, cfg]) => {
    const els = root.querySelectorAll<HTMLElement>(`.${cls}`);
    if (!els.length) return;

    els.forEach((el) => {
      if (el.dataset.nbXeff) return;
      el.dataset.nbXeff = "1";

      if (cfg.appear) {
        // trigger-based pop (once fully in view), matching __framer__threshold:1
        applyX(el, { opacity: cfg.from.opacity!, x: 0, y: 0, scale: cfg.from.scale!, rotate: 0 });
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.intersectionRatio < 1) return;
              io.disconnect();
              animate(
                el,
                { opacity: [cfg.from.opacity!, cfg.to.opacity!], scale: [cfg.from.scale!, cfg.to.scale!] },
                (cfg.spring ?? {
                  type: "spring",
                  stiffness: 300,
                  damping: 60,
                  mass: 1,
                }) as object
              );
            });
          },
          { threshold: 1 }
        );
        io.observe(el);
        onCleanup(() => io.disconnect());
        return;
      }

      // scroll-linked interpolation between from → to.
      // Progress is computed from the element's LAYOUT position (offsetTop
      // chain), never from getBoundingClientRect: the applied translateY/
      // rotate must not feed back into the measurement (that feedback is
      // what made the section feel stuck/janky while scrolling).
      const from = {
        opacity: cfg.from.opacity ?? 1,
        x: cfg.from.x ?? 0,
        y: cfg.from.y ?? 0,
        scale: cfg.from.scale ?? 1,
        rotate: (cfg.from.rotate ?? 0) * flip,
      };
      const to = {
        opacity: cfg.to.opacity ?? 1,
        x: cfg.to.x ?? 0,
        y: cfg.to.y ?? 0,
        scale: cfg.to.scale ?? 1,
        rotate: (cfg.to.rotate ?? 0) * flip,
      };
      el.style.willChange = "transform, opacity";

      let docTop = 0;
      const measure = () => {
        let t = 0;
        let n: HTMLElement | null = el;
        while (n) {
          t += n.offsetTop;
          n = n.offsetParent as HTMLElement | null;
        }
        docTop = t;
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      onCleanup(() => ro.disconnect());

      let dirty = true;
      let raf = 0;
      const paint = () => {
        raf = 0;
        if (!dirty) return;
        dirty = false;
        const vh = window.innerHeight;
        const h = el.offsetHeight || 1;
        // 0: element top at viewport bottom — 1: element bottom at viewport bottom
        const p = Math.min(1, Math.max(0, (window.scrollY + vh - docTop) / h));
        const cur = {
          opacity: from.opacity + (to.opacity - from.opacity) * p,
          x: from.x + (to.x - from.x) * p,
          y: from.y + (to.y - from.y) * p,
          scale: from.scale + (to.scale - from.scale) * p,
          rotate: from.rotate + (to.rotate - from.rotate) * p,
        };
        applyX(el, cur);
      };
      const schedule = () => {
        dirty = true;
        if (!raf) raf = requestAnimationFrame(paint);
      };

      paint();
      on(window, "scroll", schedule, { passive: true });
      on(window, "resize", schedule);
    });
  });
}

/* ------------------------------------------------------------------ */
/* Custom Select Component (Dark theme, accessible, downward opening) */
/* ------------------------------------------------------------------ */

function setupCustomSelects(root: ParentNode, siteLang: SiteLang = "en") {
  const wrappers = root.querySelectorAll<HTMLElement>(".framer-form-select-wrapper");
  if (!wrappers.length) return;

  wrappers.forEach((wrapper) => {
    if (wrapper.dataset.evexaSelectInit === "1") return;
    const select = wrapper.querySelector<HTMLSelectElement>("select");
    if (!select) return;

    wrapper.dataset.evexaSelectInit = "1";
    select.classList.add("evexa-custom-select-native");
    select.setAttribute("tabindex", "-1");
    select.setAttribute("aria-hidden", "true");

    // Extract options and optgroups
    const placeholderOption = select.querySelector<HTMLOptionElement>("option[disabled]") ?? select.options[0];
    const initialOption = select.options[select.selectedIndex] || placeholderOption;
    const isPlaceholder = !select.value || (initialOption && initialOption.disabled);

    // Create trigger
    const trigger = document.createElement("div");
    trigger.className = "evexa-select-trigger";
    trigger.setAttribute("role", "combobox");
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("tabindex", "0");

    const label = document.createElement("span");
    label.className = `evexa-select-label ${isPlaceholder ? "is-placeholder" : ""}`;
    label.textContent = initialOption ? initialOption.textContent : "";
    trigger.appendChild(label);

    const chevron = document.createElement("span");
    chevron.className = "evexa-select-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
    trigger.appendChild(chevron);

    // Create floating menu
    const menu = document.createElement("div");
    menu.className = "evexa-select-menu";
    menu.setAttribute("role", "listbox");
    menu.setAttribute("tabindex", "-1");

    // Build menu options
    const optionEls: { el: HTMLElement; value: string; text: string }[] = [];

    const buildOption = (opt: HTMLOptionElement) => {
      if (opt.disabled && !opt.value) return; // skip placeholder in list
      const item = document.createElement("div");
      item.className = "evexa-select-option";
      item.setAttribute("role", "option");
      item.dataset.value = opt.value;
      if (opt.value === select.value && select.value !== "") {
        item.classList.add("is-selected");
        item.setAttribute("aria-selected", "true");
      }

      const txt = document.createElement("span");
      txt.className = "evexa-select-option-text";
      txt.textContent = opt.textContent;
      item.appendChild(txt);

      const check = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      check.setAttribute("class", "evexa-select-option-check");
      check.setAttribute("viewBox", "0 0 24 24");
      check.innerHTML = `<polyline points="20 6 9 17 4 12" fill="none" stroke="#0055ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>`;
      item.appendChild(check);

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        selectValue(opt.value, opt.textContent || "");
      });

      menu.appendChild(item);
      optionEls.push({ el: item, value: opt.value, text: opt.textContent || "" });
    };

    // Iterate optgroups or direct children
    Array.from(select.children).forEach((child) => {
      if (child.tagName === "OPTGROUP") {
        const group = child as HTMLOptGroupElement;
        const groupHeader = document.createElement("div");
        groupHeader.className = "evexa-select-group-header";
        groupHeader.textContent = group.label;
        menu.appendChild(groupHeader);
        Array.from(group.querySelectorAll("option")).forEach(buildOption);
      } else if (child.tagName === "OPTION") {
        buildOption(child as HTMLOptionElement);
      }
    });

    const openMenu = () => {
      // Close all other open custom selects
      document.querySelectorAll(".evexa-select-trigger.evexa-select-open").forEach((t) => {
        if (t !== trigger) {
          t.classList.remove("evexa-select-open");
          t.setAttribute("aria-expanded", "false");
          const m = t.parentElement?.querySelector(".evexa-select-menu");
          m?.classList.remove("is-open");
        }
      });

      trigger.classList.add("evexa-select-open");
      trigger.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");

      // Scroll selected item into view
      const selectedItem = menu.querySelector<HTMLElement>(".evexa-select-option.is-selected");
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest" });
      }
    };

    const closeMenu = () => {
      trigger.classList.remove("evexa-select-open");
      trigger.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      optionEls.forEach((o) => o.el.classList.remove("is-highlighted"));
    };

    const selectValue = (val: string, text: string) => {
      select.value = val;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      select.dispatchEvent(new Event("input", { bubbles: true }));

      label.textContent = text;
      label.classList.remove("is-placeholder");

      optionEls.forEach((o) => {
        if (o.value === val) {
          o.el.classList.add("is-selected");
          o.el.setAttribute("aria-selected", "true");
        } else {
          o.el.classList.remove("is-selected");
          o.el.removeAttribute("aria-selected");
        }
      });

      closeMenu();
      trigger.focus();
    };

    // Trigger click
    on(trigger, "click", (e) => {
      e.stopPropagation();
      if (menu.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on outside click
    on(document, "pointerdown", (e) => {
      if (!wrapper.contains(e.target as Node)) {
        closeMenu();
      }
    });

    // Keyboard navigation
    let highlightIndex = -1;
    on(trigger, "keydown", (e: KeyboardEvent) => {
      const isOpen = menu.classList.contains("is-open");

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isOpen) {
          if (highlightIndex >= 0 && highlightIndex < optionEls.length) {
            const opt = optionEls[highlightIndex];
            selectValue(opt.value, opt.text);
          } else {
            closeMenu();
          }
        } else {
          openMenu();
        }
      } else if (e.key === "Escape") {
        if (isOpen) {
          e.preventDefault();
          closeMenu();
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) {
          openMenu();
          highlightIndex = Math.max(0, optionEls.findIndex((o) => o.value === select.value));
        } else {
          highlightIndex = (highlightIndex + 1) % optionEls.length;
        }
        updateHighlight();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) {
          openMenu();
          highlightIndex = Math.max(0, optionEls.findIndex((o) => o.value === select.value));
        } else {
          highlightIndex = (highlightIndex - 1 + optionEls.length) % optionEls.length;
        }
        updateHighlight();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Type-ahead jump to first matching option
        const char = e.key.toLowerCase();
        const foundIdx = optionEls.findIndex((o) => o.text.trim().toLowerCase().startsWith(char));
        if (foundIdx !== -1) {
          if (!isOpen) openMenu();
          highlightIndex = foundIdx;
          updateHighlight();
        }
      }
    });

    const updateHighlight = () => {
      optionEls.forEach((o, idx) => {
        if (idx === highlightIndex) {
          o.el.classList.add("is-highlighted");
          o.el.scrollIntoView({ block: "nearest" });
        } else {
          o.el.classList.remove("is-highlighted");
        }
      });
    };

    // Native form reset listener
    const form = select.form;
    if (form) {
      on(form, "reset", () => {
        setTimeout(() => {
          label.textContent = placeholderOption ? placeholderOption.textContent : "";
          label.classList.add("is-placeholder");
          optionEls.forEach((o) => {
            o.el.classList.remove("is-selected");
            o.el.removeAttribute("aria-selected");
          });
        }, 10);
      });
    }

    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);
  });
}

/* ------------------------------------------------------------------ */
/* main effect                                                         */
/* ------------------------------------------------------------------ */

export default function EvexaRuntime({ page, lang = "en" }: { page: string; lang?: string }) {
  const siteLang: SiteLang = lang === "ar" ? "ar" : "en";
  const router = useRouter();

  useEffect(() => {
    GEN += 1; // invalidate rAF loops / observers from any previous page
    const root = document.getElementById("main") ?? document.body;

    // Remember the language the visitor is actually browsing, so locale-less
    // internal links (/about, /contact…) stay in it — src/proxy.ts prefers
    // this cookie over the browser's Accept-Language header.
    document.cookie = `NEXT_LOCALE=${siteLang};path=/;max-age=31536000;samesite=lax`;

    // prefetch every internal route so client-side page swaps are instant,
    // like the original site's navigation
    ROUTES.forEach((r) => {
      try {
        router.prefetch(withLang(r, siteLang));
      } catch {}
    });

    const t = window.setTimeout(() => {
      ensureSprite(root);

      // Container fills (icon tiles, card arrows ↗, logos). When already
      // cached (2nd+ navigation) they apply synchronously; otherwise they
      // stream in as a static asset and are applied the moment they land.
      // flipRtlArrows re-runs afterwards because the fills inject the ↗
      // arrows that need mirroring on RTL pages.
      const applyFills = (fills: FillsByClass | null) => {
        fillContainers(root, fills);
        flipRtlArrows(root);
        // The fills inject content that several setups target: the card ↗
        // arrows and icons (hovers), the shimmer curves inside "SVG Path"
        // blocks, stars, audio waves… All of these are idempotent (guarded
        // by __nb* flags), so re-running them binds ONLY the new content —
        // without this, the injected elements never animate.
        setupHovers(root);
        setupCurveShimmers(root);
        setupPulses(root);
        setupAudioWaves(root);
        setupCircleTicker(root);
        setupDecor(root);
      };
      if (FILLS_CACHE[siteLang]) {
        applyFills(FILLS_CACHE[siteLang]);
      } else {
        const gen = GEN;
        loadFills(siteLang).then((fills) => {
          if (gen !== GEN) return; // navigated away meanwhile
          applyFills(fills);
        });
      }

      setupAppear(page, root);
      setupWordReveal(root);
      setupScrollReveal(root);
      setupTickers(root);
      setupAudioWaves(root);
      setupCurveShimmers(root);
      setupTransformEffects(root, siteLang);
      setupLightRays(root);
      setupCircleTicker(root);
      setupPulses(root);
      setupFaq(root, siteLang, page);
      setupDecor(root);
      setupVideo(root);
      setupHovers(root);
      setupCursor();
      setupLinksAndForms(root, (href) => router.push(href), siteLang);
      setupCustomSelects(root, siteLang);
    }, 0);

    return () => {
      window.clearTimeout(t);
      CLEANUPS.splice(0).forEach((fn) => fn());
    };
  }, [page, siteLang, router]);

  return null;
}
