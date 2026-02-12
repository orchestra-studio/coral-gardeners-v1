import React from "react";
import { useLocale } from "@/hooks/locale/useLocale";

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// Performance data interface
export interface PerformanceData {
  month: string;
  completionRate: number;
  target: number;
}

// Multilingual performance data interface
interface MultilingualPerformanceData {
  month: MultilingualText;
  completionRate: number;
  target: number;
}

// Translation objects interface
export interface PerformanceTranslations {
  header: {
    title: MultilingualText;
    description: MultilingualText;
    timeFilter: MultilingualText;
  };
  statistics: {
    avgCompletion: MultilingualText;
    aboveTarget: MultilingualText;
    bestMonth: MultilingualText;
    completion: MultilingualText;
    target: MultilingualText;
  };
}

// Raw multilingual performance data
const rawPerformanceData: MultilingualPerformanceData[] = [
  {
    month: { en: "Jan", ar: "يناير" },
    completionRate: 87,
    target: 85,
  },
  {
    month: { en: "Feb", ar: "فبراير" },
    completionRate: 92,
    target: 85,
  },
  {
    month: { en: "Mar", ar: "مارس" },
    completionRate: 78,
    target: 85,
  },
  {
    month: { en: "Apr", ar: "أبريل" },
    completionRate: 95,
    target: 85,
  },
  {
    month: { en: "May", ar: "مايو" },
    completionRate: 88,
    target: 85,
  },
];

// Translation objects
const performanceTranslations: PerformanceTranslations = {
  header: {
    title: {
      en: "Performance Metrics",
      ar: "مقاييس الأداء",
    },
    description: {
      en: "Monthly completion rate tracking",
      ar: "تتبع معدل الإنجاز الشهري",
    },
    timeFilter: {
      en: "Last 5 Months",
      ar: "آخر 5 أشهر",
    },
  },
  statistics: {
    avgCompletion: {
      en: "Avg Completion",
      ar: "متوسط الإنجاز",
    },
    aboveTarget: {
      en: "Above Target",
      ar: "فوق الهدف",
    },
    bestMonth: {
      en: "Best Month",
      ar: "أفضل شهر",
    },
    completion: {
      en: "Completion",
      ar: "الإنجاز",
    },
    target: {
      en: "Target",
      ar: "الهدف",
    },
  },
};

// Hook result interface
interface UseLocalizedPerformanceResult {
  performanceData: PerformanceData[];
  translations: {
    header: {
      title: string;
      description: string;
      timeFilter: string;
    };
    statistics: {
      avgCompletion: string;
      aboveTarget: string;
      bestMonth: string;
      completion: string;
      target: string;
    };
  };
}

// Hook to get localized performance data and translations
export const useLocalizedPerformance = (): UseLocalizedPerformanceResult => {
  const locale = useLocale();

  const localizedPerformanceData = React.useMemo(
    () =>
      rawPerformanceData.map(
        (data) =>
          ({
            month: data.month[locale],
            completionRate: data.completionRate,
            target: data.target,
          } as PerformanceData)
      ),
    [locale]
  );

  const localizedTranslations = React.useMemo(
    () => ({
      header: {
        title: performanceTranslations.header.title[locale],
        description: performanceTranslations.header.description[locale],
        timeFilter: performanceTranslations.header.timeFilter[locale],
      },
      statistics: {
        avgCompletion: performanceTranslations.statistics.avgCompletion[locale],
        aboveTarget: performanceTranslations.statistics.aboveTarget[locale],
        bestMonth: performanceTranslations.statistics.bestMonth[locale],
        completion: performanceTranslations.statistics.completion[locale],
        target: performanceTranslations.statistics.target[locale],
      },
    }),
    [locale]
  );

  return React.useMemo(
    () => ({
      performanceData: localizedPerformanceData,
      translations: localizedTranslations,
    }),
    [localizedPerformanceData, localizedTranslations]
  );
};
