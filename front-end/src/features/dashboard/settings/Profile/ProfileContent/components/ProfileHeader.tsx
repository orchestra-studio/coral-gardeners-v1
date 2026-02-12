import React from "react";
import { useTranslations } from "next-intl";
import { SettingsHeader } from "@/layouts/dashboard/settings";
import { Profile } from "@/services/profile";
import { ProfileHeaderImage } from "./ProfileHeaderImage";
import { ProfileActions } from "./ProfileActions";

interface ProfileHeaderProps {
  profileData: Profile | null | undefined;
  imageUrl: string | null;
  isEditing: boolean;
  isSubmitting: boolean;
  onEditToggle: () => void;
  onCancel: () => void;
  onImageChange: (url: string | null) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  imageUrl,
  isEditing,
  isSubmitting,
  onEditToggle,
  onCancel,
  onImageChange,
}) => {
  const t = useTranslations("dashboard/settings/profile");

  return (
    <SettingsHeader
      translationNamespace="dashboard/settings/profile"
      customTitle={
        isEditing
          ? ""
          : profileData
          ? `${profileData.first_name} ${profileData.last_name}`
          : t("header.title")
      }
      customDescription={
        isEditing ? "" : profileData?.email || t("header.description")
      }
      customComponent={
        <ProfileHeaderImage
          imageUrl={imageUrl}
          isEditing={isEditing}
          onImageChange={onImageChange}
        />
      }
      actionComponent={
        <ProfileActions
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onEditToggle={onEditToggle}
          onCancel={onCancel}
        />
      }
    />
  );
};

export default ProfileHeader;
