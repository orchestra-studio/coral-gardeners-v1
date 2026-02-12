"use client";

import React from "react";
import Table, {
  type Column as TableColumn,
  type TableFilterField as FilterField,
} from "@/components/Table";
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/ui/DropdownMenu";
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/permissions";
import { type Role } from "@/lib/api";
import { getRoleIcon } from "./helper";

export type RoleRow = Role & Record<string, unknown>;

interface RolesListResponse {
  data: Role[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AdminRolesTableProps {
  data: RolesListResponse | null;
  page: number;
  pageCount: number;
  filters: {
    name?: string;
    guard_name?: string;
    created_from?: string;
    created_to?: string;
  };
  loading?: boolean;
  skeletonRowCount?: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: {
    name?: string;
    guard_name?: string;
    created_from?: string;
    created_to?: string;
  }) => void;
  onResetFilters: () => void;
  onOpenEdit: (role: RoleRow | null) => void;
  onViewPermissions: (role: RoleRow) => void;
  onDelete: (role: RoleRow) => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminRolesTable({
  data,
  page,
  pageCount,
  filters,
  loading = false,
  skeletonRowCount,
  onPageChange,
  onFilterChange,
  onResetFilters,
  onOpenEdit,
  onViewPermissions,
  onDelete,
}: AdminRolesTableProps) {
  const t = useTranslations("dashboard/settings/adminroles.table");
  const tCommon = useTranslations("common");
  const { hasPermission } = usePermission();

  // Permission checks
  const canEdit = hasPermission("roles.edit");
  const canDelete = hasPermission("roles.delete");
  const canAssignPermissions = hasPermission("roles.assign_permissions");
  const columns: TableColumn<RoleRow>[] = [
    {
      header: t("headers.role"),
      accessor: (role) => (
        <div className="flex items-center gap-3">
          {getRoleIcon(role.name)}
          <div>
            <div className="font-medium text-[var(--text)]">{role.name}</div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              {String(role.guard_name || "")}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: t("headers.createdDate"),
      accessor: (role: RoleRow) =>
        role.created_at ? formatDate(String(role.created_at)) : "N/A",
    },
    {
      header: t("headers.updatedDate"),
      accessor: (role: RoleRow) =>
        role.updated_at ? formatDate(String(role.updated_at)) : "N/A",
    },
    {
      header: t("headers.actions"),
      accessor: (role: RoleRow) => {
        const menuItems = [];

        if (canEdit) {
          menuItems.push({
            label: t("actions.edit"),
            icon: <IconEdit size={14} />,
            onClick: () => onOpenEdit(role),
            ariaLabel: t("actions.editRole"),
          });
        }

        if (canDelete) {
          menuItems.push({
            label: t("actions.delete"),
            icon: <IconTrash size={14} />,
            onClick: () => onDelete(role),
            ariaLabel: t("actions.deleteRole"),
          });
        }

        // Don't render if no actions or view permission available
        if (!canAssignPermissions && menuItems.length === 0) {
          return null;
        }

        return (
          <div className="flex items-center justify-end gap-2">
            {/* View Button */}
            {canAssignPermissions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewPermissions(role)}
                startIcon={<IconEye size={16} />}
              >
                {t("actions.view")}
              </Button>
            )}

            {/* Actions Menu */}
            {menuItems.length > 0 && (
              <DropdownMenu
                align="right"
                portal
                trigger={({ toggle }) => (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[var(--text-muted)] hover:text-[var(--text)]"
                    onClick={toggle}
                    aria-label="Open actions menu"
                    aria-haspopup="menu"
                  >
                    <IconDotsVertical size={16} />
                  </Button>
                )}
                items={menuItems}
              />
            )}
          </div>
        );
      },
      align: "right",
    },
  ];

  const filterFields: FilterField[] = [
    {
      name: "name",
      label: t("filters.name"),
      type: "text",
      placeholder: t("filters.searchName"),
    },
    {
      name: "guard_name",
      label: t("filters.guardName"),
      type: "text",
      placeholder: t("filters.searchGuardName"),
    },
    {
      name: "created_from",
      label: t("filters.createdFrom"),
      type: "date",
      placeholder: t("filters.selectCreatedFrom"),
    },
    {
      name: "created_to",
      label: t("filters.createdTo"),
      type: "date",
      placeholder: t("filters.selectCreatedTo"),
    },
  ];

  const tableData = Array.isArray(data?.data) ? (data!.data as RoleRow[]) : [];

  return (
    <Table<RoleRow>
      data={tableData}
      columns={columns}
      // Loading state
      loading={loading}
      skeletonRowCount={skeletonRowCount || 10}
      // Filter
      showFilter
      filterFields={filterFields}
      filterDefaultValues={filters}
      onFilter={(f) => {
        onFilterChange({
          name: (f.name as string)?.trim() || undefined,
          guard_name: (f.guard_name as string)?.trim() || undefined,
          created_from: f.created_from
            ? new Date(f.created_from as Date).toISOString().split("T")[0]
            : undefined,
          created_to: f.created_to
            ? new Date(f.created_to as Date).toISOString().split("T")[0]
            : undefined,
        });
      }}
      onResetFilters={onResetFilters}
      filterButtonLabel={t("actions.filter")}
      resetButtonLabel={t("actions.reset")}
      // Pagination
      showPagination={Boolean(data && data.last_page > 1)}
      currentPage={data?.current_page || page}
      totalPages={data?.last_page || 1}
      pageSize={data?.per_page || pageCount}
      totalItems={data?.total || 0}
      onPageChange={(p) => onPageChange(p)}
      paginationTranslations={{
        showing: tCommon("Pagination.showing"),
        to: tCommon("Pagination.to"),
        of: tCommon("Pagination.of"),
        results: tCommon("Pagination.results"),
        previous: tCommon("Pagination.previous"),
        next: tCommon("Pagination.next"),
        total: tCommon("Pagination.total"),
      }}
      emptyMessage={t("emptyMessage")}
    />
  );
}
