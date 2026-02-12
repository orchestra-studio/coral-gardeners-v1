"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import { gsap } from "gsap";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  className?: string;
  /** Optional className applied to the sticky title container (header) */
  titleContainerClassName?: string;
  children: React.ReactNode;
  /** Side from which the sheet slides in. 'end' respects RTL/LTR automatically */
  side?: "start" | "end";
  /** Fixed action buttons at the bottom of the sheet */
  actions?: React.ReactNode;
  /** Maximum width of the sheet panel. Accepts pixel number or CSS size string. */
  maxWidth?: number | string;
  /** Show loading overlay */
  isLoading?: boolean;
  contentClassName?: string;
}

export default function Sheet({
  open,
  onClose,
  title,
  className,
  titleContainerClassName,
  children,
  side = "end",
  actions,
  maxWidth = 450,
  isLoading = false,
  contentClassName,
}: SheetProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);
  const resolvedMaxWidth =
    typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;

  useEffect(() => {
    if (open) {
      // Mount component
      setShouldRender(true);
    }
  }, [open]);

  useEffect(() => {
    if (!shouldRender || !contentRef.current || !backdropRef.current) return;

    const isRTL = document.documentElement.dir === "rtl";
    const isStart = side === "start";

    // Calculate animation direction based on side and RTL
    // In LTR: end = from right (+100%), start = from left (-100%)
    // In RTL: end = from left (-100%), start = from right (+100%)
    let xFrom: string;
    if (isRTL) {
      xFrom = isStart ? "100%" : "-100%";
    } else {
      xFrom = isStart ? "-100%" : "100%";
    }

    if (open) {
      // Lock body scroll
      document.body.style.overflow = "hidden";

      // Set initial states - set width immediately to prevent flashing
      gsap.set(backdropRef.current, {
        opacity: 0,
        visibility: "visible", // Make visible before animating
      });
      gsap.set(contentRef.current, {
        x: xFrom,
        width: "100%",
        maxWidth: resolvedMaxWidth,
        visibility: "visible",
      });

      // Animate in
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.to(contentRef.current, {
        x: "0%",
        duration: 0.45,
        ease: "power3.out",
      });
    } else {
      // Animate out
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });

      gsap.to(contentRef.current, {
        x: xFrom,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setShouldRender(false);
          document.body.style.overflow = "";
        },
      });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open, resolvedMaxWidth, shouldRender, side]);

  useEffect(() => {
    if (!shouldRender) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender || typeof document === "undefined") return null;

  const overlay = (
    <div className="fixed inset-0 z-[1000]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
        style={{ visibility: "hidden" }} // Prevent flash before GSAP animation
      />

      {/* Sheet Panel */}
      <div
        ref={contentRef}
        className={cn(
          "fixed top-0 bottom-0 z-[1001] w-full bg-[var(--surface)] shadow-xl",
          "flex flex-col",
          className
        )}
        style={{
          maxWidth: resolvedMaxWidth,
          visibility: "hidden", // Prevent flash before GSAP sets it visible
          // Using logical properties for position - works with RTL/LTR automatically
          ...(side === "end"
            ? { insetInlineEnd: 0 } // right in LTR, left in RTL
            : { insetInlineStart: 0 }), // left in LTR, right in RTL
        }}
      >
        {/* Header */}
        {title !== undefined && title !== null && (
          <div
            className={cn(
              "flex items-center justify-between gap-4 shrink-0",
              "border-b border-[var(--border)] bg-[var(--surface)]",
              titleContainerClassName
            )}
            style={{
              // Using logical padding
              paddingInline: "1.5rem", // px-6
              paddingBlock: "1rem", // py-4
            }}
          >
            <div className="text-lg font-semibold text-[var(--text)] flex-1">
              {title}
            </div>
            <button
              type="button"
              className="text-[var(--text-muted)] hover:text-[var(--text)] shrink-0 transition-colors"
              onClick={onClose}
              aria-label="Close"
            >
              <IconX size={20} />
            </button>
          </div>
        )}

        {/* Content - Scrollable */}
        <div
          className={cn(
            "flex-1 overflow-y-auto relative px-6 py-6",
            contentClassName,
            (title === undefined || title === null) && "pt-6"
          )}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-[var(--background)]/60 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary)] border-t-transparent" />
                <p className="text-sm text-[var(--text-muted)]">Loading...</p>
              </div>
            </div>
          )}
          {children}
        </div>

        {/* Fixed Actions Footer */}
        {actions && (
          <div
            className={cn(
              "shrink-0 border-t border-[var(--border)] bg-[var(--surface)]"
            )}
            style={{
              // Using logical padding
              paddingInline: "1.5rem", // px-6
              paddingBlock: "1rem", // py-4
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
