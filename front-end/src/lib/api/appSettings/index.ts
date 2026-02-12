/**
 * App Settings API - Exports
 */

export { appSettingsManagementApi } from "./appSettingsManagement";
export type {
    AppSetting,
    UpdateAppSettingRequest,
    AppSettingsListResponse,
    GetAppSettingsParams,
} from "./appSettingsManagement";

// Export for convenience
import { appSettingsManagementApi } from "./appSettingsManagement";

export const appSettingsApi = appSettingsManagementApi;

export default appSettingsApi;
