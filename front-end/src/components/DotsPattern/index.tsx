import React from "react";

interface DotsPatternProps {
  /**
   * Opacity of the dots pattern (0-1)
   * @default 0.8
   */
  opacity?: number;
  /**
   * Size of each dot in pixels
   * @default 1
   */
  dotSize?: number;
  /**
   * Spacing between dots in pixels
   * @default 2
   */
  spacing?: number;
  /**
   * Use custom color instead of theme-aware color
   * If not provided, automatically uses dark dots in dark mode and light gray dots in light mode
   */
  color?: string;
  /**
   * Rotation angle in degrees
   * @default 40
   */
  rotation?: number;
  /**
   * Additional className for custom styling
   */
  className?: string;
}

/**
 * DotsPattern - Reusable dots pattern overlay component
 * Automatically adapts to light/dark mode using Tailwind's dark: prefix
 * - Dark mode: Uses dark dots (rgba(0, 0, 0, 0.5))
 * - Light mode: Uses light gray near-white dots
 *
 * @example
 * <DotsPattern />
 *
 * @example Custom configuration
 * <DotsPattern
 *   opacity={0.5}
 *   dotSize={2}
 *   spacing={4}
 *   rotation={45}
 * />
 *
 * @example With custom color (overrides theme)
 * <DotsPattern color="rgba(255, 0, 0, 0.3)" />
 */
export default function DotsPattern({
  opacity = 0.8,
  dotSize = 3,
  spacing = 5,
  color,
  rotation = 40,
  className = "",
}: DotsPatternProps) {
  // Light mode: light gray dots close to white
  const lightDotColor = color || "rgba(255, 255, 255, 0.25)";
  // Dark mode: darker dots
  const darkDotColor = color || "rgba(0, 0, 0, 0.4)";

  return (
    <>
      <div
        className={`absolute -inset-400 pointer-events-none dots-pattern ${className}`}
        style={
          {
            opacity,
            transform: `rotate(${rotation}deg)`,
            backgroundSize: `${spacing}px ${spacing}px`,
            // CSS variables for dynamic values
            ["--dot-size"]: `${dotSize}px`,
            ["--light-dot-color"]: lightDotColor,
            ["--dark-dot-color"]: darkDotColor,
          } as React.CSSProperties
        }
      />
      <style jsx>{`
        .dots-pattern {
          /* Light mode */
          background-image: radial-gradient(
            circle,
            var(--light-dot-color) var(--dot-size),
            transparent var(--dot-size)
          );
        }

        :global(.dark) .dots-pattern {
          /* Dark mode */
          background-image: radial-gradient(
            circle,
            var(--dark-dot-color) var(--dot-size),
            transparent var(--dot-size)
          );
        }
      `}</style>
    </>
  );
}
