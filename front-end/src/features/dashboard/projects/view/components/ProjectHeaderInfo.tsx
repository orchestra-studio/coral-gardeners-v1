"use client";

import React from "react";
import Status from "@/components/ui/Status";

interface ProjectHeaderInfoProps {
  name: string;
  description: string;
  status: "ready" | "in-progress" | "blocked";
  statusLabel: string;
}

export default function ProjectHeaderInfo({
  name,
  description,
  status,
  statusLabel,
}: ProjectHeaderInfoProps) {
  return (
    <div className="flex-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[var(--text)] mb-2">{name}</h2>
          <p className="text-[var(--text-muted)]">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <Status variant={status} label={statusLabel} />
        </div>
      </div>
    </div>
  );
}
