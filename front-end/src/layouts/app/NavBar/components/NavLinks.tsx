import React from "react";
import Link from "next/link";
import { navStyles } from "../styles";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavLinksProps {
  links: NavLink[];
  className?: string;
}

/**
 * Simple navigation links component
 */
export const NavLinks: React.FC<NavLinksProps> = ({
  links,
  className = "",
}) => {
  if (links.length === 0) return null;

  return (
    <ul className={`hidden md:flex text-sm font-medium ${className}`}>
      {links.map((link) => (
        <li key={link.label} className="px-4 py-2">
          <Link href={link.href || "#"} className={navStyles.link}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};
