import React from "react";
import { useLocale } from "@/hooks/locale/useLocale";
import { UserTrafficPoint } from "@/components/WorldMap";

// Coral Gardeners restoration site data with real locations
export const userTrafficData: UserTrafficPoint[] = [
  {
    id: "moorea-hq",
    name: "Mo'orea HQ & Main Nursery",
    coordinates: [-149.81, -17.48],
    visitors: 45000,
    type: "active",
    sessionTime: "Since 2017",
    country: "French Polynesia",
    pageViews: 45000,
  },
  {
    id: "moorea-cooks-bay",
    name: "Cook's Bay Nursery",
    coordinates: [-149.83, -17.53],
    visitors: 18000,
    type: "active",
    sessionTime: "ReefOS Monitoring",
    country: "French Polynesia",
    pageViews: 18000,
  },
  {
    id: "tikehau",
    name: "Tikehau Atoll",
    coordinates: [-148.22, -15.12],
    visitors: 8000,
    type: "active",
    sessionTime: "Since 2021",
    country: "French Polynesia",
    pageViews: 8000,
  },
  {
    id: "fiji-malolo",
    name: "Tei Lase - Malolo Island",
    coordinates: [177.12, -17.77],
    visitors: 12000,
    type: "active",
    sessionTime: "International Branch",
    country: "Fiji",
    pageViews: 12000,
  },
  {
    id: "thailand-koh-mak",
    name: "Koh Mak Nursery",
    coordinates: [102.48, 11.82],
    visitors: 6000,
    type: "active",
    sessionTime: "Asia Branch",
    country: "Thailand",
    pageViews: 6000,
  },
  {
    id: "thailand-koh-kood",
    name: "Koh Kood Nursery",
    coordinates: [102.47, 11.53],
    visitors: 4000,
    type: "active",
    sessionTime: "Sister Site",
    country: "Thailand",
    pageViews: 4000,
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
    title: "Coral Restoration Sites",
    description: "Active nurseries and restoration programs worldwide",
    viewDetails: "View Details",
    statistics: {
      totalViewers: "Total Corals Planted",
      activeUsers: "Active Sites",
      avgSessionTime: "Countries",
      topCountry: "HQ Location",
    },
  },
  ar: {
    title: "مواقع استعادة الشعاب المرجانية",
    description: "المشاتل وبرامج الاستعادة النشطة حول العالم",
    viewDetails: "عرض التفاصيل",
    statistics: {
      totalViewers: "إجمالي الشعاب المزروعة",
      activeUsers: "المواقع النشطة",
      avgSessionTime: "الدول",
      topCountry: "المقر الرئيسي",
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
