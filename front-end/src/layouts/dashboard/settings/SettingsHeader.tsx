import React, { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface SettingsHeaderProps {
  // Translation namespace and keys
  translationNamespace: string;
  titleKey?: string;
  descriptionKey?: string;

  // Custom title and description (overrides translation keys)
  customTitle?: string;
  customDescription?: string;

  // Icon configuration
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  showIconBackground?: boolean;
  onIconClick?: () => void;

  // Custom component slot (replaces icon or used alongside)
  customComponent?: ReactNode;

  // Back button - appears before the icon/title section
  backButton?: ReactNode;

  // Action area - parent handles the buttons/components
  actionComponent?: ReactNode;

  // Additional styling
  className?: string;
  headerClassName?: string;

  iconClassName?: string;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  translationNamespace,
  titleKey,
  descriptionKey,
  customTitle,
  customDescription,
  icon: Icon,
  showIconBackground = false,
  customComponent,
  actionComponent,
  onIconClick,
  className = "",
  headerClassName = "",
  iconClassName = "",
}) => {
  const t = useTranslations(translationNamespace);

  // Unified header layout that handles all cases
  return (
    <div className={`mb-6 ${className}`}>
      <div
        className={`flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 ${headerClassName}`}
      >
        <div className="flex-1 flex items-start gap-3">
          {/* Icon section - can be with or without background, or replaced by custom component */}
          {customComponent ? (
            customComponent
          ) : Icon ? (
            <div
              className={`w-16 h-16 ${
                showIconBackground ? "bg-[var(--selected-bg)]/50" : ""
              } rounded-full flex items-center justify-center ${
                onIconClick
                  ? "cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
                  : ""
              }`}
              onClick={onIconClick}
            >
              <Icon
                className={`w-8 h-8 text-[var(--primaryColor)] ${iconClassName}`}
              />
            </div>
          ) : null}

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[var(--text)] mb-2">
              {customTitle || (titleKey ? t(titleKey) : "")}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {customDescription || (descriptionKey ? t(descriptionKey) : "")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:shrink-0">
          {/* Action area - parent provides the complete component */}
          {actionComponent}
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;
