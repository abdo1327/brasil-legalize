/**
 * Internationalization (i18n) Configuration
 * Brasil Legalize - Immigration Law Services
 *
 * DEFAULT LOCALE: Arabic (ar) - RTL
 * Supported: ar, en, es, pt-br
 *
 * @see lib/design-tokens.ts for i18n design configuration
 */

export const locales = ["ar", "en", "es", "pt-br"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const localeNames: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
  es: "Español",
  "pt-br": "Português",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  ar: "rtl",
  en: "ltr",
  es: "ltr",
  "pt-br": "ltr",
};

// ============================================================================
// DICTIONARY INTERFACE
// ============================================================================

export interface Dictionary {
  brand: {
    name: string;
    tagline: string;
    description: string;
  };
  nav: {
    home: string;
    services: string;
    process: string;
    about: string;
    faq: string;
    contact: string;
  };
  cta: {
    startCase: string;
    getStarted: string;
    learnMore: string;
    checkEligibility: string;
    contactUs: string;
    sendMessage: string;
    submit: string;
    viewServices: string;
    readMore: string;
    scheduleConsult: string;
  };
  home: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
    };
    features: {
      title: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    };
    testimonials: {
      title: string;
    };
    stats: {
      title: string;
      cases: string;
      countries: string;
      satisfaction: string;
      experience: string;
    };
  };
  services: {
    title: string;
    subtitle: string;
    description: string;
    items: {
      visa: {
        title: string;
        description: string;
        features: string[];
      };
      residency: {
        title: string;
        description: string;
        features: string[];
      };
      citizenship: {
        title: string;
        description: string;
        features: string[];
      };
      business: {
        title: string;
        description: string;
        features: string[];
      };
      family: {
        title: string;
        description: string;
        features: string[];
      };
      deportation: {
        title: string;
        description: string;
        features: string[];
      };
    };
  };
  process: {
    title: string;
    subtitle: string;
    description: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    mission: {
      title: string;
      description: string;
    };
    team: {
      title: string;
      description: string;
    };
    values: {
      title: string;
      items: Array<{
        title: string;
        description: string;
      }>;
    };
  };
  faq: {
    title: string;
    subtitle: string;
    description: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
    contact: {
      title: string;
      description: string;
    };
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    form: {
      name: string;
      email: string;
      phone: string;
      service: string;
      message: string;
      selectService: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      messagePlaceholder: string;
    };
    info: {
      title: string;
      address: string;
      phone: string;
      email: string;
      hours: string;
      hoursValue: string;
    };
  };
  footer: {
    description: string;
    quickLinks: string;
    legal: string;
    privacy: string;
    terms: string;
    cookies: string;
    followUs: string;
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      button: string;
    };
    copyright: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    required: string;
    optional: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    open: string;
    menu: string;
    search: string;
    language: string;
    year: string;
    years: string;
    country: string;
    countries: string;
  };
  validation: {
    required: string;
    email: string;
    phone: string;
    minLength: string;
    maxLength: string;
  };
  errors: {
    notFound: {
      title: string;
      description: string;
      action: string;
    };
    serverError: {
      title: string;
      description: string;
      action: string;
    };
  };
  cookies: {
    title: string;
    bannerText: string;
    accept: string;
    reject: string;
    learnMore: string;
  };
  privacy: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    lastUpdated: string;
    tableOfContents: string;
    manageConsent: string;
    withdrawConsent: string;
    acceptCookies: string;
    exportData: string;
    confirmWithdraw: string;
    confirmWithdrawText: string;
    confirmWithdrawButton: string;
    consentStatus: {
      accepted: string;
      rejected: string;
      pending: string;
    };
    toc: {
      introduction: string;
      dataController: string;
      dataCollected: string;
      dataUse: string;
      legalBasis: string;
      dataSharing: string;
      dataRetention: string;
      yourRights: string;
      cookies: string;
      security: string;
      contact: string;
    };
    sections: {
      introduction: {
        title: string;
        content: string;
      };
      dataController: {
        title: string;
        content: string;
      };
      dataCollected: {
        title: string;
        content: string;
        items: string[];
      };
      dataUse: {
        title: string;
        content: string;
        items: string[];
      };
      legalBasis: {
        title: string;
        content: string;
        items: string[];
      };
      dataSharing: {
        title: string;
        content: string;
      };
      dataRetention: {
        title: string;
        content: string;
      };
      yourRights: {
        title: string;
        content: string;
        items: string[];
      };
      cookies: {
        title: string;
        content: string;
      };
      security: {
        title: string;
        content: string;
      };
      contact: {
        title: string;
        content: string;
        email: string;
      };
    };
    cookieTable: {
      name: string;
      purpose: string;
      type: string;
      duration: string;
    };
  };
  terms: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    lastUpdated: string;
    sections: {
      acceptance: {
        title: string;
        content: string;
      };
      services: {
        title: string;
        content: string;
      };
      userResponsibilities: {
        title: string;
        content: string;
      };
      intellectualProperty: {
        title: string;
        content: string;
      };
      limitation: {
        title: string;
        content: string;
      };
      disputes: {
        title: string;
        content: string;
      };
      governingLaw: {
        title: string;
        content: string;
      };
      changes: {
        title: string;
        content: string;
      };
      contact: {
        title: string;
        content: string;
      };
    };
  };
  eligibility: {
    pageTitle: string;
    pageDescription: string;
    title: string;
    subtitle: string;
    back: string;
    next: string;
    submit: string;
    startOver: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    city: string;
    cityPlaceholder: string;
    consentText: string;
  };
}

// ============================================================================
// ARABIC DICTIONARY (DEFAULT - RTL)
// ============================================================================

