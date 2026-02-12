import BackButton from "./backButton";
import HeaderTitle from "./headerTitle";
import HeaderBrand from "./headerBrand";
import type { Route } from "../../sidebar";

interface HeaderLeftProps {
  currentRoute: Route;
  showBack: boolean;
  onBack?: () => void;
  // sidebar brand integration
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function HeaderLeft({
  currentRoute,
  showBack,
  onBack,
  isCollapsed = false,
  onToggleCollapse,
}: HeaderLeftProps) {
  return (
    <div className="w-full h-16 flex items-center">
      {/* Brand with sidebar toggle - always show if toggle handler provided */}
      {onToggleCollapse && (
        <HeaderBrand
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      )}

      {/* Back button and title - only show when no brand toggle (fallback) */}
      {!onToggleCollapse && (
        <div className="flex items-center gap-3 px-3">
          {showBack && onBack && <BackButton onBack={onBack} />}
          <HeaderTitle currentRoute={currentRoute} />
        </div>
      )}
    </div>
  );
}
