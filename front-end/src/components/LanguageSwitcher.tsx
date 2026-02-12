"use client";

import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { US, SA } from "country-flag-icons/react/3x2";
import { Select } from "@/components/ui/input";
import type { SelectOption } from "@/components/ui/input";

const languages = [
  { code: "en", country: "US" as const, Flag: US },
  { code: "ar", country: "SA" as const, Flag: SA },
];

interface LanguageSwitcherProps {
  className?: string;
  currentLocale?: string;
  variant?: "default" | "ghost";
  triggerClassName?: string;
}

export default function LanguageSwitcher({
  className,
  currentLocale = "en",
  variant = "default",
  triggerClassName,
}: LanguageSwitcherProps) {
  const { navigateToLocale } = useAppNavigation();

  const options: SelectOption[] = languages.map((lang) => ({
    value: lang.code,
    label: lang.code.toUpperCase(),
    icon: <lang.Flag title={lang.country} className="w-4 h-auto" />,
  }));

  const handleLanguageChange = (value: string | number) => {
    const langCode = value as string;

    // Get current pathname for locale switching
    const currentPath = window.location.pathname;

    // Use the enhanced navigation method that handles locale switching
    navigateToLocale(currentPath, langCode);
  };

  return (
    <Select
      options={options}
      value={currentLocale}
      onChange={handleLanguageChange}
      className={className}
      usePortal={false}
      triggerClassName={[
        "bg-[var(--control-bg)]",
        "border border-[var(--border-subtle)]",
        "rounded-full",
        "hover:bg-[var(--surface-hover)]",
        "transition-none",
        "h-8",
        "hover:border-[var(--border-subtle)]",
        triggerClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      variant={variant}
      hideChevronOnMobile
    />
  );
}
