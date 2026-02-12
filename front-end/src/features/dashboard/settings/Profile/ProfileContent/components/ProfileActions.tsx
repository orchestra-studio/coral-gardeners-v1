import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { IconEdit } from "@tabler/icons-react";

interface ProfileActionsProps {
  isEditing: boolean;
  isSubmitting: boolean;
  onEditToggle: () => void;
  onCancel: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  isEditing,
  isSubmitting,
  onEditToggle,
  onCancel,
}) => {
  const t = useTranslations("dashboard/settings/profile");

  if (!isEditing) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onEditToggle}
        className="flex items-center gap-2 min-w-32"
        startIcon={<IconEdit className="w-4 h-4" />}
      >
        {t("header.editProfile")}
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {t("header.cancel")}
      </Button>
      <Button
        type="submit"
        size="sm"
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        {t("header.saveChanges")}
      </Button>
    </div>
  );
};

export default ProfileActions;
