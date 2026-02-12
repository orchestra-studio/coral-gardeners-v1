import { api, ApiResponse } from "./client";
import { clearAuthData } from "../auth/utils";

// Authentication types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string; // NestJS returns 'access_token'
    token_type: string;
    expires_in: string;
    admin: {
        id: number;
        email: string;
        username: string;
        first_name: string;
        last_name: string;
        full_name: string;
        profile_picture: string | null;
        roles: Array<{
            id: number;
            name: string;
            guard_name: string;
        }>;
        permissions: string[];
    };
}

export interface AuthUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    profile_picture?: string | null;
    country_id?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    roles?: Array<{
        id: number;
        name: string;
        guard_name: string;
    }>;
    permissions?: string[];
    // Add computed properties for compatibility
    name?: string;
    avatar?: string | null;
    full_name?: string;
}

export interface AuthSession {
    accessToken: string;
    user: AuthUser;
    expiresAt?: number;
}

// Authentication API endpoints
export const authApi = {
    // Login admin user
    login: async (credentials: LoginRequest): Promise<ApiResponse<{ token: string; user: AuthUser }>> => {
        try {
            const response = await api.post<LoginResponse>("/auth/login", credentials);

            if (response.success && response.data) {
                // Transform NestJS response to match frontend expectations
                const { access_token, admin } = response.data;
                return {
                    success: true,
                    data: {
                        token: access_token,
                        user: {
                            id: admin.id,
                            username: admin.username,
                            first_name: admin.first_name,
                            last_name: admin.last_name,
                            email: admin.email,
                            name: admin.full_name,
                            full_name: admin.full_name,
                            avatar: admin.profile_picture,
                            profile_picture: admin.profile_picture,
                            roles: admin.roles,
                            permissions: admin.permissions,
                        },
                    },
                };
            }

            return {
                success: false,
                message: response.message || "Login failed",
                errors: response.errors,
            };
        } catch (error) {
            const parsedError = error as Error & { errors?: Record<string, string[]> };

            return {
                success: false,
                message: parsedError.message || "Login failed",
                errors: parsedError.errors,
            };
        }
    },

    // Refresh current user permissions
    refreshPermissions: async (): Promise<ApiResponse<AuthUser>> => {
        try {
            const response = await api.get<{
                id: number;
                email: string;
                username: string;
                first_name: string;
                last_name: string;
                full_name: string;
                profile_picture: string | null;
                roles: Array<{
                    id: number;
                    name: string;
                    guard_name: string;
                }>;
                permissions: string[];
            }>("/auth/me", { showLoading: false });

            if (response.success && response.data) {
                // Transform to AuthUser format
                const user: AuthUser = {
                    id: response.data.id,
                    username: response.data.username,
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    email: response.data.email,
                    name: response.data.full_name,
                    full_name: response.data.full_name,
                    avatar: response.data.profile_picture,
                    profile_picture: response.data.profile_picture,
                    roles: response.data.roles,
                    permissions: response.data.permissions,
                };

                return {
                    success: true,
                    data: user,
                };
            }

            return {
                success: false,
                message: response.message || "Failed to refresh permissions",
            };
        } catch (error) {
            const parsedError = error as Error;
            return {
                success: false,
                message: parsedError.message || "Failed to refresh permissions",
            };
        }
    },

    // Logout admin user  
    logout: async (): Promise<ApiResponse<void>> => {
        try {
            // Just clear local storage (NestJS uses stateless JWT, no logout endpoint needed)
            if (typeof window !== "undefined") {
                clearAuthData();
            }
            return { success: true };
        } catch {
            // Even if something fails, clear local storage
            if (typeof window !== "undefined") {
                clearAuthData();
            }
            return { success: true };
        }
    },

    // Get current session from localStorage
    getSession: (): Promise<ApiResponse<AuthSession | null>> => {
        if (typeof window === "undefined") {
            return Promise.resolve({ success: true, data: null });
        }

        const token = localStorage.getItem("auth_token");
        const userStr = localStorage.getItem("auth_user");
        const sessionStr = localStorage.getItem("auth_session");

        if (!token || !userStr || !sessionStr) {
            return Promise.resolve({ success: true, data: null });
        }

        try {
            const session = JSON.parse(sessionStr) as AuthSession;

            // Check if session is expired
            if (session.expiresAt && Date.now() > session.expiresAt) {
                clearAuthData();
                return Promise.resolve({ success: true, data: null });
            }

            return Promise.resolve({ success: true, data: session });
        } catch {
            clearAuthData();
            return Promise.resolve({ success: true, data: null });
        }
    },
};

export default authApi;