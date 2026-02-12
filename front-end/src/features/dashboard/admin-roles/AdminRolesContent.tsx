"use client";

import React, { useState } from "react";
import AdminRolesTable, { type RoleRow } from "./AdminRolesTable";
import AdminRoleForm from "./Form/index";
import RolePermissions from "./Permissions/index";
import RolesStats from "./components/RolesStats";
import Alert from "@/components/ui/Alert";
import { useTranslations } from "next-intl";
import { useRolesList, useDeleteRole, type Role } from "@/services/adminRoles";

interface AdminRolesContentProps {
  className?: string;
  isCreateFormOpen?: boolean;
  setIsCreateFormOpen?: (open: boolean) => void;
}

export default function AdminRolesContent({
  className = "",
  isCreateFormOpen = false,
  setIsCreateFormOpen,
}: AdminRolesContentProps) {
  const t = useTranslations("dashboard/settings/adminroles");

  const [page, setPage] = useState(1);
  const pageCount = 10;
  const [filters, setFilters] = useState<{
    name?: string;
    guard_name?: string;
    created_from?: string;
    created_to?: string;
  }>({});
  const [roleForm, setRoleForm] = useState({
    open: false,
    role: null as Role | null,
  });
  const [permissionsView, setPermissionsView] = useState({
    open: false,
    role: null as Role | null,
  });

  // Use TanStack Query for roles list
  const rolesQuery = useRolesList({
    page,
    page_count: pageCount,
    name: filters.name,
    guard_name: filters.guard_name,
    created_from: filters.created_from,
    created_to: filters.created_to,
  });

  // Use TanStack Query for delete role
  const deleteRoleMutation = useDeleteRole();

  // Sync isCreateFormOpen with form state
  React.useEffect(() => {
    if (isCreateFormOpen) {
      setRoleForm({ open: true, role: null });
    }
  }, [isCreateFormOpen]);

  const handleDelete = async (role: RoleRow) => {
    await Alert.confirmAction(
      t("messages.deleteConfirmTitle"),
      t("messages.deleteConfirmMessage", { name: role.name }),
      t("messages.deleteConfirmButton"),
      async () => {
        try {
          await deleteRoleMutation.mutateAsync(role.id);
          // Service layer handles success toast
        } catch {
          // Service layer handles error toasts
        }
      },
      t("messages.cancelButton")
    );
  };

  const handleViewPermissions = (role: RoleRow) => {
    setPermissionsView({ open: true, role: role as unknown as Role });
  };

  const handleFilterChange = (newFilters: {
    name?: string;
    guard_name?: string;
    created_from?: string;
    created_to?: string;
  }) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Cards */}
      <RolesStats />

      {/* Roles Table */}
      <AdminRolesTable
        data={rolesQuery.data || null}
        page={page}
        pageCount={pageCount}
        filters={filters}
        loading={rolesQuery.isLoading || rolesQuery.isFetching}
        onPageChange={handlePageChange}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onOpenEdit={(role: RoleRow | null) =>
          setRoleForm({ open: true, role: role as unknown as Role })
        }
        onViewPermissions={handleViewPermissions}
        onDelete={handleDelete}
      />

      {/* Role Form (Create/Edit) */}
      {roleForm.open && (
        <AdminRoleForm
          roleForm={roleForm}
          setRoleForm={(newState) => {
            if (typeof newState === "function") {
              setRoleForm((prev) => {
                const updated = newState(prev);
                if (!updated.open && setIsCreateFormOpen) {
                  setIsCreateFormOpen(false);
                }
                return updated;
              });
            } else {
              setRoleForm(newState);
              if (!newState.open && setIsCreateFormOpen) {
                setIsCreateFormOpen(false);
              }
            }
          }}
        />
      )}

      {/* View Permissions */}
      {permissionsView.open && (
        <RolePermissions
          permissionsView={permissionsView}
          setPermissionsView={setPermissionsView}
        />
      )}
    </div>
  );
}
