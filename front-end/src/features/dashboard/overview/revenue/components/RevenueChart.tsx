import AreaChart from "@/components/ui/charts/AreaChart";
import { useResponsiveChartHeight } from "@/components/ui/charts/useResponsiveChartHeight";
import { RevenueChartDataPoint } from "../hooks";
import { CHART_CONFIG } from "../config/chartConfig";
import {
  formatXAxis,
  formatYAxis,
  createTooltipFormatter,
} from "../utils/formatters";

interface RevenueChartProps {
  chartData: RevenueChartDataPoint[];
  areaFill: string;
  translations: {
    revenue: string;
    growth: string;
  };
}

export default function RevenueChart({
  chartData,
  areaFill,
  translations,
}: RevenueChartProps) {
  const chartHeight = useResponsiveChartHeight({
    compactHeight: CHART_CONFIG.compactHeight,
    expandedHeight: CHART_CONFIG.height,
    breakpoint: CHART_CONFIG.breakpoint,
  });

  return (
    <div className="flex-1 w-full min-h-[240px] max-h-[400px] sm:min-h-[280px] lg:min-h-0">
      <AreaChart
        data={chartData}
        areas={[
          {
            dataKey: "value",
            fill: areaFill,
            stroke: areaFill,
            strokeWidth: CHART_CONFIG.strokeWidth,
          },
        ]}
        height={chartHeight}
        showGrid={CHART_CONFIG.showGrid}
        showLegend={CHART_CONFIG.showLegend}
        showTooltip={CHART_CONFIG.showTooltip}
        xAxisDataKey="name"
        formatXAxis={formatXAxis}
        formatYAxis={formatYAxis}
        formatTooltip={createTooltipFormatter(chartData, translations)}
        className="h-full [&_svg]:outline-none [&_svg]:border-none [&_*]:outline-none [&_*]:border-none"
      />
    </div>
  );
}
