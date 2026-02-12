"use client";

import { useState, KeyboardEvent } from "react";
import { IconX, IconPlus } from "@tabler/icons-react";
import { Input } from "./Input";
import { Button } from "../button";
import { cn } from "@/lib/utils";

export interface ArrayInputProps {
  value?: string[];
  onChange: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  maxItems?: number;
  allowDuplicates?: boolean;
  validateItem?: (item: string) => boolean | string;
  required?: boolean;
}

export default function ArrayInput({
  value = [],
  onChange,
  label,
  placeholder = "Add item...",
  error,
  disabled = false,
  maxItems,
  allowDuplicates = false,
  validateItem,
  required = false,
}: ArrayInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState<string>("");

  // Ensure value is always an array
  const arrayValue = Array.isArray(value) ? value : [];

  const addItem = () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      return;
    }

    // Check for duplicates
    if (!allowDuplicates && arrayValue.includes(trimmedValue)) {
      setInputError("This item already exists");
      return;
    }

    // Check max items
    if (maxItems && arrayValue.length >= maxItems) {
      setInputError(`Maximum ${maxItems} items allowed`);
      return;
    }

    // Validate item
    if (validateItem) {
      const validation = validateItem(trimmedValue);
      if (validation !== true) {
        setInputError(
          typeof validation === "string" ? validation : "Invalid item"
        );
        return;
      }
    }

    onChange([...arrayValue, trimmedValue]);
    setInputValue("");
    setInputError("");
  };

  const removeItem = (index: number) => {
    onChange(arrayValue.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-[var(--text)]">
          {label}
          {required && <span className="text-[var(--destructive)]"> *</span>}
        </label>
      )}

      {/* Input with Add Button */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setInputError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={
            disabled || (maxItems ? arrayValue.length >= maxItems : false)
          }
          error={inputError}
        />
        <Button
          type="button"
          onClick={addItem}
          disabled={
            !inputValue.trim() ||
            disabled ||
            (maxItems ? arrayValue.length >= maxItems : false)
          }
          size="default"
          variant="outline"
          className="shrink-0 rounded-md h-10"
        >
          <IconPlus size={16} />
        </Button>
      </div>

      {/* Display Added Items */}
      {arrayValue.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {arrayValue.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md",
                "bg-[var(--surface-hover)] border border-[var(--border)]",
                "text-sm text-[var(--text)]"
              )}
            >
              <span>{item}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-[var(--text-muted)] hover:text-[var(--destructive)] transition-colors"
                  aria-label={`Remove ${item}`}
                >
                  <IconX size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
    </div>
  );
}
