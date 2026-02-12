import { ReactNode, RefObject } from "react";

export interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T, index: number) => ReactNode);
    align?: "left" | "center" | "right";
}

export interface TableFilterField {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "date" | "search";
    placeholder?: string;
    options?: { value: string | number; label: string }[];
    className?: string;
}

export interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    className?: string;
    filterContainerClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    rowClassName?: (item: T, index: number) => string;
    containerClassName?: string;
    emptyMessage?: string;

    // Loading state
    loading?: boolean; // default false
    skeletonRowCount?: number; // default 4

    // Optional filter integration
    showFilter?: boolean; // default false
    filterFields?: TableFilterField[];
    onFilter?: (filters: Record<string, unknown>) => void;
    onResetFilters?: () => void;
    filterDefaultValues?: Record<string, unknown>;
    filterButtonLabel?: string; // default "Filter"
    resetButtonLabel?: string; // default "Reset"

    // Optional pagination integration
    showPagination?: boolean; // default false
    currentPage?: number;
    totalPages?: number;
    pageSize?: number;
    totalItems?: number;
    onPageChange?: (page: number) => void;
    paginationTranslations?: {
        showing?: string;
        to?: string;
        of?: string;
        results?: string;
        previous?: string;
        total?: string;
        next?: string;
    };

    // Optional export integration
    tableRef?: RefObject<HTMLTableElement | null>;
}
