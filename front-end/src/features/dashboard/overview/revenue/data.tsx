import React from "react";
import { useLocale } from "@/hooks/locale/useLocale";

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// Original revenue data interface for component usage
export interface RevenueData {
  category: string;
  value: number;
  growth: number;
}

// Multilingual revenue data interface for raw data
interface MultilingualRevenueData {
  category: MultilingualText;
  value: number;
  growth: number;
}

// Translation objects interface
export interface RevenueTranslations {
  header: {
    title: MultilingualText;
    description: MultilingualText;
    timeFilter: MultilingualText;
  };
  categories: {
    courseSales: MultilingualText;
    subscriptions: MultilingualText;
    liveSessions: MultilingualText;
    certificates: MultilingualText;
    corporateTraining: MultilingualText;
    bundles: MultilingualText;
  };
  statistics: {
    totalRevenue: MultilingualText;
    avgGrowth: MultilingualText;
    positive: MultilingualText;
    revenue: MultilingualText;
    growth: MultilingualText;
  };
}

// Raw multilingual revenue data
const rawRevenueData: MultilingualRevenueData[] = [
  {
    category: {
      en: "Product Sales",
      ar: "مبيعات المنتجات",
    },
    value: 25420,
    growth: 18.4,
  },
  {
    category: {
      en: "Subscriptions",
      ar: "الاشتراكات",
    },
    value: 28930,
    growth: 12.2,
  },
  {
    category: {
      en: "Services",
      ar: "الخدمات",
    },
    value: 27680,
    growth: 8.7,
  },
  {
    category: {
      en: "Licenses",
      ar: "التراخيص",
    },
    value: 35420,
    growth: 15.3,
  },
  {
    category: {
      en: "Consulting",
      ar: "الاستشارات",
    },
    value: 42420,
    growth: 22.1,
  },
  {
    category: {
      en: "Packages",
      ar: "الحزم",
    },
    value: 33520,
    growth: 4.2,
  },
];

// Translation objects
const revenueTranslations: RevenueTranslations = {
  header: {
    title: {
      en: "Revenue Analytics",
      ar: "تحليلات الإيرادات",
    },
    description: {
      en: "Revenue breakdown by category",
      ar: "تفصيل الإيرادات حسب الفئة",
    },
    timeFilter: {
      en: "This Quarter",
      ar: "هذا الربع",
    },
  },
  categories: {
    courseSales: {
      en: "Product Sales",
      ar: "مبيعات المنتجات",
    },
    subscriptions: {
      en: "Subscriptions",
      ar: "الاشتراكات",
    },
    liveSessions: {
      en: "Services",
      ar: "الخدمات",
    },
    certificates: {
      en: "Licenses",
      ar: "التراخيص",
    },
    corporateTraining: {
      en: "Consulting",
      ar: "الاستشارات",
    },
    bundles: {
      en: "Packages",
      ar: "الحزم",
    },
  },
  statistics: {
    totalRevenue: {
      en: "Total Revenue",
      ar: "إجمالي الإيرادات",
    },
    avgGrowth: {
      en: "Avg Growth",
      ar: "متوسط النمو",
    },
    positive: {
      en: "Positive",
      ar: "إيجابي",
    },
    revenue: {
      en: "Revenue",
      ar: "الإيرادات",
    },
    growth: {
      en: "Growth",
      ar: "النمو",
    },
  },
};

// Hook result interface
interface UseLocalizedRevenueResult {
  revenueData: RevenueData[];
  translations: {
    header: {
      title: string;
      description: string;
      timeFilter: string;
    };
    statistics: {
      totalRevenue: string;
      avgGrowth: string;
      positive: string;
      revenue: string;
      growth: string;
    };
  };
}

// Hook to get localized revenue data and translations
export const useLocalizedRevenue = (): UseLocalizedRevenueResult => {
  const locale = useLocale();

  const localizedRevenueData = React.useMemo(
    () =>
      rawRevenueData.map(
        (data) =>
          ({
            category: data.category[locale],
            value: data.value,
            growth: data.growth,
          } as RevenueData)
      ),
    [locale]
  );

  const localizedTranslations = React.useMemo(
    () => ({
      header: {
        title: revenueTranslations.header.title[locale],
        description: revenueTranslations.header.description[locale],
        timeFilter: revenueTranslations.header.timeFilter[locale],
      },
      statistics: {
        totalRevenue: revenueTranslations.statistics.totalRevenue[locale],
        avgGrowth: revenueTranslations.statistics.avgGrowth[locale],
        positive: revenueTranslations.statistics.positive[locale],
        revenue: revenueTranslations.statistics.revenue[locale],
        growth: revenueTranslations.statistics.growth[locale],
      },
    }),
    [locale]
  );

  return React.useMemo(
    () => ({
      revenueData: localizedRevenueData,
      translations: localizedTranslations,
    }),
    [localizedRevenueData, localizedTranslations]
  );
};
