import BarChart from "@/components/ui/charts/BarChart";
import { useResponsiveChartHeight } from "@/components/ui/charts/useResponsiveChartHeight";
import { PerformanceChartDataPoint } from "../hooks";
import { CHART_CONFIG } from "../config/chartConfig";
import {
  formatXAxis,
  formatYAxis,
  createTooltipFormatter,
} from "../utils/formatters";

interface PerformanceChartProps {
  chartData: PerformanceChartDataPoint[];
  barFill: string;
  translations: {
    completion: string;
    target: string;
  };
}

export default function PerformanceChart({
  chartData,
  barFill,
  translations,
}: PerformanceChartProps) {
  const chartHeight = useResponsiveChartHeight({
    compactHeight: CHART_CONFIG.compactHeight,
    expandedHeight: CHART_CONFIG.height,
    breakpoint: CHART_CONFIG.breakpoint,
  });

  return (
    <div className="flex-1 w-full min-h-[240px] sm:min-h-[280px] max-h-[400px] lg:min-h-0 py-4 px-2">
      <BarChart
        data={chartData}
        bars={[
          {
            dataKey: "value",
            fill: barFill,
            radius: CHART_CONFIG.barRadius,
          },
        ]}
        height={chartHeight}
        showGrid={CHART_CONFIG.showGrid}
        showLegend={CHART_CONFIG.showLegend}
        showTooltip={CHART_CONFIG.showTooltip}
        layout={CHART_CONFIG.layout}
        xAxisDataKey="name"
        formatYAxis={formatYAxis}
        formatXAxis={formatXAxis}
        formatTooltip={createTooltipFormatter(chartData, translations)}
        className="h-full [&_svg]:outline-none [&_svg]:border-none [&_*]:outline-none [&_*]:border-none"
      />
    </div>
  );
}