const ar: Dictionary = {
  brand: {
    name: "برازيل ليجالايز",
    tagline: "شريكك القانوني الموثوق في البرازيل",
    description:
      "خدمات قانونية متخصصة في الهجرة والإقامة والجنسية البرازيلية",
  },
  nav: {
    home: "الرئيسية",
    services: "خدماتنا",
    process: "آلية العمل",
    about: "من نحن",
    faq: "الأسئلة الشائعة",
    contact: "اتصل بنا",
  },
  cta: {
    startCase: "تقديم طلب",
    getStarted: "ابدأ الآن",
    learnMore: "اعرف المزيد",
    checkEligibility: "تحقق من أهليتك",
    contactUs: "تواصل معنا",
    sendMessage: "إرسال الرسالة",
    submit: "تقديم طلب",
    viewServices: "استعرض خدماتنا",
    readMore: "اقرأ المزيد",
    scheduleConsult: "احجز استشارة",
  },
  home: {
    hero: {
      title: "طريقك القانوني إلى البرازيل",
      subtitle: "خبراء في قانون الهجرة البرازيلي",
      description:
        "نساعدك في الحصول على التأشيرات والإقامة والجنسية البرازيلية بكل سهولة وأمان. فريقنا من المحامين المتخصصين جاهز لخدمتك.",
    },
    features: {
      title: "لماذا تختارنا؟",
      items: [
        {
          title: "خبرة قانونية متخصصة",
          description:
            "فريق من المحامين المرخصين ذوي الخبرة العميقة في قانون الهجرة البرازيلي",
        },
        {
          title: "دعم متعدد اللغات",
          description:
            "نتحدث العربية والإنجليزية والإسبانية والبرتغالية لخدمتك بلغتك",
        },
        {
          title: "متابعة شفافة",
          description:
            "تتبع حالة قضيتك في أي وقت عبر بوابتنا الإلكترونية الآمنة",
        },
        {
          title: "نسبة نجاح عالية",
          description: "سجل حافل بالنجاحات في مختلف أنواع القضايا الهجرة",
        },
      ],
    },
    testimonials: {
      title: "ماذا يقول عملاؤنا",
    },
    stats: {
      title: "إنجازاتنا بالأرقام",
      cases: "قضية ناجحة",
      countries: "دولة",
      satisfaction: "رضا العملاء",
      experience: "سنوات خبرة",
    },
  },
  services: {
    title: "خدماتنا القانونية",
    subtitle: "حلول شاملة لجميع احتياجاتك القانونية",
    description:
      "نقدم مجموعة واسعة من الخدمات القانونية المتخصصة في الهجرة والإقامة في البرازيل",
    items: {
      visa: {
        title: "تأشيرات الدخول",
        description:
          "نساعدك في الحصول على جميع أنواع التأشيرات البرازيلية بما في ذلك تأشيرات العمل والسياحة والدراسة",
        features: [
          "تأشيرة العمل (VITEM V)",
          "تأشيرة السياحة (VITUR)",
          "تأشيرة الطالب (VITEM IV)",
          "تأشيرة الاستثمار",
          "تأشيرة رائد الأعمال",
        ],
      },
      residency: {
        title: "الإقامة الدائمة",
        description:
          "احصل على إقامتك الدائمة في البرازيل مع دعم قانوني شامل طوال العملية",
        features: [
          "إقامة عن طريق الزواج",
          "إقامة عن طريق العمل",
          "إقامة المستثمر",
          "إقامة التقاعد",
          "لم شمل الأسرة",
        ],
      },
      citizenship: {
        title: "الجنسية البرازيلية",
        description:
          "تحقق حلمك بالحصول على الجنسية البرازيلية مع فريقنا المتخصص",
        features: [
          "التجنس العادي",
          "التجنس المبكر",
          "استعادة الجنسية",
          "الجنسية بالنسب",
          "الجنسية للمستثمرين",
        ],
      },
      business: {
        title: "تأسيس الشركات",
        description: "ابدأ عملك التجاري في البرازيل مع الدعم القانوني الكامل",
        features: [
          "تأسيس الشركات",
          "تأشيرات الأعمال",
          "التراخيص التجارية",
          "الامتثال الضريبي",
          "العقود التجارية",
        ],
      },
      family: {
        title: "لم شمل الأسرة",
        description: "اجمع شمل عائلتك في البرازيل مع خدماتنا المتخصصة",
        features: [
          "تأشيرة الأزواج",
          "تأشيرة الأبناء",
          "تأشيرة الوالدين",
          "تأشيرة المعالين",
          "توثيق العلاقات الأسرية",
        ],
      },
      deportation: {
        title: "قضايا الترحيل",
        description:
          "دفاع قانوني متخصص في قضايا الترحيل وإلغاء أوامر الإبعاد",
        features: [
          "الطعن في قرارات الترحيل",
          "طلبات اللجوء",
          "تسوية الأوضاع",
          "الإعفاءات القانونية",
          "التمثيل أمام المحاكم",
        ],
      },
    },
  },
  process: {
    title: "آلية العمل",
    subtitle: "كيف نعمل معك",
    description:
      "نتبع منهجية واضحة ومنظمة لضمان نجاح قضيتك من البداية حتى النهاية",
    steps: [
      {
        title: "الاستشارة الأولية",
        description:
          "نبدأ بفهم وضعك وأهدافك من خلال استشارة مجانية شاملة مع أحد خبرائنا",
      },
      {
        title: "تقييم الحالة",
        description:
          "نقوم بتحليل دقيق لحالتك وتحديد أفضل المسارات القانونية المتاحة",
      },
      {
        title: "جمع المستندات",
        description:
          "نساعدك في تجميع وتجهيز جميع المستندات المطلوبة بالشكل الصحيح",
      },
      {
        title: "تقديم الطلب",
        description:
          "نتولى تقديم طلبك للجهات المختصة ومتابعته حتى الحصول على الموافقة",
      },
      {
        title: "المتابعة والدعم",
        description:
          "نبقى معك طوال العملية ونقدم لك التحديثات والدعم اللازم في كل مرحلة",
      },
    ],
  },
  about: {
    title: "من نحن",
    subtitle: "شريكك القانوني الموثوق",
    description:
      "برازيل ليجالايز هو مكتب قانوني متخصص في خدمات الهجرة والإقامة في البرازيل، نخدم عملاءنا من جميع أنحاء العالم",
    mission: {
      title: "مهمتنا",
      description:
        "نسعى لتقديم أعلى مستويات الخدمة القانونية في مجال الهجرة، مع الالتزام بالشفافية والنزاهة وتحقيق أفضل النتائج لعملائنا",
    },
    team: {
      title: "فريقنا",
      description:
        "يضم فريقنا نخبة من المحامين المرخصين في البرازيل، ذوي الخبرة الواسعة في قانون الهجرة الدولي",
    },
    values: {
      title: "قيمنا",
      items: [
        {
          title: "النزاهة",
          description: "نلتزم بأعلى معايير الأخلاق المهنية في جميع تعاملاتنا",
        },
        {
          title: "التميز",
          description: "نسعى دائماً لتقديم أفضل الحلول القانونية لعملائنا",
        },
        {
          title: "الشفافية",
          description: "نحافظ على التواصل المفتوح والصادق مع عملائنا",
        },
        {
          title: "الالتزام",
          description: "نكرس جهودنا لتحقيق أهداف عملائنا بكل إخلاص",
        },
      ],
    },
  },
  faq: {
    title: "الأسئلة الشائعة",
    subtitle: "إجابات على أكثر الأسئلة تكراراً",
    description: "تجد هنا إجابات على الأسئلة الأكثر شيوعاً حول خدماتنا",
    items: [
      {
        question: "كم تستغرق عملية الحصول على التأشيرة؟",
        answer:
          "تختلف المدة حسب نوع التأشيرة، لكن عادة ما تتراوح بين 30 إلى 90 يوماً. سنقدم لك جدولاً زمنياً دقيقاً بعد تقييم حالتك.",
      },
      {
        question: "ما هي تكلفة خدماتكم؟",
        answer:
          "تعتمد التكلفة على نوع الخدمة ومدى تعقيد الحالة. نقدم استشارة مجانية أولية لتقييم حالتك وتحديد التكلفة بشكل شفاف.",
      },
      {
        question: "هل يمكنني متابعة حالة طلبي؟",
        answer:
          "نعم، نوفر بوابة إلكترونية آمنة يمكنك من خلالها متابعة حالة طلبك ورفع المستندات والتواصل مع فريقنا في أي وقت.",
      },
      {
        question: "ما هي المستندات المطلوبة؟",
        answer:
          "تختلف المستندات المطلوبة حسب نوع الطلب. سنزودك بقائمة تفصيلية بجميع المستندات المطلوبة بعد الاستشارة الأولية.",
      },
      {
        question: "هل تقدمون خدماتكم لجميع الجنسيات؟",
        answer:
          "نعم، نقدم خدماتنا لجميع الجنسيات. لدينا خبرة في التعامل مع عملاء من أكثر من 50 دولة حول العالم.",
      },
      {
        question: "ماذا يحدث إذا تم رفض طلبي؟",
        answer:
          "في حالة الرفض، نقوم بتحليل الأسباب ونساعدك في تقديم استئناف أو إعادة التقديم مع معالجة نقاط الضعف.",
      },
    ],
    contact: {
      title: "لم تجد إجابتك؟",
      description: "تواصل معنا مباشرة وسنجيب على جميع استفساراتك",
    },
  },
  contact: {
    title: "تواصل معنا",
    subtitle: "نحن هنا لمساعدتك",
    description: "تواصل معنا اليوم للحصول على استشارة مجانية حول قضيتك",
    form: {
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      service: "الخدمة المطلوبة",
      message: "رسالتك",
      selectService: "اختر الخدمة",
      namePlaceholder: "أدخل اسمك الكامل",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      phonePlaceholder: "+966 5XX XXX XXXX",
      messagePlaceholder: "اكتب رسالتك هنا...",
    },
    info: {
      title: "معلومات الاتصال",
      address: "ساو باولو، البرازيل",
      phone: "+55 11 XXXX-XXXX",
      email: "info@brasillegalize.com",
      hours: "ساعات العمل",
      hoursValue: "الأحد - الخميس: 9 صباحاً - 6 مساءً",
    },
  },
  footer: {
    description:
      "برازيل ليجالايز - شريكك القانوني الموثوق في خدمات الهجرة والإقامة في البرازيل",
    quickLinks: "روابط سريعة",
    legal: "قانوني",
    privacy: "سياسة الخصوصية",
    terms: "الشروط والأحكام",
    cookies: "سياسة ملفات الارتباط",
    followUs: "تابعنا",
    newsletter: {
      title: "النشرة الإخبارية",
      description: "اشترك للحصول على آخر التحديثات والنصائح القانونية",
      placeholder: "بريدك الإلكتروني",
      button: "اشتراك",
    },
    copyright: "جميع الحقوق محفوظة",
  },
  common: {
    loading: "جارٍ التحميل...",
    error: "حدث خطأ",
    success: "تم بنجاح",
    required: "مطلوب",
    optional: "اختياري",
    back: "رجوع",
    next: "التالي",
    previous: "السابق",
    close: "إغلاق",
    open: "فتح",
    menu: "القائمة",
    search: "بحث",
    language: "اللغة",
    year: "سنة",
    years: "سنوات",
    country: "دولة",
    countries: "دول",
  },
  validation: {
    required: "هذا الحقل مطلوب",
    email: "يرجى إدخال بريد إلكتروني صحيح",
    phone: "يرجى إدخال رقم هاتف صحيح",
    minLength: "يجب أن يحتوي على {min} أحرف على الأقل",
    maxLength: "يجب ألا يتجاوز {max} حرفاً",
  },
  errors: {
    notFound: {
      title: "الصفحة غير موجودة",
      description: "عذراً، الصفحة التي تبحث عنها غير موجودة",
      action: "العودة للرئيسية",
    },
    serverError: {
      title: "خطأ في الخادم",
      description: "عذراً، حدث خطأ غير متوقع. يرجى المحاولة لاحقاً",
      action: "إعادة المحاولة",
    },
  },
  cookies: {
    title: "إشعار ملفات تعريف الارتباط",
    bannerText: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا.",
    accept: "قبول",
    reject: "رفض",
    learnMore: "معرفة المزيد",
  },
  privacy: {
    title: "سياسة الخصوصية",
    metaTitle: "سياسة الخصوصية | برازيل ليجالايز",
    metaDescription: "تعرف على كيفية جمع واستخدام وحماية بياناتك الشخصية وفقاً لقانون LGPD البرازيلي",
    lastUpdated: "آخر تحديث",
    tableOfContents: "جدول المحتويات",
    manageConsent: "إدارة الموافقة",
    withdrawConsent: "سحب الموافقة",
    acceptCookies: "قبول ملفات تعريف الارتباط",
    exportData: "تصدير بياناتي",
    confirmWithdraw: "تأكيد سحب الموافقة",
    confirmWithdrawText: "هل أنت متأكد من رغبتك في سحب موافقتك؟ سيتم إيقاف التحليلات وحذف ملفات تعريف الارتباط غير الضرورية.",
    confirmWithdrawButton: "نعم، سحب الموافقة",
    consentStatus: {
      accepted: "لقد قبلت ملفات تعريف الارتباط",
      rejected: "لقد رفضت ملفات تعريف الارتباط",
      pending: "لم تتخذ قراراً بعد",
    },
    toc: {
      introduction: "مقدمة",
      dataController: "مسؤول البيانات",
      dataCollected: "البيانات التي نجمعها",
      dataUse: "كيف نستخدم بياناتك",
      legalBasis: "الأساس القانوني",
      dataSharing: "مشاركة البيانات",
      dataRetention: "الاحتفاظ بالبيانات",
      yourRights: "حقوقك",
      cookies: "ملفات تعريف الارتباط",
      security: "الأمان",
      contact: "اتصل بنا",
    },
    sections: {
      introduction: {
        title: "مقدمة",
        content: "برازيل ليجالايز ملتزمة بحماية خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية وفقاً للقانون العام لحماية البيانات البرازيلي (LGPD).",
      },
      dataController: {
        title: "مسؤول البيانات",
        content: "برازيل ليجالايز هي مسؤولة البيانات لمعلوماتك الشخصية. للاستفسارات المتعلقة بالخصوصية، يرجى التواصل معنا.",
      },
      dataCollected: {
        title: "البيانات التي نجمعها",
        content: "نجمع أنواعاً مختلفة من المعلومات لتقديم خدماتنا:",
        items: [
          "بيانات التعريف الشخصي (الاسم، البريد الإلكتروني، الهاتف)",
          "معلومات الاتصال",
          "تفاصيل الاستفسار عن الخدمات",
          "المستندات المرفوعة (عند الحاجة)",
          "بيانات الاستخدام والتحليلات",
          "معلومات الجهاز والمتصفح",
        ],
      },
      dataUse: {
        title: "كيف نستخدم بياناتك",
        content: "نستخدم بياناتك للأغراض التالية:",
        items: [
          "تقديم وتحسين خدماتنا",
          "الرد على استفساراتك",
          "معالجة طلباتك",
          "إرسال اتصالات ذات صلة",
          "الامتثال للمتطلبات القانونية",
        ],
      },
      legalBasis: {
        title: "الأساس القانوني للمعالجة (LGPD)",
        content: "نعالج بياناتك بناءً على:",
        items: [
          "موافقتك",
          "تنفيذ العقد",
          "الالتزامات القانونية",
          "المصالح المشروعة",
        ],
      },
      dataSharing: {
        title: "مشاركة البيانات",
        content: "قد نشارك بياناتك مع مقدمي خدمات الطرف الثالث والسلطات الحكومية (عند الطلب). نحن لا نبيع بياناتك الشخصية أبداً.",
      },
      dataRetention: {
        title: "الاحتفاظ بالبيانات",
        content: "نحتفظ ببياناتك للمدة اللازمة لتقديم خدماتنا والامتثال للالتزامات القانونية. بعد ذلك، يتم حذف البيانات بشكل آمن.",
      },
      yourRights: {
        title: "حقوقك بموجب LGPD",
        content: "لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:",
        items: [
          "الحق في الوصول إلى بياناتك",
          "الحق في تصحيح البيانات",
          "الحق في حذف البيانات",
          "الحق في نقل البيانات",
          "الحق في الاعتراض",
          "الحق في سحب الموافقة",
        ],
      },
      cookies: {
        title: "ملفات تعريف الارتباط والتتبع",
        content: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. ملفات تعريف الارتباط الوظيفية ضرورية لعمل الموقع، بينما تتطلب ملفات تعريف الارتباط التحليلية موافقتك.",
      },
      security: {
        title: "التدابير الأمنية",
        content: "نطبق تدابير أمنية مناسبة لحماية بياناتك من الوصول غير المصرح به والتعديل والإفشاء والتدمير.",
      },
      contact: {
        title: "اتصل بنا",
        content: "للاستفسارات المتعلقة بالخصوصية أو لممارسة حقوقك، يرجى التواصل معنا:",
        email: "privacy@brasillegalize.com",
      },
    },
    cookieTable: {
      name: "اسم ملف تعريف الارتباط",
      purpose: "الغرض",
      type: "النوع",
      duration: "المدة",
    },
  },
  terms: {
    title: "الشروط والأحكام",
    metaTitle: "الشروط والأحكام | برازيل ليجالايز",
    metaDescription: "الشروط والأحكام الخاصة باستخدام خدمات برازيل ليجالايز",
    lastUpdated: "آخر تحديث",
    sections: {
      acceptance: {
        title: "قبول الشروط",
        content: "باستخدام موقعنا وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام.",
      },
      services: {
        title: "وصف الخدمات",
        content: "تقدم برازيل ليجالايز خدمات استشارات قانونية في مجال الهجرة والإقامة في البرازيل.",
      },
      userResponsibilities: {
        title: "مسؤوليات المستخدم",
        content: "أنت مسؤول عن تقديم معلومات دقيقة واستخدام خدماتنا بشكل قانوني وأخلاقي.",
      },
      intellectualProperty: {
        title: "الملكية الفكرية",
        content: "جميع المحتويات على هذا الموقع محمية بحقوق الملكية الفكرية لبرازيل ليجالايز.",
      },
      limitation: {
        title: "حدود المسؤولية",
        content: "لا نتحمل المسؤولية عن أي أضرار غير مباشرة ناتجة عن استخدام خدماتنا.",
      },
      disputes: {
        title: "حل النزاعات",
        content: "يتم حل أي نزاعات من خلال التفاوض أولاً، ثم التحكيم إذا لزم الأمر.",
      },
      governingLaw: {
        title: "القانون الحاكم",
        content: "تخضع هذه الشروط للقانون البرازيلي وتفسر وفقاً له.",
      },
      changes: {
        title: "التغييرات على الشروط",
        content: "نحتفظ بالحق في تعديل هذه الشروط. سيتم إشعارك بأي تغييرات جوهرية.",
      },
      contact: {
        title: "اتصل بنا",
        content: "للاستفسارات حول هذه الشروط، يرجى التواصل معنا عبر legal@brasillegalize.com",
      },
    },
  },
  eligibility: {
    pageTitle: "تحقق من أهليتك | برازيل ليجالايز",
    pageDescription: "اكتشف ما إذا كنت مؤهلاً للحصول على تأشيرة أو إقامة أو جنسية برازيلية من خلال فحص الأهلية السريع.",
    title: "تحقق من أهليتك",
    subtitle: "أجب عن بعض الأسئلة لمعرفة الخدمات الأنسب لوضعك.",
    back: "رجوع",
    next: "متابعة",
    submit: "احصل على النتائج",
    startOver: "ابدأ من جديد",
    name: "الاسم الكامل",
    namePlaceholder: "أدخل اسمك الكامل",
    email: "البريد الإلكتروني",
    emailPlaceholder: "your@email.com",
    phone: "الهاتف / واتساب",
    phonePlaceholder: "+1 234 567 8900",
    city: "المدينة",
    cityPlaceholder: "مدينتك",
    consentText: "أوافق على سياسة الخصوصية وأوافق على التواصل معي بخصوص استفساري.",
  },
};

