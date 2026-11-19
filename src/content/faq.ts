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
  "portfolio-lemonide-tech": {
    en: {
      title: ["Frequently", "Asked Questions"],
      intro: "A closer look at the Albetar project and the technology behind it.",
      items: [
        {
          question: "What was built for Albetar?",
          answer: "An Arabic-first hardware commerce platform with customer shopping flows, a retail operations dashboard, and integrated AI modules for search and insights.",
        },
        {
          question: "What does the AI search do?",
          answer: "It interprets product queries in Arabic and English and uses semantic retrieval and hardware-aware ranking to surface relevant items.",
        },
        {
          question: "Can shoppers configure hardware?",
          answer: "The platform includes a device customization flow with compatibility checks for supported hardware choices.",
        },
        {
          question: "How does AI support the store team?",
          answer: "AI modules provide review analysis, business data Q&A, KPI summaries, and revenue forecasting to support day-to-day decisions.",
        },
        {
          question: "Does the platform support both Arabic and English?",
          answer: "Yes. The experience is designed bilingual with full right-to-left layout support for Arabic.",
        },
        {
          question: "Can a similar solution be built for our business?",
          answer: "We can assess your store's technical requirements, catalog complexity, and operational workflows to scope a tailored platform.",
        },
      ],
    },
    ar: {
      title: ["الأسئلة", "الشائعة"],
      intro: "إجابات مختصرة عن مشروع البيطار والتقنيات المستخدمة فيه.",
      items: [
        {
          question: "ما الذي تم بناؤه لمشروع البيطار؟",
          answer: "منصة تجارة أجهزة كمبيوتر باللغة العربية أولًا، تتضمن مسار تسوق متكامل، ولوحة تحكم لإدارة العمليات، ووحدات ذكاء اصطناعي مدمجة للبحث والتحليل.",
        },
        {
          question: "ما وظيفة البحث الذكي في المتجر؟",
          answer: "يفهم استفسارات المنتجات بالعربية والإنجليزية، ويعتمد على البحث الدلالي وترتيب الأجهزة وفق المواصفات للوصول إلى خيارات دقيقة.",
        },
        {
          question: "هل يمكن للمشتري تخصيص مواصفات الجهاز؟",
          answer: "تتضمن المنصة مسارًا لتخصيص الأجهزة مع التحقق من توافق المكونات المدعومة.",
        },
        {
          question: "كيف يساعد الذكاء الاصطناعي فريق المتجر؟",
          answer: "تدعم الوحدات الذكية تحليل التقييمات، والاستفسار عن بيانات الأعمال، وتلخيص المؤشرات، والتنبؤ بالإيرادات للمساعدة في اتخاذ القرارات.",
        },
        {
          question: "هل تدعم المنصة العربية والإنجليزية؟",
          answer: "نعم، يتضمن المشروع واجهة باللغتين، مع دعم اتجاه العرض من اليمين إلى اليسار في العربية.",
        },
        {
          question: "هل يمكن تطوير حل مشابه لشركتنا؟",
          answer: "يمكننا دراسة احتياج شركتك وأنظمتها وبياناتها لتحديد المكونات المناسبة لحل مخصص.",
        },
      ],
    },
  },
  "portfolio-million-one": {
    en: {
      title: ["Frequently", "Asked Questions"],
      intro: "A closer look at Mohami Smart and AI-assisted legal workflows.",
      items: [
        {
          question: "What is Mohami Smart?",
          answer: "An AI-assisted legal platform with tools for managing cases and clients, analyzing documents, and preparing draft legal materials.",
        },
        {
          question: "Which legal workflows does it support?",
          answer: "The official platform describes case and client records, document uploads, judgment analysis, drafting support, and a legal AI assistant.",
        },
        {
          question: "Does AI replace the lawyer’s judgment?",
          answer: "No. Generated analysis and drafts are assistance tools; the lawyer remains responsible for reviewing the content and deciding how to use it.",
        },
        {
          question: "Can it work with uploaded case documents?",
          answer: "Yes. The documented workflow allows users to add case files and documents, then request AI-assisted analysis and drafting.",
        },
        {
          question: "Is the platform focused on Egyptian law?",
          answer: "The official documentation describes support for Egyptian legislation. Any wider jurisdictional coverage should be confirmed with the platform operator.",
        },
        {
          question: "Can we discuss a similar AI workflow?",
          answer: "Yes. Share your use case, documents, and review requirements with EVEXA so we can discuss whether a custom solution would be appropriate.",
        },
      ],
    },
    ar: {
      title: ["الأسئلة", "الأكثر شيوعًا"],
      intro: "إجابات مختصرة عن محامي سمارت وتطبيقات الذكاء الاصطناعي في العمل القانوني.",
      items: [
        {
          question: "ما هي منصة محامي سمارت؟",
          answer: "منصة قانونية مدعومة بأدوات ذكاء اصطناعي لإدارة القضايا والموكلين، وتحليل المستندات، والمساعدة في إعداد المسودات القانونية.",
        },
        {
          question: "ما العمليات القانونية التي تدعمها؟",
          answer: "يذكر الموقع الرسمي إدارة الملفات والموكلين ورفع المستندات وتحليل الأحكام والمساعدة في الصياغة والمحادثة الذكية.",
        },
        {
          question: "هل يحل الذكاء الاصطناعي محل المحامي؟",
          answer: "لا. تظل المخرجات أدوات مساعدة، ويتحمل المحامي مسؤولية مراجعتها وتقييمها واتخاذ القرار المهني.",
        },
        {
          question: "هل يمكن تحليل مستندات القضايا المرفوعة؟",
          answer: "نعم، تتضمن رحلة الاستخدام إضافة المستندات والأحكام إلى ملف القضية، ثم طلب التحليل والصياغة بمساعدة الذكاء الاصطناعي.",
        },
        {
          question: "هل تدعم المنصة التشريعات المصرية؟",
          answer: "يوضح الموقع الرسمي أن تركيز المنصة الحالي على القوانين المصرية. ويجب التأكد من مشغلها بشأن أي تغطية قانونية لدول أخرى.",
        },
        {
          question: "هل يمكن مناقشة حل مشابه لأعمالنا؟",
          answer: "نعم. يمكنكم مشاركة طبيعة العمل والمستندات ومتطلبات المراجعة مع EVEXA لمناقشة مدى ملاءمة حل ذكاء اصطناعي مخصص.",
        },
      ],
    },
  },
  "portfolio-viper-studio": {
    en: {
      title: ["Frequently", "Asked Questions"],
      intro: "A closer look at the two operational platforms and what each one covers.",
      items: [
        {
          question: "Are the HRMS and PMS one system?",
          answer: "No. BDCC HRMS and Bin Delamah PMS are two distinct platforms serving separate HR and construction workflows. The published case studies do not document an integration between them.",
        },
        {
          question: "What does the HRMS cover?",
          answer: "It brings together employee records, project staffing, HR requests, fleet and finance processes, documents, and audit history.",
        },
        {
          question: "What does the PMS manage?",
          answer: "The PMS covers materials, warehouses, approvals, gate passes, BOQ tracking, and executive project reporting.",
        },
        {
          question: "How is access managed?",
          answer: "Both case studies describe role-based access. The PMS also lists row-level security, while the HRMS supports access across multiple companies.",
        },
        {
          question: "Do these projects include AI features?",
          answer: "The published case studies describe operational software, not AI functionality. We present them as examples of business-systems engineering.",
        },
        {
          question: "Could we explore similar workflows?",
          answer: "Yes. Share the operational processes you want to improve, and we can explore a practical scope. Any AI capabilities can be evaluated separately where they make sense.",
        },
      ],
    },
    ar: {
      title: ["الأسئلة", "الأكثر شيوعًا"],
      intro: "لديك أسئلة؟ يوفر لك قسم الأسئلة الشائعة إجابات سريعة عن أكثر الاستفسارات شيوعًا.",
      items: [
        {
          question: "هل HRMS وPMS نظام واحد؟",
          answer: "لا. هما منصتان مستقلتان؛ الأولى للموارد البشرية والعمليات الإدارية، والثانية للمشاريع الإنشائية. ولا تذكر دراستا الحالة المنشورتان وجود تكامل بينهما.",
        },
        {
          question: "ما الذي يديره نظام HRMS؟",
          answer: "يدعم ملفات الموظفين وتوزيعهم على المشاريع وإجراءات الموارد البشرية والأسطول والمالية والمستندات وسجلات المراجعة.",
        },
        {
          question: "ما الذي يغطيه نظام PMS؟",
          answer: "يشمل إدارة المواد والمستودعات والموافقات وتصاريح البوابات وتتبع جداول الكميات (BOQ) والتقارير التنفيذية.",
        },
        {
          question: "كيف تُدار صلاحيات المستخدمين؟",
          answer: "يدعم النظامان صلاحيات مبنية على الأدوار. ويذكر توثيق PMS كذلك حماية البيانات على مستوى الصفوف، بينما يدعم HRMS العمل عبر شركات متعددة.",
        },
        {
          question: "هل تتضمن المنصتان مزايا ذكاء اصطناعي؟",
          answer: "لا تتضمن دراستا الحالة المنشورتان وصفًا لمزايا ذكاء اصطناعي. نعرض المشروعين بوصفهما مثالين على تطوير أنظمة الأعمال.",
        },
        {
          question: "هل يمكن مناقشة احتياج مشابه؟",
          answer: "نعم. شاركنا طبيعة الإجراءات والتحديات التي تواجه فريقك، لنناقش نطاق الحل المناسب. وتُدرس أي إمكانات ذكاء اصطناعي بشكل مستقل عند الحاجة.",
        },
      ],
    },
  },
};
