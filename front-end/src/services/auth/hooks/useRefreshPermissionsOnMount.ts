/**
 * Refresh Permissions On Mount Hook
 * Refreshes user permissions on page mount
 */

import { useEffect } from 'react';
import { useRefreshPermissions } from './useRefreshPermissions';
import { useAuth } from '@/store/useAuth';

interface UseRefreshPermissionsOnMountOptions {
  /**
   * Whether to enable auto-refresh (default: true)
   */
  enabled?: boolean;
}

/**
 * Hook to refresh permissions on page mount
 * 
 * @example
 * ```tsx
 * // In your dashboard layout
 * useRefreshPermissionsOnMount({ enabled: true });
 * ```
 */
export function useRefreshPermissionsOnMount(options: UseRefreshPermissionsOnMountOptions = {}) {
  const { enabled = true } = options;
  const { isAuthenticated } = useAuth();
  const { mutate: refreshPermissions } = useRefreshPermissions();

  useEffect(() => {
    // Only run if enabled and user is authenticated
    if (!enabled || !isAuthenticated) {
      return;
    }

    // Refresh permissions on mount
    refreshPermissions();
  }, [enabled, isAuthenticated, refreshPermissions]);
}
