import React from "react";
import { cn } from "@/lib/utils";
import DotsPattern from "@/components/DotsPattern";
import RaysLighting from "@/components/RaysLighting";

interface WidgetCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showPattern?: boolean;
  showLighting?: boolean;
  patternOpacity?: number;
  lightingIntensity?: number;
  lightingWidth?: number;
  lightingHeight?: number;
}

/**
 * WidgetCard - Reusable wrapper for dashboard widgets
 * Provides consistent styling with decorative pattern and lighting effects
 */
export default function WidgetCard({
  children,
  className,
  style,
  lightingWidth = 1200,
  lightingHeight = 600,
  showPattern = true,
  showLighting = true,
  patternOpacity = 0.8,
  lightingIntensity = 0.09,
}: WidgetCardProps) {
  return (
    <div
      className={cn(
        "w-full h-auto bg-[var(--surface)] rounded-2xl dark:border  dark:border-[var(--border-subtle)] p-4 flex flex-col relative overflow-hidden",
        className
      )}
      style={style}
    >
      {/* Dots Pattern Overlay */}
      {showPattern && (
        <DotsPattern
          opacity={patternOpacity}
          dotSize={3}
          spacing={5}
          rotation={40}
        />
      )}

      {/* Rays Lighting Effect */}
      {showLighting && (
        <RaysLighting
          position={"top-left"}
          width={lightingWidth}
          height={lightingHeight}
          intensity={lightingIntensity}
          zIndex={20}
        />
      )}

      {/* Content with z-index to appear above decorations */}
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </div>
  );
}
