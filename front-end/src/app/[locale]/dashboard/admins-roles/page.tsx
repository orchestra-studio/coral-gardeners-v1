"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/permissions";
import RolesHeader from "@/features/dashboard/admin-roles/components/RolesHeader";
import AdminRolesContent from "@/features/dashboard/admin-roles/AdminRolesContent";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export default function AdminRolesPage() {
  const t = useTranslations("dashboard/settings/adminroles");
  const { hasPermission } = usePermission();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const canCreate = hasPermission("roles.create");

  return (
    <>
      <RolesHeader
        actions={
          canCreate && (
            <Button
              onClick={() => setIsCreateFormOpen(true)}
              startIcon={<IconPlus size={16} />}
              size="sm"
            >
              {t("addRole")}
            </Button>
          )
        }
      />
      <AdminRolesContent
        isCreateFormOpen={isCreateFormOpen}
        setIsCreateFormOpen={setIsCreateFormOpen}
      />
    </>
  );
}
