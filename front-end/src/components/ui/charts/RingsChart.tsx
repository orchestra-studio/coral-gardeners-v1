"use client";

/**
 * RingsChart - Beautiful animated rings chart with text details
 * @description: Circular progress rings with smooth animations
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface RingData {
  label: string;
  value: number;
  max: number;
  color: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface RingsChartProps {
  data: RingData[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabels?: boolean;
  showPercentage?: boolean;
  animationDuration?: number;
  labelsLayout?: "vertical" | "horizontal";
}

export function RingsChart({
  data,
  size = 200,
  strokeWidth = 12,
  className,
  showLabels = true,
  showPercentage = true,
  animationDuration = 1.5,
  labelsLayout = "vertical",
}: RingsChartProps) {
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    data.map(() => 0)
  );

  useEffect(() => {
    const timers = data.map((item, index) => {
      return setTimeout(() => {
        setAnimatedValues((prev) => {
          const newValues = [...prev];
          newValues[index] = item.value;
          return newValues;
        });
      }, index * 200);
    });

    return () => timers.forEach(clearTimeout);
  }, [data]);

  const center = size / 2;
  const ringGap = strokeWidth + 8;
  const isHorizontal = labelsLayout === "horizontal";

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        isHorizontal ? "flex-row flex-wrap" : "flex-col",
        className
      )}
    >
      {/* SVG Rings */}
      <div
        className="relative flex-shrink-0"
        style={{ width: size, height: size, minWidth: size }}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Glass Effect Gradient Definitions */}
          <defs>
            {/* Blue Glass Gradient */}
            <linearGradient
              id="blueGlassGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="rgba(96, 165, 250, 0.9)"
                stopOpacity="1"
              />
              <stop
                offset="50%"
                stopColor="rgba(59, 130, 246, 0.7)"
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor="rgba(147, 197, 253, 0.5)"
                stopOpacity="1"
              />
            </linearGradient>

            {/* Green Glass Gradient */}
            <linearGradient
              id="greenGlassGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="rgba(74, 222, 128, 0.9)"
                stopOpacity="1"
              />
              <stop
                offset="50%"
                stopColor="rgba(34, 197, 94, 0.7)"
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor="rgba(134, 239, 172, 0.5)"
                stopOpacity="1"
              />
            </linearGradient>

            {/* Gray Glass Gradient */}
            <linearGradient
              id="grayGlassGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="rgba(209, 213, 219, 0.8)"
                stopOpacity="1"
              />
              <stop
                offset="50%"
                stopColor="rgba(156, 163, 175, 0.6)"
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor="rgba(229, 231, 235, 0.4)"
                stopOpacity="1"
              />
            </linearGradient>
          </defs>

          {data.map((item, index) => {
            const radius = center - strokeWidth / 2 - index * ringGap;
            const circumference = 2 * Math.PI * radius;
            const percentage = (animatedValues[index] / item.max) * 100;
            const strokeDashoffset =
              circumference - (percentage / 100) * circumference;

            return (
              <g key={index}>
                {/* Background ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  className="text-[var(--border)] opacity-20"
                />

                {/* Main glass gradient ring */}
                <motion.circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{
                    duration: animationDuration,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    strokeDasharray: circumference,
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* Center percentage */}
        {showPercentage && data.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-2xl font-bold text-[var(--text)]"
              >
                {Math.round((animatedValues[0] / data[0].max) * 100)}%
              </motion.div>
            </div>
          </div>
        )}
      </div>
      {/* Labels */}
      {showLabels && (
        <div
          className={cn(
            "flex-1",
            isHorizontal
              ? "flex flex-col gap-2 min-w-[200px]"
              : "w-full space-y-3"
          )}
        >
          {data.map((item, index) => {
            const Icon = item.icon;
            const percentage = Math.round(
              (animatedValues[index] / item.max) * 100
            );

            // Get solid color for labels based on gradient
            const labelColor = item.color.includes("blue")
              ? "rgba(96, 165, 250, 1)"
              : item.color.includes("green")
              ? "rgba(74, 222, 128, 1)"
              : "rgba(209, 213, 219, 1)";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="flex items-center gap-2 p-2 rounded-lg"
              >
                {Icon && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: item.color.includes("blue")
                        ? "rgba(96, 165, 250, 0.2)"
                        : item.color.includes("green")
                        ? "rgba(74, 222, 128, 0.2)"
                        : "rgba(209, 213, 219, 0.2)",
                    }}
                  >
                    <div style={{ color: labelColor }}>
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-xs font-medium text-[var(--text)] truncate">
                      {item.label}
                    </span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                      className="text-xs font-semibold flex-shrink-0"
                      style={{ color: labelColor }}
                    >
                      {percentage}%
                    </motion.span>
                  </div>

                  {item.description && (
                    <p className="text-[10px] text-[var(--text-muted)] line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RingsChart;
