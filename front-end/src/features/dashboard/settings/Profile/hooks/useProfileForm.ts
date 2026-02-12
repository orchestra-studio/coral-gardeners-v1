import { useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/store/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { setAuthState } from "@/store/slices/authSlice";
import { AuthUser } from "@/lib/auth/types";
import { useUpdateProfile } from "@/services/profile";
import { ProfileUpdateRequest } from "@/services/profile/types/profileTypes";
import { ProfileApiResponse } from "@/lib/api/profile/types";
import { ProfileFormData } from "../types";

/**
 * Hook for managing profile form submission and updates
 */
export const useProfileForm = () => {
    const { user, session } = useAuth();
    const dispatch = useAppDispatch();
    const updateProfileMutation = useUpdateProfile();

    const submitProfileChanges = useCallback(
        async (
            data: ProfileFormData,
            profileData: ProfileApiResponse | null,
            imageUrl: string | null,
            onSuccess: () => void,
            reloadProfile: () => void
        ) => {
            try {
                const updateData: ProfileUpdateRequest = {};

                // Only include fields that have changed
                if (data.first_name !== profileData?.first_name) {
                    updateData.first_name = data.first_name;
                }

                if (data.last_name !== profileData?.last_name) {
                    updateData.last_name = data.last_name;
                }

                if (data.email !== profileData?.email) {
                    updateData.email = data.email;
                }

                const currentPhone = data.phone || null;
                const originalPhone = profileData?.phone || null;
                if (currentPhone !== originalPhone) {
                    updateData.phone = currentPhone;
                }

                const currentImage = imageUrl || null;
                const originalImage = profileData?.profile_picture || null;
                if (currentImage !== originalImage) {
                    updateData.profile_picture = currentImage;
                }

                // Only include password fields if password is provided
                if (data.password && data.password.trim() !== "") {
                    updateData.password = data.password;
                    updateData.password_confirmation = data.password_confirmation;
                }

                // If no fields changed, just close edit mode
                if (Object.keys(updateData).length === 0) {
                    toast.info("No changes detected");
                    onSuccess();
                    return;
                }

                // Use the service layer mutation
                await updateProfileMutation.mutateAsync(updateData);

                onSuccess();

                // Update Redux auth store with new user data
                if (user && session) {
                    const updatedUser: AuthUser = {
                        ...user,
                    };

                    // Update user fields that changed
                    if (updateData.first_name || updateData.last_name) {
                        const firstName =
                            updateData.first_name || profileData?.first_name || "";
                        const lastName =
                            updateData.last_name || profileData?.last_name || "";
                        updatedUser.name = `${firstName} ${lastName}`.trim();
                    }
                    if (updateData.email) {
                        updatedUser.email = updateData.email;
                    }
                    if (updateData.profile_picture !== undefined) {
                        updatedUser.avatar = updateData.profile_picture || undefined;
                    }

                    // Update Redux state directly
                    dispatch(
                        setAuthState({
                            user: updatedUser,
                            session: {
                                ...session,
                                user: updatedUser,
                            },
                        })
                    );
                }

                // Reload profile data to get updated information
                await reloadProfile();
            } catch (error) {
                console.error("Profile update error:", error);
                // Error toast is now handled by the mutation
            }
        },
        [user, session, dispatch, updateProfileMutation]
    );

    return {
        submitProfileChanges,
        isUpdating: updateProfileMutation.isPending,
    };
};