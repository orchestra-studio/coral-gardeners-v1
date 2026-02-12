/**
 * Security Types
 * TypeScript interfaces for security/password management
 */

// Password change form data
export interface SecurityFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Password change request payload
export interface PasswordChangeRequest {
    current_password: string;
    password: string;
    password_confirmation: string;
}

// Password change response
export interface PasswordChangeResponse {
    success: boolean;
    message: string;
    data?: unknown;
}