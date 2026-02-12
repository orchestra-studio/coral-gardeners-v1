"use client";

import { IconChevronDown } from "@tabler/icons-react";
import WidgetCard from "../common/WidgetCard";
import SectionHeader from "../common/SectionHeader";
import { useLocalizedRevenue } from "./data";
import { useChartData, useRevenueStats, useThemeColor } from "./hooks";
import { RevenueChart, StatisticsFooter } from "./components";
import { THEME_CONFIG } from "./config/chartConfig";

export default function RevenueAnalyticsChart() {
  const { revenueData, translations } = useLocalizedRevenue();
  const areaFill = useThemeColor(
    THEME_CONFIG.colorVariable,
    THEME_CONFIG.fallbackColor
  );
  const chartData = useChartData(revenueData);
  const { totalRevenue, avgGrowth, positiveCount } =
    useRevenueStats(revenueData);

  return (
    <WidgetCard
      className="w-full h-full min-h-[400px] flex-1 flex flex-col p-4"
      lightingIntensity={0.07}
      lightingWidth={640}
      lightingHeight={720}
    >
      <SectionHeader
        title={translations.header.title}
        description={translations.header.description}
        action={
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-xs text-[var(--text-muted)]">
              {translations.header.timeFilter}
            </span>
            <IconChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
          </div>
        }
      />

      <RevenueChart
        chartData={chartData}
        areaFill={areaFill}
        translations={{
          revenue: translations.statistics.revenue,
          growth: translations.statistics.growth,
        }}
      />

      <StatisticsFooter
        totalRevenue={totalRevenue}
        avgGrowth={avgGrowth}
        positiveCount={positiveCount}
        totalCount={revenueData.length}
        translations={{
          totalRevenue: translations.statistics.totalRevenue,
          avgGrowth: translations.statistics.avgGrowth,
          positive: translations.statistics.positive,
        }}
      />
    </WidgetCard>
  );
}
