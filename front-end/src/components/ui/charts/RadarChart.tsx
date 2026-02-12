"use client";

import React from "react";
import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

export interface RadarChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface RadarChartRadar {
  dataKey: string;
  stroke: string;
  fill: string;
  strokeWidth?: number;
  fillOpacity?: number;
  name?: string;
  dot?: {
    r: number;
    stroke: string;
    strokeWidth: number;
    fill: string;
  };
}

export interface RadarChartProps {
  data: RadarChartDataPoint[];
  radars: RadarChartRadar[];
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
  angleAxisDataKey?: string;
  outerRadius?: string | number;
  domain?: [number, number];
  formatTooltip?: (value: string | number, name: string) => [string, string];
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
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 shadow-lg text-xs">
        <div className="text-[var(--text)] font-medium mb-1">{label}</div>
        {payload.map((entry, index) => {
          const [formattedValue] = formatTooltip
            ? formatTooltip(entry.value, entry.name || entry.dataKey)
            : [entry.value, entry.name || entry.dataKey];

          return (
            <div key={index} className="text-[var(--text)]">
              {formattedValue}
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function RadarChart({
  data,
  radars,
  height = 300,
  showGrid = true,
  showTooltip = true,
  className,
  angleAxisDataKey = "name",
  outerRadius = "72%",
  domain = [0, 100],
  formatTooltip,
}: RadarChartProps) {
  const useFlexHeight = height === 0;

  return (
    <div className={cn("w-full", useFlexHeight && "h-full", className)}>
      <ResponsiveContainer
        width="100%"
        height={useFlexHeight ? "100%" : height}
      >
        <RechartsRadarChart
          data={data}
          outerRadius={outerRadius}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          {showGrid && (
            <PolarGrid
              gridType="polygon"
              radialLines={true}
              stroke="var(--grid-line-color)"
              strokeOpacity={1}
            />
          )}
          <PolarAngleAxis
            dataKey={angleAxisDataKey}
            tick={{
              fill: "var(--text-muted)",
              fontSize: 12,
              fontWeight: 500,
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={domain}
            tick={false}
            tickCount={5}
            axisLine={false}
          />
          {radars.map((radar, index) => (
            <Radar
              key={index}
              dataKey={radar.dataKey}
              stroke={radar.stroke}
              strokeWidth={radar.strokeWidth || 2.5}
              fill={radar.fill}
              fillOpacity={radar.fillOpacity || 0.28}
              dot={
                radar.dot || {
                  r: 2,
                  stroke: "var(--background)",
                  strokeWidth: 1,
                  fill: radar.fill,
                }
              }
              name={radar.name || radar.dataKey}
              isAnimationActive
              animationDuration={600}
            />
          ))}
          {showTooltip && (
            <Tooltip
              cursor={false}
              content={<CustomTooltip formatTooltip={formatTooltip} />}
            />
          )}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
