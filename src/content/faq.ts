/**
 * Frequently asked questions, per page and language.
 * Shown by the FAQ section (components/sections/FaqSection.tsx).
 */
import type { Lang } from "@/config/site";

export type FaqItem = { question: string; answer: string };

export interface FaqContent {
  /** two-line heading; the second line is dimmed */
  title: [string, string];
  /** may contain "\n" for a deliberate line break */
  intro: string;
  items: FaqItem[];
}

export const FAQS: Record<string, Record<Lang, FaqContent>> = {
  "home": {
    en: {
      title: ["Frequently", "Asked Questions"],
      intro: "Answers to common questions about custom AI projects.",
      items: [
        {
          question: "Will we need new software?",
          answer: "Not necessarily. We review the systems you use and the options for integration first.",
        },
        {
          question: "Does it work in Arabic and English?",
          answer: "Yes, where the use case requires it. We test quality using representative business content.",
        },
        {
          question: "What is needed to start?",
          answer: "A short description of the workflow or problem is enough for an initial discussion.",
        },
        {
          question: "How do you handle our data?",
          answer: "We agree on data sources, access permissions, hosting, and security requirements in scope.",
        },
        {
          question: "How long does a project take?",
          answer: "It depends on complexity, data readiness, and integrations. We propose a plan after scoping.",
        },
        {
          question: "Do you also build products?",
          answer: "Yes. Custom AI is our core focus. We also build specialized products, including Dealplier.",
        },
      ],
    },
    ar: {
      title: ["الأسئلة", "الأكثر شيوعًا"],
      intro: "إجابات مباشرة عن أكثر الأسئلة شيوعًا حول مشاريع الذكاء الاصطناعي المخصصة.",
      items: [
        {
          question: "هل نحتاج إلى تغيير أنظمتنا؟",
          answer: "ليس بالضرورة. نراجع أنظمتكم الحالية وإمكانات ربطها قبل تحديد الحل.",
        },
        {
          question: "هل يدعم العربية والإنجليزية؟",
          answer: "نعم، وفق متطلبات المشروع، مع اختبار الجودة باستخدام محتوى من بيئة العمل.",
        },
        {
          question: "ما المطلوب للبدء؟",
          answer: "يكفي وصف مختصر للإجراء أو التحدي، ثم نحدد المتطلبات معًا.",
        },
        {
          question: "كيف تتعاملون مع بياناتنا؟",
          answer: "نحدد مصادر البيانات والصلاحيات والاستضافة ومتطلبات الأمان ضمن نطاق المشروع.",
        },
        {
          question: "كم يستغرق تنفيذ المشروع؟",
          answer: "يعتمد على تعقيد الحل وجاهزية البيانات والتكاملات، ونحدد الجدول بعد دراسة النطاق.",
        },
        {
          question: "هل تطوّرون منتجات أيضًا؟",
          answer: "نعم. نركز على الحلول المخصصة، ونطوّر منتجات متخصصة من بينها Dealplier.",
        },
      ],
    },
  },
  "about": {
    en: {
      title: ["Frequently", "Asked Questions"],
      intro: "Answers to common questions before starting a custom AI project with EVEXA.",
      items: [
        {
          question: "Do we need to replace our existing software?",
          answer: "Not necessarily. We first review the systems you use and the integration options they offer.",
        },
        {
          question: "Can the solution work in Arabic and English?",
          answer: "Yes, when the use case requires it. We test language quality using representative business content.",
        },
        {
          question: "What do you need from us to get started?",
          answer: "A description of the process or problem is enough for an initial discussion. We can define the data and technical requirements together.",
        },
        {
          question: "How do you approach data privacy and access?",
          answer: "We agree on data sources, user permissions, hosting, and security requirements as part of the project scope.",
        },
        {
          question: "How long does a project take?",
          answer: "It depends on data readiness, complexity, and integrations. We propose a delivery plan after understanding the scope.",
        },
        {
          question: "Do you offer products as well as custom AI solutions?",
          answer: "Yes. Custom AI solutions are our core focus. We also develop specialized products such as Dealplier for B2B sales teams.",
        },
      ],
    },
    ar: {
      title: ["الأسئلة", "الشائعة"],
      intro: "إجابات مباشرة عن الأسئلة الشائعة قبل بدء مشروع ذكاء اصطناعي مخصص مع EVEXA.",
      items: [
        {
          question: "هل نحتاج إلى استبدال أنظمتنا الحالية؟",
          answer: "ليس بالضرورة. نراجع الأنظمة المستخدمة وإمكانات ربطها قبل تحديد الحل.",
        },
        {
          question: "هل يمكن أن يعمل الحل بالعربية والإنجليزية؟",
          answer: "نعم، بحسب متطلبات المشروع، مع اختبار جودة الاستجابات باستخدام محتوى ممثل لبيئة العمل.",
        },
        {
          question: "ما الذي تحتاجونه منّا للبدء؟",
          answer: "يكفي وصف المشكلة أو الإجراء المراد تحسينه، ثم نحدد معًا البيانات والمتطلبات التقنية.",
        },
        {
          question: "كيف تتعاملون مع خصوصية البيانات والصلاحيات؟",
          answer: "نتفق على مصادر البيانات والصلاحيات والاستضافة ومتطلبات الأمان ضمن نطاق المشروع.",
        },
        {
          question: "كم يستغرق تنفيذ المشروع؟",
          answer: "يعتمد على جاهزية البيانات وتعقيد الحل والتكاملات. نضع خطة تنفيذ بعد فهم المتطلبات.",
        },
        {
          question: "هل تقدم EVEXA منتجات إلى جانب الحلول المخصصة؟",
          answer: "نعم. نركز على حلول الذكاء الاصطناعي المخصصة، ونطوّر كذلك منتجات متخصصة مثل Dealplier لدعم فرق مبيعات الشركات.",
        },
      ],
    },
  },
  "portfolio": {
    en: {
      title: ["Frequently", "Asked Questions"],
      intro: "A few useful details about the projects featured here.",
      items: [
        {
          question: "What kinds of projects are featured?",
          answer: "Selected AI solutions and operational platforms created for specific business needs.",
        },
        {
          question: "Is every featured project AI-powered?",
          answer: "No. We distinguish AI capabilities from business platforms that focus on structured workflows.",
        },
        {
          question: "Can a solution connect to existing systems?",
          answer: "Depending on the systems and available access, we assess integration options at the start.",
        },
        {
          question: "Can we see a project demonstration?",
          answer: "Public examples can be shared when available. Access to private systems depends on client permission.",
        },
        {
          question: "Can you explain the technical approach?",
          answer: "We can discuss relevant design and integration choices without exposing confidential project data.",
        },
        {
          question: "How do we start a similar project?",
          answer: "Tell us about your process, users, and challenges. We will help define the initial requirements.",
        },
      ],
    },
    ar: {
      title: ["الأسئلة", "الأكثر شيوعًا"],
      intro: "إجابات مختصرة عن المشاريع المعروضة وطريقة بدء مشروع مشابه.",
      items: [
        {
          question: "ما نوع المشاريع المعروضة؟",
          answer: "نماذج من حلول الذكاء الاصطناعي وأنظمة تشغيل الأعمال، صُممت لاحتياجات محددة.",
        },
        {
          question: "هل تعتمد جميع المشاريع على الذكاء الاصطناعي؟",
          answer: "لا. نوضح الفرق بين المزايا الذكية والأنظمة المخصصة لتنظيم إجراءات العمل.",
        },
        {
          question: "هل يمكن ربط الحل بأنظمتنا الحالية؟",
          answer: "نقيّم إمكانات الربط حسب الأنظمة المستخدمة والصلاحيات المتاحة ومتطلبات المشروع.",
        },
        {
          question: "هل يمكن الاطلاع على عرض تجريبي؟",
          answer: "نشارك العروض المتاحة للنشر، أما الأنظمة الداخلية فتخضع لموافقة أصحابها.",
        },
        {
          question: "هل يمكن معرفة التفاصيل التقنية؟",
          answer: "يمكننا مناقشة منهجية التطوير والتكامل دون كشف بيانات أو معلومات سرية.",
        },
        {
          question: "كيف نبدأ مشروعًا مشابهًا؟",
          answer: "أخبرنا بالإجراءات والمستخدمين والتحديات، لنحدد المتطلبات الأولية معًا.",
        },
      ],
    },
  },
  "contact": {
    en: {
      title: ["Frequently", "Asked Questions"],
      intro: "A few useful answers before you reach out to EVEXA.",
      items: [
        {
          question: "What should I include in my message?",
          answer: "Tell us what your business is trying to improve, how the work is handled today, and what outcome you have in mind. A short description is enough to start.",
        },
        {
          question: "Do I need a complete project brief?",
          answer: "No. We can begin with an initial conversation and work through the scope, data needs, and relevant systems together.",
        },
        {
          question: "Can you work with our current systems?",
          answer: "We assess integration options based on your existing software, available access, and project requirements. Not every system supports the same connections.",
        },
        {
          question: "Can I discuss a confidential project?",
          answer: "Yes. Start with a general description. Please do not send passwords, sensitive records, or confidential files through this form; we can discuss a suitable process for sharing details.",
        },
        {
          question: "Can I ask about Dealplier?",
          answer: "Yes. Mention Dealplier in your message, or visit dealplier.com to learn about the product.",
        },
        {
          question: "What happens after I submit the form?",
          answer: "Once your submission is confirmed, our team will review it and follow up through the email address you provided.",
        },
      ],
    },
    ar: {
      title: ["الأسئلة", "الأكثر شيوعًا"],
      intro: "عندك أسئلة؟ قسم الأسئلة الشائعة يجيب مع\nإجابات سريعة لأكثر الاستفسارات شيوعًا.",
      items: [
        {
          question: "ماذا أذكر في رسالتي؟",
          answer: "اذكر ما ترغب في تحسينه في أعمالك، وكيف تُدار العملية حاليًا، والنتيجة التي تسعى إليها. يكفي وصف مختصر للبدء.",
        },
        {
          question: "هل أحتاج إلى متطلبات جاهزة؟",
          answer: "لا. يمكننا البدء بمناقشة أولية ثم تحديد نطاق العمل والبيانات والأنظمة المرتبطة بالاحتياج.",
        },
        {
          question: "هل يمكن ربط الحل بأنظمتنا الحالية؟",
          answer: "نقيّم خيارات الربط وفق الأنظمة المستخدمة والصلاحيات المتاحة ومتطلبات المشروع؛ فإمكانات التكامل تختلف من نظام إلى آخر.",
        },
        {
          question: "هل يمكن مناقشة مشروع يتضمن معلومات سرية؟",
          answer: "نعم، ابدأ بوصف عام، وتجنّب إرسال كلمات المرور أو البيانات الحساسة أو الملفات السرية عبر النموذج. ويمكننا مناقشة وسيلة مناسبة لمشاركة التفاصيل.",
        },
        {
          question: "هل يمكنني الاستفسار عن Dealplier؟",
          answer: "نعم. اذكر Dealplier في رسالتك، أو اطّلع على تفاصيل المنتج من خلال موقعه.",
        },
        {
          question: "ماذا يحدث بعد إرسال النموذج؟",
          answer: "بعد تأكيد استلام الرسالة، يراجع فريقنا طلبك ويتواصل معك عبر البريد الإلكتروني الذي أدخلته.",
        },
      ],
    },
  },
  "portfolio-albetar": {
    en: {
      title: ["Frequently", "Asked Questions"],
      intro: "A closer look at the Albetar project and the technology behind it.",
      items: [
        {
          question: "Is BETO a standalone chatbot?",
          answer: "No. It works inside the store itself, alongside product pages and configuration, guiding customers while they choose.",
        },
        {
          question: "Can shoppers choose RAM and storage?",
          answer: "Yes. The configurator shows the alternatives, their prices and the selected state of each choice.",
        },
        {
          question: "How do customers know components are compatible?",
          answer: "Configuration options show compatibility indicators and notices about any additional requirements.",
        },
        {
          question: "Does the platform include store administration?",
          answer: "Yes. There are dedicated areas for products, orders, reviews, promotions and subscribers.",
        },
        {
          question: "Does it include analytics and forecasts?",
          answer: "Yes. The admin dashboard shows AI summaries and recommendations, revenue forecasting and unusual-activity indicators.",
        },
        {
          question: "Could this work for another retailer?",
          answer: "Yes. We shape it around your product data, catalog structure and the integrations available.",
        },
      ],
    },
    ar: {
      title: ["الأسئلة", "الشائعة"],
      intro: "إجابات مختصرة عن مشروع البيطار والتقنيات المستخدمة فيه.",
      items: [
        {
          question: "هل BETO مجرد نافذة محادثة؟",
          answer: "لا. يعمل ضمن تجربة المتجر نفسها، إلى جانب صفحات المنتجات والتخصيص، ليرشد العميل أثناء الاختيار.",
        },
        {
          question: "هل يمكن اختيار RAM ووحدة التخزين؟",
          answer: "نعم. تعرض واجهة التخصيص البدائل وأسعارها وحالة كل اختيار بوضوح.",
        },
        {
          question: "كيف يعرف العميل مدى توافق المكونات؟",
          answer: "تظهر على البدائل مؤشرات توافق وتنبيهات مرتبطة بالتكوين.",
        },
        {
          question: "هل توجد لوحة لإدارة المتجر؟",
          answer: "نعم، لإدارة المنتجات والطلبات والتقييمات والعروض والمشتركين.",
        },
        {
          question: "هل تتضمن المنصة تحليلات وتوقعات؟",
          answer: "نعم. تعرض لوحة الإدارة ملخصات وتوصيات ذكية، ومخططات لتوقع الإيرادات ورصد التغيرات غير المعتادة.",
        },
        {
          question: "هل يمكن تنفيذ فكرة مشابهة لمتجر آخر؟",
          answer: "نعم، ونصممها بحسب نوع المنتجات وجودة البيانات والتكاملات المتاحة.",
        },
      ],
    },
  },
  "portfolio-mohami-smart": {
    en: {
      title: ["Frequently", "Asked Questions"],
      intro: "A closer look at Mohami Smart and AI-assisted legal workflows.",
      items: [
        {
          question: "Can an AI-generated memo be used without review?",
          answer: "No. The draft is a working tool; the responsible lawyer checks the facts, sources and legal reasoning before using it.",
        },
        {
          question: "Can users review case facts before analysis?",
          answer: "Yes. There is a dedicated fact-review stage before the workflow moves on.",
        },
        {
          question: "Can suggested arguments be selected or edited?",
          answer: "Yes. Suggested arguments come with review, selection and editing controls.",
        },
        {
          question: "Does the platform only create legal drafts?",
          answer: "No. It also covers case and client management, documents, a calendar and other practice tools.",
        },
        {
          question: "Are different legal routes supported?",
          answer: "Yes, including defense memos and statements of claim, each with its own steps.",
        },
        {
          question: "Are documents and hearings managed in the platform?",
          answer: "Yes. It includes document areas, a hearing calendar and a legal library.",
        },
      ],
    },
    ar: {
      title: ["الأسئلة", "الأكثر شيوعًا"],
      intro: "إجابات مختصرة عن محامي سمارت وتطبيقات الذكاء الاصطناعي في العمل القانوني.",
      items: [
        {
          question: "هل تُغني المسودة عن مراجعة المحامي؟",
          answer: "لا. المسودة أداة مساعدة، ويتحقق المحامي المختص من الوقائع والمراجع والاستدلال قبل استخدامها.",
        },
        {
          question: "هل يمكن مراجعة الوقائع قبل التحليل؟",
          answer: "نعم. توجد مرحلة مستقلة لمراجعة الوقائع قبل استكمال المراحل التالية.",
        },
        {
          question: "هل يستطيع المستخدم اختيار الدفوع المقترحة؟",
          answer: "نعم. تُعرض الدفوع المقترحة مع أدوات للمراجعة والاختيار والتحرير.",
        },
        {
          question: "هل يقتصر النظام على كتابة المذكرات؟",
          answer: "لا. يتضمن أيضًا إدارة الموكلين والقضايا والمستندات والتقويم وأدوات قانونية أخرى.",
        },
        {
          question: "هل توجد مسارات قانونية مختلفة؟",
          answer: "نعم، منها مذكرة الدفاع وصحيفة الدعوى، ولكل مسار خطواته.",
        },
        {
          question: "هل تتوفر أدوات للمستندات والمواعيد؟",
          answer: "نعم. تضم المنصة صفحات للمستندات، وتقويمًا للجلسات، ومكتبة قانونية.",
        },
      ],
    },
  },
  "portfolio-business-operations": {
    en: {
      title: ["Frequently", "Asked Questions"],
      intro: "A closer look at the two platforms and what each one covers.",
      items: [
        {
          question: "Are HRMS and PMS one system?",
          answer: "No. They are distinct platforms, each with its own functions and users.",
        },
        {
          question: "What does the HRMS cover?",
          answer: "Employee records and indicators, leave, notes and administrative follow-ups.",
        },
        {
          question: "What does the PMS cover?",
          answer: "Projects, tasks, requests, materials, warehouses, clients, users and reports.",
        },
        {
          question: "Can managers generate project reports?",
          answer: "Yes. Reports cover project summaries, material usage and task completion.",
        },
        {
          question: "Is user administration included?",
          answer: "Yes. PMS manages users, their roles and their permissions.",
        },
        {
          question: "Where does AI come in?",
          answer: "Smart reports summarize project and material status, automatic alerts flag low stock and overdue follow-ups, and smart search finds employee and project records quickly.",
        },
      ],
    },
    ar: {
      title: ["الأسئلة", "الأكثر شيوعًا"],
      intro: "إجابات مختصرة عن النظامين وما يغطيه كل منهما.",
      items: [
        {
          question: "هل HRMS وPMS نظام واحد؟",
          answer: "لا، هما منصتان مختلفتان، لكل منهما وظائفها ومستخدموها.",
        },
        {
          question: "ماذا يغطي HRMS؟",
          answer: "ملفات الموظفين ومؤشراتهم، والإجازات، والملاحظات، والمتابعات الإدارية.",
        },
        {
          question: "ماذا يغطي PMS؟",
          answer: "المشاريع والمهام والطلبات والمواد والمستودعات والمستخدمين والعملاء والتقارير.",
        },
        {
          question: "هل توجد تقارير للمشاريع؟",
          answer: "نعم، تقارير لملخص المشاريع واستخدام المواد وإنجاز المهام.",
        },
        {
          question: "هل تتضمن الأنظمة إدارة للمستخدمين؟",
          answer: "نعم. يدير PMS المستخدمين وأدوارهم وصلاحياتهم.",
        },
        {
          question: "أين يظهر الذكاء الاصطناعي في النظامين؟",
          answer: "في تقارير ذكية تلخّص حالة المشاريع والمواد، وتنبيهات تلقائية لنقص المخزون والمتابعات المتأخرة، وبحث ذكي يصل إلى سجلات الموظفين والمشاريع بسرعة.",
        },
      ],
    },
  },
};
