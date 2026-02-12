import React from "react";
import { useLocale } from "@/hooks/locale/useLocale";

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// Original radar data interface for component usage
export interface RadarData {
  metric: string;
  value: number;
}

// Multilingual radar data interface for raw data
interface MultilingualRadarData {
  metric: MultilingualText;
  value: number;
}

// Translation objects interface
export interface AnalyticsTranslations {
  radar: {
    header: {
      title: MultilingualText;
      description: MultilingualText;
    };
    tip: {
      content: MultilingualText;
    };
  };
}

// Raw multilingual business metrics data
const rawRadarData: MultilingualRadarData[] = [
  {
    metric: {
      en: "Engagement",
      ar: "التفاعل",
    },
    value: 94,
  },
  {
    metric: {
      en: "Conversion Rate",
      ar: "معدل التحويل",
    },
    value: 78,
  },
  {
    metric: {
      en: "User Satisfaction",
      ar: "رضا المستخدمين",
    },
    value: 91,
  },
  {
    metric: {
      en: "Content Quality",
      ar: "جودة المحتوى",
    },
    value: 88,
  },
  {
    metric: {
      en: "Performance",
      ar: "الأداء",
    },
    value: 92,
  },
];

// Translation objects
const analyticsTranslations: AnalyticsTranslations = {
  radar: {
    header: {
      title: {
        en: "Performance Analytics",
        ar: "تحليلات الأداء",
      },
      description: {
        en: "Key performance indicators and metrics overview",
        ar: "نظرة عامة على مؤشرات الأداء الرئيسية",
      },
    },
    tip: {
      content: {
        en: "Tip: Improve performance by optimizing content delivery, enhancing user experience, and gathering regular feedback.",
        ar: "نصيحة: حسّن الأداء من خلال تحسين توصيل المحتوى، وتعزيز تجربة المستخدم، وجمع التعليقات بانتظام.",
      },
    },
  },
};

// Hook result interface
interface UseLocalizedAnalyticsResult {
  radarData: RadarData[];
  translations: {
    radar: {
      header: {
        title: string;
        description: string;
      };
      tip: {
        content: string;
      };
    };
  };
}

// Hook to get localized analytics and translations
export const useLocalizedAnalytics = (): UseLocalizedAnalyticsResult => {
  const locale = useLocale();

  const localizedRadarData = React.useMemo(
    () =>
      rawRadarData.map(
        (data) =>
          ({
            metric: data.metric[locale],
            value: data.value,
          } as RadarData)
      ),
    [locale]
  );

  const localizedTranslations = React.useMemo(
    () => ({
      radar: {
        header: {
          title: analyticsTranslations.radar.header.title[locale],
          description: analyticsTranslations.radar.header.description[locale],
        },
        tip: {
          content: analyticsTranslations.radar.tip.content[locale],
        },
      },
    }),
    [locale]
  );

  return React.useMemo(
    () => ({
      radarData: localizedRadarData,
      translations: localizedTranslations,
    }),
    [localizedRadarData, localizedTranslations]
  );
};
