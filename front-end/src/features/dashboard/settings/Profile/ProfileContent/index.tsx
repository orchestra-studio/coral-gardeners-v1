"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

// Local imports
import { ProfileFormData } from "../types";
import { createProfileValidationSchema } from "../validation";
import {
  useProfile,
  useUpdateProfile,
  ProfileUpdateRequest,
} from "@/services/profile";
import { ProfileForm } from "../components";
import { useAuth } from "@/store/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { setAuthState } from "@/store/slices/authSlice";
import { AuthUser } from "@/lib/auth/types";
import { ProfileHeader } from "./components";

interface ProfileContentProps {
  className?: string;
}

export default function ProfileContent({
  className = "",
}: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const t = useTranslations("dashboard/settings/profile");

  // TanStack Query hooks
  const profileQuery = useProfile();
  const updateProfileMutation = useUpdateProfile();

  // Redux hooks
  const { user, session } = useAuth();
  const dispatch = useAppDispatch();

  // Translation function for validation
  const tValidation = (key: string) => t(`validation.${key}`);

  // Form setup
  const methods = useForm<ProfileFormData>({
    resolver: yupResolver(createProfileValidationSchema(tValidation)) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country_id: null,
      profile_picture: "",
      password: "",
      password_confirmation: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
    control,
  } = methods;

  // Event handlers
  const handleEditToggle = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form with current data
    if (profileQuery.data) {
      reset({
        first_name: profileQuery.data.first_name,
        last_name: profileQuery.data.last_name,
        email: profileQuery.data.email,
        phone: profileQuery.data.phone || "",
        country_id: profileQuery.data.country_id || null,
        profile_picture: profileQuery.data.profile_picture || "",
        password: "",
        password_confirmation: "",
      });
      setImageUrl(profileQuery.data.profile_picture || null);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!profileQuery.data) return;

    try {
      // Prepare update data - only include changed fields
      const updateData: ProfileUpdateRequest = {};

      if (data.first_name !== profileQuery.data.first_name) {
        updateData.first_name = data.first_name;
      }
      if (data.last_name !== profileQuery.data.last_name) {
        updateData.last_name = data.last_name;
      }
      if (data.email !== profileQuery.data.email) {
        updateData.email = data.email;
      }

      const currentPhone = data.phone || null;
      const originalPhone = profileQuery.data.phone || null;
      if (currentPhone !== originalPhone) {
        updateData.phone = currentPhone;
      }

      const currentCountryId = data.country_id || null;
      const originalCountryId = profileQuery.data.country_id || null;
      if (currentCountryId !== originalCountryId) {
        updateData.country_id = currentCountryId;
      }

      const currentImage = imageUrl || null;
      const originalImage = profileQuery.data.profile_picture || null;
      if (currentImage !== originalImage) {
        updateData.profile_picture = currentImage;
      }

      // Include password if provided
      if (data.password && data.password.trim() !== "") {
        updateData.password = data.password;
        updateData.password_confirmation = data.password_confirmation;
      }

      // If no changes, just close edit mode
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes detected");
        setIsEditing(false);
        return;
      }

      await updateProfileMutation.mutateAsync(updateData);

      // Update Redux auth store
      if (user && session) {
        const updatedUser: AuthUser = { ...user };

        if (updateData.first_name || updateData.last_name) {
          const firstName =
            updateData.first_name || profileQuery.data.first_name;
          const lastName = updateData.last_name || profileQuery.data.last_name;
          updatedUser.name = `${firstName} ${lastName}`.trim();
        }
        if (updateData.email) {
          updatedUser.email = updateData.email;
        }
        if (updateData.profile_picture !== undefined) {
          updatedUser.avatar = updateData.profile_picture || undefined;
        }

        dispatch(
          setAuthState({
            user: updatedUser,
            session: { ...session, user: updatedUser },
          })
        );
      }

      // Toast is now handled by the service layer mutation
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      // Error toast is now handled by the service layer mutation
    }
  };

  // Initialize form when profile data loads
  useEffect(() => {
    if (profileQuery.data) {
      reset({
        first_name: profileQuery.data.first_name,
        last_name: profileQuery.data.last_name,
        email: profileQuery.data.email,
        phone: profileQuery.data.phone || "",
        country_id: profileQuery.data.country_id || null,
        profile_picture: profileQuery.data.profile_picture || "",
        password: "",
        password_confirmation: "",
      });
      setImageUrl(profileQuery.data.profile_picture || null);
    }
  }, [profileQuery.data, reset]);

  const isSubmitting =
    methods.formState.isSubmitting || updateProfileMutation.isPending;

  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl p-6 ${className}`}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
          noValidate
        >
          <ProfileHeader
            profileData={profileQuery.data}
            imageUrl={imageUrl}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            onEditToggle={handleEditToggle}
            onCancel={handleCancel}
            onImageChange={setImageUrl}
          />

          <ProfileForm
            isEditing={isEditing}
            errors={errors}
            register={register}
            control={control}
          />
        </form>
      </FormProvider>
    </div>
  );
}
