import type { SettingsTab } from '../types';

export const tabConfig: Record<SettingsTab, { labelKey: string; descriptionKey: string }> = {
    profile: {
        labelKey: "dashboard.settings.tabs.profile.label",
        descriptionKey: "dashboard.settings.tabs.profile.description",
    },
    security: {
        labelKey: "dashboard.settings.tabs.security.label",
        descriptionKey: "dashboard.settings.tabs.security.description",
    },
    "app-settings": {
        labelKey: "dashboard.settings.tabs.app-settings.label",
        descriptionKey: "dashboard.settings.tabs.app-settings.description",
    },
};