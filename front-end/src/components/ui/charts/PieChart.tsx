"use client";

import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

export interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieChartDataPoint[];
  height?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
  // Rounded arcs and spacing
  cornerRadius?: number; // rounded arc caps
  paddingAngle?: number; // space between arcs in degrees (default 0)
  formatTooltip?: (value: number, name: string) => [string, string];
  labelFormatter?: (entry: PieChartDataPoint) => string;
  showLabels?: boolean;
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = (
  entry: {
    cx?: number | string;
    cy?: number | string;
    midAngle?: number;
    innerRadius?: number;
    outerRadius?: number;
    percent?: number;
    name?: string;
    value?: number | string;
  },
  labelFormatter?: (entry: PieChartDataPoint) => string
) => {
  // Convert cx and cy to numbers if they're strings (e.g., "50%")
  const cx = typeof entry.cx === "string" ? 0 : entry.cx || 0;
  const cy = typeof entry.cy === "string" ? 0 : entry.cy || 0;
  const value =
    typeof entry.value === "string"
      ? parseFloat(entry.value) || 0
      : entry.value || 0;

  if (
    !cx ||
    !cy ||
    !entry.percent ||
    !entry.innerRadius ||
    !entry.outerRadius ||
    !entry.midAngle
  )
    return null;

  const radius =
    entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-entry.midAngle * RADIAN);
  const y = cy + radius * Math.sin(-entry.midAngle * RADIAN);

  if (entry.percent < 0.05) return null; // Don't show labels for slices < 5%

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {entry.name && labelFormatter
        ? labelFormatter({ name: entry.name, value })
        : `${(entry.percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({
  active,
  payload,
  formatTooltip,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: PieChartDataPoint;
  }>;
  formatTooltip?: (value: number, name: string) => [string, string];
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const [formattedValue, formattedName] = formatTooltip
      ? formatTooltip(data.value, data.name)
      : [data.value.toString(), data.name];

    return (
      <div className="bg-[var(--surface)] p-3 border border-[var(--border)] rounded-md shadow-lg">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          {formattedName}: {formattedValue}
        </p>
      </div>
    );
  }
  return null;
};

const DEFAULT_COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#f97316", // orange-500
];

export default function PieChart({
  data,
  height = 300,
  showTooltip = true,
  showLegend = true,
  className,
  innerRadius = 0,
  outerRadius,
  colors = DEFAULT_COLORS,
  cornerRadius = 12,
  paddingAngle = 0,
  formatTooltip,
  labelFormatter,
  showLabels = true,
}: PieChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length],
  }));

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={
              showLabels
                ? (entry) => renderCustomizedLabel(entry, labelFormatter)
                : false
            }
            outerRadius={outerRadius || height * 0.3}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
            // Rounded arcs without gaps
            cornerRadius={cornerRadius}
            paddingAngle={paddingAngle}
            stroke="transparent"
            strokeWidth={0}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {showTooltip && (
            <Tooltip
              content={<CustomTooltip formatTooltip={formatTooltip} />}
            />
          )}
          {showLegend && (
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "12px",
                color: "rgb(115 115 115)",
              }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
