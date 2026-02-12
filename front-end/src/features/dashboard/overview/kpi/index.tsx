import React from "react";
import StatCards from "@/components/StatCards";
import type { StatCardData } from "@/components/StatCards/types";
import { useLocalizedKpis } from "./kpiData";

export default function KpiSection() {
  // Get localized KPIs and translations
  const { kpis, translations } = useLocalizedKpis();

  // Convert Kpi to StatCardData
  const statsData = React.useMemo((): StatCardData[] => {
    return kpis.map((kpi) => ({
      id: kpi.id,
      title: kpi.title,
      value: kpi.value,
      icon: kpi.icon,
      trend: kpi.trend
        ? {
            direction: kpi.trend.direction,
            value: kpi.trend.value,
            label:
              "directionLabel" in kpi.trend
                ? (kpi.trend as { directionLabel: string }).directionLabel
                : kpi.trend.direction,
          }
        : undefined,
      color: kpi.color,
    }));
  }, [kpis]);

  return (
    <div className="w-full">
      <StatCards
        data={statsData}
        saveOrder={true}
        storageKey="dashboard-overview-kpi-order"
        gridCols="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
        gap="gap-4 xs:gap-4"
        enableNoise={true}
        enableLighting={true}
        translations={{
          dragHandle: translations.dragHandle,
          trends: {
            ariaLabel: translations.trends.ariaLabel,
          },
        }}
      />
    </div>
  );
}
