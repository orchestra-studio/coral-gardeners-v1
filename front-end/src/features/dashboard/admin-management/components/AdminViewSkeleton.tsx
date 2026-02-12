import React from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import SettingsHeader from "@/layouts/dashboard/settings/SettingsHeader";
import Skeleton from "@/components/ui/Skeleton";

interface AdminViewSkeletonProps {
  onBack: () => void;
}

const AdminViewSkeleton: React.FC<AdminViewSkeletonProps> = ({ onBack }) => {
  const adminT = useTranslations("dashboard/settings/adminmanagement");

  return (
    <>
      {/* Header with back button and skeleton title */}
      <div className=" bg-[var(--surface)] rounded-t-md p-6 pb-2">
        <SettingsHeader
          translationNamespace="dashboard/settings/adminmanagement"
          titleKey="view.titlePrefix"
          customTitle={adminT("view.loading")}
          descriptionKey="view.description"
          icon={IconArrowLeft}
          iconClassName="rtl:rotate-180"
          showIconBackground
          onIconClick={onBack}
          actionComponent={
            <div className="flex gap-2">
              <Skeleton width="80px" height="36px" rounded="md" />
              <Skeleton width="80px" height="36px" rounded="md" />
              <Skeleton width="80px" height="36px" rounded="md" />
            </div>
          }
        />
      </div>

      {/* Main content skeleton - matches AdminViewLayout structure */}
      <div className="flex flex-col gap-4">
        <div className="rounded-b-lg overflow-hidden bg-[var(--surface)]">
          <div className="px-6 pb-6 mt-18">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
              {/* Avatar skeleton - matches AdminAvatar exactly */}
              <div className="relative z-10 w-24 h-24 rounded-full border-4 bg-[var(--surface)] border-[var(--surface)]">
                <Skeleton width="100%" height="100%" rounded="full" />
              </div>

              {/* Header info skeleton - matches AdminHeaderInfo */}
              <div className="flex flex-col gap-2">
                <Skeleton width="150px" height="24px" />
                <Skeleton width="100px" height="16px" />
              </div>
            </div>

            {/* Roles section skeleton - matches roles display */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Skeleton width="16px" height="16px" rounded="sm" />
                <Skeleton width="60px" height="16px" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton width="80px" height="28px" rounded="full" />
                <Skeleton width="100px" height="28px" rounded="full" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton - matches Tabs component */}
        <div className="w-full bg-[var(--surface)] rounded-lg">
          <div className="flex border-b border-[var(--border)]">
            <div className="px-4 py-3 border-b-2 border-[var(--primary)]">
              <Skeleton width="80px" height="16px" />
            </div>
            <div className="px-4 py-3">
              <Skeleton width="60px" height="16px" />
            </div>
          </div>
        </div>

        {/* Content skeleton - matches InfoSection grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4 p-6 bg-[var(--surface)] rounded-lg">
            <div className="flex items-center gap-2">
              <Skeleton width="20px" height="20px" rounded="sm" />
              <Skeleton width="120px" height="20px" />
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton width="100%" height="40px" />
              <Skeleton width="100%" height="40px" />
              <Skeleton width="100%" height="40px" />
            </div>
          </div>
          <div className="flex flex-col gap-4 p-6 bg-[var(--surface)] rounded-lg">
            <div className="flex items-center gap-2">
              <Skeleton width="20px" height="20px" rounded="sm" />
              <Skeleton width="120px" height="20px" />
            </div>
            <div className="flex flex-col gap-3">
              <Skeleton width="100%" height="40px" />
              <Skeleton width="100%" height="40px" />
              <Skeleton width="100%" height="40px" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminViewSkeleton;
