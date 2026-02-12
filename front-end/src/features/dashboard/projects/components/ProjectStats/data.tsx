import React from "react";
import {
  IconFolders,
  IconProgress,
  IconCheck,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { Kpi } from "@/features/dashboard/overview/common/types";
import { useLocale } from "@/hooks/locale/useLocale";
import { ProjectStatsProps } from "../../types";

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// Project Stats with multilingual content
interface MultilingualProjectStat {
  id: string;
  title: MultilingualText;
  value: number | MultilingualText;
  icon: React.ReactNode;
  color?: string;
}

// Translation words passed to components
export interface ProjectStatsTranslations {
  dragHandle: MultilingualText;
}

// Function to generate project stats data based on props
const generateProjectStatsData = (
  props: ProjectStatsProps
): MultilingualProjectStat[] => {
  return [
    {
      id: "project-stat-1",
      title: {
        en: "Total Projects",
        ar: "إجمالي المشاريع",
      },
      value: props.totalCount,
      icon: <IconFolders size={16} />,
    },
    {
      id: "project-stat-2",
      title: {
        en: "In Progress",
        ar: "قيد التنفيذ",
      },
      value: props.inProgressCount,
      icon: <IconProgress size={16} />,
    },
    {
      id: "project-stat-3",
      title: {
        en: "Ready",
        ar: "جاهز",
      },
      value: props.readyCount || 0,
      icon: <IconCheck size={16} />,
    },
    {
      id: "project-stat-4",
      title: {
        en: "Blocked",
        ar: "محظور",
      },
      value: props.blockedCount || 0,
      icon: <IconAlertTriangle size={16} />,
    },
  ];
};

// Translation words for project stats components
const projectStatsTranslations: ProjectStatsTranslations = {
  dragHandle: {
    en: "Drag handle",
    ar: "مقبض السحب",
  },
};

// Hook result interface
interface UseLocalizedProjectStatsResult {
  projectStats: Kpi[];
  translations: {
    dragHandle: string;
  };
}

// Hook to get localized project stats and translations
export const useLocalizedProjectStats = (
  props: ProjectStatsProps
): UseLocalizedProjectStatsResult => {
  const locale = useLocale();
  const { totalCount, inProgressCount, readyCount, blockedCount } = props;

  const localizedProjectStats = React.useMemo(() => {
    const rawData = generateProjectStatsData({
      totalCount,
      inProgressCount,
      readyCount,
      blockedCount,
    });
    return rawData.map(
      (stat) =>
        ({
          id: stat.id,
          title: stat.title[locale],
          value:
            typeof stat.value === "object" ? stat.value[locale] : stat.value,
          icon: stat.icon,
          color: stat.color,
        } as Kpi)
    );
  }, [locale, totalCount, inProgressCount, readyCount, blockedCount]);

  const localizedTranslations = React.useMemo(
    () => ({
      dragHandle: projectStatsTranslations.dragHandle[locale],
    }),
    [locale]
  );

  return React.useMemo(
    () => ({
      projectStats: localizedProjectStats,
      translations: localizedTranslations,
    }),
    [localizedProjectStats, localizedTranslations]
  );
};
