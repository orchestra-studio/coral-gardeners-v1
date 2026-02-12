"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { IconBrandGoogle, IconBrandApple } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface OAuthProvidersProps {
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
  disabled?: boolean;
}

/**
 * OAuthProviders - Social login buttons (Google & Apple)
 */
export function OAuthProviders({
  onGoogleLogin,
  onAppleLogin,
  disabled = false,
}: OAuthProvidersProps) {
  const t = useTranslations("auth.login");

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/30 dark:border-border/20" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[var(--surface)] px-3 p-[1px] pb-[2px] rounded-full text-[var(--text-muted)]">
            {t("continueWith")}
          </span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onGoogleLogin}
          disabled={disabled}
          className="w-full"
          startIcon={<IconBrandGoogle className="h-5 w-5 mr-2" />}
        >
          {t("google")}
        </Button>

        {/* Apple Button */}
        <Button
          type="button"
          variant="outline"
          onClick={onAppleLogin}
          disabled={disabled}
          className="w-full"
          startIcon={<IconBrandApple className="h-5 w-5 mr-2" />}
        >
          {t("apple")}
        </Button>
      </div>
    </div>
  );
}
