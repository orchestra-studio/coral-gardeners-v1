/**
 * Hook for table export functionality
 * Provides methods to export table data as CSV or Image
 */

import { useCallback, useRef } from "react";
import type { Column } from "../types";
import { exportToCSV, exportToImage } from "../utils/exportUtils";

export type ExportFormat = "csv" | "image";

export interface UseTableExportProps<T> {
  data: T[];
  columns: Column<T>[];
  filename?: string;
  exportColumns?: Column<T>[]; // Optional: Different columns for export (text-only)
}

export interface TableExportRef {
  exportAsCSV: () => Promise<void>;
  exportAsImage: () => Promise<void>;
}

export function useTableExport<T extends object>({
  data,
  columns,
  filename = "table-export",
  exportColumns,
}: UseTableExportProps<T>) {
  const tableRef = useRef<HTMLTableElement | null>(null);

  const handleExportCSV = useCallback(async () => {
    return new Promise<void>((resolve) => {
      exportToCSV({
        data,
        columns: exportColumns || columns, // Use exportColumns if provided
        filename: `${filename}-${new Date().toISOString().split("T")[0]}`,
      });
      // Add a small delay to ensure download starts
      setTimeout(() => resolve(), 100);
    });
  }, [data, columns, exportColumns, filename]);

  const handleExportImage = useCallback(async () => {
    if (tableRef.current) {
      await exportToImage({
        element: tableRef.current,
        filename: `${filename}-${new Date().toISOString().split("T")[0]}`,
      });
    }
  }, [filename]);

  return {
    tableRef,
    exportAsCSV: handleExportCSV,
    exportAsImage: handleExportImage,
  };
}
