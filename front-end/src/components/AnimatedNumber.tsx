"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import type { Format } from "@number-flow/react";

interface AnimatedNumberProps {
  value: number;
  format?: Format;
  prefix?: string;
  suffix?: string;
  className?: string;
  trend?: number | ((oldValue: number, value: number) => number);
  willChange?: boolean;
  locales?: string | string[];
  animateOnMount?: boolean;
}

/**
 * AnimatedNumber - Wrapper for NumberFlow library
 * Provides smooth animated number transitions
 *
 * @example
 * // Basic usage
 * <AnimatedNumber value={42} />
 *
 * @example
 * // With formatting
 * <AnimatedNumber
 *   value={1234.56}
 *   format={{ notation: 'compact' }}
 *   suffix="/mo"
 * />
 *
 * @example
 * // Currency
 * <AnimatedNumber
 *   value={99.99}
 *   format={{ style: 'currency', currency: 'USD' }}
 * />
 */
export function AnimatedNumber({
  value,
  format,
  prefix,
  suffix,
  className,
  trend = 0, // 0 means digits go up/down based on change direction
  willChange = false,
  locales,
  animateOnMount = false,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(animateOnMount ? 0 : value);

  useEffect(() => {
    if (animateOnMount) {
      // Delay to ensure smooth animation on mount
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [animateOnMount, value]);

  // Update value when it changes (after initial mount)
  useEffect(() => {
    if (!animateOnMount || displayValue !== 0) {
      setDisplayValue(value);
    }
  }, [value, animateOnMount, displayValue]);

  return (
    <NumberFlow
      value={displayValue}
      format={format}
      prefix={prefix}
      suffix={suffix}
      trend={trend}
      willChange={willChange}
      className={className}
      locales={locales}
      transformTiming={{
        duration: 750,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)", // Smooth ease-out
      }}
      spinTiming={{
        duration: 750,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      opacityTiming={{
        duration: 350,
        easing: "ease-out",
      }}
    />
  );
}
