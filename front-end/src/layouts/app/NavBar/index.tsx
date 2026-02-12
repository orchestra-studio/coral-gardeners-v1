"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { BRAND_CONFIG } from "@/layouts/dashboard/sidebar/config/navigationData";
import type { MultilingualText } from "@/layouts/dashboard/sidebar/config/navigationData";
import { useLocale } from "@/hooks/locale/useLocale";

// Components
import { Logo, NavLinks, ActionsSection } from "./components";

// Types and Styles
import { NavbarProps, NavbarDataProps } from "./types";
import { navStyles } from "./styles";

/**
 * Simple navbar component with responsive design
 */
const Navbar = forwardRef<HTMLDivElement, NavbarProps>(({ className }, ref) => {
  const locale = useLocale();

  const data: NavbarDataProps = {
    logo: {
      // Use responsive image logo for brand
      text:
        BRAND_CONFIG.name[locale as keyof MultilingualText] ||
        BRAND_CONFIG.name.en,
      // No href or onClick - just a visual element
    },
    links: [],
    actions: {},
  };

  return (
    <header ref={ref} className={cn(navStyles.header, className)}>
      <div className={navStyles.container.base}>
        <nav className={navStyles.nav.base}>
          <div className={navStyles.content.base}>
            {/* Logo Section */}
            {data.logo && (
              <Logo
                text={data.logo.text}
                href={data.logo.href}
                onClick={data.logo.onClick}
                useImageLogo={true}
              />
            )}

            {/* Spacer */}
            <div className="flex-1" aria-hidden="true" />

            {/* Desktop Navigation Links */}
            <NavLinks links={data.links} />

            {/* Actions Section */}
            <ActionsSection actions={data.actions} />
          </div>
        </nav>
      </div>
    </header>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
