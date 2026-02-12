import { IconUser, IconShield, IconSettings } from '@tabler/icons-react';
import type { SettingsTab } from '../types';

export const settingsTabs = [
    { id: 'profile' as SettingsTab, labelKey: 'dashboard.settings.tabs.profile.label', icon: IconUser },
    { id: 'security' as SettingsTab, labelKey: 'dashboard.settings.tabs.security.label', icon: IconShield },
    { id: 'app-settings' as SettingsTab, labelKey: 'dashboard.settings.tabs.app-settings.label', icon: IconSettings },
];