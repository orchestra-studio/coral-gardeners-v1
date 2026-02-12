"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import "quill/dist/quill.snow.css";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { useLocale } from "@/hooks/locale/useLocale";
import * as LabelPrimitive from "@radix-ui/react-label";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QuillType = any;

// Dynamically import Quill to avoid SSR issues
let Quill: QuillType = null;
if (typeof window !== "undefined") {
  import("quill").then((module) => {
    Quill = module.default;
  });
}

export interface RichTextEditorProps {
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: Record<string, string>;
  error?: string | Record<string, string | undefined>;
  disabled?: boolean;
  required?: boolean;
  containerClassName?: string;
  allowedElements?: "all" | "list" | "basic" | string[];
  id?: string; // Optional ID for accessibility
}

const languageTabs: TabItem<"en" | "ar">[] = [
  {
    id: "en",
    label: "ENGLISH",
    className:
      "flex-1 max-w-[90px] rounded-tl-md rounded-tr-none rounded-bl-none rounded-br-none border-e! border-b!",
  },
  {
    id: "ar",
    label: "عربي",
    className:
      "flex-1 max-w-[90px] rounded-tr-md rounded-tl-none rounded-br-none rounded-bl-none border-s-0! border-b!",
  },
];

export default function RichTextEditor({
  value = {},
  onChange,
  onBlur,
  label,
  placeholder = {},
  error,
  disabled = false,
  required = false,
  containerClassName,
  allowedElements = "all",
  id,
}: RichTextEditorProps) {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<"en" | "ar">(
    (locale as "en" | "ar") || "en"
  );
  const editorRefEn = useRef<HTMLDivElement>(null);
  const editorRefAr = useRef<HTMLDivElement>(null);
  const quillEnRef = useRef<QuillType | null>(null);
  const quillArRef = useRef<QuillType | null>(null);
  const isInitializedEn = useRef(false);
  const isInitializedAr = useRef(false);
  // Keep track of the current value to avoid stale closure issues
  const valueRef = useRef<Record<string, string>>(value || {});

  // Generate ID at top level
  const generatedId = React.useId();
  const labelId = id || generatedId;
  const enErrorId = `${labelId}-en-error`;
  const arErrorId = `${labelId}-ar-error`;

  // Update valueRef whenever value prop changes
  useEffect(() => {
    valueRef.current = value || {};
  }, [value]);

  // Update active tab when locale changes
  useEffect(() => {
    if (locale === "en" || locale === "ar") {
      setActiveTab(locale);
    }
  }, [locale]);

  // Reorder tabs based on locale - active locale first
  const orderedTabs =
    locale === "ar" ? [...languageTabs].reverse() : languageTabs;

  // Ensure value is always an object
  const objectValue =
    value && typeof value === "object" && !Array.isArray(value) ? value : {};

  // Create toolbar configuration based on allowedElements
  const getToolbarConfig = () => {
    if (allowedElements === "all") {
      return [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ];
    } else if (allowedElements === "list") {
      return [[{ list: "ordered" }, { list: "bullet" }], ["clean"]];
    } else if (allowedElements === "basic") {
      return [["bold", "italic", "underline"], ["clean"]];
    } else if (Array.isArray(allowedElements)) {
      const toolbar = [];
      if (allowedElements.includes("header")) {
        toolbar.push([{ header: [1, 2, 3, false] }]);
      }
      if (
        allowedElements.some((el) =>
          ["bold", "italic", "underline"].includes(el)
        )
      ) {
        const formatting = [];
        if (allowedElements.includes("bold")) formatting.push("bold");
        if (allowedElements.includes("italic")) formatting.push("italic");
        if (allowedElements.includes("underline")) formatting.push("underline");
        toolbar.push(formatting);
      }
      if (allowedElements.includes("list")) {
        toolbar.push([{ list: "ordered" }, { list: "bullet" }]);
      }
      if (allowedElements.includes("link")) {
        toolbar.push(["link"]);
      }
      toolbar.push(["clean"]);
      return toolbar;
    }
    return [];
  };

  const toolbarConfig = getToolbarConfig();

  // Initialize Quill editor for English
  useEffect(() => {
    if (!Quill || !editorRefEn.current || isInitializedEn.current) return;

    const quill = new Quill(editorRefEn.current, {
      theme: "snow",
      placeholder: placeholder.en || "Enter text...",
      modules: {
        toolbar: toolbarConfig,
        clipboard: {
          matchVisual: false,
        },
      },
    });

    // Strip all inline styles from pasted content
    quill.clipboard.addMatcher(
      Node.ELEMENT_NODE,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_node: Node, delta: any) => {
        const ops = delta.ops.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (op: any) => {
            if (op.attributes) {
              // Remove all inline styles including background, color, font, etc.
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { background, color, font, size, ...allowedAttributes } =
                op.attributes;
              return {
                ...op,
                attributes:
                  Object.keys(allowedAttributes).length > 0
                    ? allowedAttributes
                    : undefined,
              };
            }
            return op;
          }
        );
        delta.ops = ops;
        return delta;
      }
    );

    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      const newValue = {
        ...valueRef.current,
        en: html === "<p><br></p>" ? "" : html,
      };
      onChange(newValue);
    });

    // Add blur event listener
    quill.root.addEventListener("blur", () => {
      if (onBlur) {
        onBlur();
      }
    });

    quillEnRef.current = quill;
    isInitializedEn.current = true;

    // Set initial content
    if (objectValue.en) {
      quill.root.innerHTML = objectValue.en;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolbarConfig]);

  // Initialize Quill editor for Arabic
  useEffect(() => {
    if (!Quill || !editorRefAr.current || isInitializedAr.current) return;

    const quill = new Quill(editorRefAr.current, {
      theme: "snow",
      placeholder: placeholder.ar || "أدخل النص...",
      modules: {
        toolbar: toolbarConfig,
        clipboard: {
          matchVisual: false,
        },
      },
    });

    // Strip all inline styles from pasted content
    quill.clipboard.addMatcher(
      Node.ELEMENT_NODE,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_node: Node, delta: any) => {
        const ops = delta.ops.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (op: any) => {
            if (op.attributes) {
              // Remove all inline styles including background, color, font, etc.
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { background, color, font, size, ...allowedAttributes } =
                op.attributes;
              return {
                ...op,
                attributes:
                  Object.keys(allowedAttributes).length > 0
                    ? allowedAttributes
                    : undefined,
              };
            }
            return op;
          }
        );
        delta.ops = ops;
        return delta;
      }
    );

    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      const newValue = {
        ...valueRef.current,
        ar: html === "<p><br></p>" ? "" : html,
      };
      onChange(newValue);
    });

    // Add blur event listener
    quill.root.addEventListener("blur", () => {
      if (onBlur) {
        onBlur();
      }
    });

    quillArRef.current = quill;
    isInitializedAr.current = true;

    // Set initial content
    if (objectValue.ar) {
      quill.root.innerHTML = objectValue.ar;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolbarConfig]);

  // Update content when value changes externally
  useEffect(() => {
    if (quillEnRef.current && objectValue.en !== undefined) {
      const currentContent = quillEnRef.current.root.innerHTML;
      if (
        currentContent !== objectValue.en &&
        objectValue.en !==
          (currentContent === "<p><br></p>" ? "" : currentContent)
      ) {
        quillEnRef.current.root.innerHTML = objectValue.en || "";
      }
    }
  }, [objectValue.en]);

  useEffect(() => {
    if (quillArRef.current && objectValue.ar !== undefined) {
      const currentContent = quillArRef.current.root.innerHTML;
      if (
        currentContent !== objectValue.ar &&
        objectValue.ar !==
          (currentContent === "<p><br></p>" ? "" : currentContent)
      ) {
        quillArRef.current.root.innerHTML = objectValue.ar || "";
      }
    }
  }, [objectValue.ar]);

  // Handle disabled state
  useEffect(() => {
    if (quillEnRef.current) {
      quillEnRef.current.enable(!disabled);
    }
    if (quillArRef.current) {
      quillArRef.current.enable(!disabled);
    }
  }, [disabled]);

  return (
    <div className={cn("w-full", containerClassName)}>
      {label && (
        <LabelPrimitive.Root
          htmlFor={labelId}
          className="block text-sm font-medium text-[var(--text)] mb-2"
        >
          {label}
          {required && <span className="text-[var(--destructive)]"> *</span>}
        </LabelPrimitive.Root>
      )}

      {/* Language Tabs */}
      <Tabs
        items={orderedTabs}
        value={activeTab}
        onValueChange={setActiveTab}
        variant="minimal"
        size="xs"
        containerClassName="gap-0 justify-start"
        tabClassName="border border-[var(--border)]"
        activeTabClassName="border-b-2! border-b-[var(--primaryColor)]! bg-[var(--primaryColor)]/5"
        inactiveTabClassName="border-b-2! border-b-[var(--border)]! hover:border-b-[var(--primaryColor)]/50"
      />

      {/* Tab Content */}
      <div
        className={cn(
          "-mt-px border rounded-b-md relative",
          error && (typeof error === "string" || error.en || error.ar)
            ? "border-[var(--errorColor)]"
            : "border-[var(--input-border)]/30"
        )}
      >
        <div className={cn("rich-text-editor", activeTab !== "en" && "hidden")}>
          {/* Hide editor top border under both tabs to avoid double border */}
          <div className="absolute top-0 start-0 w-[180px] h-px bg-[var(--input-bg)] z-10" />
          <div ref={editorRefEn} />
        </div>
        <div
          className={cn(
            "rich-text-editor rtl-editor",
            activeTab !== "ar" && "hidden"
          )}
          dir="rtl"
        >
          {/* Hide editor top border under both tabs to avoid double border */}
          <div className="absolute top-0 start-0 w-[180px] h-px bg-[var(--input-bg)] z-10" />
          <div ref={editorRefAr} />
        </div>
      </div>

      {/* Show all errors below the editor */}
      {error && (
        <div className="mt-1 space-y-1">
          {typeof error === "string" ? (
            <p
              className="text-sm text-[var(--errorColor)]"
              role="alert"
              aria-live="polite"
            >
              {error}
            </p>
          ) : (
            <>
              {error.en && (
                <p
                  id={enErrorId}
                  className="text-sm text-[var(--errorColor)] flex items-center gap-1"
                  role="alert"
                  aria-live="polite"
                >
                  <span className="font-medium">EN:</span> {error.en}
                </p>
              )}
              {error.ar && (
                <p
                  id={arErrorId}
                  className="text-sm text-[var(--errorColor)] flex items-center gap-1"
                  role="alert"
                  aria-live="polite"
                >
                  <span className="font-medium">AR:</span> {error.ar}
                </p>
              )}
            </>
          )}
        </div>
      )}

      <style jsx global>{`
        .rich-text-editor .ql-container {
          font-family: inherit;
          border: none;
          background-color: var(--input-bg);
          border-radius: 0 0 0.375rem 0.375rem;
          overflow: visible;
        }

        .rich-text-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid var(--input-border);
          border-bottom-opacity: 0.3;
          border-radius: 0 0.375rem 0 0;
          background-color: var(--input-bg);
          position: relative;
          overflow: visible;
        }

        /* Tooltip positioning fix to prevent horizontal scroll */
        .rich-text-editor .ql-tooltip {
          position: absolute;
          z-index: 1000;
          left: 0 !important;
          right: 0 !important;
          margin-left: auto;
          margin-right: auto;
          max-width: 60%;
          transform: none !important;
        }
        .ql-snow .ql-tooltip a.ql-preview {
          max-width: 50% !important;
        }

        .rich-text-editor .ql-tooltip input[type="text"] {
          max-width: 60%;
          width: 60%;
        }

        .rich-text-editor .ql-editor {
          min-height: 150px;
          color: var(--text);
          border-radius: 0 0 0.375rem 0.375rem;
          direction: ltr;
          text-align: left;
        }

        .rich-text-editor .ql-editor.ql-blank::before {
          color: var(--text-muted);
          font-style: normal;
        }

        .rich-text-editor.rtl-editor .ql-editor {
          direction: rtl;
          text-align: right;
        }

        /* List styling - same padding for both LTR and RTL, just different sides */
        .rich-text-editor .ql-editor ol,
        .rich-text-editor .ql-editor ul {
          padding-left: 1.5em;
        }

        .rich-text-editor.rtl-editor .ql-editor ol,
        .rich-text-editor.rtl-editor .ql-editor ul {
          padding-left: 0;
          padding-right: 1.5em;
        }

        .rich-text-editor .ql-editor li {
          list-style-position: outside;
          padding-left: 0.4em;
        }

        .rich-text-editor.rtl-editor .ql-editor li {
          padding-right: 0.4em !important;
        }

        /* LTR list marker positioning - Quill default */
        .rich-text-editor .ql-editor li > .ql-ui::before {
          margin-left: -1.2em !important;
          margin-right: 0.3em !important;
        }

        /* RTL list marker positioning - mirrored version */
        .rich-text-editor.rtl-editor .ql-editor li > .ql-ui::before {
          margin-left: 0em !important;
          padding-right: 0 !important;
          margin-right: -1.2em !important;
          text-align: right !important;
        }

        .rich-text-editor .ql-stroke {
          stroke: var(--text);
        }

        .rich-text-editor .ql-fill {
          fill: var(--text);
        }
        .ql-toolbar.ql-snow .ql-formats {
          border-inline-end: 1px solid var(--input-border);
          margin-right: unset !important;
          margin-left: unset !important;
          padding-inline: 10px !important;
        }

        .rich-text-editor .ql-picker-label {
          color: var(--text);
          padding-left: unset !important;
          padding-right: unset !important;
          padding-inline-start: 8px !important;
        }
        .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
          right: unset;
          inset-inline-end: 0px;
        }
        .ql-active {
          color: var(--primaryColor) !important;
        }
        .ql-picker-item:hover {
          color: var(--primaryColor) !important;
        }
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button:focus,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: var(--primaryColor);
        }

        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button:focus .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--primaryColor);
        }

        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button:focus .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: var(--primaryColor);
        }
      `}</style>
    </div>
  );
}
