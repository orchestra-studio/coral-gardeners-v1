"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import UsersHeader from "@/features/dashboard/users/components/UsersHeader";
import UsersContent from "@/features/dashboard/users/UsersContent";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import DonorImportButton from "@/features/dashboard/users/components/DonorImportButton";
import { useQueryClient } from "@tanstack/react-query";

export default function AllUsersPage() {
  const t = useTranslations("dashboard/users");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleImportComplete = () => {
    // Invalidate users query to refresh the list
    queryClient.invalidateQueries({ queryKey: ["users"] });
  };

  return (
    <>
      <UsersHeader
        type="all"
        actions={
          <div className="flex gap-2">
            <DonorImportButton onImportComplete={handleImportComplete} />
            <Button
              onClick={() => setIsCreateFormOpen(true)}
              startIcon={<IconPlus size={16} />}
              size="sm"
            >
              {t("actions.create")}
            </Button>
          </div>
        }
      />
      <UsersContent
        type="all"
        isCreateFormOpen={isCreateFormOpen}
        setIsCreateFormOpen={setIsCreateFormOpen}
      />
    </>
  );
}
