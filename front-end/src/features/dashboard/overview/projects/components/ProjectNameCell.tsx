import React from "react";
import { Link } from "@/components/ui/Link";
import type { ProjectDisplay } from "../types";

interface ProjectNameCellProps {
  deployment: ProjectDisplay;
}

export function ProjectNameCell({ deployment }: ProjectNameCellProps) {
  return (
    <div className="max-w-[300px] min-w-0">
      <Link
        variant="ghost"
        size="button"
        className="flex items-center gap-2 sm:gap-3 text-start w-full min-w-0 h-auto p-2 justify-start"
        href="#"
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="p-1 sm:p-1.5 bg-[var(--surface-hover)] rounded-md border border-[var(--border)] flex-shrink-0">
          {deployment.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-[var(--text)] text-sm truncate">
            {deployment.name}
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
            {deployment.description}
          </div>
        </div>
      </Link>
    </div>
  );
}
