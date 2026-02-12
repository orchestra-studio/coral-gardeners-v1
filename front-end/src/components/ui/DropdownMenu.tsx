"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { useLocale } from "@/hooks/locale/useLocale";

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface DropdownMenuProps {
  trigger: (opts: { open: boolean; toggle: () => void }) => React.ReactNode;
  items?: DropdownItem[];
  content?:
    | React.ReactNode
    | ((opts: { close: () => void }) => React.ReactNode);
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
  // Optional full-screen backdrop overlay (used by notifications dropdown)
  backdrop?: boolean;
  backdropClassName?: string;
  // Render menu in a portal without overlay and position it with fixed coords
  // Useful inside scroll/overflow containers to avoid clipping
  portal?: boolean;
}

export default function DropdownMenu({
  trigger,
  items,
  content,
  align = "right",
  className,
  menuClassName,
  backdrop = false,
  backdropClassName,
  portal = false,
}: DropdownMenuProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  // Track computed position for mobile (fixed) mode
  const [mobileTop, setMobileTop] = useState<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);
  // When rendering in a portal/fixed, compute left or right offset so the menu aligns with trigger
  const [fixedLeft, setFixedLeft] = useState<number | undefined>(undefined);
  // Track whether menu should appear above or below trigger
  const [showAbove, setShowAbove] = useState(false);
  const scrollParentRef = useRef<HTMLElement | Window | null>(null);

  const toggle = () => setOpen((v) => !v);
  const close = useCallback(() => setOpen(false), []);

  // Store initial position to detect significant movement
  const initialPosition = useRef<{
    top: number;
    left: number;
    right: number;
  } | null>(null);

  // Update menu position for mobile and portal modes
  const updatePosition = useCallback(() => {
    const mobile = window.innerWidth < 640; // sm breakpoint
    setIsMobile(mobile);

    if (rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();

      // For portal mode, check if trigger has moved significantly or is out of view
      if (portal && initialPosition.current) {
        const moved =
          Math.abs(rect.top - initialPosition.current.top) > 50 ||
          Math.abs(rect.left - initialPosition.current.left) > 50 ||
          Math.abs(rect.right - initialPosition.current.right) > 50;

        // If trigger moved significantly or is out of viewport, close menu
        const outOfView =
          rect.bottom < -10 ||
          rect.top > window.innerHeight + 10 ||
          rect.right < -10 ||
          rect.left > window.innerWidth + 10;

        if (moved || outOfView) {
          close();
          return;
        }
      }

      // Store initial position on first render
      if (!initialPosition.current) {
        initialPosition.current = {
          top: rect.top,
          left: rect.left,
          right: rect.right,
        };
      }

      // Calculate available space above and below trigger
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Get actual menu size if available, otherwise use estimate
      const menuHeight = menuRef.current?.offsetHeight || 200;
      const menuWidth = menuRef.current?.offsetWidth || 200;
      const viewportPadding = 12;

      // Determine if menu should appear above or below
      // Show above if there's not enough space below AND there's more space above
      const shouldShowAbove =
        spaceBelow < menuHeight && spaceAbove > spaceBelow;
      setShowAbove(shouldShowAbove);

      // Set position based on whether menu appears above or below
      if (shouldShowAbove) {
        // Position menu above trigger - the transform will handle the offset
        setMobileTop(rect.top - 4);
      } else {
        // Position menu below trigger with small offset (4px gap)
        setMobileTop(rect.bottom + 4);
      }

      if (portal || backdrop) {
        // For backdrop/portal mode, we need to calculate absolute positioning
        // In RTL mode, we need to flip the alignment:
        // - align="right" in RTL should position on the left side (because right is start in RTL)
        // - align="left" in RTL should position on the right side (because left is end in RTL)

        const effectiveAlign = isRTL
          ? align === "right"
            ? "left"
            : "right"
          : align;

        let desiredLeft: number;

        if (effectiveAlign === "right") {
          // Align right edges: menu's left = trigger's right - menu's width
          desiredLeft = rect.right - menuWidth;
        } else {
          // Align left edges: menu's left = trigger's left
          desiredLeft = rect.left;
        }

        // Clamp to viewport with padding
        const minLeft = viewportPadding;
        const maxLeft = window.innerWidth - menuWidth - viewportPadding;

        const finalLeft = Math.max(minLeft, Math.min(desiredLeft, maxLeft));
        setFixedLeft(finalLeft);
      } else {
        // Reset fixed offsets when not using portal mode
        setFixedLeft(undefined);
      }
    }
  }, [align, portal, backdrop, close, isRTL]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) {
      // Reset initial position when menu closes
      initialPosition.current = null;
      return;
    }

    // Find nearest scrollable parent to reposition menu on container scroll
    const getScrollParent = (el: HTMLElement | null): HTMLElement | Window => {
      if (!el) return window;
      let node: HTMLElement | null = el.parentElement;
      while (node) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        const overflow = style.overflow;
        if ([overflowY, overflow].some((v) => v === "auto" || v === "scroll")) {
          return node;
        }
        node = node.parentElement;
      }
      return window;
    };

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      // Check if click is outside both trigger and menu
      if (
        rootRef.current &&
        !rootRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        close();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    updatePosition();

    // Use mousedown instead of click to capture before any click handlers
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);

    // For portal mode, use more aggressive scroll handling
    if (portal) {
      // Close menu on any scroll for portal mode to prevent misalignment
      const handlePortalScroll = () => {
        // Use requestAnimationFrame to batch updates and check position
        requestAnimationFrame(() => {
          updatePosition();
        });
      };

      window.addEventListener("scroll", handlePortalScroll, {
        passive: true,
        capture: true,
      });
      document.addEventListener("scroll", handlePortalScroll, {
        passive: true,
        capture: true,
      });

      // Also listen to all possible scroll containers
      const sp = getScrollParent(rootRef.current);
      scrollParentRef.current = sp;
      const spTarget: HTMLElement | Window = sp;
      spTarget.addEventListener(
        "scroll",
        handlePortalScroll as EventListener,
        { passive: true, capture: true } as AddEventListenerOptions
      );

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", handlePortalScroll, {
          capture: true,
        });
        document.removeEventListener("scroll", handlePortalScroll, {
          capture: true,
        });
        const currentSp = scrollParentRef.current;
        if (currentSp && "removeEventListener" in currentSp) {
          (currentSp as HTMLElement | Window).removeEventListener(
            "scroll",
            handlePortalScroll as EventListener,
            { capture: true } as EventListenerOptions
          );
        }
      };
    } else {
      // Standard scroll handling for non-portal mode
      window.addEventListener("scroll", updatePosition, { passive: true });

      const sp = getScrollParent(rootRef.current);
      scrollParentRef.current = sp;
      const spTarget: HTMLElement | Window = sp;
      spTarget.addEventListener(
        "scroll",
        updatePosition as EventListener,
        { passive: true } as AddEventListenerOptions
      );

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
        const currentSp = scrollParentRef.current;
        if (currentSp && "removeEventListener" in currentSp) {
          (currentSp as HTMLElement | Window).removeEventListener(
            "scroll",
            updatePosition as EventListener
          );
        }
      };
    }
  }, [open, close, updatePosition, portal]);

  // Handle menu item clicks
  const handleItemClick = useCallback(
    (item: DropdownItem, e: React.MouseEvent) => {
      // Prevent event propagation
      e.preventDefault();
      e.stopPropagation();

      if (item.disabled) return;

      // Execute the item's onClick immediately
      if (item.onClick) {
        item.onClick();
      }

      // Close the menu after the click handler has executed
      close();
    },
    [close]
  );

  // Render menu items
  const renderMenuItems = () => {
    return (items || []).map((item, idx) => (
      <button
        key={idx}
        className={cn(
          "flex items-center gap-2 w-full px-3 py-2 text-sm text-start transition-colors",
          item.danger
            ? "text-[var(--destructive,rgb(239,68,68))] hover:bg-[var(--destructive-light,rgb(254,242,242))]"
            : "text-[var(--text)] hover:bg-[var(--surface-hover)]",
          item.disabled && "opacity-50 pointer-events-none"
        )}
        role="menuitem"
        aria-label={item.ariaLabel || item.label}
        onClick={(e) => handleItemClick(item, e)}
        disabled={item.disabled}
      >
        {item.icon}
        {item.label}
      </button>
    ));
  };

  return (
    <div className={cn("relative inline-block", className)} ref={rootRef}>
      {trigger({ open, toggle })}

      {/* Backdrop overlay */}
      {open &&
        backdrop &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[9998] bg-white/20 dark:bg-black/40 backdrop-blur-[0]",
              backdropClassName
            )}
            onClick={close}
            aria-hidden
          />,
          document.body
        )}

      {/* Menu content */}
      {open &&
        (backdrop && typeof document !== "undefined" ? (
          // Portal with backdrop/overlay
          createPortal(
            <div
              ref={menuRef}
              className={cn(
                // Always fixed when using backdrop (portal)
                "mt-1 w-36 bg-[var(--surface)] rounded-md shadow-lg border border-[var(--border)] py-1 z-[9999] animate-in fade-in duration-150 fixed",
                // remove end/start utilities and rely on computed left/right to anchor to trigger
                isMobile && "mt-0",
                // Apply transform when menu appears above
                showAbove && "transform -translate-y-full",
                menuClassName
              )}
              style={{
                top: mobileTop,
                left: typeof fixedLeft === "number" ? fixedLeft : undefined,
              }}
              role="menu"
            >
              {content
                ? typeof content === "function"
                  ? (
                      content as (opts: {
                        close: () => void;
                      }) => React.ReactNode
                    )({ close })
                  : content
                : renderMenuItems()}
            </div>,
            document.body
          )
        ) : portal && typeof document !== "undefined" ? (
          // Portal without backdrop (avoid clipping inside overflow containers)
          createPortal(
            <div
              ref={menuRef}
              className={cn(
                "mt-1 w-36 bg-[var(--surface)] rounded-md shadow-lg border border-[var(--input-border)]/40 py-1 z-[9999] animate-in fade-in duration-150 fixed",
                isMobile && "mt-0",
                // Apply transform when menu appears above
                showAbove && "transform -translate-y-full",
                menuClassName
              )}
              style={{
                top: mobileTop,
                left: typeof fixedLeft === "number" ? fixedLeft : undefined,
              }}
              role="menu"
            >
              {content
                ? typeof content === "function"
                  ? (
                      content as (opts: {
                        close: () => void;
                      }) => React.ReactNode
                    )({ close })
                  : content
                : renderMenuItems()}
            </div>,
            document.body
          )
        ) : (
          // Default inline rendering (absolute on sm+, fixed on mobile)
          <div
            ref={menuRef}
            className={cn(
              // Fixed on mobile so it can stick to the viewport end edge; absolute on sm+
              "mt-1 w-36 bg-[var(--surface)] rounded-md shadow-lg border border-[var(--border)] py-1 z-50 animate-in fade-in duration-150 fixed sm:absolute",
              align === "right" ? "end-0" : "start-0",
              // when fixed, margin-top has no effect; override to 0 and rely on computed top
              isMobile && "mt-0",
              // For non-mobile (absolute positioning), handle above placement differently
              !isMobile && showAbove && "bottom-full mb-1 mt-0",
              // For mobile (fixed positioning), use transform
              isMobile && showAbove && "transform -translate-y-full",
              menuClassName
            )}
            style={isMobile ? { top: mobileTop } : undefined}
            role="menu"
          >
            {content
              ? typeof content === "function"
                ? (content as (opts: { close: () => void }) => React.ReactNode)(
                    { close }
                  )
                : content
              : renderMenuItems()}
          </div>
        ))}
    </div>
  );
}
