"use client";

import React from "react";
import {
  IconArrowRight,
  IconTrendingUp,
  IconTrendingDown,
  IconGripHorizontal,
} from "@tabler/icons-react";
import { BaseCard, CardTranslations, TrendDirection } from "../types";
import DotsPattern from "@/components/DotsPattern";
import RaysLighting from "@/components/RaysLighting";

interface StatCardProps extends BaseCard {
  translations?: CardTranslations;
  enableDragHandle?: boolean;
  className?: string;
  enableNoise?: boolean;
  enableLighting?: boolean;
}

export default function StatCard({
  id,
  title,
  value,
  icon,
  trend,
  color,
  translations,
  enableDragHandle = false,
  className = "",
  enableNoise = false,
  enableLighting = false,
}: StatCardProps) {
  // Check if we're on mobile to hide drag handle
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Function to decide which trend icon to use
  const getTrendIcon = (direction: TrendDirection) => {
    const iconClassName = "me-1 size-3 xs:size-3.5";
    switch (direction) {
      case "up":
        return <IconTrendingUp className={iconClassName} />;
      case "down":
        return <IconTrendingDown className={iconClassName} />;
      case "stable":
        return <IconArrowRight className={iconClassName} />;
      default:
        return null;
    }
  };

  // Determine trend color based on direction
  const getTrendColor = (direction: TrendDirection) => {
    switch (direction) {
      case "up":
        return "text-[var(--trend-growth)]";
      case "down":
        return "text-[var(--trend-drop)]";
      case "stable":
        return "text-[var(--text-muted)]";
      default:
        return "text-[var(--text-muted)]";
    }
  };

  // Use passed color or default
  const valueColor = color || "text-[var(--text)]";

  // Format value for display
  const displayValue =
    typeof value === "number" ? value.toLocaleString() : value;

  const defaultTranslations: CardTranslations = {
    dragHandle: "Drag to reorder",
    trends: {
      ariaLabel: "Trend {direction} {value}",
    },
  };

  const t = translations || defaultTranslations;

  return (
    <div
      className={`bg-[var(--surface)] py-4 px-4 rounded-2xl dark:border dark:border-[var(--border-subtle)] h-full select-none min-h-[110px] w-full flex flex-col justify-between  relative overflow-hidden ${className}`}
      data-card-id={id}
      tabIndex={0}
      role="article"
      aria-label={`${title}: ${displayValue}${
        trend ? `, trend ${trend.direction} ${trend.value}` : ""
      }`}
    >
      {/* Large Background Icon */}
      {!trend && icon && (
        <div
          className="absolute bottom-4 end-6 text-[var(--text-muted)] opacity-[0.07] pointer-events-none"
          aria-hidden="true"
          style={{ transform: "scale(2.3)" }}
        >
          <div className="w-5 h-5 xs:w-6 xs:h-6 [&>svg]:w-5 [&>svg]:h-5 xs:[&>svg]:w-6 xs:[&>svg]:h-6">
            {icon}
          </div>
        </div>
      )}

      {/* Dots Pattern Overlay */}
      {enableNoise && (
        <DotsPattern opacity={0.8} dotSize={3} spacing={5} rotation={40} />
      )}

      {/* Rays Lighting Effect from Corner */}
      {enableLighting && (
        <RaysLighting
          position="top-left"
          intensity={0.09}
          width={1200}
          height={600}
          zIndex={20}
        />
      )}

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center">
          {icon && (
            <div
              className="me-2 text-[var(--text-muted)] bg-[var(--surface-hover)] p-1.5 xs:p-2 rounded-md"
              aria-hidden="true"
            >
              <div className="w-5 h-5 xs:w-6 xs:h-6 [&>svg]:w-5 [&>svg]:h-5 xs:[&>svg]:w-6 xs:[&>svg]:h-6">
                {icon}
              </div>
            </div>
          )}
          <div className="text-xs xs:text-sm font-medium text-[var(--text-muted)] leading-tight">
            {title}
          </div>
        </div>
        {enableDragHandle && !isMobile && (
          <div
            className="opacity-30 hover:opacity-100 transition-opacity cursor-grab touch-manipulation p-0.5 xs:p-1 -m-0.5 xs:-m-1"
            aria-hidden="true"
            title={t.dragHandle}
          >
            <IconGripHorizontal size={14} className="xs:size-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between relative z-10">
        <div
          className={`text-lg xs:text-xl font-bold ${valueColor} leading-tight`}
        >
          {displayValue}
        </div>
        {trend && (
          <div
            className={`flex items-center text-xs xs:text-sm ${getTrendColor(
              trend.direction
            )}`}
            aria-label={t.trends.ariaLabel
              .replace("{direction}", trend.directionLabel || trend.direction)
              .replace("{value}", trend.value)}
          >
            {getTrendIcon(trend.direction)}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
