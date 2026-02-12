import { memo, useMemo } from "react";
import BarChart from "@/components/ui/charts/BarChart";
import LineChart from "@/components/ui/charts/LineChart";
import type {
  BarChartDataPoint,
  BarChartProps,
} from "@/components/ui/charts/BarChart";
import type {
  LineChartDataPoint,
  LineChartProps,
} from "@/components/ui/charts/LineChart";
import { CHART_COLORS } from "../constants";
import { normalizeChartData } from "../utils";
import type { ChartBlock as ChartBlockType } from "../types";

interface ChartBlockProps {
  block: ChartBlockType;
  index: number;
}

function ChartBlockComponent({ block, index }: ChartBlockProps) {
  const {
    title,
    description,
    chartKind,
    data,
    series,
    xKey = "month",
    height = 320,
    showLegend,
    showGrid,
  } = block;

  const normalizedSeries = useMemo(
    () =>
      series.map((entry, idx) => ({
        dataKey: entry.dataKey,
        name: entry.name || entry.dataKey,
        color: entry.color ?? CHART_COLORS[idx % CHART_COLORS.length],
      })),
    [series]
  );

  const normalizedData = useMemo(
    () => normalizeChartData(data, xKey),
    [data, xKey]
  );

  const legendSetting =
    showLegend === undefined ? normalizedSeries.length > 1 : showLegend;
  const gridSetting = showGrid === undefined ? true : showGrid;

  const barProps: Pick<
    BarChartProps,
    "data" | "bars" | "height" | "showLegend" | "showGrid" | "xAxisDataKey"
  > = {
    data: normalizedData as BarChartDataPoint[],
    bars: normalizedSeries.map((entry) => ({
      dataKey: entry.dataKey,
      name: entry.name,
      fill: entry.color,
    })),
    height,
    showLegend: legendSetting,
    showGrid: gridSetting,
    xAxisDataKey: xKey,
  };

  const lineProps: Pick<
    LineChartProps,
    "data" | "lines" | "height" | "showLegend" | "showGrid" | "xAxisDataKey"
  > = {
    data: normalizedData as LineChartDataPoint[],
    lines: normalizedSeries.map((entry) => ({
      dataKey: entry.dataKey,
      name: entry.name,
      stroke: entry.color,
    })),
    height,
    showLegend: legendSetting,
    showGrid: gridSetting,
    xAxisDataKey: xKey,
  };

  return (
    <div key={`chart-block-${index}`} className="space-y-2 w-full">
      {title && (
        <h4 className="text-sm font-semibold text-[var(--text-muted)]">
          {title}
        </h4>
      )}
      <div
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
        dir="ltr"
      >
        {chartKind === "bar" ? (
          <BarChart {...barProps} />
        ) : (
          <LineChart {...lineProps} />
        )}
      </div>
      {description && (
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
      )}
    </div>
  );
}

// Memoize to prevent re-renders when parent re-renders during streaming
export const ChartBlock = memo(ChartBlockComponent);
