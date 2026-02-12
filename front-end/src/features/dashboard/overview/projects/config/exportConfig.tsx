/**
 * Export configuration for Projects Table Widget
 * Provides text-only columns for CSV export
 */

import type { Column } from "@/components/Table/types";
import type { ProjectDisplay } from "../types";

interface ExportColumnConfig {
  columns: {
    name: string;
    status: string;
    lastUpdated: string;
  };
  status: {
    "in-progress": string;
    ready: string;
    blocked: string;
  };
}

/**
 * Get export columns configuration (text-only, no React components)
 */
export const getExportColumns = (
  t: ExportColumnConfig
): Column<ProjectDisplay>[] => [
  {
    header: t.columns.name,
    accessor: "name", // Direct field access instead of component
  },
  {
    header: t.columns.status,
    accessor: (deployment: ProjectDisplay) =>
      t.status[deployment.status as keyof typeof t.status], // Return text instead of component
  },
  {
    header: t.columns.lastUpdated,
    accessor: "date",
  },
  // Note: Actions column is excluded from export as it's not meaningful in CSV
];
