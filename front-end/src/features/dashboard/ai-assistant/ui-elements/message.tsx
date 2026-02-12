import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, HTMLAttributes } from "react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useDarkMode } from "@/hooks/useTheme";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: "user" | "assistant" | "system" | "tool";
  messageId?: string;
};

export const Message = ({
  className,
  from,
  messageId,
  ...props
}: MessageProps) => (
  <div
    data-message-id={messageId}
    className={cn(
      "group flex w-full items-end justify-end gap-2 py-3 sm:flex-row",
      from === "user"
        ? "is-user flex-col-reverse items-end sm:flex-row"
        : "is-assistant flex-col-reverse items-start sm:flex-row-reverse",
      className
    )}
    {...props}
  />
);

const messageContentVariants = cva(
  "flex min-w-0 flex-col gap-2 overflow-hidden rounded-2xl text-sm leading-relaxed break-words  max-w-[100%] sm:max-w-[90%]",
  {
    variants: {
      variant: {
        contained: [
          "px-3 py-3 sm:px-4",
          "group-[.is-user]:bg-[var(--surface)] group-[.is-user]:text-[var(--text)]",
          "group-[.is-assistant]:bg-[var(--surface)] group-[.is-assistant]:text-[var(--text)] group-[.is-assistant]:self-start",
        ],
        flat: [
          "bg-transparent border-transparent",
          "group-[.is-user]:text-[var(--text)]",
          "group-[.is-assistant]:text-[var(--text)]",
        ],
      },
    },
    defaultVariants: {
      variant: "contained",
    },
  }
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof messageContentVariants>;

export const MessageContent = ({
  children,
  className,
  variant,
  ...props
}: MessageContentProps) => (
  <div
    className={cn(messageContentVariants({ variant, className }))}
    {...props}
  >
    {children}
  </div>
);

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
  src?: string;
  name?: string;
  variant?: "user" | "assistant" | "system" | "tool";
};

export const MessageAvatar = ({
  src,
  name,
  className,
  variant = "assistant",
  ...props
}: MessageAvatarProps) => {
  const isDark = useDarkMode();

  if (variant === "assistant") {
    return (
      <div className={cn("size-9 flex-shrink-0 relative", className)}>
        <Image
          src={
            isDark
              ? "/assets/images/avatar/sphere-dark.png"
              : "/assets/images/avatar/sphere-light.png"
          }
          alt="AI Assistant"
          width={36}
          height={36}
          className="rounded-full"
        />
      </div>
    );
  }

  return (
    <Avatar
      className={cn("size-9 ring-1 ring-[var(--border)]", className)}
      {...props}
    >
      {src ? (
        <AvatarImage alt={name ?? "Avatar"} src={src} />
      ) : (
        <AvatarFallback
          className={cn(
            "font-semibold text-xs uppercase",
            "bg-[var(--control-bg)] text-[var(--text)]"
          )}
        >
          {name?.slice(0, 2)?.toUpperCase() ?? "U"}
        </AvatarFallback>
      )}
    </Avatar>
  );
};
