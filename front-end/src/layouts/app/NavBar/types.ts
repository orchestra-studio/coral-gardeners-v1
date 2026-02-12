export interface NavbarProps {
  className?: string;
}
export interface NavbarDataProps {
  logo?: {
    icon?: React.ReactNode;
    text?: string;
    href?: string;
    onClick?: () => void;
  };
  links: Array<{
    label: string;
    href: string;
  }>;
  actions?: {
    cta?: {
      label: string;
      onClick?: () => void;
      variant?: "secondary" | "default";
    };
  };
}

export interface NavLinkProps {
  label: string;
  href?: string;
  index?: number;
  className?: string;
}
