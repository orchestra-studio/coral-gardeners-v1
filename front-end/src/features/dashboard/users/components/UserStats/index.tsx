"use client";

import React from "react";
import StatCards from "@/components/StatCards";
import type { StatCardData } from "@/components/StatCards/types";
import { useLocalizedUserStats } from "./data";
import { UserStatsProps } from "../../types";

export default function UserStats({
  totalCount,
  deletedCount,
  unverifiedCount,
  verifiedCount,
  loading = false,
}: UserStatsProps) {
  // Get localized user stats and translations
  const { userStats, translations } = useLocalizedUserStats({
    totalCount,
    deletedCount,
    unverifiedCount,
    verifiedCount,
  });

  // Convert Kpi to StatCardData
  const statsData = React.useMemo((): StatCardData[] => {
    return userStats.map((stat) => ({
      id: stat.id,
      title: stat.title,
      value: stat.value,
      icon: stat.icon,
      color: stat.color,
    }));
  }, [userStats]);

  return (
    <div className="w-full mt-4">
      <StatCards
        data={statsData}
        saveOrder={true}
        storageKey="dashboard-users-stats-order"
        loading={loading}
        gridCols="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
        gap="gap-3 xs:gap-4"
        translations={{
          dragHandle: translations.dragHandle,
        }}
      />
    </div>
  );
}
