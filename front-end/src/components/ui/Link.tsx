import * as React from "react";
import NextLink from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { useLocale } from "../../hooks/locale/useLocale";

const linkVariants = cva(
  "inline-flex items-center transition-all cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "text-[var(--text)] hover:text-[var(--text-muted)]",
        primary:
          "text-[var(--primaryColor)] hover:text-[var(--primaryColorHover)]",
        muted: "text-[var(--text-muted)] hover:text-[var(--text)]",
        underline:
          "text-[var(--text)] underline underline-offset-4 hover:text-[var(--text-muted)]",
        "primary-underline":
          "text-[var(--primaryColor)] hover:text-[var(--primaryColorHover)] underline underline-offset-4",
        ghost: "text-[var(--text)] hover:bg-[var(--surface-hover)] rounded-md",
        button:
          "justify-center whitespace-nowrap text-sm font-medium rounded-md border border-transparent",
        "button-primary":
          "justify-center whitespace-nowrap text-sm font-medium rounded-md bg-[var(--text)] text-[var(--surface)] hover:bg-[var(--text-muted)]",
        "button-outline":
          "justify-center whitespace-nowrap text-sm font-medium rounded-md border border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--surface-hover)]",
        "button-ghost":
          "justify-center whitespace-nowrap text-sm font-medium rounded-md bg-transparent hover:bg-[var(--surface-hover)]",
      },
      size: {
        default: "",
        sm: "text-sm",
        lg: "text-lg",
        button: "h-10 px-4 py-2",
        "button-sm": "h-8 px-3 text-xs",
        "button-lg": "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  href: string;
  external?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      variant,
      size,
      href,
      external = false,
      startIcon,
      endIcon,
      children,
      ...props
    },
    ref
  ) => {
    const locale = useLocale();

    // Function to get localized href - same logic as Button component
    const getLocalizedHref = (path: string): string => {
      // If it's an external URL or already has a locale, return as is
      if (
        path.startsWith("http") ||
        path.startsWith("mailto:") ||
        path.startsWith("tel:") ||
        external
      ) {
        return path;
      }
      // Add locale prefix to the path
      return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
    };

    // For external links or when explicitly marked as external
    if (
      external ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return (
        <a
          href={href}
          className={cn(linkVariants({ variant, size }), className)}
          ref={ref}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          {...props}
        >
          {startIcon && (
            <span className="me-2 flex items-center">{startIcon}</span>
          )}
          {children}
          {endIcon && <span className="ms-2 flex items-center">{endIcon}</span>}
        </a>
      );
    }

    // For internal links with Next.js Link
    return (
      <NextLink
        href={getLocalizedHref(href)}
        className={cn(linkVariants({ variant, size }), className)}
        ref={ref}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {startIcon && (
          <span className="me-2 flex items-center">{startIcon}</span>
        )}
        {children}
        {endIcon && <span className="ms-2 flex items-center">{endIcon}</span>}
      </NextLink>
    );
  }
);

Link.displayName = "Link";

export { Link, linkVariants };
