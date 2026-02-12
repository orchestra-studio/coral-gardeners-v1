/**
 * Types and interfaces for Projects module
 */

import type { Project } from "@/services/projects";

// Component Props Interfaces
export interface ProjectStatsProps {
    totalCount: number;
    inProgressCount: number;
    readyCount?: number;
    blockedCount?: number;
    loading?: boolean;
}

export interface ProjectsContentProps {
    type: "all" | "deleted";
}

export interface ProjectsHeaderProps {
    actions?: React.ReactNode;
    type: "all" | "deleted";
}

export interface ProjectsTableProps {
    type: "all" | "deleted";
    onView?: (project: Project) => void;
    onEdit?: (project: Project) => void;
    onDelete?: (project: Project) => void;
    onRestore?: (project: Project) => void;
}

// Menu Item Interface
export interface MenuItem {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

// Project Table Types
export type ProjectTableType = "all" | "deleted";

// Status Variant Types
export type StatusVariant = "success" | "warning" | "info";

// Re-export Project type for convenience
export type { Project } from "@/services/projects";
