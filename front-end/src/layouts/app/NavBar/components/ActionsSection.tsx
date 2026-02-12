import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { useLocale } from "@/hooks/locale/useLocale";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export interface CTAButton {
  label: string;
  onClick?: () => void;
  variant?: "secondary" | "default";
}

export interface ActionsProps {
  actions?: {
    cta?: CTAButton;
  };
  className?: string;
}

/**
 * Actions section component for the navbar
 * Contains theme toggle and language switcher
 */
export const ActionsSection: React.FC<ActionsProps> = ({
  actions,
  className = "flex items-center justify-end gap-2 min-w-[30%]",
}) => {
  const currentLocale = useLocale();

  return (
    <div className={className}>
      <LanguageSwitcher currentLocale={currentLocale} variant="ghost" />
      <ThemeToggle />

      {/* CTA button */}
      {actions?.cta && (
        <Button
          onClick={actions.cta.onClick}
          variant={actions.cta.variant || "default"}
          size="sm"
          aria-label={actions.cta.label}
        >
          {actions.cta.label}
        </Button>
      )}
    </div>
  );
};
