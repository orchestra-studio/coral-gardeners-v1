"use client";

import React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { IconChevronRight, IconChevronDown } from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import IconButton from "./iconButton";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  rightContent?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}

export default function Collapsible({
  title,
  children,
  rightContent,
  defaultOpen = false,
  open,
  onOpenChange,
  className,
  headerClassName,
  contentClassName,
  disabled = false,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const generatedId = React.useId();
  const triggerId = `${generatedId}-trigger`;
  const contentId = `${generatedId}-content`;

  // Use controlled state if provided, otherwise use internal state
  const isOpen = open !== undefined ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  return (
    <CollapsiblePrimitive.Root
      open={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={handleOpenChange}
      disabled={disabled}
      className={cn(className)}
    >
      <CollapsiblePrimitive.Trigger
        id={triggerId}
        aria-controls={contentId}
        aria-expanded={isOpen}
        asChild
      >
        <div
          className={cn(
            "w-full p-4 flex items-center justify-between bg-[var(--control-bg)]",
            "hover:bg-[var(--control-bg-hover)] select-none cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primaryColor)] focus-visible:ring-offset-2",
            disabled &&
              "cursor-not-allowed opacity-50 hover:bg-[var(--control-bg)]",
            isOpen ? "rounded-b-none rounded-t-xl" : "rounded-xl",
            headerClassName
          )}
          style={{
            transition:
              "opacity 200ms, box-shadow 200ms, border-radius 300ms cubic-bezier(0.87, 0, 0.13, 1)",
          }}
        >
          <div className="flex items-center gap-2">
            <IconButton
              size="sm"
              variant="ghost"
              disabled={disabled}
              aria-label={isOpen ? "Collapse section" : "Expand section"}
            >
              {isOpen ? (
                <IconChevronDown size={16} />
              ) : (
                <IconChevronRight size={16} className="rtl:rotate-180" />
              )}
            </IconButton>
            <span className="text-sm font-medium">{title}</span>
          </div>
          {rightContent && (
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {rightContent}
            </div>
          )}
        </div>
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Content
        id={contentId}
        aria-labelledby={triggerId}
        className={cn(
          "overflow-hidden",
          "data-[state=open]:animate-slideDown",
          "data-[state=closed]:animate-slideUp"
        )}
      >
        <div
          className={cn(
            "bg-[var(--control-bg)]/60",
            "rounded-b-xl",
            contentClassName
          )}
        >
          {children}
        </div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}
