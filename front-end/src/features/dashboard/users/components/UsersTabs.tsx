"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/locale/useLocale";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export type UserTab = "all" | "deleted";

export default function UsersTabs({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("dashboard/users");

  const tabItems = [
    { id: "all" as const, label: t("tabs.all") },
    { id: "deleted" as const, label: t("tabs.deleted") },
  ];

  const getCurrentTab = (): UserTab => {
    if (pathname.includes("/deleted")) return "deleted";
    return "all";
  };

  const currentTab = getCurrentTab();

  return (
    <div className={`w-full ${className}`}>
      <div className="flex w-full bg-[var(--surface)] rounded-md overflow-hidden justify-start">
        {tabItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              href={`/${locale}/dashboard/users/${item.id}`}
              className={`
                relative whitespace-nowrap bg-[var(--surface)] 
                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full
                text-sm px-3 h-13 inline-flex items-center rounded-none
                ${
                  isActive
                    ? "text-[var(--text)] font-medium after:bg-[var(--primaryColor)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--primaryColorHover)]/2 after:bg-transparent hover:after:bg-[var(--neutralLight)]/40"
                }
              `}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
