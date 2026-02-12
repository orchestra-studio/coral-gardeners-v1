"use client";

import { useState, useEffect } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import IconButton from "./iconButton";

interface SearchInputProps {
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  onOpenModal?: () => void;
  mobileFull?: boolean;
}

export default function SearchInput({
  placeholder = "Search...",
  ariaLabel = "Open search",
  className,
  onOpenModal,
  mobileFull = false,
}: SearchInputProps) {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  const shortcutText = isMac ? "⌘K" : "Ctrl+K";

  return (
    <>
      {/* Mobile */}
      {mobileFull ? (
        <Button
          onClick={onOpenModal}
          variant="ghost"
          size="sm"
          className={cn(
            "sm:hidden relative w-full h-8 px-3 text-sm justify-start",
            "bg-[var(--control-bg)] border border-[var(--border-subtle)] rounded-full",
            "hover:bg-[var(--surface-hover)] hover:border-[var(--border-subtle)]",
            "focus:outline-none transition-none",
            className
          )}
          contentClassName="w-full flex items-center justify-between"
          aria-label={ariaLabel}
        >
          <IconSearch className="w-4 h-4 text-[var(--text-muted)] me-2 flex-shrink-0" />
          <span className="flex-1 text-[var(--text-muted)] truncate">
            {placeholder}
          </span>
        </Button>
      ) : (
        <IconButton
          onClick={onOpenModal}
          aria-label={ariaLabel}
          className={cn("sm:hidden", className)}
        >
          <IconSearch className="w-4 h-4 text-[var(--text-muted)]" />
        </IconButton>
      )}

      {/* sm and up: pill with placeholder and shortcut */}
      <Button
        onClick={onOpenModal}
        variant="ghost"
        size="sm"
        className={cn(
          "hidden sm:flex relative items-center justify-between flex-1 min-w-0 h-8 px-3 text-sm",
          "bg-[var(--control-bg)]  border border-[var(--border-subtle)] rounded-full",
          "hover:bg-[var(--surface-hover)] hover:border-[var(--border-subtle)]",
          "focus:outline-none transition-none",
          className
        )}
        contentClassName="w-full flex items-center justify-between"
        aria-label={ariaLabel}
      >
        <div className="flex items-center gap-2 flex-1 text-start justify-start min-w-0">
          <IconSearch className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
          <span className="flex-1 text-[var(--text-muted)] truncate">
            {placeholder}
          </span>
        </div>

        <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-[var(--surface)] text-[var(--text-muted)] rounded-md border border-[var(--border)]">
          {shortcutText}
        </kbd>
      </Button>
    </>
  );
}
