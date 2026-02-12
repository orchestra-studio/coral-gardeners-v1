"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/input";
import type { ProjectFormData } from "../types";

interface StatusFieldProps {
  value: ProjectFormData["status"];
  statusOptions: Array<{ value: string; label: string }>;
  onChange: (field: keyof ProjectFormData, value: string) => void;
}

export default function StatusField({
  value,
  statusOptions,
  onChange,
}: StatusFieldProps) {
  const t = useTranslations("dashboard/projects");

  return (
    <div className="bg-[var(--surface-hover)] p-4 rounded-md border border-[var(--border)] mb-6">
      <Select
        label={t("form.fields.status.label")}
        placeholder={t("form.fields.status.placeholder")}
        options={statusOptions}
        value={value}
        onChange={(val) => onChange("status", val as string)}
      />
    </div>
  );
}
