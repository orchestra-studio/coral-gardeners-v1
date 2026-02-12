import React from "react";
import {
  IconUsers,
  IconToggleRight,
  IconToggleLeft,
  IconCheck,
} from "@tabler/icons-react";
import { Kpi } from "@/features/dashboard/overview/common/types";
import { useLocale } from "@/hooks/locale/useLocale";
import { UserStatsProps } from "../../types";

// Multilingual text interface
interface MultilingualText {
  en: string;
  ar: string;
}

// User Stats with multilingual content
interface MultilingualUserStat {
  id: string;
  title: MultilingualText;
  value: number | MultilingualText;
  icon: React.ReactNode;
  color?: string;
}

// Translation words passed to components
export interface UserStatsTranslations {
  dragHandle: MultilingualText;
}

// Function to generate user stats data based on props
const generateUserStatsData = (
  props: UserStatsProps
): MultilingualUserStat[] => {
  return [
    {
      id: "user-stat-1",
      title: {
        en: "Total Users",
        ar: "إجمالي المستخدمين",
      },
      value: props.totalCount,
      icon: <IconUsers size={16} />,
    },
    {
      id: "user-stat-2",
      title: {
        en: "Deleted Users",
        ar: "المستخدمين المحذوفين",
      },
      value: props.deletedCount,
      icon: <IconToggleLeft size={16} />,
    },
    {
      id: "user-stat-3",
      title: {
        en: "Unverified Users",
        ar: "المستخدمين غير المتحققين",
      },
      value: props.unverifiedCount || 0,
      icon: <IconToggleRight size={16} />,
    },
    {
      id: "user-stat-4",
      title: {
        en: "Verified Users",
        ar: "المستخدمين المتحققين",
      },
      value: props.verifiedCount || 0,
      icon: <IconCheck size={16} />,
    },
  ];
};

// Translation words for user stats components
const userStatsTranslations: UserStatsTranslations = {
  dragHandle: {
    en: "Drag handle",
    ar: "مقبض السحب",
  },
};

// Hook result interface
interface UseLocalizedUserStatsResult {
  userStats: Kpi[];
  translations: {
    dragHandle: string;
  };
}

// Hook to get localized user stats and translations
export const useLocalizedUserStats = (
  props: UserStatsProps
): UseLocalizedUserStatsResult => {
  const locale = useLocale();
  const { totalCount, deletedCount, unverifiedCount, verifiedCount } = props;

  const localizedUserStats = React.useMemo(() => {
    const rawData = generateUserStatsData({
      totalCount,
      deletedCount,
      unverifiedCount,
      verifiedCount,
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
  }, [locale, totalCount, deletedCount, unverifiedCount, verifiedCount]);

  const localizedTranslations = React.useMemo(
    () => ({
      dragHandle: userStatsTranslations.dragHandle[locale],
    }),
    [locale]
  );

  return React.useMemo(
    () => ({
      userStats: localizedUserStats,
      translations: localizedTranslations,
    }),
    [localizedUserStats, localizedTranslations]
  );
};
