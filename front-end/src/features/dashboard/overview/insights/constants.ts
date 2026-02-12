import {
    IconAlertTriangle,
    IconBulb,
    IconClock,
    IconTarget,
    IconTrendingUp,
    IconUsers,
} from "@tabler/icons-react";

export interface RingConfig {
    key: string;
    value: number;
    max: number;
    color: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export interface InsightConfig {
    key: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
}

export interface InsightData {
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    title: string;
    description: string;
}

export const RINGS_CONFIG = {
    performance: [
        {
            key: "taskCompletion",
            value: 85,
            max: 100,
            color: "url(#blueGlassGradient)",
            icon: IconTarget,
        },
        {
            key: "userEngagement",
            value: 84,
            max: 100,
            color: "url(#greenGlassGradient)",
            icon: IconUsers,
        },
        {
            key: "responseTime",
            value: 78,
            max: 100,
            color: "url(#grayGlassGradient)",
            icon: IconClock,
        },
    ] as RingConfig[],
    trends: [
        {
            key: "userGrowth",
            value: 92,
            max: 100,
            color: "url(#greenGlassGradient)",
            icon: IconTrendingUp,
        },
        {
            key: "engagementRate",
            value: 88,
            max: 100,
            color: "url(#blueGlassGradient)",
            icon: IconUsers,
        },
        {
            key: "retention",
            value: 75,
            max: 100,
            color: "url(#grayGlassGradient)",
            icon: IconTarget,
        },
    ] as RingConfig[],
    alerts: [
        {
            key: "storageUsage",
            value: 85,
            max: 100,
            color: "var(--accent-4)",
            icon: IconAlertTriangle,
        },
        {
            key: "responseTime",
            value: 68,
            max: 100,
            color: "var(--accent-5)",
            icon: IconClock,
        },
        {
            key: "systemLoad",
            value: 72,
            max: 100,
            color: "var(--accent-3)",
            icon: IconTarget,
        },
    ] as RingConfig[],
};

export const INSIGHT_CONFIG = {
    performance: {
        key: "optimizeTaskCompletion",
        icon: IconBulb,
        iconColor: "text-blue-400",
    } as InsightConfig,
    trends: {
        key: "growthTrajectory",
        icon: IconTrendingUp,
        iconColor: "text-emerald-400",
    } as InsightConfig,
    alerts: {
        key: "storageCapacity",
        icon: IconAlertTriangle,
        iconColor: "text-[var(--accent-4)]",
    } as InsightConfig,
};

export const CHART_CONFIG = {
    size: 170,
    strokeWidth: 10,
    showLabels: true,
    showPercentage: true,
};
