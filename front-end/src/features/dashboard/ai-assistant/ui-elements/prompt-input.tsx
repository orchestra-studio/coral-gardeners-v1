"use client";

import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Loader2Icon, SendIcon, SquareIcon, XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const PromptInput = React.forwardRef<
  HTMLFormElement,
  React.FormHTMLAttributes<HTMLFormElement>
>(({ className, children, ...props }, ref) => {
  const internalRef = useRef<HTMLFormElement | null>(null);

  useImperativeHandle(ref, () => internalRef.current as HTMLFormElement);

  return (
    <form
      ref={internalRef}
      className={cn(
        "group relative flex w-full max-w-[850px] mx-auto items-center overflow-hidden rounded-full border-0 bg-[var(--surface)] px-5 shadow-none min-h-[3.4375rem] outline-none focus-within:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </form>
  );
});
PromptInput.displayName = "PromptInput";

type PromptInputTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    autoFocusOnMount?: boolean;
  };

export const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  PromptInputTextareaProps
>(({ className, autoFocusOnMount, onKeyDown, ...props }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

  const resize = React.useCallback(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [props.value, resize]);

  useEffect(() => {
    if (autoFocusOnMount && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocusOnMount]);

  return (
    <textarea
      ref={textareaRef}
      className={cn(
        "flex-1 w-full resize-none bg-transparent text-sm leading-6 text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] py-3 max-h-48",
        "pr-12",
        className
      )}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey && !isComposing) {
          event.preventDefault();
          event.currentTarget.form?.requestSubmit();
          return;
        }

        onKeyDown?.(event);
      }}
      rows={1}
      {...props}
    />
  );
});
PromptInputTextarea.displayName = "PromptInputTextarea";

type PromptInputSubmitStatus = "ready" | "submitted" | "streaming" | "error";

export type PromptInputSubmitProps = React.ComponentProps<typeof Button> & {
  status?: PromptInputSubmitStatus;
};

export const PromptInputSubmit = ({
  status = "ready",
  className,
  children,
  ...props
}: PromptInputSubmitProps) => {
  let icon = <SendIcon className="h-4 w-4" />;

  if (status === "submitted") {
    icon = <Loader2Icon className="h-4 w-4 animate-spin" />;
  } else if (status === "streaming") {
    icon = <SquareIcon className="h-4 w-4" />;
  } else if (status === "error") {
    icon = <XIcon className="h-4 w-4" />;
  }

  return (
    <Button
      type={status === "streaming" ? "button" : "submit"}
      size="icon"
      className={cn(
        "h-8 w-8 rounded-full bg-transparent text-[var(--text)] shadow-none transition hover:bg-[var(--surface-hover)] flex-shrink-0",
        className
      )}
      variant="ghost"
      {...props}
    >
      {children ?? icon}
    </Button>
  );
};
