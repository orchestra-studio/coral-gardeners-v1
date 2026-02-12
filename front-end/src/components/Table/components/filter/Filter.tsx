"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { cn } from "@/lib/utils";
import FilterFieldsGrid from "./FilterFieldsGrid";
import { FilterProps } from "./types";
import DotsPattern from "@/components/DotsPattern";
import RaysLighting from "@/components/RaysLighting";

export default function Filter({
  fields,
  onFilter,
  onReset,
  defaultValues,
  className,
  loading = false,
  filterButtonLabel = "Filter",
  resetButtonLabel = "Reset",
  enableNoise = true,
  enableLighting = true,
}: FilterProps) {
  const methods = useForm({ defaultValues });
  const { handleSubmit, reset } = methods;

  const handleReset = () => {
    reset();
    onReset();
  };

  return (
    <div
      className={cn(
        "relative p-4 border border-[var(--border-subtle)] bg-[var(--surface)] rounded-2xl",
        className
      )}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onFilter)} className="relative z-1">
          <FilterFieldsGrid
            fields={fields}
            loading={loading}
            onReset={handleReset}
            filterButtonLabel={filterButtonLabel}
            resetButtonLabel={resetButtonLabel}
          />
        </form>
      </FormProvider>
      <div className="w-full z-0 h-full absolute rounded-2xl inset-0 overflow-hidden">
        {enableNoise && (
          <DotsPattern opacity={0.8} dotSize={3} spacing={5} rotation={40} />
        )}
      </div>

      {enableLighting && (
        <div className="w-full h-full absolute rounded-2xl inset-0 overflow-hidden">
          <RaysLighting
            position="top-left"
            intensity={0.08}
            width={2800}
            height={900}
            zIndex={20}
          />
          <RaysLighting
            position="top-right"
            intensity={0.08}
            width={2800}
            height={900}
            zIndex={20}
          />
        </div>
      )}
    </div>
  );
}