// ============================================================================
// ENGLISH DICTIONARY
// ============================================================================

const en: Dictionary = {
  brand: {
    name: "Brasil Legalize",
    tagline: "Your Trusted Legal Partner in Brazil",
    description:
      "Specialized legal services in immigration, residency, and Brazilian citizenship",
  },
  nav: {
    home: "Home",
    services: "Services",
    process: "Our Process",
    about: "About Us",
    faq: "FAQ",
    contact: "Contact",
  },
  cta: {
    startCase: "Start Your Case",
    getStarted: "Get Started",
    learnMore: "Learn More",
    checkEligibility: "Check Eligibility",
    contactUs: "Contact Us",
    sendMessage: "Send Message",
    submit: "Submit",
    viewServices: "View Services",
    readMore: "Read More",
    scheduleConsult: "Schedule Consultation",
  },
  home: {
    hero: {
      title: "Your Legal Path to Brazil",
      subtitle: "Experts in Brazilian Immigration Law",
      description:
        "We help you obtain Brazilian visas, residency, and citizenship with ease and security. Our team of specialized lawyers is ready to serve you.",
    },
    features: {
      title: "Why Choose Us?",
      items: [
        {
          title: "Specialized Legal Expertise",
          description:
            "Team of licensed lawyers with deep expertise in Brazilian immigration law",
        },
        {
          title: "Multilingual Support",
          description:
            "We speak Arabic, English, Spanish, and Portuguese to serve you in your language",
        },
        {
          title: "Transparent Tracking",
          description:
            "Track your case status anytime through our secure online portal",
        },
        {
          title: "High Success Rate",
          description:
            "Proven track record of success in various types of immigration cases",
        },
      ],
    },
    testimonials: {
      title: "What Our Clients Say",
    },
    stats: {
      title: "Our Achievements in Numbers",
      cases: "Successful Cases",
      countries: "Countries",
      satisfaction: "Client Satisfaction",
      experience: "Years Experience",
    },
  },
  services: {
    title: "Our Legal Services",
    subtitle: "Comprehensive Solutions for All Your Legal Needs",
    description:
      "We offer a wide range of specialized legal services in immigration and residency in Brazil",
    items: {
      visa: {
        title: "Entry Visas",
        description:
          "We help you obtain all types of Brazilian visas including work, tourist, and student visas",
        features: [
          "Work Visa (VITEM V)",
          "Tourist Visa (VITUR)",
          "Student Visa (VITEM IV)",
          "Investment Visa",
          "Entrepreneur Visa",
        ],
      },
      residency: {
        title: "Permanent Residency",
        description:
          "Get your permanent residency in Brazil with comprehensive legal support throughout the process",
        features: [
          "Residency through Marriage",
          "Residency through Employment",
          "Investor Residency",
          "Retirement Residency",
          "Family Reunification",
        ],
      },
      citizenship: {
        title: "Brazilian Citizenship",
        description:
          "Achieve your dream of obtaining Brazilian citizenship with our specialized team",
        features: [
          "Standard Naturalization",
          "Expedited Naturalization",
          "Citizenship Restoration",
          "Citizenship by Descent",
          "Investor Citizenship",
        ],
      },
      business: {
        title: "Business Formation",
        description:
          "Start your business in Brazil with complete legal support",
        features: [
          "Company Formation",
          "Business Visas",
          "Commercial Licenses",
          "Tax Compliance",
          "Commercial Contracts",
        ],
      },
      family: {
        title: "Family Reunification",
        description:
          "Reunite your family in Brazil with our specialized services",
        features: [
          "Spouse Visa",
          "Children Visa",
          "Parent Visa",
          "Dependent Visa",
          "Family Relationship Documentation",
        ],
      },
      deportation: {
        title: "Deportation Cases",
        description:
          "Specialized legal defense in deportation cases and removal order cancellation",
        features: [
          "Deportation Order Appeals",
          "Asylum Applications",
          "Status Regularization",
          "Legal Waivers",
          "Court Representation",
        ],
      },
    },
  },
  process: {
    title: "Our Process",
    subtitle: "How We Work With You",
    description:
      "We follow a clear and organized methodology to ensure your case succeeds from start to finish",
    steps: [
      {
        title: "Initial Consultation",
        description:
          "We start by understanding your situation and goals through a comprehensive free consultation with one of our experts",
      },
      {
        title: "Case Assessment",
        description:
          "We conduct a thorough analysis of your case and identify the best available legal pathways",
      },
      {
        title: "Document Collection",
        description:
          "We help you gather and prepare all required documents in the correct format",
      },
      {
        title: "Application Submission",
        description:
          "We handle submitting your application to the relevant authorities and follow up until approval",
      },
      {
        title: "Follow-up & Support",
        description:
          "We stay with you throughout the process and provide updates and support at every stage",
      },
    ],
  },
  about: {
    title: "About Us",
    subtitle: "Your Trusted Legal Partner",
    description:
      "Brasil Legalize is a law firm specialized in immigration and residency services in Brazil, serving clients from around the world",
    mission: {
      title: "Our Mission",
      description:
        "We strive to provide the highest levels of legal service in immigration, with commitment to transparency, integrity, and achieving the best results for our clients",
    },
    team: {
      title: "Our Team",
      description:
        "Our team includes elite lawyers licensed in Brazil with extensive experience in international immigration law",
    },
    values: {
      title: "Our Values",
      items: [
        {
          title: "Integrity",
          description:
            "We adhere to the highest standards of professional ethics in all our dealings",
        },
        {
          title: "Excellence",
          description:
            "We always strive to provide the best legal solutions for our clients",
        },
        {
          title: "Transparency",
          description:
            "We maintain open and honest communication with our clients",
        },
        {
          title: "Commitment",
          description:
            "We dedicate our efforts to achieving our clients' goals with sincerity",
        },
      ],
    },
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Answers to the Most Common Questions",
    description:
      "Find answers to the most frequently asked questions about our services",
    items: [
      {
        question: "How long does the visa process take?",
        answer:
          "The duration varies depending on the visa type, but usually ranges from 30 to 90 days. We will provide you with an accurate timeline after assessing your case.",
      },
      {
        question: "What are your service fees?",
        answer:
          "The cost depends on the type of service and case complexity. We offer a free initial consultation to assess your case and determine the cost transparently.",
      },
      {
        question: "Can I track my application status?",
        answer:
          "Yes, we provide a secure online portal where you can track your application status, upload documents, and communicate with our team anytime.",
      },
      {
        question: "What documents are required?",
        answer:
          "Required documents vary depending on the application type. We will provide you with a detailed list of all required documents after the initial consultation.",
      },
      {
        question: "Do you serve all nationalities?",
        answer:
          "Yes, we serve all nationalities. We have experience dealing with clients from over 50 countries around the world.",
      },
      {
        question: "What happens if my application is denied?",
        answer:
          "In case of denial, we analyze the reasons and help you file an appeal or reapply while addressing the weak points.",
      },
    ],
    contact: {
      title: "Didn't Find Your Answer?",
      description:
        "Contact us directly and we will answer all your questions",
    },
  },
  contact: {
    title: "Contact Us",
    subtitle: "We're Here to Help",
    description:
      "Contact us today for a free consultation about your case",
    form: {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      service: "Service Needed",
      message: "Your Message",
      selectService: "Select a Service",
      namePlaceholder: "Enter your full name",
      emailPlaceholder: "Enter your email address",
      phonePlaceholder: "+1 XXX XXX XXXX",
      messagePlaceholder: "Write your message here...",
    },
    info: {
      title: "Contact Information",
      address: "São Paulo, Brazil",
      phone: "+55 11 XXXX-XXXX",
      email: "info@brasillegalize.com",
      hours: "Business Hours",
      hoursValue: "Monday - Friday: 9 AM - 6 PM",
    },
  },
  footer: {
    description:
      "Brasil Legalize - Your trusted legal partner in immigration and residency services in Brazil",
    quickLinks: "Quick Links",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    cookies: "Cookie Policy",
    followUs: "Follow Us",
    newsletter: {
      title: "Newsletter",
      description:
        "Subscribe to receive the latest updates and legal tips",
      placeholder: "Your email address",
      button: "Subscribe",
    },
    copyright: "All Rights Reserved",
  },
  common: {
    loading: "Loading...",
    error: "An error occurred",
    success: "Success",
    required: "Required",
    optional: "Optional",
    back: "Back",
    next: "Next",
    previous: "Previous",
    close: "Close",
    open: "Open",
    menu: "Menu",
    search: "Search",
    language: "Language",
    year: "year",
    years: "years",
    country: "country",
    countries: "countries",
  },
  validation: {
    required: "This field is required",
    email: "Please enter a valid email address",
    phone: "Please enter a valid phone number",
    minLength: "Must contain at least {min} characters",
    maxLength: "Must not exceed {max} characters",
  },
  errors: {
    notFound: {
      title: "Page Not Found",
      description: "Sorry, the page you are looking for does not exist",
      action: "Go to Home",
    },
    serverError: {
      title: "Server Error",
      description:
        "Sorry, an unexpected error occurred. Please try again later",
      action: "Try Again",
    },
  },
  cookies: {
    title: "Cookie Notice",
    bannerText: "We use cookies to improve your experience on our website.",
    accept: "Accept",
    reject: "Reject",
    learnMore: "Learn More",
  },
  privacy: {
    title: "Privacy Policy",
    metaTitle: "Privacy Policy | Brasil Legalize",
    metaDescription: "Learn how we collect, use, and protect your personal data in compliance with Brazilian LGPD law",
    lastUpdated: "Last Updated",
    tableOfContents: "Table of Contents",
    manageConsent: "Manage Consent",
    withdrawConsent: "Withdraw Consent",
    acceptCookies: "Accept Cookies",
    exportData: "Export My Data",
    confirmWithdraw: "Confirm Consent Withdrawal",
    confirmWithdrawText: "Are you sure you want to withdraw your consent? Analytics will be disabled and non-essential cookies will be deleted.",
    confirmWithdrawButton: "Yes, Withdraw Consent",
    consentStatus: {
      accepted: "You have accepted cookies",
      rejected: "You have rejected cookies",
      pending: "You haven't made a choice yet",
    },
    toc: {
      introduction: "Introduction",
      dataController: "Data Controller",
      dataCollected: "Data We Collect",
      dataUse: "How We Use Your Data",
      legalBasis: "Legal Basis",
      dataSharing: "Data Sharing",
      dataRetention: "Data Retention",
      yourRights: "Your Rights",
      cookies: "Cookies",
      security: "Security",
      contact: "Contact Us",
    },
    sections: {
      introduction: {
        title: "Introduction",
        content: "Brasil Legalize is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information in compliance with Brazil's General Data Protection Law (LGPD).",
      },
      dataController: {
        title: "Data Controller",
        content: "Brasil Legalize is the data controller for your personal information. For privacy-related inquiries, please contact us.",
      },
      dataCollected: {
        title: "Data We Collect",
        content: "We collect various types of information to provide our services:",
        items: [
          "Personal identification data (name, email, phone)",
          "Contact information",
          "Service inquiry details",
          "Uploaded documents (when applicable)",
          "Usage data and analytics",
          "Device and browser information",
        ],
      },
      dataUse: {
        title: "How We Use Your Data",
        content: "We use your data for the following purposes:",
        items: [
          "Provide and improve our services",
          "Respond to your inquiries",
          "Process your applications",
          "Send relevant communications",
          "Comply with legal requirements",
        ],
      },
      legalBasis: {
        title: "Legal Basis for Processing (LGPD)",
        content: "We process your data based on:",
        items: [
          "Your consent",
          "Contract performance",
          "Legal obligations",
          "Legitimate interests",
        ],
      },
      dataSharing: {
        title: "Data Sharing",
        content: "We may share your data with third-party service providers and government authorities (when required). We never sell your personal data.",
      },
      dataRetention: {
        title: "Data Retention",
        content: "We retain your data for as long as necessary to provide our services and comply with legal obligations. After that, data is securely deleted.",
      },
      yourRights: {
        title: "Your Rights Under LGPD",
        content: "You have the following rights regarding your personal data:",
        items: [
          "Right to access your data",
          "Right to data correction",
          "Right to data deletion",
          "Right to data portability",
          "Right to object",
          "Right to withdraw consent",
        ],
      },
      cookies: {
        title: "Cookies and Tracking",
        content: "We use cookies to enhance your experience. Functional cookies are essential for the site to work, while analytics cookies require your consent.",
      },
      security: {
        title: "Security Measures",
        content: "We implement appropriate security measures to protect your data from unauthorized access, modification, disclosure, and destruction.",
      },
      contact: {
        title: "Contact Us",
        content: "For privacy-related inquiries or to exercise your rights, please contact us:",
        email: "privacy@brasillegalize.com",
      },
    },
    cookieTable: {
      name: "Cookie Name",
      purpose: "Purpose",
      type: "Type",
      duration: "Duration",
    },
  },
  terms: {
    title: "Terms and Conditions",
    metaTitle: "Terms and Conditions | Brasil Legalize",
    metaDescription: "Terms and conditions for using Brasil Legalize services",
    lastUpdated: "Last Updated",
    sections: {
      acceptance: {
        title: "Acceptance of Terms",
        content: "By using our website and services, you agree to be bound by these terms and conditions.",
      },
      services: {
        title: "Description of Services",
        content: "Brasil Legalize provides legal consulting services in immigration and residency in Brazil.",
      },
      userResponsibilities: {
        title: "User Responsibilities",
        content: "You are responsible for providing accurate information and using our services legally and ethically.",
      },
      intellectualProperty: {
        title: "Intellectual Property",
        content: "All content on this website is protected by Brasil Legalize intellectual property rights.",
      },
      limitation: {
        title: "Limitation of Liability",
        content: "We are not liable for any indirect damages resulting from the use of our services.",
      },
      disputes: {
        title: "Dispute Resolution",
        content: "Any disputes will be resolved through negotiation first, then arbitration if necessary.",
      },
      governingLaw: {
        title: "Governing Law",
        content: "These terms are governed by and construed in accordance with Brazilian law.",
      },
      changes: {
        title: "Changes to Terms",
        content: "We reserve the right to modify these terms. You will be notified of any material changes.",
      },
      contact: {
        title: "Contact Us",
        content: "For questions about these terms, please contact us at legal@brasillegalize.com",
      },
    },
  },
  eligibility: {
    pageTitle: "Check Your Eligibility | Brasil Legalize",
    pageDescription: "Find out if you qualify for Brazilian visa, residency, or citizenship services with our quick eligibility check.",
    title: "Check Your Eligibility",
    subtitle: "Answer a few questions to find out which services best fit your situation.",
    back: "Back",
    next: "Continue",
    submit: "Get Results",
    startOver: "Start Over",
    name: "Full Name",
    namePlaceholder: "Enter your full name",
    email: "Email Address",
    emailPlaceholder: "your@email.com",
    phone: "Phone / WhatsApp",
    phonePlaceholder: "+1 234 567 8900",
    city: "City",
    cityPlaceholder: "Your city",
    consentText: "I agree to the privacy policy and consent to being contacted regarding my inquiry.",
  },
};

