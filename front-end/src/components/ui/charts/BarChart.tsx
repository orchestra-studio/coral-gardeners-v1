"use client";

import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import CustomTooltip from "./components/CustomTooltip";

export interface BarChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface BarChartBar {
  dataKey: string;
  fill: string;
  name?: string;
  radius?: [number, number, number, number];
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  bars: BarChartBar[];
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  xAxisDataKey?: string;
  layout?: "horizontal" | "vertical";
  formatTooltip?: (value: string | number, name: string) => [string, string];
  formatXAxis?: (value: string | number) => string;
  formatYAxis?: (value: string | number) => string;
  animationDuration?: number;
  animationEasing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
}

export default function BarChart({
  data,
  bars,
  height = 300,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  className,
  xAxisDataKey = "name",
  layout = "horizontal",
  formatTooltip,
  formatXAxis,
  formatYAxis,
  animationDuration = 800,
  animationEasing = "ease-out",
}: BarChartProps) {
  // Use parent's height if height is 0 (flex mode)
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
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={
            layout === "vertical"
              ? { top: 10, right: 10, left: 0, bottom: 10 }
              : { top: 5, right: 10, left: -25, bottom: 0 }
          }
          barCategoryGap={layout === "vertical" ? "15%" : "25%"}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-neutral-200 dark:stroke-neutral-700"
            />
          )}
          <XAxis
            // For standard vertical bars (horizontal layout), X axis is category
            type={layout === "horizontal" ? "category" : "number"}
            dataKey={layout === "horizontal" ? xAxisDataKey : undefined}
            className="text-xs fill-neutral-600 dark:fill-neutral-400"
            tickFormatter={formatXAxis}
          />
          <YAxis
            // For horizontal bars (vertical layout), Y axis is category
            type={layout === "horizontal" ? "number" : "category"}
            dataKey={layout === "vertical" ? xAxisDataKey : undefined}
            className="text-xs fill-neutral-600 dark:fill-neutral-400"
            tickFormatter={formatYAxis}
            padding={
              layout === "vertical"
                ? { top: 12, bottom: 12 }
                : { top: 0, bottom: 12 }
            }
          />
          {showTooltip && (
            <Tooltip
              cursor={{ fill: "transparent" }}
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
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              fill={bar.fill}
              name={bar.name || bar.dataKey}
              radius={bar.radius || [4, 4, 0, 0]}
              animationDuration={animationDuration}
              animationEasing={animationEasing}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
