import React from "react";
import { RingsChart } from "@/components/ui/charts";
import { RingData } from "@/components/ui/charts";
import { InsightData, CHART_CONFIG } from "../constants";

interface TabContentProps {
  chartData: RingData[];
  insight: InsightData;
}

export function TabContent({ chartData }: TabContentProps) {
  return (
    <div className="p-3 sm:p-4 w-full flex items-center justify-center overflow-visible">
      {/* Chart with labels - in row */}
      <RingsChart
        data={chartData}
        size={CHART_CONFIG.size}
        strokeWidth={CHART_CONFIG.strokeWidth}
        showLabels={CHART_CONFIG.showLabels}
        showPercentage={CHART_CONFIG.showPercentage}
        labelsLayout="horizontal"
      />
    </div>
  );
}
