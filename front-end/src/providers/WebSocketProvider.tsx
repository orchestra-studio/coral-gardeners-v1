"use client";

import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api/client";
import { useAppDispatch } from "@/store/hooks";
import { setAuthState } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import { useLocale } from "@/hooks/locale/useLocale";

interface BackendAuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string | null;
  phone?: string;
  country_id?: number;
  created_at?: string;
  updated_at?: string;
  roles: Array<{ id: number; name: string; guard_name: string }>;
  permissions: string[];
}

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, session } = useAuth();
  const dispatch = useAppDispatch();
  const locale = useLocale();

  useWebSocket({
    enabled: isAuthenticated,
    onPermissionsUpdated: async (data?: {
      message?: { en: string; ar: string };
    }) => {
      console.log(
        "[WebSocket] Permissions updated, fetching fresh user data..."
      );

      try {
        // Fetch updated user data from backend
        const response = await api.get<BackendAuthUser>("/auth/me");

        if (response.success && response.data) {
          const updatedUser = response.data;

          // Update Redux store with new permissions
          if (session) {
            const updatedSession = {
              ...session,
              user: {
                ...session.user,
                id: updatedUser.id.toString(),
                username: updatedUser.username,
                email: updatedUser.email,
                first_name: updatedUser.first_name,
                last_name: updatedUser.last_name,
                name:
                  updatedUser.full_name ||
                  `${updatedUser.first_name} ${updatedUser.last_name}`,
                avatar: updatedUser.profile_picture || undefined,
                profile_picture: updatedUser.profile_picture || null,
                roles: updatedUser.roles,
                permissions: updatedUser.permissions,
              },
            };

            // Update Redux state - this will trigger re-renders in all components using useAuth()
            dispatch(
              setAuthState({
                user: updatedSession.user,
                session: updatedSession,
              })
            );

            // Update localStorage to persist the changes
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "auth_user",
                JSON.stringify(updatedSession.user)
              );
              localStorage.setItem(
                "auth_session",
                JSON.stringify(updatedSession)
              );
            }

            console.log("[WebSocket] User permissions updated successfully:", {
              oldPermissions: session.user.permissions || [],
              newPermissions: updatedUser.permissions,
            });

            // Get the translated message based on current locale
            const message =
              data?.message?.[locale] ?? "Your permissions have been updated";

            // Show notification - position is inherited from global ToastContainer
            toast.info(message, {
              autoClose: 5000,
            });
          }
        }
      } catch (error) {
        console.error("[WebSocket] Error fetching updated user data:", error);

        // Get the translated message based on current locale for error case
        const message =
          data?.message?.[locale] ?? "Your permissions have been updated";

        // Show notification - position is inherited from global ToastContainer
        toast.info(message, {
          autoClose: 5000,
        });
      }
    },
  });

  return <>{children}</>;
}
