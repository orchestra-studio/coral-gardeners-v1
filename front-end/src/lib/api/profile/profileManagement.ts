/**
 * Profile Management API
 * Operations for managing admin profiles
 */

import { api, ApiResponse } from "../client";
import { ProfileData, ProfileApiResponse, PasswordChangeRequest } from "./types";

export const profileManagementApi = {
    // Get current admin profile
    get: (): Promise<ApiResponse<ProfileApiResponse>> => {
        return api.get<ProfileApiResponse>("/auth/me", { showLoading: false });
    },

    // Update admin profile
    update: (data: ProfileData): Promise<ApiResponse<ProfileApiResponse>> => {
        return api.patch<ProfileApiResponse>("/admins/profile", data);
    },

    // Change password
    changePassword: (data: PasswordChangeRequest): Promise<ApiResponse<void>> => {
        return api.patch<void>("/admins/profile/password", data);
    },
};
