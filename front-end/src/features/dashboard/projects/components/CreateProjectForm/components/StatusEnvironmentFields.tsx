"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/input";
import type { ProjectFormData } from "../types";

interface StatusEnvironmentFieldsProps {
  status: ProjectFormData["status"];
  environment: string;
  statusOptions: Array<{ value: string; label: string }>;
  environmentOptions: Array<{ value: string; label: string }>;
  onChange: (field: keyof ProjectFormData, value: string | null) => void;
  error?: string;
}

export default function StatusEnvironmentFields({
  status,
  environment,
  statusOptions,
  environmentOptions,
  onChange,
  error,
}: StatusEnvironmentFieldsProps) {
  const t = useTranslations("dashboard/projects");

  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      <Select
        label={t("form.fields.status.label")}
        placeholder={t("form.fields.status.placeholder")}
        options={statusOptions}
        value={status}
        onChange={(val) => onChange("status", val as string)}
        searchable
        usePortal={false}
      />

      <Select
        label={t("form.fields.environment.label")}
        placeholder={t("form.fields.environment.placeholder")}
        options={environmentOptions}
        value={environment}
        onChange={(value) => onChange("environment_en", value as string)}
        error={error}
        required
        searchable
        usePortal={false}
      />
    </div>
  );
}
