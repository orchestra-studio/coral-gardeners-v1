import type { StatusVariant } from "@/components/ui/Status";
import { ICONS } from "../constants/icons";
import type { UserViewComputed } from "../hooks/useUserViewData";

export interface QuickStatItem {
    id: string;
    label: string;
    value: string;
    icon: React.ReactNode;
}

export interface LayoutInfoItem {
    id: string;
    label: string;
    value: string;
    icon: React.ReactNode;
    muted?: boolean;
    helperText?: string;
    status?: {
        variant: StatusVariant;
        label: string;
    };
}

interface DataBuildersParams {
    computed: UserViewComputed;
    t: (key: string, params?: Record<string, string | number>) => string;
    formatDateTime: (value: string | null) => string;
}

export function buildQuickStats({
    computed,
    t,
}: Omit<DataBuildersParams, 'formatDateTime'>): QuickStatItem[] {
    const verificationLabel = t(computed.verification.labelKey);

    return [
        {
            id: "verification",
            label: t("view.labels.verificationStatus"),
            value: verificationLabel,
            icon: ICONS.verification(),
        },
        {
            id: "phone",
            label: t("table.columns.phone"),
            value: computed.contact.phone ?? t("view.labels.notProvided"),
            icon: ICONS.phone(),
        },
        computed.contact.countryName
            ? {
                id: "country",
                label: t("table.columns.country"),
                value: computed.contact.countryName,
                icon: ICONS.country(),
            }
            : {
                id: "location",
                label: t("table.columns.country"),
                value: t("view.labels.notProvided"),
                icon: ICONS.country(),
            },
    ];
}

export function buildContactItems({
    computed,
    t,
    formatDateTime,
}: DataBuildersParams): LayoutInfoItem[] {
    const verificationLabel = t(computed.verification.labelKey);

    return [
        {
            id: "email",
            label: t("table.columns.email"),
            value: computed.contact.email,
            icon: ICONS.email(),
            status: {
                variant: computed.verification.statusVariant,
                label: verificationLabel,
            },
            helperText: computed.verification.isVerified
                ? t("view.labels.verifiedOn", {
                    date: formatDateTime(computed.timeline.verifiedAt),
                })
                : undefined,
        },
        {
            id: "phone",
            label: t("table.columns.phone"),
            value: computed.contact.phone ?? t("view.labels.notProvided"),
            icon: ICONS.phone(),
            muted: !computed.contact.phone,
        },
        computed.contact.countryName
            ? {
                id: "country",
                label: t("table.columns.country"),
                value: computed.contact.countryName,
                icon: ICONS.country(),
                helperText: computed.contact.countryCode
                    ? t("view.labels.countryCode", {
                        code: computed.contact.countryCode,
                    })
                    : undefined,
            }
            : null,
    ].filter(Boolean) as LayoutInfoItem[];
}

export function buildAccountItems({
    computed,
    t,
    formatDateTime,
}: DataBuildersParams): LayoutInfoItem[] {
    return [
        {
            id: "user-id",
            label: t("view.labels.userId"),
            value: `#${computed.identity.id}`,
            icon: ICONS.userId(),
        },
        {
            id: "username",
            label: t("view.labels.username"),
            value: `@${computed.identity.username}`,
            icon: ICONS.username(),
        },
        {
            id: "created",
            label: t("view.labels.createdAt"),
            value: formatDateTime(computed.timeline.createdAt),
            icon: ICONS.createdAt(),
        },
        {
            id: "updated",
            label: t("view.labels.updatedAt"),
            value: formatDateTime(computed.timeline.updatedAt),
            icon: ICONS.updatedAt(),
        },
        computed.timeline.deletedAt
            ? {
                id: "deleted",
                label: t("view.labels.deletedAt"),
                value: formatDateTime(computed.timeline.deletedAt),
                icon: ICONS.deletedAt(),
                status: {
                    variant: "error" as StatusVariant,
                    label: t("view.labels.deletedStatus"),
                },
            }
            : null,
    ].filter(Boolean) as LayoutInfoItem[];
}