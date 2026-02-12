"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CardProps } from "./types";
import { GLASS_PRESETS, DEFAULT_CARD_CONFIG } from "./config/constants";
import { useTheme } from "@/providers/ThemeProvider";
import { useBackdropFilterSupport } from "@/hooks/useTheme";
import { getGlassStyles, getRegularStyles } from "./utils/glassEffects";

/**
 * Card Component - Reusable card with optional glass morphism effect
 *
 * @example Basic usage
 * <Card>Content</Card>
 *
 * @example With glass effect
 * <Card glass glassIntensity="strong">
 *   Glass content
 * </Card>
 *
 * @example Custom glass settings
 * <Card glass blur={20} saturation={2} opacity={0.9}>
 *   Custom glass
 * </Card>
 */
export default function Card({
  children,
  className,
  padding = DEFAULT_CARD_CONFIG.padding,
  borderRadius = DEFAULT_CARD_CONFIG.borderRadius,
  glass = false,
  glassIntensity = DEFAULT_CARD_CONFIG.glassIntensity,
  blur,
  brightness,
  opacity,
  saturation,
  borderWidth = 1,
  style = {},
}: CardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const supportsBackdrop = useBackdropFilterSupport();

  // Get glass configuration
  const glassConfig = glass
    ? {
        ...GLASS_PRESETS[glassIntensity],
        // Override with custom values if provided
        ...(blur !== undefined && { blur }),
        ...(brightness !== undefined && { brightness }),
        ...(opacity !== undefined && { opacity }),
        ...(saturation !== undefined && { saturation }),
      }
    : null;

  // Generate styles based on glass/regular mode
  const cardStyles =
    glass && glassConfig
      ? getGlassStyles(glassConfig, isDark, supportsBackdrop)
      : getRegularStyles();

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        borderRadius,
        padding,
        className
      )}
      style={{
        ...cardStyles,
        borderWidth: `${borderWidth}px`,
        ...style,
      }}
    >
      {/* Top highlight for glass effect */}
      {glass && (
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1/3 pointer-events-none opacity-20",
            borderRadius
          )}
          style={{
            background: `linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.3) 0%,
              transparent 100%
            )`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