// ============================================================================
// SPANISH DICTIONARY
// ============================================================================

const es: Dictionary = {
  brand: {
    name: "Brasil Legalize",
    tagline: "Tu Socio Legal de Confianza en Brasil",
    description:
      "Servicios legales especializados en inmigración, residencia y ciudadanía brasileña",
  },
  nav: {
    home: "Inicio",
    services: "Servicios",
    process: "Proceso",
    about: "Nosotros",
    faq: "Preguntas Frecuentes",
    contact: "Contacto",
  },
  cta: {
    startCase: "Inicia Tu Caso",
    getStarted: "Comenzar",
    learnMore: "Saber Más",
    checkEligibility: "Verifica Tu Elegibilidad",
    contactUs: "Contáctanos",
    sendMessage: "Enviar Mensaje",
    submit: "Enviar",
    viewServices: "Ver Servicios",
    readMore: "Leer Más",
    scheduleConsult: "Agendar Consulta",
  },
  home: {
    hero: {
      title: "Tu Camino Legal a Brasil",
      subtitle: "Expertos en Ley de Inmigración Brasileña",
      description:
        "Te ayudamos a obtener visas, residencia y ciudadanía brasileña con facilidad y seguridad. Nuestro equipo de abogados especializados está listo para servirte.",
    },
    features: {
      title: "¿Por Qué Elegirnos?",
      items: [
        {
          title: "Experiencia Legal Especializada",
          description:
            "Equipo de abogados licenciados con amplia experiencia en ley de inmigración brasileña",
        },
        {
          title: "Soporte Multilingüe",
          description:
            "Hablamos árabe, inglés, español y portugués para atenderte en tu idioma",
        },
        {
          title: "Seguimiento Transparente",
          description:
            "Sigue el estado de tu caso en cualquier momento a través de nuestro portal seguro",
        },
        {
          title: "Alta Tasa de Éxito",
          description:
            "Historial comprobado de éxito en varios tipos de casos de inmigración",
        },
      ],
    },
    testimonials: {
      title: "Lo Que Dicen Nuestros Clientes",
    },
    stats: {
      title: "Nuestros Logros en Números",
      cases: "Casos Exitosos",
      countries: "Países",
      satisfaction: "Satisfacción del Cliente",
      experience: "Años de Experiencia",
    },
  },
  services: {
    title: "Nuestros Servicios Legales",
    subtitle: "Soluciones Integrales para Todas Tus Necesidades Legales",
    description:
      "Ofrecemos una amplia gama de servicios legales especializados en inmigración y residencia en Brasil",
    items: {
      visa: {
        title: "Visas de Entrada",
        description:
          "Te ayudamos a obtener todos los tipos de visas brasileñas incluyendo trabajo, turismo y estudiante",
        features: [
          "Visa de Trabajo (VITEM V)",
          "Visa de Turista (VITUR)",
          "Visa de Estudiante (VITEM IV)",
          "Visa de Inversión",
          "Visa de Emprendedor",
        ],
      },
      residency: {
        title: "Residencia Permanente",
        description:
          "Obtén tu residencia permanente en Brasil con apoyo legal integral durante todo el proceso",
        features: [
          "Residencia por Matrimonio",
          "Residencia por Empleo",
          "Residencia de Inversionista",
          "Residencia de Jubilación",
          "Reunificación Familiar",
        ],
      },
      citizenship: {
        title: "Ciudadanía Brasileña",
        description:
          "Logra tu sueño de obtener la ciudadanía brasileña con nuestro equipo especializado",
        features: [
          "Naturalización Estándar",
          "Naturalización Acelerada",
          "Restauración de Ciudadanía",
          "Ciudadanía por Descendencia",
          "Ciudadanía para Inversionistas",
        ],
      },
      business: {
        title: "Formación de Empresas",
        description:
          "Inicia tu negocio en Brasil con apoyo legal completo",
        features: [
          "Formación de Empresas",
          "Visas de Negocios",
          "Licencias Comerciales",
          "Cumplimiento Fiscal",
          "Contratos Comerciales",
        ],
      },
      family: {
        title: "Reunificación Familiar",
        description:
          "Reúne a tu familia en Brasil con nuestros servicios especializados",
        features: [
          "Visa de Cónyuge",
          "Visa de Hijos",
          "Visa de Padres",
          "Visa de Dependientes",
          "Documentación de Relaciones Familiares",
        ],
      },
      deportation: {
        title: "Casos de Deportación",
        description:
          "Defensa legal especializada en casos de deportación y cancelación de órdenes de remoción",
        features: [
          "Apelaciones de Órdenes de Deportación",
          "Solicitudes de Asilo",
          "Regularización de Estatus",
          "Exenciones Legales",
          "Representación en Tribunales",
        ],
      },
    },
  },
  process: {
    title: "Nuestro Proceso",
    subtitle: "Cómo Trabajamos Contigo",
    description:
      "Seguimos una metodología clara y organizada para asegurar el éxito de tu caso de principio a fin",
    steps: [
      {
        title: "Consulta Inicial",
        description:
          "Comenzamos entendiendo tu situación y objetivos a través de una consulta gratuita integral con uno de nuestros expertos",
      },
      {
        title: "Evaluación del Caso",
        description:
          "Realizamos un análisis exhaustivo de tu caso e identificamos los mejores caminos legales disponibles",
      },
      {
        title: "Recopilación de Documentos",
        description:
          "Te ayudamos a reunir y preparar todos los documentos requeridos en el formato correcto",
      },
      {
        title: "Presentación de Solicitud",
        description:
          "Nos encargamos de presentar tu solicitud ante las autoridades correspondientes y damos seguimiento hasta la aprobación",
      },
      {
        title: "Seguimiento y Apoyo",
        description:
          "Te acompañamos durante todo el proceso y te proporcionamos actualizaciones y apoyo en cada etapa",
      },
    ],
  },
  about: {
    title: "Sobre Nosotros",
    subtitle: "Tu Socio Legal de Confianza",
    description:
      "Brasil Legalize es un bufete de abogados especializado en servicios de inmigración y residencia en Brasil, atendiendo clientes de todo el mundo",
    mission: {
      title: "Nuestra Misión",
      description:
        "Nos esforzamos por proporcionar los más altos niveles de servicio legal en inmigración, con compromiso de transparencia, integridad y lograr los mejores resultados para nuestros clientes",
    },
    team: {
      title: "Nuestro Equipo",
      description:
        "Nuestro equipo incluye abogados de élite licenciados en Brasil con amplia experiencia en ley de inmigración internacional",
    },
    values: {
      title: "Nuestros Valores",
      items: [
        {
          title: "Integridad",
          description:
            "Adherimos a los más altos estándares de ética profesional en todos nuestros tratos",
        },
        {
          title: "Excelencia",
          description:
            "Siempre nos esforzamos por proporcionar las mejores soluciones legales para nuestros clientes",
        },
        {
          title: "Transparencia",
          description:
            "Mantenemos comunicación abierta y honesta con nuestros clientes",
        },
        {
          title: "Compromiso",
          description:
            "Dedicamos nuestros esfuerzos a lograr los objetivos de nuestros clientes con sinceridad",
        },
      ],
    },
  },
  faq: {
    title: "Preguntas Frecuentes",
    subtitle: "Respuestas a las Preguntas Más Comunes",
    description:
      "Encuentra respuestas a las preguntas más frecuentes sobre nuestros servicios",
    items: [
      {
        question: "¿Cuánto tiempo toma el proceso de visa?",
        answer:
          "La duración varía según el tipo de visa, pero generalmente oscila entre 30 y 90 días. Te proporcionaremos un cronograma preciso después de evaluar tu caso.",
      },
      {
        question: "¿Cuáles son sus honorarios?",
        answer:
          "El costo depende del tipo de servicio y la complejidad del caso. Ofrecemos una consulta inicial gratuita para evaluar tu caso y determinar el costo de manera transparente.",
      },
      {
        question: "¿Puedo seguir el estado de mi solicitud?",
        answer:
          "Sí, proporcionamos un portal en línea seguro donde puedes seguir el estado de tu solicitud, subir documentos y comunicarte con nuestro equipo en cualquier momento.",
      },
      {
        question: "¿Qué documentos se requieren?",
        answer:
          "Los documentos requeridos varían según el tipo de solicitud. Te proporcionaremos una lista detallada de todos los documentos requeridos después de la consulta inicial.",
      },
      {
        question: "¿Atienden a todas las nacionalidades?",
        answer:
          "Sí, atendemos a todas las nacionalidades. Tenemos experiencia tratando con clientes de más de 50 países alrededor del mundo.",
      },
      {
        question: "¿Qué pasa si mi solicitud es denegada?",
        answer:
          "En caso de denegación, analizamos las razones y te ayudamos a presentar una apelación o volver a solicitar mientras abordamos los puntos débiles.",
      },
    ],
    contact: {
      title: "¿No Encontraste Tu Respuesta?",
      description:
        "Contáctanos directamente y responderemos todas tus preguntas",
    },
  },
  contact: {
    title: "Contáctanos",
    subtitle: "Estamos Aquí para Ayudarte",
    description:
      "Contáctanos hoy para una consulta gratuita sobre tu caso",
    form: {
      name: "Nombre Completo",
      email: "Correo Electrónico",
      phone: "Número de Teléfono",
      service: "Servicio Necesario",
      message: "Tu Mensaje",
      selectService: "Selecciona un Servicio",
      namePlaceholder: "Ingresa tu nombre completo",
      emailPlaceholder: "Ingresa tu correo electrónico",
      phonePlaceholder: "+1 XXX XXX XXXX",
      messagePlaceholder: "Escribe tu mensaje aquí...",
    },
    info: {
      title: "Información de Contacto",
      address: "São Paulo, Brasil",
      phone: "+55 11 XXXX-XXXX",
      email: "info@brasillegalize.com",
      hours: "Horario de Atención",
      hoursValue: "Lunes - Viernes: 9 AM - 6 PM",
    },
  },
  footer: {
    description:
      "Brasil Legalize - Tu socio legal de confianza en servicios de inmigración y residencia en Brasil",
    quickLinks: "Enlaces Rápidos",
    legal: "Legal",
    privacy: "Política de Privacidad",
    terms: "Términos y Condiciones",
    cookies: "Política de Cookies",
    followUs: "Síguenos",
    newsletter: {
      title: "Boletín",
      description:
        "Suscríbete para recibir las últimas actualizaciones y consejos legales",
      placeholder: "Tu correo electrónico",
      button: "Suscribirse",
    },
    copyright: "Todos los Derechos Reservados",
  },
  common: {
    loading: "Cargando...",
    error: "Ocurrió un error",
    success: "Éxito",
    required: "Requerido",
    optional: "Opcional",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    close: "Cerrar",
    open: "Abrir",
    menu: "Menú",
    search: "Buscar",
    language: "Idioma",
    year: "año",
    years: "años",
    country: "país",
    countries: "países",
  },
  validation: {
    required: "Este campo es requerido",
    email: "Por favor ingresa un correo electrónico válido",
    phone: "Por favor ingresa un número de teléfono válido",
    minLength: "Debe contener al menos {min} caracteres",
    maxLength: "No debe exceder {max} caracteres",
  },
  errors: {
    notFound: {
      title: "Página No Encontrada",
      description: "Lo sentimos, la página que buscas no existe",
      action: "Ir al Inicio",
    },
    serverError: {
      title: "Error del Servidor",
      description:
        "Lo sentimos, ocurrió un error inesperado. Por favor intenta más tarde",
      action: "Intentar de Nuevo",
    },
  },
  cookies: {
    title: "Aviso de Cookies",
    bannerText: "Usamos cookies para mejorar tu experiencia en nuestro sitio web.",
    accept: "Aceptar",
    reject: "Rechazar",
    learnMore: "Saber más",
  },
  privacy: {
    title: "Política de Privacidad",
    metaTitle: "Política de Privacidad | Brasil Legalize",
    metaDescription: "Conoce cómo recopilamos, usamos y protegemos tus datos personales según la ley LGPD de Brasil",
    lastUpdated: "Última actualización",
    tableOfContents: "Tabla de Contenidos",
    manageConsent: "Gestionar Consentimiento",
    withdrawConsent: "Retirar Consentimiento",
    acceptCookies: "Aceptar Cookies",
    exportData: "Exportar Mis Datos",
    confirmWithdraw: "Confirmar Retiro de Consentimiento",
    confirmWithdrawText: "¿Estás seguro de que deseas retirar tu consentimiento? Las analíticas serán deshabilitadas y las cookies no esenciales serán eliminadas.",
    confirmWithdrawButton: "Sí, Retirar Consentimiento",
    consentStatus: {
      accepted: "Has aceptado las cookies",
      rejected: "Has rechazado las cookies",
      pending: "Aún no has tomado una decisión",
    },
    toc: {
      introduction: "Introducción",
      dataController: "Controlador de Datos",
      dataCollected: "Datos que Recopilamos",
      dataUse: "Cómo Usamos tus Datos",
      legalBasis: "Base Legal",
      dataSharing: "Compartir Datos",
      dataRetention: "Retención de Datos",
      yourRights: "Tus Derechos",
      cookies: "Cookies",
      security: "Seguridad",
      contact: "Contáctanos",
    },
    sections: {
      introduction: {
        title: "Introducción",
        content: "Brasil Legalize está comprometido con la protección de tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal de acuerdo con la Ley General de Protección de Datos de Brasil (LGPD).",
      },
      dataController: {
        title: "Controlador de Datos",
        content: "Brasil Legalize es el controlador de datos de tu información personal. Para consultas relacionadas con la privacidad, por favor contáctanos.",
      },
      dataCollected: {
        title: "Datos que Recopilamos",
        content: "Recopilamos varios tipos de información para proporcionar nuestros servicios:",
        items: [
          "Datos de identificación personal (nombre, correo, teléfono)",
          "Información de contacto",
          "Detalles de consulta de servicios",
          "Documentos subidos (cuando aplica)",
          "Datos de uso y analíticas",
          "Información del dispositivo y navegador",
        ],
      },
      dataUse: {
        title: "Cómo Usamos tus Datos",
        content: "Usamos tus datos para los siguientes propósitos:",
        items: [
          "Proporcionar y mejorar nuestros servicios",
          "Responder a tus consultas",
          "Procesar tus solicitudes",
          "Enviar comunicaciones relevantes",
          "Cumplir con requisitos legales",
        ],
      },
      legalBasis: {
        title: "Base Legal para el Procesamiento (LGPD)",
        content: "Procesamos tus datos basándonos en:",
        items: [
          "Tu consentimiento",
          "Ejecución de contrato",
          "Obligaciones legales",
          "Intereses legítimos",
        ],
      },
      dataSharing: {
        title: "Compartir Datos",
        content: "Podemos compartir tus datos con proveedores de servicios terceros y autoridades gubernamentales (cuando sea requerido). Nunca vendemos tus datos personales.",
      },
      dataRetention: {
        title: "Retención de Datos",
        content: "Retenemos tus datos mientras sea necesario para proporcionar nuestros servicios y cumplir con obligaciones legales. Después de eso, los datos se eliminan de forma segura.",
      },
      yourRights: {
        title: "Tus Derechos bajo LGPD",
        content: "Tienes los siguientes derechos respecto a tus datos personales:",
        items: [
          "Derecho a acceder a tus datos",
          "Derecho a corrección de datos",
          "Derecho a eliminación de datos",
          "Derecho a portabilidad de datos",
          "Derecho a objetar",
          "Derecho a retirar consentimiento",
        ],
      },
      cookies: {
        title: "Cookies y Seguimiento",
        content: "Usamos cookies para mejorar tu experiencia. Las cookies funcionales son esenciales para que el sitio funcione, mientras que las cookies de analíticas requieren tu consentimiento.",
      },
      security: {
        title: "Medidas de Seguridad",
        content: "Implementamos medidas de seguridad apropiadas para proteger tus datos de acceso no autorizado, modificación, divulgación y destrucción.",
      },
      contact: {
        title: "Contáctanos",
        content: "Para consultas relacionadas con la privacidad o para ejercer tus derechos, por favor contáctanos:",
        email: "privacy@brasillegalize.com",
      },
    },
    cookieTable: {
      name: "Nombre de Cookie",
      purpose: "Propósito",
      type: "Tipo",
      duration: "Duración",
    },
  },
  terms: {
    title: "Términos y Condiciones",
    metaTitle: "Términos y Condiciones | Brasil Legalize",
    metaDescription: "Términos y condiciones para usar los servicios de Brasil Legalize",
    lastUpdated: "Última actualización",
    sections: {
      acceptance: {
        title: "Aceptación de Términos",
        content: "Al usar nuestro sitio web y servicios, aceptas estar sujeto a estos términos y condiciones.",
      },
      services: {
        title: "Descripción de Servicios",
        content: "Brasil Legalize proporciona servicios de consultoría legal en inmigración y residencia en Brasil.",
      },
      userResponsibilities: {
        title: "Responsabilidades del Usuario",
        content: "Eres responsable de proporcionar información precisa y usar nuestros servicios legal y éticamente.",
      },
      intellectualProperty: {
        title: "Propiedad Intelectual",
        content: "Todo el contenido en este sitio web está protegido por los derechos de propiedad intelectual de Brasil Legalize.",
      },
      limitation: {
        title: "Limitación de Responsabilidad",
        content: "No somos responsables por daños indirectos resultantes del uso de nuestros servicios.",
      },
      disputes: {
        title: "Resolución de Disputas",
        content: "Cualquier disputa se resolverá primero mediante negociación, luego arbitraje si es necesario.",
      },
      governingLaw: {
        title: "Ley Aplicable",
        content: "Estos términos se rigen e interpretan de acuerdo con la ley brasileña.",
      },
      changes: {
        title: "Cambios en los Términos",
        content: "Nos reservamos el derecho de modificar estos términos. Serás notificado de cualquier cambio importante.",
      },
      contact: {
        title: "Contáctanos",
        content: "Para preguntas sobre estos términos, por favor contáctanos en legal@brasillegalize.com",
      },
    },
  },
  eligibility: {
    pageTitle: "Verifica Tu Elegibilidad | Brasil Legalize",
    pageDescription: "Descubre si calificas para los servicios de visa, residencia o ciudadanía brasileña con nuestra verificación rápida.",
    title: "Verifica Tu Elegibilidad",
    subtitle: "Responde algunas preguntas para descubrir qué servicios se adaptan mejor a tu situación.",
    back: "Atrás",
    next: "Continuar",
    submit: "Obtener Resultados",
    startOver: "Comenzar de Nuevo",
    name: "Nombre Completo",
    namePlaceholder: "Ingresa tu nombre completo",
    email: "Correo Electrónico",
    emailPlaceholder: "tu@email.com",
    phone: "Teléfono / WhatsApp",
    phonePlaceholder: "+1 234 567 8900",
    city: "Ciudad",
    cityPlaceholder: "Tu ciudad",
    consentText: "Acepto la política de privacidad y consiento ser contactado sobre mi consulta.",
  },
};

