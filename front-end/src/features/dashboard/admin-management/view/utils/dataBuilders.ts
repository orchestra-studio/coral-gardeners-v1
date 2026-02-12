import { useCallback } from "react";
import type { AdminUser } from "@/lib/api/types";
import type { AdminComputedData } from "../hooks/useAdminViewData";
import { ADMIN_ICONS } from "../constants/icons";
import { useLocaleDateFormatter } from "@/hooks/formatting/useLocaleDateFormatter";

// Date formatter utility
export function useDateTimeFormatter() {
    const { formatDate } = useLocaleDateFormatter({
        options: ADMIN_DATE_TIME_OPTIONS,
        fallback: DEFAULT_FALLBACK_LABEL,
    });

    const formatDateTime = useCallback(
        (value: string | null, fallback = DEFAULT_FALLBACK_LABEL) =>
            formatDate(value, fallback),
        [formatDate]
    );

    return { formatDateTime };
}

const ADMIN_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
};

const DEFAULT_FALLBACK_LABEL = "Not provided";

interface BuilderParams {
    computed?: AdminComputedData | null;
    admin?: AdminUser;
    t: (key: string) => string;
    formatDateTime?: (value: string | null) => string;
}

// Contact items builder
export function buildAdminContactItems({ admin, t }: BuilderParams) {
    if (!admin) return [];

    return [
        {
            label: t("view.labels.email"),
            value: admin.email || t("view.labels.notProvided"),
            icon: ADMIN_ICONS.email(),
        },
        {
            label: t("view.labels.phone"),
            value: admin.phone || t("view.labels.notProvided"),
            icon: ADMIN_ICONS.phone(),
        },
        {
            label: t("view.labels.country"),
            value: admin.country?.name?.en || t("view.labels.notProvided"),
            icon: ADMIN_ICONS.country(),
        },
    ];
}

// Account items builder
export function buildAdminAccountItems({ admin, t, formatDateTime }: BuilderParams) {
    if (!admin || !formatDateTime) return [];

    return [
        {
            label: t("view.labels.username"),
            value: admin.username || t("view.labels.notProvided"),
            icon: ADMIN_ICONS.username(),
        },
        {
            label: t("view.labels.createdAt"),
            value: formatDateTime(admin.created_at),
            icon: ADMIN_ICONS.createdAt(),
        },
        {
            label: t("view.labels.updatedAt"),
            value: formatDateTime(admin.updated_at),
            icon: ADMIN_ICONS.updatedAt(),
        },
        {
            label: t("view.labels.roles"),
            value: admin.roles?.map((role) => role.name).join(", ") || t("view.labels.noRoles"),
            icon: ADMIN_ICONS.roles(),
        },
    ];
}