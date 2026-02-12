"use client";

import React from "react";
import Table, {
  type Column as TableColumn,
  type TableFilterField as FilterField,
} from "@/components/Table";
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useTranslations, useLocale } from "next-intl";
import { usePermission } from "@/hooks/permissions";
import { InlineEdit } from "@/components/ui/InlineEdit";
import type { AppSetting } from "@/services/appSettings";

export type AppSettingRow = AppSetting & Record<string, unknown>;

export interface AppSettingsTableProps {
  data: AppSetting[] | null;
  loading?: boolean;
  editingId: number | null;
  onEdit: (setting: AppSettingRow) => void;
  onSave: (setting: AppSettingRow, value: string) => void;
  onCancel: () => void;
  onDelete?: (setting: AppSettingRow) => void;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  // Filters
  onFiltersChange?: (filters: Record<string, unknown>) => void;
  onResetFilters?: () => void;
}

export default function AppSettingsTable({
  data,
  loading = false,
  editingId,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onFiltersChange,
  onResetFilters,
}: AppSettingsTableProps) {
  const t = useTranslations("dashboard/settings/appsettings.table");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "ar" | "en";
  const { hasPermission } = usePermission();

  // Permission check
  const canEdit = hasPermission("settings.edit");

  // Build columns array conditionally
  const columns: TableColumn<AppSettingRow>[] = [
    {
      header: t("headers.name"),
      accessor: (setting: AppSettingRow) => (
        <div className="min-w-[200px] max-w-md">
          <div className="font-medium text-[var(--text)]">
            {setting.display_name
              ? setting.display_name[locale] || setting.display_name.en
              : setting.key}
          </div>
          {setting.description && (
            <div className="text-xs text-[var(--text-muted)] mt-1 break-words whitespace-normal">
              {setting.description[locale] || setting.description.en}
            </div>
          )}
        </div>
      ),
      align: "left",
    },
    {
      header: t("headers.value"),
      accessor: (setting: AppSettingRow) => (
        <div className="w-full min-w-0 group">
          <InlineEdit
            value={setting.value}
            isEditing={canEdit && editingId === setting.id}
            placeholder={t("valuePlaceholder")}
            maxLength={255}
            onEdit={() => canEdit && onEdit(setting)}
            onSave={(value: string) => canEdit && onSave(setting, value)}
            onCancel={onCancel}
          />
        </div>
      ),
      align: "left",
    },
    {
      header: t("headers.category"),
      accessor: (setting: AppSettingRow) => (
        <div className="w-32">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--surface-hover)] text-[var(--primary)] capitalize">
            {setting.category}
          </span>
        </div>
      ),
      align: "left",
    },
    // Only include Actions column if user has edit permission
    ...(canEdit && onDelete
      ? [
          {
            header: t("headers.actions"),
            accessor: (setting: AppSettingRow) => {
              return (
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
                  items={[
                    {
                      label: t("actions.delete"),
                      icon: <IconTrash size={14} />,
                      onClick: () => onDelete(setting),
                      ariaLabel: t("actions.deleteSetting"),
                    },
                  ]}
                />
              );
            },
            align: "right" as const,
          },
        ]
      : []),
  ];

  const filterFields: FilterField[] = [
    {
      name: "search",
      label: t("filters.search"),
      type: "text",
      placeholder: t("filters.searchPlaceholder"),
    },
    {
      name: "category",
      label: t("filters.category"),
      type: "select",
      placeholder: t("filters.categoryPlaceholder"),
      options: [
        { label: t("categories.all"), value: "" },
        { label: t("categories.payment"), value: "payment" },
        { label: t("categories.withdrawal"), value: "withdrawal" },
        { label: t("categories.email"), value: "email" },
        { label: t("categories.general"), value: "general" },
        { label: t("categories.features"), value: "features" },
      ],
    },
  ];

  const tableData = Array.isArray(data) ? (data as AppSettingRow[]) : [];

  return (
    <div className="overflow-hidden">
      <Table<AppSettingRow>
        data={tableData}
        columns={columns}
        // Loading state
        loading={loading}
        skeletonRowCount={6}
        // Pagination
        showPagination
        currentPage={currentPage || 1}
        totalPages={totalPages || 1}
        totalItems={totalItems || 0}
        pageSize={pageSize || 10}
        onPageChange={onPageChange}
        paginationTranslations={{
          showing: tCommon("Pagination.showing"),
          to: tCommon("Pagination.to"),
          of: tCommon("Pagination.of"),
          results: tCommon("Pagination.results"),
          previous: tCommon("Pagination.previous"),
          next: tCommon("Pagination.next"),
          total: tCommon("Pagination.total"),
        }}
        // Filters
        showFilter={true}
        filterFields={filterFields}
        onFilter={onFiltersChange}
        onResetFilters={onResetFilters}
        filterButtonLabel={t("actions.filter")}
        resetButtonLabel={t("actions.reset")}
        // Empty state
        emptyMessage={t("noData")}
      />
    </div>
  );
}
