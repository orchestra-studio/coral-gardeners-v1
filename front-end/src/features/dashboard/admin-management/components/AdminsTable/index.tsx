"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import Table from "@/components/Table";
import { createAdminColumns } from "../AdminColumns";
import type { AdminUser } from "@/services/adminManagement";
import { useAdminsList, useAdminsStatistics } from "@/services/adminManagement";
import { useAdminsTable, useAdminsFilterFields } from "../../hooks";
import AdminStats from "../AdminStats";

interface AdminsTableProps {
  onView?: (admin: AdminUser) => void;
  onEdit?: (admin: AdminUser) => void;
  onDelete?: (admin: AdminUser) => void;
  onAssignRoles?: (admin: AdminUser) => void;
}

export default function AdminsTable({
  onView,
  onEdit,
  onDelete,
  onAssignRoles,
}: AdminsTableProps) {
  const t = useTranslations("dashboard/settings/adminmanagement");
  const tCommon = useTranslations("common");

  // Use organized hooks for filters and pagination
  const {
    filterValues,
    currentPage,
    pageSize,
    apiFilters,
    setCurrentPage,
    onFilter,
    onResetFilters,
  } = useAdminsTable();

  const filterFields = useAdminsFilterFields(t);

  // Fetch admins data with API filters
  const { data: adminsData, isFetching } = useAdminsList(apiFilters);

  // Fetch admin statistics
  const { data: statsData, isLoading: statsLoading } = useAdminsStatistics();

  // Use API data directly
  const displayData = useMemo(() => {
    return adminsData?.data || [];
  }, [adminsData]);

  // Pagination info from API
  const totalItems = adminsData?.total || 0;
  const totalPages = adminsData?.totalPages || 1;

  // Create columns with handlers
  const columns = useMemo(
    () => createAdminColumns(t, onView, onEdit, onDelete, onAssignRoles),
    [t, onView, onEdit, onDelete, onAssignRoles]
  );

  return (
    <div className="space-y-4">
      <AdminStats statsData={statsData} loading={statsLoading} />

      <Table<AdminUser>
        data={displayData}
        columns={columns}
        loading={isFetching}
        skeletonRowCount={10}
        emptyMessage={t("table.empty.description")}
        // Filter with integrated search bar
        showFilter
        filterFields={filterFields}
        filterDefaultValues={filterValues}
        onFilter={onFilter}
        onResetFilters={onResetFilters}
        filterButtonLabel={tCommon("Filter.filterButton")}
        resetButtonLabel={tCommon("Filter.resetButton")}
        // Pagination
        showPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        paginationTranslations={{
          showing: tCommon("Pagination.showing"),
          to: tCommon("Pagination.to"),
          of: tCommon("Pagination.of"),
          results: tCommon("Pagination.results"),
          previous: tCommon("Pagination.previous"),
          next: tCommon("Pagination.next"),
          total: tCommon("Pagination.total"),
        }}
      />
    </div>
  );
}
