"use client";

import React from "react";
import StatCards from "@/components/StatCards";
import type { StatCardData } from "@/components/StatCards/types";
import { useLocalizedProjectStats } from "./data";
import { ProjectStatsProps } from "../../types";

export default function ProjectStats({
  totalCount,
  inProgressCount,
  readyCount,
  blockedCount,
  loading = false,
}: ProjectStatsProps) {
  // Get localized project stats and translations
  const { projectStats, translations } = useLocalizedProjectStats({
    totalCount,
    inProgressCount,
    readyCount,
    blockedCount,
  });

  // Convert Kpi to StatCardData
  const statsData = React.useMemo((): StatCardData[] => {
    return projectStats.map((stat) => ({
      id: stat.id,
      title: stat.title,
      value: stat.value,
      icon: stat.icon,
      color: stat.color,
    }));
  }, [projectStats]);

  return (
    <div className="w-full mt-4">
      <StatCards
        data={statsData}
        saveOrder={true}
        storageKey="dashboard-projects-stats-order"
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
