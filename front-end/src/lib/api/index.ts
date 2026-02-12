// Main API exports
export { api, apiClient, setLoadingCallbacks, detectCurrentLocale } from "./client";
export type { ApiResponse, ApiRequestConfig } from "./client";

// Admins API (Admins Management Only)
export { adminApi } from "./admins";

// Roles API
export { rolesApi } from "./roles";

// Profile API
export { profileApi } from "./profile";

// App Settings API
export { appSettingsApi } from "./appSettings";

// Projects API
export { projectsApi } from "./projects";

// Users API
export { usersApi } from "./users";

// Auth API
export { authApi } from "./auth";

// AI Chat API
export { chatSessionsApi, aiChatConfigApi } from "./aiChat";
export type {
    ChatSession,
    ChatSessionWithMessages,
    ChatConfig,
    LLMModel,
    LLMProvider,
    ChatMessage,
    StreamChatParams,
    CreateSessionPayload,
    UpdateSessionPayload,
} from "./aiChat";

// Types
export type {
    Role,
    Permission,
    AdminUser,
    PaginatedResponse,
    AdminsListResponse,
    CreateAdminRequest,
    UpdateAdminRequest,
    UpdateAdminRolesRequest,
    AdminsListParams,
} from "./types";

// Auth Types
export type {
    LoginRequest,
    LoginResponse,
    AuthSession,
    AuthUser as CustomAuthUser,
} from "./auth";