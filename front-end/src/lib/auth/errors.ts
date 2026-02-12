import { toast } from "react-toastify";
import type { AuthError } from "./types";
import { Alert } from "../../components/ui/Alert";

/**
 * 🔐 AUTHENTICATION ERROR HANDLING
 * 
 * Centralized error handling for all authentication flows.
 * 
 * 📋 CUSTOMIZATION FOR TEMPLATE BUYERS:
 * 
 * 1. CHANGE MESSAGES: Update AUTH_ERRORS object to match your brand voice
 * 2. ADD NEW PROVIDERS: Extend error code mappings in handle* functions
 * 3. CUSTOM LOGIC: Add provider-specific error handling (JWT, Firebase, etc.)
 * 4. NOTIFICATIONS: Replace toast with your preferred notification system
 * 
 * 💡 EXAMPLES FOR OTHER PROVIDERS:
 * 
 * JWT Provider:
 * - Add "TOKEN_EXPIRED", "REFRESH_FAILED" error codes
 * - Handle 401/403 HTTP status codes
 * 
 * Firebase:
 * - Add "auth/user-disabled", "auth/too-many-requests" 
 * - Handle Firebase-specific error formats
 * 
 * Auth0:
 * - Add "invalid_grant", "unauthorized" error codes
 * - Handle OAuth-specific errors
 * 
 * 🔧 ERROR CODE NORMALIZATION:
 * All error codes are normalized (lowercase, no underscores/hyphens)
 * This handles: "USER_NOT_FOUND", "user_not_found", "user-not-found" → "usernotfound"
 */

export const AUTH_ERRORS = {
    // User existence errors
    USER_ALREADY_EXISTS: "An account with this email already exists. Please try logging in instead.",
    USER_NOT_FOUND: "No account found with this email address.",

    // Authentication errors
    INVALID_CREDENTIALS: "Invalid email or password. Please check your credentials and try again.",
    EMAIL_NOT_CONFIRMED: "Please verify your email address before signing in. Check your inbox for a confirmation email.",
    WEAK_PASSWORD: "Password is too weak. Please use at least 8 characters with numbers and special characters.",

    // Rate limiting and security
    TOO_MANY_REQUESTS: "Too many attempts. Please wait a few minutes before trying again.",
    ACCOUNT_LOCKED: "Your account has been temporarily locked for security reasons.",

    // Network and system errors
    NETWORK_ERROR: "Network connection error. Please check your internet connection and try again.",
    SERVER_ERROR: "Server error occurred. Please try again later.",

    // Token and session errors
    INVALID_TOKEN: "Invalid or expired token. Please try logging in again.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",

    // Password reset errors
    RESET_TOKEN_EXPIRED: "Password reset link has expired. Please request a new one.",
    RESET_TOKEN_INVALID: "Invalid password reset link. Please request a new one.",

    // Custom API specific errors
    LOGIN_FAILED: "Login failed. Please check your credentials and try again.",
    SIGNUP_NOT_SUPPORTED: "Account registration is not available. Please contact your administrator.",
    PASSWORD_RESET_NOT_SUPPORTED: "Password reset is not available. Please contact your administrator.",

    // General errors
    UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
    PROVIDER_ERROR: "Authentication service error. Please try again later.",
} as const;

/**
 * Normalize error codes to handle different provider formats
 * Converts "USER_NOT_FOUND", "user_not_found", "user-not-found" → "usernotfound"
 */
const normalizeErrorCode = (code: string): string => {
    return code.toLowerCase().replace(/[_-]/g, '');
};

/**
 * 📝 EXAMPLE: Adding JWT Provider Support
 * 
 * Just add new cases to the switch statements:
 * 
 * case "tokenexpired":
 * case "refreshfailed":
 *   toast.error("Your session has expired. Please login again.");
 *   // Optionally redirect to login
 *   break;
 * 
 * case "unauthorized": 
 * case "accessdenied":
 *   toast.error("Access denied. Please check your permissions.");
 *   break;
 */

/**
 * Handle login-specific errors
 * @param error - The authentication error
 * @param email - User's email (for future customization like "resend confirmation to email@example.com")
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleLoginError = (error: AuthError, email?: string) => {
    const normalizedCode = normalizeErrorCode(error.code);

    switch (normalizedCode) {
        case "invalidcredentials":
        case "invalidlogincredentials":
        case "loginfailed":
            toast.error(AUTH_ERRORS.INVALID_CREDENTIALS);
            break;

        case "emailnotconfirmed":
        case "confirmationsentat":
            toast.error(AUTH_ERRORS.EMAIL_NOT_CONFIRMED);
            break;

        case "usernotfound":
            toast.error(AUTH_ERRORS.USER_NOT_FOUND);
            break;

        case "toomanyrequests":
            toast.error(AUTH_ERRORS.TOO_MANY_REQUESTS);
            break;

        case "networkerror":
            toast.error(AUTH_ERRORS.NETWORK_ERROR);
            break;

        case "signupnotsupported":
            toast.error(AUTH_ERRORS.SIGNUP_NOT_SUPPORTED);
            break;

        case "passwordresetnotsupported":
            toast.error(AUTH_ERRORS.PASSWORD_RESET_NOT_SUPPORTED);
            break;

        default:
            toast.error(error.message || AUTH_ERRORS.UNKNOWN_ERROR);
    }
};

/**
 * Handle registration-specific errors
 */
