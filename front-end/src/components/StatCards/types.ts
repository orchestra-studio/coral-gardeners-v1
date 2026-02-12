import { ReactNode } from "react";

export type TrendDirection = "up" | "down" | "stable";

export interface StatTrend {
    direction: TrendDirection;
    value: string;
    label?: string;
}

export interface CardTrend {
    direction: TrendDirection;
    value: string;
    directionLabel?: string;
}

export interface BaseCard {
    id: string;
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: CardTrend;
    color?: string;
}

export interface CardTranslations {
    dragHandle: string;
    trends: {
        ariaLabel: string;
    };
}

export interface StatCardData {
    id: string;
    title: string;
    value: string | number;
    icon?: ReactNode;
    trend?: StatTrend;
    color?: string;
    description?: string;
}

// Base props for StatCards
interface BaseStatCardsProps {
    /** Array of stat card data */
    data: StatCardData[];
    /** Enable drag and drop reordering (default: true on desktop, false on mobile) */
    enableDnd?: boolean;
    /** Callback when cards are reordered */
    onReorder?: (newOrder: StatCardData[]) => void;
    /** Grid column classes (default: "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4") */
    gridCols?: string;
    /** Gap classes (default: "gap-4") */
    gap?: string;
    /** Additional className for the container */
    className?: string;
    /** Enable noise effect on cards (default: false) */
    enableNoise?: boolean;
    /** Enable lighting effect on cards (default: false) */
    enableLighting?: boolean;
    /** Loading state */
    loading?: boolean;
    /** Translations for accessibility */
    translations?: {
        dragHandle?: string;
        trends?: {
            ariaLabel?: string;
        };
    };
}

// When saveOrder is true, storageKey is required
interface StatCardsPropsWithSaveOrder extends BaseStatCardsProps {
    saveOrder: true;
    /** localStorage key to persist card order - REQUIRED when saveOrder is true */
    storageKey: string;
}

// When saveOrder is false or not provided, storageKey is not allowed
interface StatCardsPropsWithoutSaveOrder extends BaseStatCardsProps {
    saveOrder?: false;
    storageKey?: never;
}

// Union type - either with saveOrder + storageKey or without
export type StatCardsProps = StatCardsPropsWithSaveOrder | StatCardsPropsWithoutSaveOrder;
