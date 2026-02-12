export interface UserData {
    name: string;
    email: string;
    initials: string;
    avatar?: string | null;
}

export interface MenuItemProps {
    icon: React.ComponentType<{ size?: number, className?: string }>;
    label: string;
    ariaLabel: string;
    onClick: () => void;
    variant?: 'default' | 'danger';
}