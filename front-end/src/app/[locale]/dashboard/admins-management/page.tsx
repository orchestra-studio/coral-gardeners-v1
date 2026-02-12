"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/permissions";
import AdminsHeader from "@/features/dashboard/admin-management/components/AdminsHeader";
import AdminsContent from "@/features/dashboard/admin-management/AdminsContent";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export default function AdminManagementPage() {
  const t = useTranslations("dashboard/settings/adminmanagement");
  const { hasPermission } = usePermission();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const canCreate = hasPermission("admins.create");

  return (
    <>
      <AdminsHeader
        actions={
          canCreate && (
            <Button
              onClick={() => setIsCreateFormOpen(true)}
              startIcon={<IconPlus size={16} />}
              size="sm"
            >
              {t("actions.create")}
            </Button>
          )
        }
      />
      <AdminsContent
        isCreateFormOpen={isCreateFormOpen}
        setIsCreateFormOpen={setIsCreateFormOpen}
      />
    </>
  );
}