// ============================================================================
// PORTUGUESE (BRAZIL) DICTIONARY
// ============================================================================

const ptBr: Dictionary = {
  brand: {
    name: "Brasil Legalize",
    tagline: "Seu Parceiro Jurídico de Confiança no Brasil",
    description:
      "Serviços jurídicos especializados em imigração, residência e cidadania brasileira",
  },
  nav: {
    home: "Início",
    services: "Serviços",
    process: "Processo",
    about: "Sobre Nós",
    faq: "Perguntas Frequentes",
    contact: "Contato",
  },
  cta: {
    startCase: "Inicie Seu Caso",
    getStarted: "Começar",
    learnMore: "Saiba Mais",
    checkEligibility: "Verifique Sua Elegibilidade",
    contactUs: "Fale Conosco",
    sendMessage: "Enviar Mensagem",
    submit: "Enviar",
    viewServices: "Ver Serviços",
    readMore: "Ler Mais",
    scheduleConsult: "Agendar Consulta",
  },
  home: {
    hero: {
      title: "Seu Caminho Legal para o Brasil",
      subtitle: "Especialistas em Lei de Imigração Brasileira",
      description:
        "Ajudamos você a obter vistos, residência e cidadania brasileira com facilidade e segurança. Nossa equipe de advogados especializados está pronta para atendê-lo.",
    },
    features: {
      title: "Por Que Nos Escolher?",
      items: [
        {
          title: "Expertise Jurídica Especializada",
          description:
            "Equipe de advogados licenciados com ampla experiência em lei de imigração brasileira",
        },
        {
          title: "Suporte Multilíngue",
          description:
            "Falamos árabe, inglês, espanhol e português para atendê-lo no seu idioma",
        },
        {
          title: "Acompanhamento Transparente",
          description:
            "Acompanhe o status do seu caso a qualquer momento através do nosso portal seguro",
        },
        {
          title: "Alta Taxa de Sucesso",
          description:
            "Histórico comprovado de sucesso em vários tipos de casos de imigração",
        },
      ],
    },
    testimonials: {
      title: "O Que Nossos Clientes Dizem",
    },
    stats: {
      title: "Nossas Conquistas em Números",
      cases: "Casos de Sucesso",
      countries: "Países",
      satisfaction: "Satisfação do Cliente",
      experience: "Anos de Experiência",
    },
  },
  services: {
    title: "Nossos Serviços Jurídicos",
    subtitle: "Soluções Completas para Todas as Suas Necessidades Jurídicas",
    description:
      "Oferecemos uma ampla gama de serviços jurídicos especializados em imigração e residência no Brasil",
    items: {
      visa: {
        title: "Vistos de Entrada",
        description:
          "Ajudamos você a obter todos os tipos de vistos brasileiros incluindo trabalho, turismo e estudante",
        features: [
          "Visto de Trabalho (VITEM V)",
          "Visto de Turista (VITUR)",
          "Visto de Estudante (VITEM IV)",
          "Visto de Investimento",
          "Visto de Empreendedor",
        ],
      },
      residency: {
        title: "Residência Permanente",
        description:
          "Obtenha sua residência permanente no Brasil com suporte jurídico completo durante todo o processo",
        features: [
          "Residência por Casamento",
          "Residência por Emprego",
          "Residência de Investidor",
          "Residência de Aposentado",
          "Reunificação Familiar",
        ],
      },
      citizenship: {
        title: "Cidadania Brasileira",
        description:
          "Realize seu sonho de obter a cidadania brasileira com nossa equipe especializada",
        features: [
          "Naturalização Padrão",
          "Naturalização Acelerada",
          "Restauração de Cidadania",
          "Cidadania por Descendência",
          "Cidadania para Investidores",
        ],
      },
      business: {
        title: "Formação de Empresas",
        description:
          "Inicie seu negócio no Brasil com suporte jurídico completo",
        features: [
          "Formação de Empresas",
          "Vistos de Negócios",
          "Licenças Comerciais",
          "Conformidade Fiscal",
          "Contratos Comerciais",
        ],
      },
      family: {
        title: "Reunificação Familiar",
        description:
          "Reúna sua família no Brasil com nossos serviços especializados",
        features: [
          "Visto de Cônjuge",
          "Visto de Filhos",
          "Visto de Pais",
          "Visto de Dependentes",
          "Documentação de Relações Familiares",
        ],
      },
      deportation: {
        title: "Casos de Deportação",
        description:
          "Defesa jurídica especializada em casos de deportação e cancelamento de ordens de remoção",
        features: [
          "Recursos de Ordens de Deportação",
          "Solicitações de Asilo",
          "Regularização de Status",
          "Isenções Legais",
          "Representação em Tribunais",
        ],
      },
    },
  },
  process: {
    title: "Nosso Processo",
    subtitle: "Como Trabalhamos com Você",
    description:
      "Seguimos uma metodologia clara e organizada para garantir o sucesso do seu caso do início ao fim",
    steps: [
      {
        title: "Consulta Inicial",
        description:
          "Começamos entendendo sua situação e objetivos através de uma consulta gratuita completa com um de nossos especialistas",
      },
      {
        title: "Avaliação do Caso",
        description:
          "Realizamos uma análise completa do seu caso e identificamos os melhores caminhos legais disponíveis",
      },
      {
        title: "Coleta de Documentos",
        description:
          "Ajudamos você a reunir e preparar todos os documentos necessários no formato correto",
      },
      {
        title: "Submissão da Solicitação",
        description:
          "Cuidamos de submeter sua solicitação às autoridades competentes e acompanhamos até a aprovação",
      },
      {
        title: "Acompanhamento e Suporte",
        description:
          "Ficamos com você durante todo o processo e fornecemos atualizações e suporte em cada etapa",
      },
    ],
  },
  about: {
    title: "Sobre Nós",
    subtitle: "Seu Parceiro Jurídico de Confiança",
    description:
      "Brasil Legalize é um escritório de advocacia especializado em serviços de imigração e residência no Brasil, atendendo clientes de todo o mundo",
    mission: {
      title: "Nossa Missão",
      description:
        "Nos esforçamos para fornecer os mais altos níveis de serviço jurídico em imigração, com compromisso de transparência, integridade e alcançar os melhores resultados para nossos clientes",
    },
    team: {
      title: "Nossa Equipe",
      description:
        "Nossa equipe inclui advogados de elite licenciados no Brasil com ampla experiência em lei de imigração internacional",
    },
    values: {
      title: "Nossos Valores",
      items: [
        {
          title: "Integridade",
          description:
            "Aderimos aos mais altos padrões de ética profissional em todos os nossos negócios",
        },
        {
          title: "Excelência",
          description:
            "Sempre nos esforçamos para fornecer as melhores soluções jurídicas para nossos clientes",
        },
        {
          title: "Transparência",
          description:
            "Mantemos comunicação aberta e honesta com nossos clientes",
        },
        {
          title: "Compromisso",
          description:
            "Dedicamos nossos esforços para alcançar os objetivos de nossos clientes com sinceridade",
        },
      ],
    },
  },
  faq: {
    title: "Perguntas Frequentes",
    subtitle: "Respostas às Perguntas Mais Comuns",
    description:
      "Encontre respostas às perguntas mais frequentes sobre nossos serviços",
    items: [
      {
        question: "Quanto tempo leva o processo de visto?",
        answer:
          "A duração varia dependendo do tipo de visto, mas geralmente varia de 30 a 90 dias. Forneceremos um cronograma preciso após avaliar seu caso.",
      },
      {
        question: "Quais são seus honorários?",
        answer:
          "O custo depende do tipo de serviço e da complexidade do caso. Oferecemos uma consulta inicial gratuita para avaliar seu caso e determinar o custo de forma transparente.",
      },
      {
        question: "Posso acompanhar o status da minha solicitação?",
        answer:
          "Sim, fornecemos um portal online seguro onde você pode acompanhar o status da sua solicitação, enviar documentos e se comunicar com nossa equipe a qualquer momento.",
      },
      {
        question: "Quais documentos são necessários?",
        answer:
          "Os documentos necessários variam dependendo do tipo de solicitação. Forneceremos uma lista detalhada de todos os documentos necessários após a consulta inicial.",
      },
      {
        question: "Vocês atendem todas as nacionalidades?",
        answer:
          "Sim, atendemos todas as nacionalidades. Temos experiência lidando com clientes de mais de 50 países ao redor do mundo.",
      },
      {
        question: "O que acontece se minha solicitação for negada?",
        answer:
          "Em caso de negação, analisamos os motivos e ajudamos você a apresentar um recurso ou reaplicar enquanto abordamos os pontos fracos.",
      },
    ],
    contact: {
      title: "Não Encontrou Sua Resposta?",
      description:
        "Entre em contato conosco diretamente e responderemos todas as suas perguntas",
    },
  },
  contact: {
    title: "Fale Conosco",
    subtitle: "Estamos Aqui para Ajudar",
    description:
      "Entre em contato conosco hoje para uma consulta gratuita sobre seu caso",
    form: {
      name: "Nome Completo",
      email: "Endereço de E-mail",
      phone: "Número de Telefone",
      service: "Serviço Necessário",
      message: "Sua Mensagem",
      selectService: "Selecione um Serviço",
      namePlaceholder: "Digite seu nome completo",
      emailPlaceholder: "Digite seu e-mail",
      phonePlaceholder: "+55 XX XXXXX-XXXX",
      messagePlaceholder: "Escreva sua mensagem aqui...",
    },
    info: {
      title: "Informações de Contato",
      address: "São Paulo, Brasil",
      phone: "+55 11 XXXX-XXXX",
      email: "info@brasillegalize.com",
      hours: "Horário de Funcionamento",
      hoursValue: "Segunda - Sexta: 9h - 18h",
    },
  },
  footer: {
    description:
      "Brasil Legalize - Seu parceiro jurídico de confiança em serviços de imigração e residência no Brasil",
    quickLinks: "Links Rápidos",
    legal: "Legal",
    privacy: "Política de Privacidade",
    terms: "Termos e Condições",
    cookies: "Política de Cookies",
    followUs: "Siga-nos",
    newsletter: {
      title: "Newsletter",
      description:
        "Inscreva-se para receber as últimas atualizações e dicas jurídicas",
      placeholder: "Seu e-mail",
      button: "Inscrever-se",
    },
    copyright: "Todos os Direitos Reservados",
  },
  common: {
    loading: "Carregando...",
    error: "Ocorreu um erro",
    success: "Sucesso",
    required: "Obrigatório",
    optional: "Opcional",
    back: "Voltar",
    next: "Próximo",
    previous: "Anterior",
    close: "Fechar",
    open: "Abrir",
    menu: "Menu",
    search: "Buscar",
    language: "Idioma",
    year: "ano",
    years: "anos",
    country: "país",
    countries: "países",
  },
  validation: {
    required: "Este campo é obrigatório",
    email: "Por favor, digite um e-mail válido",
    phone: "Por favor, digite um número de telefone válido",
    minLength: "Deve conter pelo menos {min} caracteres",
    maxLength: "Não deve exceder {max} caracteres",
  },
  errors: {
    notFound: {
      title: "Página Não Encontrada",
      description: "Desculpe, a página que você procura não existe",
      action: "Ir para Início",
    },
    serverError: {
      title: "Erro do Servidor",
      description:
        "Desculpe, ocorreu um erro inesperado. Por favor, tente novamente mais tarde",
      action: "Tentar Novamente",
    },
  },
  cookies: {
    title: "Aviso de Cookies",
    bannerText: "Usamos cookies para melhorar sua experiência em nosso site.",
    accept: "Aceitar",
    reject: "Rejeitar",
    learnMore: "Saiba mais",
  },
  privacy: {
    title: "Política de Privacidade",
    metaTitle: "Política de Privacidade | Brasil Legalize",
    metaDescription: "Saiba como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD",
    lastUpdated: "Última atualização",
    tableOfContents: "Índice",
    manageConsent: "Gerenciar Consentimento",
    withdrawConsent: "Retirar Consentimento",
    acceptCookies: "Aceitar Cookies",
    exportData: "Exportar Meus Dados",
    confirmWithdraw: "Confirmar Retirada de Consentimento",
    confirmWithdrawText: "Tem certeza de que deseja retirar seu consentimento? As análises serão desabilitadas e os cookies não essenciais serão excluídos.",
    confirmWithdrawButton: "Sim, Retirar Consentimento",
    consentStatus: {
      accepted: "Você aceitou os cookies",
      rejected: "Você rejeitou os cookies",
      pending: "Você ainda não fez uma escolha",
    },
    toc: {
      introduction: "Introdução",
      dataController: "Controlador de Dados",
      dataCollected: "Dados que Coletamos",
      dataUse: "Como Usamos Seus Dados",
      legalBasis: "Base Legal",
      dataSharing: "Compartilhamento de Dados",
      dataRetention: "Retenção de Dados",
      yourRights: "Seus Direitos",
      cookies: "Cookies",
      security: "Segurança",
      contact: "Fale Conosco",
    },
    sections: {
      introduction: {
        title: "Introdução",
        content: "A Brasil Legalize está comprometida em proteger sua privacidade. Esta política explica como coletamos, usamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD) do Brasil.",
      },
      dataController: {
        title: "Controlador de Dados",
        content: "A Brasil Legalize é o controlador de dados de suas informações pessoais. Para consultas relacionadas à privacidade, entre em contato conosco.",
      },
      dataCollected: {
        title: "Dados que Coletamos",
        content: "Coletamos vários tipos de informações para fornecer nossos serviços:",
        items: [
          "Dados de identificação pessoal (nome, e-mail, telefone)",
          "Informações de contato",
          "Detalhes de consulta de serviços",
          "Documentos enviados (quando aplicável)",
          "Dados de uso e análises",
          "Informações do dispositivo e navegador",
        ],
      },
      dataUse: {
        title: "Como Usamos Seus Dados",
        content: "Usamos seus dados para os seguintes fins:",
        items: [
          "Fornecer e melhorar nossos serviços",
          "Responder às suas consultas",
          "Processar suas solicitações",
          "Enviar comunicações relevantes",
          "Cumprir requisitos legais",
        ],
      },
      legalBasis: {
        title: "Base Legal para Processamento (LGPD)",
        content: "Processamos seus dados com base em:",
        items: [
          "Seu consentimento",
          "Execução de contrato",
          "Obrigações legais",
          "Interesses legítimos",
        ],
      },
      dataSharing: {
        title: "Compartilhamento de Dados",
        content: "Podemos compartilhar seus dados com prestadores de serviços terceiros e autoridades governamentais (quando exigido). Nunca vendemos seus dados pessoais.",
      },
      dataRetention: {
        title: "Retenção de Dados",
        content: "Retemos seus dados pelo tempo necessário para fornecer nossos serviços e cumprir obrigações legais. Após isso, os dados são excluídos com segurança.",
      },
      yourRights: {
        title: "Seus Direitos sob a LGPD",
        content: "Você tem os seguintes direitos em relação aos seus dados pessoais:",
        items: [
          "Direito de acessar seus dados",
          "Direito à correção de dados",
          "Direito à exclusão de dados",
          "Direito à portabilidade de dados",
          "Direito de se opor",
          "Direito de retirar consentimento",
        ],
      },
      cookies: {
        title: "Cookies e Rastreamento",
        content: "Usamos cookies para melhorar sua experiência. Cookies funcionais são essenciais para o funcionamento do site, enquanto cookies de análise requerem seu consentimento.",
      },
      security: {
        title: "Medidas de Segurança",
        content: "Implementamos medidas de segurança apropriadas para proteger seus dados contra acesso não autorizado, modificação, divulgação e destruição.",
      },
      contact: {
        title: "Fale Conosco",
        content: "Para consultas relacionadas à privacidade ou para exercer seus direitos, entre em contato conosco:",
        email: "privacy@brasillegalize.com",
      },
    },
    cookieTable: {
      name: "Nome do Cookie",
      purpose: "Finalidade",
      type: "Tipo",
      duration: "Duração",
    },
  },
  terms: {
    title: "Termos e Condições",
    metaTitle: "Termos e Condições | Brasil Legalize",
    metaDescription: "Termos e condições para uso dos serviços da Brasil Legalize",
    lastUpdated: "Última atualização",
    sections: {
      acceptance: {
        title: "Aceitação dos Termos",
        content: "Ao usar nosso site e serviços, você concorda em estar vinculado a estes termos e condições.",
      },
      services: {
        title: "Descrição dos Serviços",
        content: "A Brasil Legalize fornece serviços de consultoria jurídica em imigração e residência no Brasil.",
      },
      userResponsibilities: {
        title: "Responsabilidades do Usuário",
        content: "Você é responsável por fornecer informações precisas e usar nossos serviços de forma legal e ética.",
      },
      intellectualProperty: {
        title: "Propriedade Intelectual",
        content: "Todo o conteúdo neste site é protegido pelos direitos de propriedade intelectual da Brasil Legalize.",
      },
      limitation: {
        title: "Limitação de Responsabilidade",
        content: "Não somos responsáveis por quaisquer danos indiretos resultantes do uso de nossos serviços.",
      },
      disputes: {
        title: "Resolução de Disputas",
        content: "Quaisquer disputas serão resolvidas primeiro por negociação, depois por arbitragem se necessário.",
      },
      governingLaw: {
        title: "Lei Aplicável",
        content: "Estes termos são regidos e interpretados de acordo com a lei brasileira.",
      },
      changes: {
        title: "Alterações nos Termos",
        content: "Reservamo-nos o direito de modificar estes termos. Você será notificado sobre quaisquer alterações importantes.",
      },
      contact: {
        title: "Fale Conosco",
        content: "Para dúvidas sobre estes termos, entre em contato conosco em legal@brasillegalize.com",
      },
    },
  },
  eligibility: {
    pageTitle: "Verifique Sua Elegibilidade | Brasil Legalize",
    pageDescription: "Descubra se você se qualifica para serviços de visto, residência ou cidadania brasileira com nossa verificação rápida.",
    title: "Verifique Sua Elegibilidade",
    subtitle: "Responda algumas perguntas para descobrir quais serviços melhor se adequam à sua situação.",
    back: "Voltar",
    next: "Continuar",
    submit: "Obter Resultados",
    startOver: "Recomeçar",
    name: "Nome Completo",
    namePlaceholder: "Digite seu nome completo",
    email: "Endereço de E-mail",
    emailPlaceholder: "seu@email.com",
    phone: "Telefone / WhatsApp",
    phonePlaceholder: "+55 11 99999-9999",
    city: "Cidade",
    cityPlaceholder: "Sua cidade",
    consentText: "Concordo com a política de privacidade e consinto em ser contatado sobre minha consulta.",
  },
};

