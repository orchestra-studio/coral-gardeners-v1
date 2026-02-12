import React, { ReactNode, RefObject } from "react";
import { Column } from "../types";
import SkeletonRow from "./SkeletonRow";

// Helper function to safely convert any value to a ReactNode
export const toReactNode = (value: unknown): ReactNode => {
  if (value === null || value === undefined) return value as ReactNode;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  )
    return String(value);
  if (
    React.isValidElement(value) ||
    Array.isArray(value) ||
    typeof value === "function"
  )
    return value as ReactNode;
  return String(value);
};

export interface TableBaseProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: (item: T, index: number) => string;
  emptyMessage?: string;
  loading?: boolean;
  skeletonRowCount?: number;
  tableRef?: RefObject<HTMLTableElement | null>;
}

export default function TableBase<T extends object>({
  columns,
  data = [],
  className = "",
  headerClassName = "",
  bodyClassName = "",
  rowClassName = () => "",
  emptyMessage = "No data found",
  loading = false,
  skeletonRowCount = 4,
  tableRef,
}: TableBaseProps<T>) {
  return (
    <div
      className={`bg-[var(--surface)] border-1 border-[var(--border-subtle)] rounded-2xl overflow-hidden ${className}`}
    >
      <div className="overflow-x-auto">
        <table
          ref={tableRef}
          className="w-full border-separate border-spacing-0 min-w-full"
        >
          <thead>
            <tr
              className={`border-b border-[var(--border)] ${headerClassName}`}
            >
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`p-2 sm:p-3 lg:p-4 font-semibold text-[var(--text)] text-sm bg-[var(--table-bg)] first:rounded-ss-md last:rounded-se-md whitespace-nowrap ${
                    column.align === "right"
                      ? "text-end"
                      : column.align === "center"
                      ? "text-center"
                      : "text-start"
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`text-sm ${bodyClassName}`}>
            {loading ? (
              // Render skeleton rows when loading
              Array.from({ length: skeletonRowCount }, (_, index) => (
                <SkeletonRow
                  key={`skeleton-${index}`}
                  columns={columns}
                  rowIndex={index}
                />
              ))
            ) : !data || !Array.isArray(data) || data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-[var(--text-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`bg-[var(--surface)] hover:bg-[var(--table-hover-bg)]  ${rowClassName(
                    item,
                    rowIndex
                  )}`}
                >
                  {columns.map((column, colIndex) => {
                    const rawValue =
                      typeof column.accessor === "function"
                        ? column.accessor(item, rowIndex)
                        : (item as Record<string, unknown>)[
                            column.accessor as string
                          ];
                    const cellValue = toReactNode(rawValue);

                    return (
                      <td
                        key={colIndex}
                        className={`p-2 sm:p-3 lg:p-4 text-[var(--text)] whitespace-nowrap ${
                          column.align === "right"
                            ? "text-end"
                            : column.align === "center"
                            ? "text-center"
                            : "text-start"
                        }`}
                      >
                        {cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
