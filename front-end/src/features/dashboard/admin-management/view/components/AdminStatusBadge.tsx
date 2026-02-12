"use client";

import React from "react";
import type { AdminUser } from "@/services/adminManagement/types/adminTypes";

interface AdminStatusBadgeProps {
  admin: AdminUser;
  t: (key: string) => string;
}

export function AdminStatusBadge({ admin, t }: AdminStatusBadgeProps) {
  const isDeleted = !!admin.deleted_at;

  return (
    <div className="sm:mb-4 flex gap-2">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isDeleted
            ? "bg-[var(--errorColor)]/10 text-[var(--errorColor)] border border-[var(--errorColor)]/20"
            : "bg-[var(--successColor)]/10 text-[var(--successColor)] border border-[var(--successColor)]/20"
        }`}
      >
        {isDeleted ? t("view.status.deleted") : t("view.status.active")}
      </span>
    </div>
  );
}

export default AdminStatusBadge;
