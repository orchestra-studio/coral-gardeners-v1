import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface AppState {
    theme: 'light' | 'dark' | 'system';
    isNavOpen: boolean;
    isLoading: boolean;
    currentPage: string;
    lastVisitedPage: string | null;
    sidebarCollapsed: boolean;
    notifications: {
        enabled: boolean;
        sound: boolean;
        desktop: boolean;
    };
    preferences: {
        language: string;
        timezone: string;
        dateFormat: string;
    };
}

// Initial state
const initialState: AppState = {
    theme: 'system',
    isNavOpen: false,
    isLoading: false,
    currentPage: '/',
    lastVisitedPage: null,
    sidebarCollapsed: false,
    notifications: {
        enabled: true,
        sound: true,
        desktop: true,
    },
    preferences: {
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        dateFormat: 'MM/dd/yyyy',
    },
};

// Slice
const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
            state.theme = action.payload;
        },
        toggleNav: (state) => {
            state.isNavOpen = !state.isNavOpen;
        },
        setNavOpen: (state, action: PayloadAction<boolean>) => {
            state.isNavOpen = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setCurrentPage: (state, action: PayloadAction<string>) => {
            state.lastVisitedPage = state.currentPage;
            state.currentPage = action.payload;
        },
        toggleSidebar: (state) => {
            state.sidebarCollapsed = !state.sidebarCollapsed;
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.sidebarCollapsed = action.payload;
        },
        updateNotificationSettings: (state, action: PayloadAction<Partial<AppState['notifications']>>) => {
            state.notifications = { ...state.notifications, ...action.payload };
        },
        updatePreferences: (state, action: PayloadAction<Partial<AppState['preferences']>>) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        resetAppState: () => initialState,
    },
});

// Export actions
export const {
    setTheme,
    toggleNav,
    setNavOpen,
    setLoading,
    setCurrentPage,
    toggleSidebar,
    setSidebarCollapsed,
    updateNotificationSettings,
    updatePreferences,
    resetAppState,
} = appSlice.actions;

import type { RootState } from '../index';

// Export selectors
export const selectApp = (state: RootState) => state.app;
export const selectTheme = (state: RootState) => state.app?.theme ?? 'system';
export const selectIsNavOpen = (state: RootState) => state.app?.isNavOpen ?? false;
export const selectIsLoading = (state: RootState) => state.app?.isLoading ?? false;
export const selectCurrentPage = (state: RootState) => state.app?.currentPage ?? '/';
export const selectLastVisitedPage = (state: RootState) => state.app?.lastVisitedPage;
export const selectSidebarCollapsed = (state: RootState) => state.app?.sidebarCollapsed ?? false;
export const selectNotificationSettings = (state: RootState) => state.app?.notifications;
export const selectPreferences = (state: RootState) => state.app?.preferences;

// Export reducer
export default appSlice.reducer;
