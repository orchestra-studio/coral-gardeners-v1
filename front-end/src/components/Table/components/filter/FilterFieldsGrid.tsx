"use client";

import React from "react";
import { Input, DatePickerInput, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IconSearch, IconRefresh } from "@tabler/icons-react";
import { useFormContext } from "react-hook-form";
import { FilterField } from "./types";

interface FilterFieldsGridProps {
  fields: FilterField[];
  loading?: boolean;
  onReset: () => void;
  filterButtonLabel?: string;
  resetButtonLabel?: string;
}

export default function FilterFieldsGrid({
  fields,
  loading,
  onReset,
  filterButtonLabel = "Filter",
  resetButtonLabel = "Reset",
}: FilterFieldsGridProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const renderField = (field: FilterField) => {
    const fieldName = field.name as string;
    const errorMap = errors as Record<string, { message?: string }>;
    const error = errorMap[fieldName]?.message as string;

    switch (field.type) {
      case "text":
      case "search":
        return (
          <Input
            {...register(field.name)}
            type="text"
            placeholder={field.placeholder}
            label={field.label}
            error={error}
            className={field.className}
          />
        );
      case "number":
        return (
          <Input
            {...register(field.name, { valueAsNumber: true })}
            type="number"
            placeholder={field.placeholder}
            label={field.label}
            error={error}
            className={field.className}
          />
        );
      case "select":
        return (
          <Select
            options={field.options || []}
            value={watch(field.name) as string | number | undefined}
            onChange={(value) => setValue(field.name, value)}
            placeholder={field.placeholder}
            label={field.label}
            usePortal={false}
            error={error}
            className={field.className}
          />
        );
      case "date":
        return (
          <DatePickerInput
            value={watch(field.name) as Date | undefined}
            onChange={(date) => setValue(field.name, date)}
            placeholder={field.placeholder}
            label={field.label}
            error={error}
            className={field.className}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {fields.map((field) => (
        <div key={field.name} className="col-span-1">
          {renderField(field)}
        </div>
      ))}
      <div
        className="col-span-full flex items-end justify-end gap-2 pb-1"
        style={{ gridColumn: "auto / -1" }}
      >
        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={loading}
          className="flex items-center gap-2"
          startIcon={<IconSearch className="w-4 h-4" />}
        >
          {filterButtonLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={loading}
          className="flex items-center gap-2"
          startIcon={<IconRefresh className="w-4 h-4" />}
        >
          {resetButtonLabel}
        </Button>
      </div>
    </div>
  );
}
