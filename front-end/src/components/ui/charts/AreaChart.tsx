"use client";

import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import CustomTooltip from "./components/CustomTooltip";

export interface AreaChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface AreaChartArea {
  dataKey: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  name?: string;
  stackId?: string;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  areas: AreaChartArea[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  xAxisDataKey?: string;
  stacked?: boolean;
  formatTooltip?: (value: string | number, name: string) => [string, string];
  formatXAxis?: (value: string | number) => string;
  formatYAxis?: (value: string | number) => string;
}

export default function AreaChart({
  data,
  areas,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
  xAxisDataKey = "name",
  stacked = false,
  formatTooltip,
  formatXAxis,
  formatYAxis,
}: AreaChartProps) {
  const useFlexHeight = height === 0;

  return (
    <div
      className={cn("w-full", useFlexHeight && "h-full", className)}
      dir="ltr"
    >
      <ResponsiveContainer
        width="100%"
        height={useFlexHeight ? "100%" : height}
      >
        <RechartsAreaChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <defs>
            {areas.map((area, index) => (
              <linearGradient
                key={index}
                id={`gradient-${area.dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={area.fill} stopOpacity={0.8} />
                <stop offset="95%" stopColor={area.fill} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
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
          {areas.map((area, index) => (
            <Area
              key={index}
              type="monotone"
              dataKey={area.dataKey}
              stackId={stacked ? area.stackId || "1" : undefined}
              stroke={area.stroke || area.fill}
              strokeWidth={area.strokeWidth || 2}
              fill={`url(#gradient-${area.dataKey})`}
              name={area.name || area.dataKey}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
