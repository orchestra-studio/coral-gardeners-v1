"use client";

import { useCallback, useEffect, type ComponentProps } from "react";
import { ArrowDownIcon } from "lucide-react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1", className)}
    initial="instant"
    resize="instant"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<"div">;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => {
  const context = useStickToBottomContext();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const scrollElement =
      (document.scrollingElement as HTMLElement | null) ||
      (document.documentElement as HTMLElement | null) ||
      (document.body as HTMLElement | null);

    if (!scrollElement) {
      return;
    }

    context.scrollRef(scrollElement);

    return () => {
      context.scrollRef(null);
    };
  }, [context]);

  const handleContentRef = useCallback(
    (node: HTMLDivElement | null) => {
      context.contentRef(node as unknown as HTMLElement | null);
    },
    [context]
  );

  return (
    <div
      ref={handleContentRef}
      className={cn(
        "mx-auto flex w-full basis-full flex-col gap-1 sm:gap-3 lg:gap-4 px-0 sm:px-4 lg:px-6 py-6 max-w-full sm:max-w-3xl xl:max-w-4xl",
        className
      )}
      {...props}
    />
  );
};

export type ConversationEmptyStateProps = ComponentProps<"div"> & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-4 p-8 pb-0 text-center",
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className="text-[var(--text-muted)]">{icon}</div>}
        <div className="space-y-2">
          <h3 className="text-xl lg:text-[28px] font-semibold text-[var(--text)]">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-[var(--text-muted)]">{description}</p>
          )}
        </div>
      </>
    )}
  </div>
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom("instant");
  }, [scrollToBottom]);

  if (isAtBottom) {
    return null;
  }

  return (
    <Button
      className={cn(
        "absolute bottom-6 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full border border-[var(--border)] bg-[var(--surface)] shadow-lg",
        className
      )}
      onClick={handleScrollToBottom}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      <ArrowDownIcon className="h-4 w-4" />
    </Button>
  );
};
