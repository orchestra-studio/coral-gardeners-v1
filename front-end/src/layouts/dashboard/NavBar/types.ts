import { Route } from "../sidebar";

export interface AppHeaderProps {
    currentRoute: Route;
    showBack?: boolean;
    onBack?: () => void;
    // sidebar brand integration
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

export interface HeaderActionsProps {
    onSearchOpen: () => void;
}

export interface BackButtonProps {
    onBack: () => void;
}

export interface HeaderTitleProps {
    currentRoute: Route;
}
