"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  /**
   * URL of the image to display
   */
  src?: string | null;

  /**
   * Alternative text for the image
   */
  alt: string;

  /**
   * Fallback text to display when image is not available (usually initials)
   */
  fallback: string;

  /**
   * Size variant of the avatar
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";

  /**
   * Shape of the avatar
   * @default "circle"
   */
  shape?: "circle" | "square" | "rounded";

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Fallback background color class
   */
  fallbackBgClass?: string;

  /**
   * Fallback text color class
   */
  fallbackTextClass?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-base",
  xl: "h-32 w-32 text-3xl",
};

const shapeClasses = {
  circle: "rounded-full",
  square: "rounded-none",
  rounded: "rounded-md",
};

/**
 * Avatar Component
 *
 * A reusable avatar component that displays an image or fallback text (initials).
 * Supports different sizes and shapes.
 *
 * @example
 * ```tsx
 * <Avatar
 *   src="https://example.com/avatar.jpg"
 *   alt="John Doe"
 *   fallback="JD"
 *   size="md"
 *   shape="circle"
 * />
 * ```
 */
export default function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  shape = "circle",
  className,
  fallbackBgClass = "bg-[var(--primaryColor)]/10",
  fallbackTextClass = "text-[var(--primaryColor)]",
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !src || imageError;

  return (
    <div
      className={cn(
        "flex items-center justify-center font-semibold overflow-hidden",
        sizeClasses[size],
        shapeClasses[shape],
        showFallback ? fallbackBgClass : "bg-transparent",
        className
      )}
    >
      {showFallback ? (
        <span className={cn("select-none", fallbackTextClass)}>{fallback}</span>
      ) : (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
