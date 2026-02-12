import React from "react";

interface FormPanelProps {
  title: string;
  children: React.ReactNode;
}

/**
 * FormPanel - Right side panel containing the auth form
 */
export function FormPanel({ title, children }: FormPanelProps) {
  return (
    <div
      className="w-full lg:w-1/2 flex items-center justify-center px-6 py-6 lg:px-12 lg:py-8"
      style={{
        backgroundColor: "var(--surface)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Title */}
        <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-[var(--text-heading)]">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
