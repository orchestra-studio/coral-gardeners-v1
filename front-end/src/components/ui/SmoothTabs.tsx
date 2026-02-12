"use client";

/**
 * Smooth Animated Tabs Component
 * @description: Enhanced tabs with smooth animations and transitions
 * Features:
 * - Sliding background indicator with spring animation
 * - Content slides with blur and scale effects
 * - Responsive grid layout
 * - Accessibility support (ARIA, keyboard navigation)
 */

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";

export interface SmoothTabItem {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  content?: React.ReactNode;
  cardContent?: React.ReactNode;
}

interface SmoothTabsProps {
  items: SmoothTabItem[];
  defaultTabId?: string;
  value?: string;
  onValueChange?: (tabId: string) => void;
  onChange?: (tabId: string) => void; // Alias for onValueChange
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  showCardContent?: boolean;
  cardHeight?: string;
  tabsPosition?: "top" | "bottom";
  syncWithUrl?: boolean; // Sync selected tab with URL params
  urlParamName?: string; // URL parameter name (default: "tab")
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    filter: "blur(8px)",
    position: "absolute" as const,
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    position: "relative" as const,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    filter: "blur(8px)",
    position: "absolute" as const,
  }),
};

const transition = {
  duration: 0.4,
  ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
};

export function SmoothTabs({
  items,
  defaultTabId,
  value: controlledValue,
  onValueChange,
  onChange,
  className,
  containerClassName,
  contentClassName,
  showCardContent = true,
  cardHeight = "200px",
  tabsPosition = "bottom",
  syncWithUrl = false,
  urlParamName = "tab",
}: SmoothTabsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get initial value from URL if syncWithUrl is enabled
  const getInitialValue = () => {
    if (syncWithUrl && searchParams) {
      const urlTab = searchParams.get(urlParamName);
      // Check if the URL tab exists in items
      if (urlTab && items.some((item) => item.id === urlTab)) {
        return urlTab;
      }
    }
    return controlledValue || defaultTabId || items[0]?.id || "";
  };

  // Handle both controlled and uncontrolled state
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState<string>(
    getInitialValue()
  );
  const selected = isControlled ? controlledValue : internalValue;

  const [direction, setDirection] = React.useState(0);
  const [dimensions, setDimensions] = React.useState({
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
    direction: "ltr" as "ltr" | "rtl",
  });

  // Reference for the selected button
  const buttonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Update dimensions whenever selected tab changes or on mount
  React.useLayoutEffect(() => {
    const updateDimensions = () => {
      const selectedButton = buttonRefs.current.get(selected);
      const container = containerRef.current;

      if (selectedButton && container) {
        const rect = selectedButton.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const computedDirection = window.getComputedStyle(container)
          .direction as "ltr" | "rtl";

        const offsetX =
          computedDirection === "rtl"
            ? containerRect.right - rect.right
            : rect.left - containerRect.left;

        const offsetY = rect.top - containerRect.top;

        setDimensions({
          width: rect.width,
          height: rect.height,
          offsetX: offsetX,
          offsetY: offsetY,
          direction: computedDirection,
        });
      }
    };

    // Initial update
    requestAnimationFrame(() => {
      updateDimensions();
    });

    // Update on resize
    window.addEventListener("resize", updateDimensions);

    // Watch for container size changes using ResizeObserver
    const container = containerRef.current;
    let resizeObserver: ResizeObserver | null = null;

    if (container) {
      resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          updateDimensions();
        });
      });
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (resizeObserver && container) {
        resizeObserver.unobserve(container);
        resizeObserver.disconnect();
      }
    };
  }, [selected]);

  // Update URL when tab changes (if syncWithUrl is enabled)
  React.useEffect(() => {
    if (syncWithUrl && pathname && router && searchParams) {
      const currentUrlTab = searchParams.get(urlParamName);

      // Only update URL if the tab is different from what's in the URL
      if (currentUrlTab !== selected) {
        const params = new URLSearchParams(searchParams.toString());

        if (selected) {
          params.set(urlParamName, selected);
        } else {
          params.delete(urlParamName);
        }

        const newUrl = `${pathname}?${params.toString()}`;
        router.replace(newUrl, { scroll: false });
      }
    }
  }, [selected, syncWithUrl, pathname, router, searchParams, urlParamName]);

  const handleTabClick = (tabId: string) => {
    const currentIndex = items.findIndex((item) => item.id === selected);
    const newIndex = items.findIndex((item) => item.id === tabId);
    setDirection(newIndex > currentIndex ? 1 : -1);

    if (!isControlled) {
      setInternalValue(tabId);
    }

    // Call both callbacks if provided
    onValueChange?.(tabId);
    onChange?.(tabId);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    tabId: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTabClick(tabId);
    }
  };

  const getTabWidth = (items: any) => {
    switch (items.length) {
      case 1:
        return "w-[48%] sm:w-[100%]";
      case 2:
        return "w-[48%] sm:w-[48%]";
      case 3:
        return "w-[48%] sm:w-[32%]";
      case 4:
        return "w-[48%] sm:w-[23%]";
      case 5:
        return "w-[48%] sm:w-[18%]";
      default:
        return "w-[48%] sm:w-[auto]";
    }
  };

  const selectedItem = items.find((item) => item.id === selected);
  // Tabs toolbar component
  const TabsToolbar = (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Smooth tabs"
      className={cn(
        "flex flex-wrap items-center gap-2 p-1 relative",
        "bg-[var(--surface)] w-full",
        "rounded-2xl border border-[var(--border)]/60",
        "transition-none",
        containerClassName
      )}
    >
      {/* Sliding Background */}
      <motion.div
        className={cn(
          "absolute rounded-lg z-[1] bg-[var(--accent-tab-active)]"
        )}
        initial={false}
        animate={{
          width: Math.max(dimensions.width - 8, 0),
          height: Math.max(dimensions.height - 8, 0),
          opacity: 1,
          ...(dimensions.direction === "rtl"
            ? { right: dimensions.offsetX + 4, left: "auto" }
            : { left: dimensions.offsetX + 4, right: "auto" }),
          top: dimensions.offsetY + 4,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        style={{
          ...(dimensions.direction === "rtl"
            ? { right: dimensions.offsetX + 4, left: "auto" }
            : { left: dimensions.offsetX + 4, right: "auto" }),
          top: dimensions.offsetY + 4,
        }}
      />

      {items.map((item) => {
        const isSelected = selected === item.id;
        const Icon = item.icon;
        return (
          <motion.button
            key={item.id}
            ref={(el) => {
              if (el) buttonRefs.current.set(item.id, el);
              else buttonRefs.current.delete(item.id);
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={`panel-${item.id}`}
            id={`tab-${item.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => handleTabClick(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            className={cn(
              "relative flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 z-[2]",
              "text-sm font-medium transition-opacity duration-300",
              "outline-none focus-visible:outline-none focus-visible:ring-0",
              "truncate text-[var(--text)]",
              getTabWidth(items),
              isSelected ? "opacity-100" : "opacity-75 hover:opacity-100"
            )}
            style={{
              backgroundColor: "transparent",
              color: "var(--text)",
            }}
          >
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            <span className="truncate">{item.title}</span>
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Tabs at top */}
      {tabsPosition === "top" && TabsToolbar}

      {/* Card Content Area */}
      {showCardContent && (
        <div
          className={cn(
            "flex-1 relative",
            tabsPosition === "top" ? "mt-4" : "mb-4"
          )}
        >
          <div
            className={cn(
              "bg-[var(--surface)] border border-[var(--border)]/60 rounded-lg w-full relative overflow-hidden",
              contentClassName
            )}
            style={{ height: cardHeight }}
          >
            <AnimatePresence
              initial={false}
              mode="popLayout"
              custom={direction}
            >
              <motion.div
                key={`card-${selected}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={transition}
                className="absolute inset-0 w-full h-full will-change-transform bg-[var(--surface)]/0"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {selectedItem?.cardContent || selectedItem?.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Tabs at bottom */}
      {tabsPosition === "bottom" && TabsToolbar}
    </div>
  );
}

export default SmoothTabs;
