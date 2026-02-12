/**
 * Custom hooks for Admin Management module
 */

import { useMemo, useState } from "react";
import type { AdminsListParams } from "@/lib/api/types";
import { TableFilterField as FilterField } from "@/components/Table";

/**
 * Hook for managing admins table state and filters
 */
export const useAdminsTable = () => {
    const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    // Build API filters
    const apiFilters: AdminsListParams = useMemo(() => {
        const filters: AdminsListParams = {
            page: currentPage,
            page_count: pageSize,
        };

        // Add filter values (name field handles search functionality)
        if (filterValues.search && String(filterValues.search).trim()) {
            filters.name = String(filterValues.search);
        }

        if (filterValues.email) {
            filters.email = String(filterValues.email);
        }
        if (filterValues.phone) {
            filters.phone = String(filterValues.phone);
        }
        if (filterValues.name) {
            filters.name = String(filterValues.name);
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
export const useAdminsFilterFields = (t?: (key: string) => string): FilterField[] => {
    return useMemo(() => {
        return [
            {
                name: "search",
                label: t ? t("table.filters.searchLabel") : "Search",
                type: "search",
                placeholder: t ? t("table.filters.search") : "Search admins...",
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
                name: "name",
                label: t ? t("table.filters.name") : "Name",
                type: "text",
                placeholder: t ? t("table.filters.searchName") : "Search by first/last name",
            },
        ];
    }, [t]);
};
