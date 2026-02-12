"use client";

import React from "react";
import { useLocale } from "@/hooks/locale/useLocale";

interface RaysLightingProps {
  /**
   * Position of the light source
   * @default "top-left"
   */
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  /**
   * Width of the ellipse in pixels
   * @default 1200
   */
  width?: number;
  /**
   * Height of the ellipse in pixels
   * @default 600
   */
  height?: number;
  /**
   * Intensity of the light (0-1)
   * @default 0.09
   */
  intensity?: number;
  /**
   * Use custom color instead of theme-aware color
   * If not provided, automatically uses appropriate color for light/dark mode
   */
  color?: string;
  /**
   * Z-index of the lighting layer
   * @default 20
   */
  zIndex?: number;
  /**
   * Additional className for custom styling
   */
  className?: string;
}

/**
 * RaysLighting - Reusable rays lighting effect component
 * Creates a radial gradient light effect from a corner or center
 * Uses white rays with 0.09 opacity for subtle lighting effect
 *
 * @example
 * <RaysLighting />
 *
 * @example Custom configuration
 * <RaysLighting
 *   position="top-right"
 *   intensity={0.15}
 *   width={1000}
 *   height={500}
 * />
 *
 * @example With custom color (overrides default white)
 * <RaysLighting color="100, 200, 255" />
 */
export default function RaysLighting({
  position = "top-left",
  width = 1200,
  height = 600,
  intensity = 0.05,
  color,
  zIndex = 20,
  className = "",
}: RaysLightingProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Map position to gradient coordinates
  // In RTL mode, flip left/right positions
  const positionMap = {
    "top-left": isRTL ? "100% 0%" : "0% 0%",
    "top-right": isRTL ? "0% 0%" : "100% 0%",
    "bottom-left": isRTL ? "100% 100%" : "0% 100%",
    "bottom-right": isRTL ? "0% 100%" : "100% 100%",
    center: "50% 50%",
  };

  const gradientPosition = positionMap[position];

  // Use white (255, 255, 255) as default for consistent lighting
  const lightColor = color || "205, 205, 205";

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        zIndex,
        background: `radial-gradient(ellipse ${width}px ${height}px at ${gradientPosition}, rgba(${lightColor}, ${intensity}) 0%, rgba(${lightColor}, 0) 30%, transparent 70%)`,
      }}
    />
  );
}
