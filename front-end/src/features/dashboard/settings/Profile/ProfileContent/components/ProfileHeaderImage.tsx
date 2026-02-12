import React from "react";
import ImageUploader from "@/components/ImageUploader";

interface ProfileHeaderImageProps {
  imageUrl: string | null;
  isEditing: boolean;
  onImageChange: (url: string | null) => void;
}

export const ProfileHeaderImage: React.FC<ProfileHeaderImageProps> = ({
  imageUrl,
  isEditing,
  onImageChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <ImageUploader
        value={imageUrl || undefined}
        onChange={onImageChange}
        path="admins/profile"
        sizePreset="profile"
        showUploadButton={isEditing}
      />
    </div>
  );
};

export default ProfileHeaderImage;
