import RadarChart from "@/components/ui/charts/RadarChart";
import { RadarChartDataPoint } from "../hooks";
import { CHART_CONFIG, THEME_CONFIG } from "../config/chartConfig";

interface AnalyticsRadarChartProps {
  chartData: RadarChartDataPoint[];
}

export default function AnalyticsRadarChart({
  chartData,
}: AnalyticsRadarChartProps) {
  return (
    <div className="h-[260px] xs:h-[280px] sm:h-[300px] md:h-[320px] max-h-[400px] lg:h-[300px] xl:h-[330px]">
      <RadarChart
        data={chartData}
        radars={[
          {
            dataKey: "value",
            stroke: `var(${THEME_CONFIG.colorVariable})`,
            fill: `var(${THEME_CONFIG.colorVariable})`,
            strokeWidth: CHART_CONFIG.strokeWidth,
            fillOpacity: CHART_CONFIG.fillOpacity,
          },
        ]}
        height={CHART_CONFIG.height}
        showGrid={CHART_CONFIG.showGrid}
        showTooltip={CHART_CONFIG.showTooltip}
        angleAxisDataKey="name"
        outerRadius={CHART_CONFIG.outerRadius}
        domain={CHART_CONFIG.domain}
      />
    </div>
  );
}
