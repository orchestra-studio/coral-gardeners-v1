"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IconX } from "@tabler/icons-react";
import { cn } from "../../lib/utils";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Optional className applied to the sticky title container (header) */
  titleContainerClassName?: string;
  children: React.ReactNode;
}

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export default function Modal({
  open,
  onClose,
  title,
  size = "md",
  className,
  titleContainerClassName,
  children,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const overlay = (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // Close only when clicking the backdrop, not inside the panel
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="absolute inset-0 bg-black/50 pointer-events-none"
        aria-hidden
      />
      <div
        ref={contentRef}
        className={cn(
          "relative z-[1001] w-full rounded-md bg-[var(--surface)] shadow-xl border border-[var(--border)]",
          "max-h-[90vh] overflow-y-auto",
          sizeMap[size],
          className
        )}
      >
        {title !== undefined && title !== null && (
          <div
            className={cn(
              "sticky w-full top-0 z-10 flex items-center justify-between gap-2 px-6 py-4 border-b border-[var(--border)] bg-[var(--surface)]",
              titleContainerClassName
            )}
          >
            <div className="text-lg w-full font-semibold text-[var(--text)]">
              {title}
            </div>
            <button
              type="button"
              className="text-[var(--text-muted)] hover:text-[var(--text)] shrink-0"
              onClick={onClose}
              aria-label="Close"
            >
              <IconX size={20} />
            </button>
          </div>
        )}
        <div
          className={cn(
            "px-6 py-6",
            (title === undefined || title === null) && "pt-6"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
