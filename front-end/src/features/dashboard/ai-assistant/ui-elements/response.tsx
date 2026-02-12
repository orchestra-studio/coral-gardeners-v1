"use client";

import { memo, type ComponentProps } from "react";
import { Streamdown } from "streamdown";

import { cn } from "@/lib/utils";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, parseIncompleteMarkdown = true, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        "prose prose-sm w-full max-w-full leading-relaxed break-words text-[var(--text)] dark:prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      parseIncompleteMarkdown={parseIncompleteMarkdown}
      {...props}
    />
  ),
  (prev, next) => prev.children === next.children
);

Response.displayName = "Response";
