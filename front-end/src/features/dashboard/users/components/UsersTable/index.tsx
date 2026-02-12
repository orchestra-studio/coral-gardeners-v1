"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import Table from "@/components/Table";
import { createUserColumns } from "../UserColumns";
import type { User } from "@/services/users";
import {
  useUsers,
  useDeletedUsers,
  useUsersStatistics,
} from "@/services/users/hooks/useUsers";
import { useUsersTable, useUsersFilterFields } from "../../hooks";
import UserStats from "../UserStats";

interface UsersTableProps {
  type: "all" | "deleted";
  onView?: (user: User) => void;
  onDelete?: (user: User) => void;
  onRestore?: (user: User) => void;
  onChangePassword?: (user: User) => void;
  onResendVerification?: (user: User) => void;
  onMarkVerified?: (user: User) => void;
  onMarkUnverified?: (user: User) => void;
}

export default function UsersTable({
  type,
  onView,
  onDelete,
  onRestore,
  onChangePassword,
  onResendVerification,
  onMarkVerified,
  onMarkUnverified,
}: UsersTableProps) {
  const t = useTranslations("dashboard/users");
  const tCommon = useTranslations("common");

  // Use organized hooks
  const {
    filterValues,
    currentPage,
    pageSize,
    apiFilters,
    setCurrentPage,
    onFilter,
    onResetFilters,
  } = useUsersTable();

  const filterFields = useUsersFilterFields(type, t);

  // Fetch users statistics (only for "all" type)
  const { data: statsData, isLoading: statsLoading } = useUsersStatistics();

  // Fetch users data based on type with API filters
  const { data: allUsersData, isFetching: allFetching } = useUsers(
    apiFilters,
    type === "all"
  );
  const { data: deletedUsersData, isFetching: deletedFetching } =
    useDeletedUsers(apiFilters, type === "deleted");

  const usersData = type === "all" ? allUsersData : deletedUsersData;
  const isFetching = type === "all" ? allFetching : deletedFetching;

  // Use API data directly (pagination handled by API)
  const displayData = useMemo(() => {
    return usersData?.users || [];
  }, [usersData]);

  // Pagination info from API
  const totalItems = usersData?.pagination.total || 0;
  const totalPages = usersData?.pagination.totalPages || 1;

  const handleDelete = useMemo(
    () => (user: User) => {
      if (onDelete) {
        onDelete(user);
      }
    },
    [onDelete]
  );

  const handleRestore = useMemo(
    () => (user: User) => {
      if (onRestore) {
        onRestore(user);
      }
    },
    [onRestore]
  );

  // Create columns with handlers based on type
  const columns = useMemo(
    () =>
      createUserColumns(
        type,
        type === "all" ? handleDelete : handleRestore,
        t,
        onView,
        onChangePassword,
        onResendVerification,
        onMarkVerified,
        onMarkUnverified
      ),
    [
      onView,
      handleDelete,
      handleRestore,
      type,
      t,
      onChangePassword,
      onResendVerification,
      onMarkVerified,
      onMarkUnverified,
    ]
  );

  return (
    <div className="space-y-4">
      <UserStats
        totalCount={Number(statsData?.total) || 0}
        deletedCount={Number(statsData?.deleted) || 0}
        unverifiedCount={Number(statsData?.unverified) || 0}
        verifiedCount={Number(statsData?.verified) || 0}
        loading={statsLoading}
      />
      <Table<User>
        data={displayData}
        columns={columns}
        loading={isFetching}
        skeletonRowCount={10}
        emptyMessage={t("table.empty.description")}
        // Filter with integrated search bar - shown for both types
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
