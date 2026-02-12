import { useLocale } from "@/hooks/locale/useLocale";
import {
  INSIGHT_CONFIG,
  InsightConfig,
  InsightData,
  RINGS_CONFIG,
  RingConfig,
} from "./constants";
import { RingData } from "@/components/ui/charts";

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

interface RingTranslation {
  label: MultilingualText;
  description: MultilingualText;
}

interface InsightTranslation {
  title: MultilingualText;
  description: MultilingualText;
}

// Translation objects interface
export interface InsightsTranslations {
  header: {
    title: MultilingualText;
    description: MultilingualText;
  };
  tabs: {
    performance: MultilingualText;
    trends: MultilingualText;
  };
  rings: {
    performance: Record<string, RingTranslation>;
    trends: Record<string, RingTranslation>;
    alerts: Record<string, RingTranslation>;
  };
  insights: Record<string, InsightTranslation>;
}

// Translation objects
const insightsTranslations: InsightsTranslations = {
  header: {
    title: {
      en: "Insights",
      ar: "الرؤى",
    },
    description: {
      en: "Performance analytics",
      ar: "تحليلات الأداء",
    },
  },
  tabs: {
    performance: {
      en: "Performance",
      ar: "الأداء",
    },
    trends: {
      en: "Trends",
      ar: "الاتجاهات",
    },
  },
  rings: {
    performance: {
      taskCompletion: {
        label: {
          en: "Task Completion",
          ar: "إكمال المهام",
        },
        description: {
          en: "Overall completion rate",
          ar: "معدل الإكمال الإجمالي",
        },
      },
      userEngagement: {
        label: {
          en: "User Engagement",
          ar: "مشاركة المستخدمين",
        },
        description: {
          en: "Active user participation",
          ar: "مشاركة المستخدمين الفعّالة",
        },
      },
      responseTime: {
        label: {
          en: "Response Time",
          ar: "زمن الاستجابة",
        },
        description: {
          en: "Average response efficiency",
          ar: "كفاءة متوسط الاستجابة",
        },
      },
    },
    trends: {
      userGrowth: {
        label: {
          en: "User Growth",
          ar: "نمو المستخدمين",
        },
        description: {
          en: "Month-over-month increase",
          ar: "الزيادة شهرًا بعد شهر",
        },
      },
      engagementRate: {
        label: {
          en: "Engagement Rate",
          ar: "معدل التفاعل",
        },
        description: {
          en: "Daily active users",
          ar: "عدد المستخدمين النشطين يوميًا",
        },
      },
      retention: {
        label: {
          en: "Retention",
          ar: "الاحتفاظ",
        },
        description: {
          en: "User retention rate",
          ar: "معدل احتفاظ المستخدمين",
        },
      },
    },
    alerts: {
      storageUsage: {
        label: {
          en: "Storage Usage",
          ar: "استخدام التخزين",
        },
        description: {
          en: "Disk space consumed",
          ar: "المساحة المستخدمة",
        },
      },
      responseTime: {
        label: {
          en: "Response Time",
          ar: "زمن الاستجابة",
        },
        description: {
          en: "Average response speed",
          ar: "متوسط سرعة الاستجابة",
        },
      },
      systemLoad: {
        label: {
          en: "System Load",
          ar: "حمل النظام",
        },
        description: {
          en: "Current system capacity",
          ar: "السعة الحالية للنظام",
        },
      },
    },
  },
  insights: {
    optimizeTaskCompletion: {
      title: {
        en: "Optimize task completion rate",
        ar: "حسّن معدل إكمال المهام",
      },
      description: {
        en: "Your task completion is at 78%. Consider breaking down large tasks into smaller milestones to improve completion rates and team productivity.",
        ar: "نسبة إنجاز المهام لديك 78٪. فكّر في تقسيم المهام الكبيرة إلى مراحل أصغر لتحسين معدل الإكمال ورفع إنتاجية الفريق.",
      },
    },
    growthTrajectory: {
      title: {
        en: "Exceptional growth trajectory",
        ar: "مسار نمو استثنائي",
      },
      description: {
        en: "User growth is up 92% with strong engagement metrics. Peak activity hours are 2-4 PM daily. Consider scheduling important updates during these windows.",
        ar: "نمو المستخدمين ارتفع بنسبة 92٪ مع مؤشرات تفاعل قوية. تبلغ ذروة النشاط بين الساعة 2 و4 مساءً يوميًا. فكّر في جدولة التحديثات المهمة خلال هذه الفترات.",
      },
    },
    storageCapacity: {
      title: {
        en: "Storage approaching capacity",
        ar: "السعة التخزينية تقترب من الحد",
      },
      description: {
        en: "You're using 85% of allocated storage. Consider archiving old data or upgrading your plan to prevent service disruptions. Review queue management to improve response times.",
        ar: "أنت تستخدم 85٪ من السعة المتاحة. فكّر في أرشفة البيانات القديمة أو ترقية الباقة لتجنب انقطاع الخدمة. راجع إدارة الطوابير لتحسين أوقات الاستجابة.",
      },
    },
  },
};

// Hook result interface
interface UseLocalizedInsightsResult {
  translations: {
    header: {
      title: string;
      description: string;
    };
  };
  tabs: {
    performance: string;
    trends: string;
  };
  ringData: {
    performance: RingData[];
    trends: RingData[];
  };
  insights: {
    performance: InsightData;
    trends: InsightData;
  };
}

const mapRingGroup = (
  configs: RingConfig[],
  translations: Record<string, RingTranslation>,
  locale: keyof MultilingualText
): RingData[] =>
  configs.map((config) => {
    const text = translations[config.key];

    return {
      label: text ? text.label[locale] : config.key,
      description: text ? text.description[locale] : "",
      value: config.value,
      max: config.max,
      color: config.color,
      icon: config.icon,
    };
  });

const mapInsight = (
  config: InsightConfig,
  translations: Record<string, InsightTranslation>,
  locale: keyof MultilingualText
): InsightData => {
  const text = translations[config.key];

  return {
    icon: config.icon,
    iconColor: config.iconColor,
    title: text ? text.title[locale] : "",
    description: text ? text.description[locale] : "",
  };
};

// Hook to get localized translations
export const useLocalizedInsights = (): UseLocalizedInsightsResult => {
  const locale = useLocale();
  const normalizedLocale: keyof MultilingualText =
    locale === "ar" ? "ar" : "en";

  return {
    translations: {
      header: {
        title: insightsTranslations.header.title[normalizedLocale],
        description: insightsTranslations.header.description[normalizedLocale],
      },
    },
    tabs: {
      performance: insightsTranslations.tabs.performance[normalizedLocale],
      trends: insightsTranslations.tabs.trends[normalizedLocale],
    },
    ringData: {
      performance: mapRingGroup(
        RINGS_CONFIG.performance,
        insightsTranslations.rings.performance,
        normalizedLocale
      ),
      trends: mapRingGroup(
        RINGS_CONFIG.trends,
        insightsTranslations.rings.trends,
        normalizedLocale
      ),
    },
    insights: {
      performance: mapInsight(
        INSIGHT_CONFIG.performance,
        insightsTranslations.insights,
        normalizedLocale
      ),
      trends: mapInsight(
        INSIGHT_CONFIG.trends,
        insightsTranslations.insights,
        normalizedLocale
      ),
    },
  };
};
