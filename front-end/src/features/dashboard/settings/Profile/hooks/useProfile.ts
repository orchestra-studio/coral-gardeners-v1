/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useProfile as useProfileQuery } from "@/services/profile";

/**
 * Hook for managing profile data loading
 */
export const useProfile = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // Use the service layer for profile data
    const { data: profileData, isLoading, error, refetch } = useProfileQuery();

    const loadProfile = useCallback(async (resetForm?: (data: any) => void) => {
        try {
            // Refetch profile data
            const result = await refetch();
            const data = result.data;

            if (data) {
                setImageUrl(data.profile_picture);

                // Reset form if reset function is provided
                if (resetForm) {
                    resetForm({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email,
                        phone: data.phone || "",
                        profile_picture: data.profile_picture || "",
                        password: "",
                        password_confirmation: "",
                    });
                }
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
            toast.error("Failed to load profile data");
        }
    }, [refetch]);

    return {
        profileData,
        imageUrl,
        setImageUrl,
        loadProfile,
        isLoading,
        error,
    };
};