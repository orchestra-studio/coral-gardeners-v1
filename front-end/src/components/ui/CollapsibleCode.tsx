"use client";

import React, { useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import Collapsible from "./Collapsible";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "./button";

interface CollapsibleCodeProps {
  title?: string;
  code: string;
  language?: string;
  className?: string;
  defaultExpanded?: boolean;
  defaultOpen?: boolean; // Alias for defaultExpanded
  copyLabel?: string;
  copiedLabel?: string;
  copyAriaLabel?: string;
  copiedAriaLabel?: string;
}

export default function CollapsibleCode({
  title = "Code Example",
  code,
  language = "tsx",
  className = "",
  defaultExpanded = false,
  defaultOpen,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  copyAriaLabel = "Copy code to clipboard",
  copiedAriaLabel = "Copied to clipboard",
}: CollapsibleCodeProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen ?? defaultExpanded);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <Collapsible
      title={title}
      defaultOpen={defaultOpen ?? defaultExpanded}
      open={isOpen}
      onOpenChange={setIsOpen}
      className={className}
      rightContent={
        language && (
          <span className="text-xs px-2 py-1 bg-[var(--primaryColor)]/10 text-[var(--text)] rounded-2xl">
            {language}
          </span>
        )
      }
    >
      <div className="relative">
        <Button
          onClick={handleCopy}
          aria-label={isCopied ? copiedAriaLabel : copyAriaLabel}
          size="sm"
          className="h-6 absolute top-2 right-2 z-10"
          startIcon={
            isCopied ? (
              <IconCheck className="h-3 w-3" />
            ) : (
              <IconCopy className="h-3 w-3" />
            )
          }
        >
          {isCopied ? copiedLabel : copyLabel}
        </Button>
        <SyntaxHighlighter
          language={language}
          dir="ltr"
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: "transparent",
            fontSize: "0.75rem",
            lineHeight: "1.5",
            direction: "ltr",
            textAlign: "left",
          }}
          codeTagProps={{
            className: "text-xs",
          }}
          className="bg-[var(--code-bg,rgb(24,24,27))]"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </Collapsible>
  );
}
