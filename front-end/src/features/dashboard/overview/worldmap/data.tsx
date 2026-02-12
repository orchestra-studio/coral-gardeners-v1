import React from "react";
import { useLocale } from "@/hooks/locale/useLocale";
import { UserTrafficPoint } from "@/components/WorldMap";

// User traffic data with multilingual names
export const userTrafficData: UserTrafficPoint[] = [
  {
    id: "1",
    name: "Sarah Chen",
    coordinates: [121.5654, 25.033],
    visitors: 2500,
    type: "active",
    sessionTime: "8 min",
    country: "Taiwan",
    pageViews: 12,
  },
  {
    id: "2",
    name: "James Wilson",
    coordinates: [-74.006, 40.7128],
    visitors: 1200,
    type: "idle",
    sessionTime: "3 min",
    country: "United States",
    pageViews: 5,
  },
  {
    id: "3",
    name: "María García",
    coordinates: [-3.7038, 40.4168],
    visitors: 3400,
    type: "active",
    sessionTime: "15 min",
    country: "Spain",
    pageViews: 23,
  },
  {
    id: "4",
    name: "أحمد حسن",
    coordinates: [31.2357, 30.0444],
    visitors: 890,
    type: "idle",
    sessionTime: "2 min",
    country: "Egypt",
    pageViews: 3,
  },
  {
    id: "5",
    name: "田中雪",
    coordinates: [139.6917, 35.6895],
    visitors: 5600,
    type: "active",
    sessionTime: "22 min",
    country: "Japan",
    pageViews: 34,
  },
  {
    id: "6",
    name: "Lucas Silva",
    coordinates: [-46.6333, -23.5505],
    visitors: 1800,
    type: "active",
    sessionTime: "11 min",
    country: "Brazil",
    pageViews: 18,
  },
];

// Multilingual worldmap interface
export interface MultilingualWorldmap {
  title: string;
  description: string;
  viewDetails: string;
  statistics: {
    totalViewers: string;
    activeUsers: string;
    avgSessionTime: string;
    topCountry: string;
  };
}

// Worldmap translations
export const worldmapTranslations: Record<string, MultilingualWorldmap> = {
  en: {
    title: "User Activity Map",
    description: "Real-time user engagement worldwide",
    viewDetails: "View Details",
    statistics: {
      totalViewers: "Total Users",
      activeUsers: "Active Now",
      avgSessionTime: "Avg Session Time",
      topCountry: "Top Region",
    },
  },
  ar: {
    title: "خريطة نشاط المستخدمين",
    description: "تفاعل المستخدمين المباشر حول العالم",
    viewDetails: "عرض التفاصيل",
    statistics: {
      totalViewers: "إجمالي المستخدمين",
      activeUsers: "نشطون الآن",
      avgSessionTime: "متوسط وقت الجلسة",
      topCountry: "المنطقة الأولى",
    },
  },
};

// Hook to provide localized worldmap data
export function useLocalizedWorldmap() {
  const locale = useLocale();

  return React.useMemo(
    () => ({
      userTraffic: userTrafficData,
      translations: worldmapTranslations[locale],
    }),
    [locale]
  );
}
