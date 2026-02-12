"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Modal from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { usePermissions, useRolePermissions } from "./hooks";
import { SelectAllCheckbox, PermissionGroup } from "./components";
import { RolePermissionsProps, FormValues } from "./types";

export default function RolePermissions({
  permissionsView,
  setPermissionsView,
}: RolePermissionsProps) {
  const t = useTranslations("dashboard/settings/adminroles.permissions");

  const {
    loading: permissionsLoading,
    permissionGroups,
    rolePermissions,
    expandedGroups,
    toggleGroupExpansion,
  } = usePermissions(permissionsView.role);

  const handleClose = () => {
    setPermissionsView({ open: false, role: null });
  };

  const {
    handleSubmit,
    watch,
    handlePermissionToggle,
    handleGroupToggle,
    handleSelectAll,
    areAllPermissionsSelected,
    areSomePermissionsSelected,
    getGroupState,
    onSubmit,
    isLoading,
  } = useRolePermissions(
    permissionsView.role,
    permissionGroups,
    rolePermissions,
    handleClose
  );

  // Don't render if no role is selected
  if (!permissionsView.role) {
    return null;
  }

  const handleFormSubmit = async (values: FormValues) => {
    await onSubmit(values);
  };

  const getPermissionChecked = (permission: string): boolean => {
    const allPermissions = watch("permissions") || {};
    return allPermissions[permission] === true;
  };

  if (permissionsLoading && !Object.keys(permissionGroups).length) {
    return (
      <Modal
        open={permissionsView.open}
        onClose={handleClose}
        title={t("loading")}
        size="lg"
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-[var(--text-muted)]">{t("loading")}</div>
        </div>
      </Modal>
    );
  }
  return (
    <Modal
      open={permissionsView.open}
      onClose={handleClose}
      title={`${t("title")} - ${permissionsView.role?.name || ""}`}
      size="lg"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Select All Checkbox */}
        <SelectAllCheckbox
          areAllPermissionsSelected={areAllPermissionsSelected}
          areSomePermissionsSelected={areSomePermissionsSelected}
          handleSelectAll={handleSelectAll}
        />

        {/* Permission Groups */}
        <div className="flex flex-col gap-4">
          {Object.entries(permissionGroups).map(([groupName, permissions]) => {
            const groupState = getGroupState(groupName);
            const isExpanded = expandedGroups[groupName];

            return (
              <PermissionGroup
                key={groupName}
                groupName={groupName}
                permissions={permissions}
                groupState={groupState}
                isExpanded={isExpanded}
                onToggleExpansion={() => toggleGroupExpansion(groupName)}
                onGroupToggle={() => handleGroupToggle(groupName)}
                getPermissionChecked={getPermissionChecked}
                onPermissionToggle={handlePermissionToggle}
              />
            );
          })}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            {t("actions.close")}
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            loadingText={t("actions.saving")}
          >
            {t("actions.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
