import React from "react";
import {
  IconUsers,
  IconTrendingUp,
  IconClock,
  IconFolders,
} from "@tabler/icons-react";
import { Kpi } from "../common/types";
import { useLocale } from "@/hooks/locale/useLocale";

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// Enhanced trend with multilingual labels
interface MultilingualTrend {
  direction: "up" | "down" | "stable";
  value: string;
  label: MultilingualText;
}

// KPI with multilingual content
interface MultilingualKpi {
  id: string;
  title: MultilingualText;
  value: number | MultilingualText;
  icon: React.ReactNode;
  trend: MultilingualTrend;
  color?: string;
}

// Translation words passed to components
export interface KpiTranslations {
  dragHandle: MultilingualText;
  trends: {
    ariaLabel: MultilingualText;
  };
}

// Raw KPI data with complete multilingual content
const rawKpiData: MultilingualKpi[] = [
  {
    id: "kpi-1",
    title: {
      en: "Total Projects",
      ar: "إجمالي المشاريع",
    },
    value: 24,
    icon: <IconFolders size={16} />,
    trend: {
      direction: "up",
      value: "+3",
      label: {
        en: "Up",
        ar: "صاعد",
      },
    },
  },
  {
    id: "kpi-2",
    title: {
      en: "Active Users",
      ar: "المستخدمون النشطون",
    },
    value: 1847,
    icon: <IconUsers size={16} />,
    trend: {
      direction: "up",
      value: "+12%",
      label: {
        en: "Up",
        ar: "صاعد",
      },
    },
  },
  {
    id: "kpi-3",
    title: {
      en: "Task Completion",
      ar: "إتمام المهام",
    },
    value: {
      en: "78%",
      ar: "78%",
    },
    icon: <IconTrendingUp size={16} />,
    trend: {
      direction: "up",
      value: "+5%",
      label: {
        en: "Up",
        ar: "صاعد",
      },
    },
  },
  {
    id: "kpi-4",
    title: {
      en: "Avg. Response Time",
      ar: "متوسط وقت الاستجابة",
    },
    value: {
      en: "32 min",
      ar: "32 دقيقة",
    },
    icon: <IconClock size={16} />,
    trend: {
      direction: "stable",
      value: "0%",
      label: {
        en: "Stable",
        ar: "مستقر",
      },
    },
  },
];

// Translation words for KPI components
const kpiTranslations: KpiTranslations = {
  dragHandle: {
    en: "Drag handle",
    ar: "مقبض السحب",
  },
  trends: {
    ariaLabel: {
      en: "Trend: {direction} {value}",
      ar: "الاتجاه: {direction} {value}",
    },
  },
};

// Hook result interface
interface UseLocalizedKpisResult {
  kpis: Kpi[];
  translations: {
    dragHandle: string;
    trends: {
      ariaLabel: string;
    };
  };
}

// Hook to get localized KPIs and translations
export const useLocalizedKpis = (): UseLocalizedKpisResult => {
  const locale = useLocale();

  const localizedKpis = React.useMemo(
    () =>
      rawKpiData.map(
        (kpi) =>
          ({
            id: kpi.id,
            title: kpi.title[locale],
            value:
              typeof kpi.value === "object" ? kpi.value[locale] : kpi.value,
            icon: kpi.icon,
            trend: {
              direction: kpi.trend.direction,
              value: kpi.trend.value,
              // Include the localized direction label for aria-label
              directionLabel: kpi.trend.label[locale],
            },
            color: kpi.color,
          } as Kpi & {
            trend: {
              direction: "up" | "down" | "stable";
              value: string;
              directionLabel: string;
            };
          })
      ),
    [locale]
  );

  const localizedTranslations = React.useMemo(
    () => ({
      dragHandle: kpiTranslations.dragHandle[locale],
      trends: {
        ariaLabel: kpiTranslations.trends.ariaLabel[locale],
      },
    }),
    [locale]
  );

  return React.useMemo(
    () => ({
      kpis: localizedKpis,
      translations: localizedTranslations,
    }),
    [localizedKpis, localizedTranslations]
  );
};

// Keep backward compatibility (deprecated - will be removed)
export const initialKpis: Kpi[] = [];
