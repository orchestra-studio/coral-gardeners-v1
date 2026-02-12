/**
 * Custom hooks for Users module
 */

import { useMemo, useState } from "react";
import type { User, UsersFilters } from "@/services/users";
import { TableFilterField as FilterField } from "@/components/Table";

/**
 * Hook for managing users table state and filters
 */
export const useUsersTable = () => {
    const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    // Build API filters
    const apiFilters: UsersFilters = useMemo(() => {
        const filters: UsersFilters = {
            page: currentPage,
            page_count: pageSize,
            order: "desc",
        };

        // Add search query
        if (filterValues.search && String(filterValues.search).trim()) {
            filters.search = String(filterValues.search);
        }

        // Add filter values
        if (filterValues.email) {
            filters.email = String(filterValues.email);
        }
        if (filterValues.phone) {
            filters.phone = String(filterValues.phone);
        }
        if (filterValues.country_id) {
            filters.country_id = Number(filterValues.country_id);
        }
        if (filterValues.username) {
            filters.username = String(filterValues.username);
        }
        if (filterValues.first_name) {
            filters.first_name = String(filterValues.first_name);
        }
        if (filterValues.last_name) {
            filters.last_name = String(filterValues.last_name);
        }
        if (filterValues.from_date) {
            filters.from_date = String(filterValues.from_date);
        }
        if (filterValues.to_date) {
            filters.to_date = String(filterValues.to_date);
        }

        return filters;
    }, [filterValues, currentPage, pageSize]);

    // Event handlers
    const onFilter = (filters: Record<string, unknown>) => {
        setFilterValues(filters);
        setCurrentPage(1);
    };

    const onResetFilters = () => {
        setFilterValues({});
        setCurrentPage(1);
    };

    return {
        filterValues,
        currentPage,
        pageSize,
        apiFilters,
        setCurrentPage,
        onFilter,
        onResetFilters,
    };
};

/**
 * Hook for generating filter fields configuration
 */
export const useUsersFilterFields = (type: "all" | "deleted", t?: (key: string) => string): FilterField[] => {
    return useMemo(() => {
        // Return filter fields for both "all" and "deleted" types
        return [
            {
                name: "username",
                label: t ? t("table.filters.username") : "Username",
                type: "text",
                placeholder: t ? t("table.filters.searchUsername") : "Filter by username",
            },
            {
                name: "email",
                label: t ? t("table.filters.email") : "Email",
                type: "text",
                placeholder: t ? t("table.filters.searchEmail") : "Filter by email",
            },
            {
                name: "phone",
                label: t ? t("table.filters.phone") : "Phone",
                type: "text",
                placeholder: t ? t("table.filters.searchPhone") : "Filter by phone",
            },
            {
                name: "first_name",
                label: t ? t("table.filters.firstName") : "First Name",
                type: "text",
                placeholder: t ? t("table.filters.searchFirstName") : "Filter by first name",
            },
            {
                name: "last_name",
                label: t ? t("table.filters.lastName") : "Last Name",
                type: "text",
                placeholder: t ? t("table.filters.searchLastName") : "Filter by last name",
            },
            {
                name: "from_date",
                label: t ? t("table.filters.fromDate") : "From Date",
                type: "date",
                placeholder: t ? t("table.filters.fromDatePlaceholder") : "YYYY-MM-DD",
            },
            {
                name: "to_date",
                label: t ? t("table.filters.toDate") : "To Date",
                type: "date",
                placeholder: t ? t("table.filters.toDatePlaceholder") : "YYYY-MM-DD",
            },
        ];
    }, [t]);
};

/**
 * Hook for managing user action handlers
 */
export const useUserActions = (
    type: "all" | "deleted",
    onEdit: (user: User) => void,
    onDelete?: (user: User) => void,
    onRestore?: (user: User) => void
) => {
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

    return {
        handleEdit: onEdit,
        handleAction: type === "all" ? handleDelete : handleRestore,
    };
};

/**
 * Hook for processing table data
 */
export const useUsersTableData = (users: User[] | undefined) => {
    return useMemo(() => {
        return users || [];
    }, [users]);
};

/**
 * Hook for calculating pagination info
 */
export const useUsersPagination = (displayData: User[], pageSize: number) => {
    return useMemo(() => {
        const totalItems = displayData.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return { totalItems, totalPages };
    }, [displayData.length, pageSize]);
};