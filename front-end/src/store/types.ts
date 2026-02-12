// Common types file to avoid circular imports and type issues

import type { AuthState } from './slices/authSlice';
import type { AppState } from './slices/appSlice';

export interface RootState {
    auth: AuthState;
    app: AppState;
}
