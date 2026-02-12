"use client";

import React from "react";

interface ProjectViewEmptyStateProps {
  title: string;
  description: string;
}

export default function ProjectViewEmptyState({
  title,
  description,
}: ProjectViewEmptyStateProps) {
  return (
    <div className="mt-6 text-center py-12">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{title}</h3>
      <p className="text-[var(--text-muted)]">{description}</p>
    </div>
  );
}
