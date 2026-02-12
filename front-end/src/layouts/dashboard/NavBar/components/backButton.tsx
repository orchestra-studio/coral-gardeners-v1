import { IconArrowLeft } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { BackButtonProps } from "../types";
import IconButton from "@/components/ui/iconButton";

export default function BackButton({ onBack }: BackButtonProps) {
  const t = useTranslations();

  return (
    <IconButton
      onClick={onBack}
      aria-label={t("dashboard.header.backButton.ariaLabel")}
      className="text-[var(--text-muted)] hover:text-[var(--text)]"
    >
      <IconArrowLeft size={18} className="rtl:rotate-180" />
    </IconButton>
  );
}
