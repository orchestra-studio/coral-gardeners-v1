"use client";

import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

export interface LineChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface LineChartLine {
  dataKey: string;
  stroke: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  name?: string;
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  lines: LineChartLine[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  xAxisDataKey?: string;
  formatTooltip?: (value: string | number, name: string) => [string, string];
  formatXAxis?: (value: string | number) => string;
  formatYAxis?: (value: string | number) => string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
  formatTooltip,
}: {
  active?: boolean;
  payload?: Array<{
    value: string | number;
    name?: string;
    dataKey: string;
    color: string;
  }>;
  label?: string;
  formatTooltip?: (value: string | number, name: string) => [string, string];
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--surface)] p-3 border border-[var(--border)] rounded-md shadow-lg">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          {label}
        </p>
        {payload.map((entry, index) => {
          const [formattedValue, formattedName] = formatTooltip
            ? formatTooltip(entry.value, entry.name || entry.dataKey)
            : [entry.value, entry.name || entry.dataKey];

          return (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {formattedName}: {formattedValue}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function LineChart({
  data,
  lines,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
  xAxisDataKey = "name",
  formatTooltip,
  formatXAxis,
  formatYAxis,
}: LineChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-neutral-200 dark:stroke-neutral-700"
            />
          )}
          <XAxis
            dataKey={xAxisDataKey}
            className="text-xs fill-neutral-600 dark:fill-neutral-400"
            tickFormatter={formatXAxis}
          />
          <YAxis
            className="text-xs fill-neutral-600 dark:fill-neutral-400"
            tickFormatter={formatYAxis}
          />
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
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              strokeWidth={line.strokeWidth || 2}
              strokeDasharray={line.strokeDasharray}
              name={line.name || line.dataKey}
              dot={{ fill: line.stroke, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: line.stroke, strokeWidth: 2 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
