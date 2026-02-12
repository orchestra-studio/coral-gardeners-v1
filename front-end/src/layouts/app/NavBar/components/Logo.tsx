import React from "react";
import Link from "next/link";

export interface LogoProps {
  icon?: React.ReactNode;
  text?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  useImageLogo?: boolean;
}

/**
 * Logo component for the navbar
 * Can display either icon+text or responsive image logo
 * Can be clickable or just a visual element
 */
export const Logo: React.FC<LogoProps> = ({
  icon,
  text,
  href,
  onClick,
  className = "flex items-center gap-1.5 min-w-[30%]",
  useImageLogo = false,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Render responsive image logo using CSS variables
  const renderImageLogo = () => (
    <div
      className="h-12 w-auto min-w-[90px]"
      style={{
        backgroundImage: "var(--logo-bg-image)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        filter: "var(--logo-filter)",
      }}
      aria-label="Brand Logo"
    />
  );

  // Render traditional icon + text logo
  const renderIconTextLogo = () => (
    <>
      {icon}
      <div className="text-lg font-bold">{text}</div>
    </>
  );

  const logoContent = useImageLogo ? renderImageLogo() : renderIconTextLogo();

  // If no href or onClick, render as a non-clickable div
  if (!href && !onClick) {
    return (
      <div className={`${className}`} aria-label={text || "Logo"}>
        {logoContent}
      </div>
    );
  }

  // If href or onClick provided, render as clickable Link
  return (
    <Link
      href={href || "#"}
      onClick={handleClick}
      className={`${className} cursor-pointer hover:opacity-80 transition-opacity`}
      aria-label={`${text || "Logo"} - Go to home page`}
    >
      {logoContent}
    </Link>
  );
};
