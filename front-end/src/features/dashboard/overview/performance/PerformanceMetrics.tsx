"use client";

import { IconChevronDown } from "@tabler/icons-react";
import WidgetCard from "../common/WidgetCard";
import SectionHeader from "../common/SectionHeader";
import { useLocalizedPerformance } from "./data";
import { useChartData, usePerformanceStats, useThemeColor } from "./hooks";
import { PerformanceChart, StatisticsFooter } from "./components";
import { THEME_CONFIG } from "./config/chartConfig";

export default function PerformanceMetricsChart() {
  const { performanceData, translations } = useLocalizedPerformance();
  const barFill = useThemeColor(
    THEME_CONFIG.colorVariable,
    THEME_CONFIG.fallbackColor
  );
  const chartData = useChartData(performanceData);
  const { avgCompletion, aboveTarget, bestMonth } =
    usePerformanceStats(performanceData);

  return (
    <WidgetCard
      className="w-full h-full min-h-[400px] flex-1 flex flex-col p-4"
      lightingIntensity={0.07}
      lightingWidth={1200}
      lightingHeight={900}
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

      <PerformanceChart
        chartData={chartData}
        barFill={barFill}
        translations={{
          completion: translations.statistics.completion,
          target: translations.statistics.target,
        }}
      />

      <StatisticsFooter
        avgCompletion={avgCompletion}
        aboveTarget={aboveTarget}
        totalMonths={performanceData.length}
        bestMonth={bestMonth}
        translations={{
          avgCompletion: translations.statistics.avgCompletion,
          aboveTarget: translations.statistics.aboveTarget,
          bestMonth: translations.statistics.bestMonth,
        }}
      />
    </WidgetCard>
  );
}