export const handleRegistrationError = (error: AuthError, email?: string, onLoginRedirect?: () => void) => {
    const normalizedCode = normalizeErrorCode(error.code);

    switch (normalizedCode) {
        case "useralreadyexists":
        case "emailaddresstaken":
        case "emailalreadyexists":
            // Use SweetAlert for better UX with action buttons
            Alert.confirm({
                title: "Account Already Exists",
                text: `An account with email "${email}" already exists. Would you like to sign in instead?`,
                icon: "info",
                confirmButtonText: "Yes, Sign In",
                cancelButtonText: "Stay Here",
                confirmButtonColor: "#3b82f6",
                cancelButtonColor: "#6b7280"
            }).then((result) => {
                if (result.isConfirmed && onLoginRedirect) {
                    onLoginRedirect();
                }
            });
            break;

        case "weakpassword":
            toast.error(AUTH_ERRORS.WEAK_PASSWORD);
            break;

        case "invalidemail":
            toast.error("Please enter a valid email address.");
            break;

        case "toomanyrequests":
            toast.error(AUTH_ERRORS.TOO_MANY_REQUESTS);
            break;

        default:
            toast.error(error.message || AUTH_ERRORS.UNKNOWN_ERROR);
    }
};

/**
 * Handle password reset errors
 * @param email - User's email (for customization)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handlePasswordResetError = (error: AuthError, email?: string) => {
    const normalizedCode = normalizeErrorCode(error.code);

    switch (normalizedCode) {
        case "usernotfound":
            toast.error(AUTH_ERRORS.USER_NOT_FOUND);
            break;

        case "toomanyrequests":
            toast.error(AUTH_ERRORS.TOO_MANY_REQUESTS);
            break;

        case "networkerror":
            toast.error(AUTH_ERRORS.NETWORK_ERROR);
            break;

        default:
            toast.error(error.message || "Failed to send password reset email. Please try again.");
    }
};

/**
 * Handle password update errors
 * @param onSuccess - Success callback (for customization)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handlePasswordUpdateError = (error: AuthError, onSuccess?: () => void) => {
    const normalizedCode = normalizeErrorCode(error.code);

    switch (normalizedCode) {
        case "weakpassword":
            toast.error(AUTH_ERRORS.WEAK_PASSWORD);
            break;

        case "invalidtoken":
        case "resettokenexpired":
            toast.error(AUTH_ERRORS.RESET_TOKEN_EXPIRED);
            break;

        case "resettokeninvalid":
            toast.error(AUTH_ERRORS.RESET_TOKEN_INVALID);
            break;

        default:
            toast.error(error.message || "Failed to update password. Please try again.");
    }
};

/**
 * Handle unexpected/general errors
 */
export const handleUnexpectedError = (err: unknown) => {
    console.error("Unexpected error:", err);

    if (err instanceof Error) {
        // Check for common network errors
        if (err.message.includes("NetworkError") || err.message.includes("fetch")) {
            toast.error(AUTH_ERRORS.NETWORK_ERROR);
            return;
        }

        // Check for server errors
        if (err.message.includes("500") || err.message.includes("Internal Server Error")) {
            toast.error(AUTH_ERRORS.SERVER_ERROR);
            return;
        }
    }

    toast.error(AUTH_ERRORS.UNKNOWN_ERROR);
};

/**
 * Success messages for consistency
 */
export const AUTH_SUCCESS = {
    LOGIN: "Welcome back! Login successful!",
    REGISTRATION: "Account created successfully! Please check your email to verify your account.",
    REGISTRATION_AUTO_LOGIN: "Welcome! Your account has been created successfully and you're now signed in!",
    PASSWORD_RESET_SENT: "Password reset email sent! Please check your inbox.",
    PASSWORD_UPDATED: "Password updated successfully! Redirecting to dashboard...",
    EMAIL_VERIFIED: "Email verified successfully! You can now sign in.",
    LOGOUT: "You have been logged out successfully.",
} as const;

/**
 * Show success message
 */
export const showSuccess = (message: string) => {
    toast.success(message);
};

/**
 * Show error message
 */
export const showError = (message: string) => {
    toast.error(message);
};