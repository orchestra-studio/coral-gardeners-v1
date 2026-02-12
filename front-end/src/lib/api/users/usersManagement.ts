/**
 * Users Management API
 * CRUD operations for users
 */

import { api, ApiResponse } from "../client";
import {
    UsersListParams,
    UsersPaginatedResponse,
    ChangePasswordPayload,
    DeleteUserResponse,
    CreateUserPayload,
} from "./types";
import type { User } from "./types";

export const usersManagementApi = {
    // List all users with optional filters
    list: async (params?: UsersListParams): Promise<ApiResponse<UsersPaginatedResponse['data']>> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.page_count) queryParams.append("page_count", params.page_count.toString());
        if (params?.order) queryParams.append("order", params.order);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.email) queryParams.append("email", params.email);
        if (params?.from_date) queryParams.append("from_date", params.from_date);
        if (params?.to_date) queryParams.append("to_date", params.to_date);
        if (params?.phone) queryParams.append("phone", params.phone);
        if (params?.country_id) queryParams.append("country_id", params.country_id.toString());
        if (params?.username) queryParams.append("username", params.username);
        if (params?.first_name) queryParams.append("first_name", params.first_name);
        if (params?.last_name) queryParams.append("last_name", params.last_name);

        const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        const response = await api.get<UsersPaginatedResponse['data']>(url, { showLoading: false });

        // Return full pagination metadata
        return response;
    },

    // List deleted users
    listDeleted: async (params?: UsersListParams): Promise<ApiResponse<UsersPaginatedResponse['data']>> => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.page_count) queryParams.append("page_count", params.page_count.toString());
        if (params?.order) queryParams.append("order", params.order);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.email) queryParams.append("email", params.email);
        if (params?.phone) queryParams.append("phone", params.phone);
        if (params?.username) queryParams.append("username", params.username);
        if (params?.first_name) queryParams.append("first_name", params.first_name);
        if (params?.last_name) queryParams.append("last_name", params.last_name);
        if (params?.from_date) queryParams.append("from_date", params.from_date);
        if (params?.to_date) queryParams.append("to_date", params.to_date);

        const url = `/users/deleted${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
        const response = await api.get<UsersPaginatedResponse['data']>(url, { showLoading: false });

        // Return full pagination metadata
        return response;
    },

    // Get users statistics
    statistics: (): Promise<ApiResponse<{
        total: number;
        deleted: number;
        verified: number;
        unverified: number;
    }>> => {
        return api.get(`/users/statistic`, { showLoading: false });
    },

    // Get a single user by username
    getByUsername: (username: string): Promise<ApiResponse<User>> => {
        return api.get<User>(`/users/${username}`);
    },

    // Create a new user
    create: (data: CreateUserPayload): Promise<ApiResponse<User>> => {
        return api.post<User>('/users', data);
    },

    // Get detailed user information by username
    getUserDetails: (username: string): Promise<ApiResponse<User>> => {
        return api.get<User>(`/users/${username}`);
    },

    // Delete a user by username
    delete: (username: string): Promise<ApiResponse<DeleteUserResponse>> => {
        return api.delete<DeleteUserResponse>(`/users/${username}`);
    },

    // Change user password
    changePassword: (username: string, data: ChangePasswordPayload): Promise<ApiResponse<void>> => {
        return api.patch<void>(`/users/${username}/change-password`, data);
    },

    // Resend verification email
    resendVerificationEmail: (username: string): Promise<ApiResponse<void>> => {
        return api.post<void>(`/users/${username}/resend-verification-email`);
    },

    // Mark user email as verified
    markEmailVerified: (username: string): Promise<ApiResponse<void>> => {
        return api.post<void>(`/users/${username}/make-verified`);
    },

    // Mark user email as unverified
    markEmailUnverified: (username: string): Promise<ApiResponse<void>> => {
        return api.post<void>(`/users/${username}/make-unverified`);
    },

    // Restore a deleted user
    restore: (username: string): Promise<ApiResponse<void>> => {
        return api.post<void>(`/users/deleted/${username}/restore`);
    },
};

// Export individual functions for convenience
export const {
    list: listUsers,
    listDeleted: listDeletedUsers,
    statistics: getUsersStatistics,
    getByUsername: getUserByUsername,
    create: createUser,
    getUserDetails: getUserDetailsByUsername,
    delete: deleteUser,
    changePassword: changeUserPassword,
    resendVerificationEmail: resendUserVerificationEmail,
    markEmailVerified: markUserEmailVerified,
    markEmailUnverified: markUserEmailUnverified,
    restore: restoreUser,
} = usersManagementApi;