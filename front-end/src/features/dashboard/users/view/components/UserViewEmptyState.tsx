"use client";

import React from "react";
import { Notice } from "@/components/ui/Notice";

interface UserViewEmptyStateProps {
  title: string;
  description: string;
}

export default function UserViewEmptyState({
  title,
  description,
}: UserViewEmptyStateProps) {
  return (
    <Notice title={title} variant="info">
      {description}
    </Notice>
  );
}
