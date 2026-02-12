"use client";

import React from "react";
import { IconUser } from "@tabler/icons-react";
import Status from "@/components/ui/Status";
import type { AdminIdentityMeta } from "../hooks/useAdminViewData";

interface AdminHeaderInfoProps {
  identity: AdminIdentityMeta & { statusLabel: string };
}

const nameClass = "text-2xl font-bold text-[var(--text)]";
const usernameClass =
  "text-sm flex items-center gap-1 mt-1 text-[var(--text-muted)]";

export function AdminHeaderInfo({ identity }: AdminHeaderInfoProps) {
  const statusVariant =
    identity.statusLabelKey === "status.active" ? "success" : "error";

  return (
    <>
      <div className="flex-1 sm:mb-4">
        <h2 className={nameClass}>{identity.displayName}</h2>
        <p className={usernameClass}>
          <IconUser size={16} />@{identity.displayName}
        </p>
      </div>

      <div className="sm:mb-5 flex flex-col gap-1 items-start sm:items-end">
        <Status
          variant={statusVariant}
          size="md"
          label={identity.statusLabel}
        />
      </div>
    </>
  );
}
