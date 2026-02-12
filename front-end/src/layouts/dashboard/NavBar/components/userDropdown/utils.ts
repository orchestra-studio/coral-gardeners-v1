/**
 * Handles user logout by clearing session and redirecting to login
 */
export const handleLogout = async (navigateTo: (path: string) => void) => {
    try {
        // Clear the session using the auth provider
        const { getAuthProvider } = await import("@/lib/auth/factory");
        const authProvider = getAuthProvider();
        await authProvider.signOut();

        // Redirect to login page
        navigateTo("/auth/login");
    } catch (error) {
        console.error("Error signing out:", error);
        // Even if there's an error, redirect to login to be safe
        navigateTo("/auth/login");
    }
};