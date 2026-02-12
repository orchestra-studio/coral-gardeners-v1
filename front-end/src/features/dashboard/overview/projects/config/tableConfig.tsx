/**
 * Table configuration for Projects Table Widget
 */

import React from "react";
import type { Column } from "@/components/Table/types";
import Status from "@/components/ui/Status";
import { ProjectNameCell, ProjectActionsMenu } from "../components";
import type { ProjectDisplay } from "../types";

interface TableColumnConfig {
  columns: {
    name: string;
    status: string;
    lastUpdated: string;
    actions: string;
  };
  status: {
    "in-progress": string;
    ready: string;
    blocked: string;
  };
  actions: {
    viewDetails: string;
    edit: string;
    delete: string;
    openActionsMenu: string;
    viewProjectDetails: string;
    editProject: string;
    deleteProject: string;
  };
}

/**
 * Get table columns configuration
 */
export const getTableColumns = (
  t: TableColumnConfig
): Column<ProjectDisplay>[] => [
  {
    header: t.columns.name,
    accessor: (deployment: ProjectDisplay) => (
      <ProjectNameCell deployment={deployment} />
    ),
  },
  {
    header: t.columns.status,
    accessor: (deployment: ProjectDisplay) => (
      <Status
        variant={deployment.status as "ready" | "blocked" | "in-progress"}
        label={t.status[deployment.status as keyof typeof t.status]}
      />
    ),
  },
  {
    header: t.columns.lastUpdated,
    accessor: "date",
  },
  {
    header: t.columns.actions,
    accessor: (deployment: ProjectDisplay) => (
      <ProjectActionsMenu deployment={deployment} translations={t.actions} />
    ),
    align: "right",
  },
];
