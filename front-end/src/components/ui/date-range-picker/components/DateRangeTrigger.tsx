"use client";

import * as React from "react";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

import type { DateRangePickerSize } from "../types";

interface DateRangeTriggerProps {
  id?: string;
  isOpen: boolean;
  label: string;
  size: DateRangePickerSize;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}

export const DateRangeTrigger = React.forwardRef<
  HTMLButtonElement,
  DateRangeTriggerProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ id, isOpen, label, size, variant = "outline", ...props }, ref) => {
  const isSmall = size === "small";

  return (
    <Button
      ref={ref}
      id={id}
      variant={variant}
      size={isSmall ? "sm" : "default"}
      startIcon={
        <CalendarIcon
          className={cn("opacity-70", isSmall ? "h-3 w-3" : "h-4 w-4")}
        />
      }
      {...props}
    >
      <span className="flex-1 truncate text-start">{label}</span>
      <ChevronDownIcon
        className={cn(
          "ml-2 opacity-60 transition-transform duration-200",
          isSmall ? "h-3 w-3" : "h-4 w-4",
          isOpen && "rotate-180"
        )}
      />
    </Button>
  );
});

DateRangeTrigger.displayName = "DateRangeTrigger";
