"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Sheet from "@/components/ui/Sheet";
import { AdminRolesFormProps } from "./types";
import { useRoleManagement } from "./useRoleManagement";
import { AdminInfo } from "./AdminInfo";
import { RolesList } from "./RolesList";
import { useTranslations } from "next-intl";

export default function AdminRolesForm({
  adminRolesForm,
  setAdminRolesForm,
  getData,
}: AdminRolesFormProps) {
  const t = useTranslations("dashboard/settings/adminmanagement.rolesForm");
  const tMessages = useTranslations(
    "dashboard/settings/adminmanagement.messages"
  );

  const { admin, open } = adminRolesForm;

  const { availableRoles, selectedRoles, loading, toggleRole, updateRoles } =
    useRoleManagement(admin, open, (key: string) => {
      // Map keys to appropriate translation namespaces
      if (key === "rolesUpdated") return tMessages("rolesUpdated");
      if (key === "rolesFailed") return tMessages("rolesFailed");
      if (key === "rolesError") return tMessages("rolesFailed");
      if (key === "fetchRolesFailed" || key === "fetchRolesError")
        return tMessages("fetchFailed");
      return tMessages(key);
    });

  const handleSubmit = async () => {
    const success = await updateRoles();
    if (success) {
      handleClose();
      getData();
    }
  };

  const handleClose = () => {
    setAdminRolesForm({ open: false, admin: null });
  };

  if (!open || !admin) return null;

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title={t("title")}
      maxWidth={500}
      actions={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {t("actions.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            loading={loading}
            loadingText={t("actions.updating")}
            disabled={availableRoles.length === 0}
          >
            {t("actions.update")}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Admin Info */}
        <AdminInfo admin={admin} />

        {/* Roles Selection */}
        <div>
          <h3 className="text-base font-medium text-[var(--text)] mb-4">
            {t("availableRoles")}
          </h3>
          <RolesList
            roles={availableRoles}
            selectedRoles={selectedRoles}
            onToggleRole={toggleRole}
          />
        </div>
      </div>
    </Sheet>
  );
}
