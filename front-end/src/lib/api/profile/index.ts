/**
 * Profile API - Exports
 */

export { profileManagementApi } from "./profileManagement";
export type {
    ProfileData,
    ProfileApiResponse,
    PasswordChangeRequest,
} from "./types";

// Export for convenience
import { profileManagementApi } from "./profileManagement";

export const profileApi = profileManagementApi;

export default profileApi;
