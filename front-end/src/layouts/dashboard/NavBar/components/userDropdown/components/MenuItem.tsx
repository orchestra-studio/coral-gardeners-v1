import { MenuItemProps } from "../types";
import { Button } from "@/components/ui/button";

export default function MenuItem({
  icon: Icon,
  label,
  ariaLabel,
  onClick,
  variant = "default",
}: MenuItemProps) {
  const baseClasses =
    "flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-[var(--surface-hover)] transition-colors";
  const variantClasses = {
    default: "text-[var(--text-muted)] hover:text-[var(--text)]",
    danger: "text-[var(--errorColor)]",
  };

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={`${baseClasses} ${variantClasses[variant]} justify-start h-auto rounded-none`}
      role="menuitem"
      aria-label={ariaLabel}
    >
      <Icon size={16} className="me-1.5 rtl:ml-1.5 rtl:me-0" />
      {label}
    </Button>
  );
}
