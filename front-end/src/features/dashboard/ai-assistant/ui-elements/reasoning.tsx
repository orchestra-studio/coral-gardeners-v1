"use client";

import { Brain } from "lucide-react";
import type { ComponentProps } from "react";
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { ShineBadge } from "@/components/ui/ShineBadge";

type ReasoningContextValue = {
  isStreaming: boolean;
  duration: number;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

const useReasoningContext = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within <Reasoning>");
  }
  return context;
};

export type ReasoningProps = ComponentProps<"div"> & {
  isStreaming?: boolean;
};

export const Reasoning = memo(function Reasoning({
  className,
  isStreaming = false,
  children,
  ...props
}: ReasoningProps) {
  const [duration, setDuration] = useState(0);
  const startRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isStreaming) {
      if (startRef.current === null) {
        startRef.current = Date.now();
        setDuration(0);
      }

      if (timerRef.current === null) {
        timerRef.current = window.setInterval(() => {
          if (startRef.current !== null) {
            setDuration(
              Math.max(0, Math.ceil((Date.now() - startRef.current) / 1000))
            );
          }
        }, 1000);
      }
      return () => {};
    }

    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (startRef.current !== null) {
      setDuration(
        Math.max(0, Math.ceil((Date.now() - startRef.current) / 1000))
      );
      startRef.current = null;
    }

    return () => {};
  }, [isStreaming]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      timerRef.current = null;
      startRef.current = null;
    };
  }, []);

  const contextValue = useMemo<ReasoningContextValue>(
    () => ({ isStreaming, duration }),
    [isStreaming, duration]
  );

  return (
    <ReasoningContext.Provider value={contextValue}>
      <div className={cn("not-prose", className)} {...props}>
        {children}
      </div>
    </ReasoningContext.Provider>
  );
});

export type ReasoningTriggerProps = ComponentProps<"div"> & {
  thinkingLabel?: string;
  reasoningText?: string;
};

const buildStatusLabel = (
  isStreaming: boolean,
  duration: number,
  thinkingLabel = "Thinking..."
) => {
  if (isStreaming) {
    return thinkingLabel;
  }

  if (duration <= 0) {
    return "Thought for a few seconds";
  }

  return `Thought for ${duration} seconds`;
};

export const ReasoningTrigger = memo(function ReasoningTrigger({
  className,
  thinkingLabel,
  reasoningText,
  ...props
}: ReasoningTriggerProps) {
  const { isStreaming, duration } = useReasoningContext();
  const normalizedReasoningText = reasoningText
    ? reasoningText.trim().replace(/(\.\.\.)(\S)/g, "$1 $2")
    : "";

  const baseText =
    normalizedReasoningText ||
    buildStatusLabel(isStreaming, duration, thinkingLabel);

  return (
    <div
      className={cn(
        "flex w-full items-center gap-2 text-left text-sm text-[var(--text-muted)]",
        className
      )}
      {...props}
    >
      <Brain className="h-4 w-4 text-[var(--primaryColor)]" />
      <ShineBadge className="truncate capitalize" size="sm" variant="secondary">
        {baseText}
      </ShineBadge>
    </div>
  );
});

Reasoning.displayName = "Reasoning";
ReasoningTrigger.displayName = "ReasoningTrigger";
