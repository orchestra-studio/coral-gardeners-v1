"use client";

import React from "react";
import TableBase from "./components/TableBase";
import type { TableProps } from "./types";
import Filter from "./components/filter/Filter";
import Pagination from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";

export type {
  Column,
  TableProps as TableComponentProps,
  TableProps,
  TableFilterField,
} from "./types";

export { useTableExport } from "./hooks/useTableExport";
export type { ExportFormat, TableExportRef } from "./hooks/useTableExport";
export { default as ExportButton } from "./components/ExportButton";

export default function Table<T extends object>({
  columns,
  data,
  className,
  headerClassName,
  filterContainerClassName,
  bodyClassName,
  rowClassName,
  containerClassName,
  emptyMessage = "No data found",
  loading = false,
  skeletonRowCount = 3,
  // filter
  showFilter = false,
  filterFields = [],
  onFilter,
  onResetFilters,
  filterDefaultValues,
  filterButtonLabel = "Filter",
  resetButtonLabel = "Reset",
  // pagination
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = data.length,
  onPageChange,
  paginationTranslations,
  // export
  tableRef,
}: TableProps<T>) {
  return (
    <div className={cn("flex flex-col gap-4", containerClassName)}>
      {showFilter && (
        <Filter
          fields={filterFields.map((f) => ({
            name: f.name,
            label: f.label,
            type: f.type,
            placeholder: f.placeholder,
            options: f.options,
            className: f.className,
          }))}
          onFilter={(values: Record<string, unknown>) => onFilter?.(values)}
          onReset={() => onResetFilters?.()}
          defaultValues={filterDefaultValues}
          loading={loading}
          filterButtonLabel={filterButtonLabel}
          resetButtonLabel={resetButtonLabel}
          className={filterContainerClassName}
        />
      )}

      <TableBase<T>
        columns={columns}
        data={data}
        className={className}
        headerClassName={headerClassName}
        bodyClassName={bodyClassName}
        rowClassName={rowClassName}
        emptyMessage={emptyMessage}
        loading={loading}
        skeletonRowCount={skeletonRowCount}
        tableRef={tableRef}
      />

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={(page) => onPageChange?.(page)}
          translations={paginationTranslations}
        />
      )}
    </div>
  );
}
