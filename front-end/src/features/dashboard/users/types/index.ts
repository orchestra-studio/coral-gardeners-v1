/**
 * Types and interfaces for Users module
 */

import type { User } from "@/services/users";

// Component Props Interfaces
export interface UserAvatarProps {
    initials: string;
    profilePicture?: string | null;
}

export interface UserNameCellProps {
    user: User;
}

export interface UserEmailCellProps {
    user: User;
}

export interface UserActionsProps {
    user: User;
    type: "all" | "deleted";
    onView?: (user: User) => void;
    onAction: (user: User) => void;
    onChangePassword?: (user: User) => void;
    onResendVerification?: (user: User) => void;
    onMarkVerified?: (user: User) => void;
    onMarkUnverified?: (user: User) => void;
    t: (key: string) => string;
}

export interface UsersContentProps {
    type: "all" | "deleted";
}

export interface UsersHeaderProps {
    actions?: React.ReactNode;
    type: "all" | "deleted";
}

export interface UsersTableProps {
    type: "all" | "deleted";
    onView?: (user: User) => void;
    onDelete?: (user: User) => void;
    onRestore?: (user: User) => void;
    onChangePassword?: (user: User) => void;
    onResendVerification?: (user: User) => void;
    onMarkVerified?: (user: User) => void;
    onMarkUnverified?: (user: User) => void;
}

export interface UserStatsProps {
    totalCount: number;
    deletedCount: number;
    unverifiedCount?: number;
    verifiedCount?: number;
    loading?: boolean;
}

// Menu Item Interface
export interface MenuItem {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

// User Table Types
export type UserTableType = "all" | "deleted";

// Status Variant Types
export type StatusVariant = "success" | "warning";

// Re-export User type for convenience
export type { User } from "@/services/users";