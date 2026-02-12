"use client";

import React from "react";
import Checkbox from "@/components/ui/checkbox";
import { Link } from "@/components/ui/Link";

interface RememberMeProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  forgotPasswordText?: string;
  forgotPasswordHref?: string;
  rememberMeText?: string;
}

/**
 * RememberMe - Remember me checkbox with forgot password link
 */
export function RememberMe({
  checked = false,
  onChange,
  forgotPasswordText = "Forgot password?",
  forgotPasswordHref = "/auth/forgot-password",
  rememberMeText = "Remember me",
}: RememberMeProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Remember Me Checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="remember-me"
          checked={checked}
          onChange={() => onChange?.(!checked)}
        />
        <label
          htmlFor="remember-me"
          className="text-sm text-[var(--text-muted)] cursor-pointer select-none"
        >
          {rememberMeText}
        </label>
      </div>

      {/* Forgot Password Link */}
      <Link
        href={forgotPasswordHref}
        className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
      >
        {forgotPasswordText}
      </Link>
    </div>
  );
}