// ============================================================================
// DICTIONARY UTILITIES
// ============================================================================

const dictionaries: Record<Locale, Dictionary> = {
  ar,
  en,
  es,
  "pt-br": ptBr,
};

/**
 * Get dictionary for a specific locale
 * @param locale - The locale to get dictionary for
 * @returns Dictionary for the specified locale, falls back to Arabic if not found
 */
export function getDictionary(locale: Locale | string): Dictionary {
  return dictionaries[locale as Locale] || dictionaries[defaultLocale];
}

/**
 * Get text direction for a locale
 * @param locale - The locale to check
 * @returns 'rtl' for Arabic, 'ltr' for all others
 */
export function getDirection(locale: Locale | string): "ltr" | "rtl" {
  return localeDirections[locale as Locale] || "ltr";
}

/**
 * Check if locale is RTL
 * @param locale - The locale to check
 * @returns true if RTL (Arabic), false otherwise
 */
export function isRTL(locale: Locale | string): boolean {
  return getDirection(locale) === "rtl";
}

/**
 * Type-safe translation helper with nested key support
 * @param dict - The dictionary to use
 * @param key - Dot-notation key path (e.g., 'nav.home', 'home.hero.title')
 * @returns The translated string or the key if not found
 */
export function t(dict: Dictionary, key: string): string {
  const keys = key.split(".");
  let value: unknown = dict;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  return typeof value === "string" ? value : key;
}

/**
 * Get locale from pathname
 * @param pathname - The pathname to extract locale from
 * @returns The locale or default locale if not found
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }

  return defaultLocale;
}

/**
 * Generate localized pathname
 * @param pathname - The base pathname
 * @param locale - The target locale
 * @returns The localized pathname
 */
export function localizePathname(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  // Remove existing locale if present
  if (segments[0] && locales.includes(segments[0] as Locale)) {
    segments.shift();
  }

  return `/${locale}/${segments.join("/")}`.replace(/\/+$/, "") || `/${locale}`;
}

export default dictionaries;
