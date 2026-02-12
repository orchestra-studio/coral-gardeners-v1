import { useMemo } from "react";
import { useUserDetails } from "@/services/users";
import type { User } from "@/services/users";
import type { StatusVariant } from "@/components/ui/Status";
import { useLocale } from "@/hooks/locale/useLocale";
import {
    getUserFullName,
    getUserInitials,
    getStatusVariant,
    isUserVerified,
} from "../../utils";

type Nullable<T> = T | null;

export interface UserVerificationMeta {
    isVerified: boolean;
    statusVariant: StatusVariant;
    labelKey: string;
    descriptionKey: string;
}

export interface UserTimelineMeta {
    createdAt: string;
    updatedAt: string;
    verifiedAt: Nullable<string>;
    deletedAt: Nullable<string>;
}

export interface UserContactMeta {
    email: string;
    phone: Nullable<string>;
    countryName: Nullable<string>;
    countryCode: Nullable<string>;
}

export interface UserIdentityMeta {
    id: number;
    username: string;
    fullName: string;
    displayName: string;
    initials: string;
    avatarUrl: Nullable<string>;
}

export interface UserViewComputed {
    identity: UserIdentityMeta;
    verification: UserVerificationMeta;
    contact: UserContactMeta;
    timeline: UserTimelineMeta;
    raw: User;
}

export interface UseUserViewDataResult {
    user: Nullable<User>;
    isLoading: boolean;
    isFetching: boolean;
    error: unknown;
    computed: Nullable<UserViewComputed>;
    refetch: () => Promise<unknown>;
}

const VERIFIED_LABEL_KEY = "table.verified";
const UNVERIFIED_LABEL_KEY = "table.unverified";
const VERIFIED_DESCRIPTION_KEY = "status.verified";

export function useUserViewData(username: string): UseUserViewDataResult {
    const query = useUserDetails(username);
    const locale = useLocale();

    const computed = useMemo<UserViewComputed | null>(() => {
        if (!query.data) {
            return null;
        }

        const user = query.data as unknown as User;
        const fullName = getUserFullName(user);
        const initials = getUserInitials(user).toUpperCase();
        const displayName = fullName || user.username;
        const avatarUrl = user.profile_picture ?? null;
        const isVerified = isUserVerified(user);
        const statusVariant = getStatusVariant(isVerified);

        // Extract localized country name if available
        const countryName = user.country?.name
            ? (user.country.name[locale] ||
                user.country.name['en'] ||
                Object.values(user.country.name)[0] ||
                null)
            : null;

        return {
            identity: {
                id: user.id,
                username: user.username,
                fullName,
                displayName,
                initials,
                avatarUrl,
            },
            verification: {
                isVerified,
                statusVariant,
                labelKey: isVerified ? VERIFIED_LABEL_KEY : UNVERIFIED_LABEL_KEY,
                descriptionKey: isVerified
                    ? VERIFIED_DESCRIPTION_KEY
                    : "", // No description for unverified users
            },
            contact: {
                email: user.email,
                phone: user.phone ?? null,
                countryName,
                countryCode: user.country?.code ?? null,
            },
            timeline: {
                createdAt: user.created_at,
                updatedAt: user.updated_at,
                verifiedAt: user.email_verified_at ?? null,
                deletedAt: user.deleted_at ?? null,
            },
            raw: user,
        };
    }, [query.data, locale]);

    return {
        user: (query.data as unknown as User) ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error,
        computed,
        refetch: query.refetch,
    };
}
