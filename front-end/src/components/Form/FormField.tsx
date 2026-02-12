"use client";

import React from "react";

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  dir?: "ltr" | "rtl";
}

/**
 * FormField - A reusable wrapper for form inputs with label, error, and hint
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Project Name"
 *   error={errors.name}
 *   required
 *   hint="Enter a unique project name"
 * >
 *   <Input value={name} onChange={setName} />
 * </FormField>
 * ```
 */
export default function FormField({
  label,
  error,
  required,
  hint,
  children,
  className = "",
  dir,
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`} dir={dir}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text)]">
          {label}
          {required && <span className="text-[var(--errorColor)] ml-1">*</span>}
        </label>
      )}

      {children}

      {hint && !error && (
        <p className="text-xs text-[var(--text-muted)]">{hint}</p>
      )}

      {error && <p className="text-sm text-[var(--errorColor)]">{error}</p>}
    </div>
  );
}
