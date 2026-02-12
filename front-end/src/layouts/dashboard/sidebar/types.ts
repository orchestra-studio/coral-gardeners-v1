import React from "react";
import type { MultilingualText } from "./config/navigationData";

// Extract route types programmatically from the config
export type ExtractRoutes<T> = T extends readonly (infer U)[]
    ? U extends { type: "item"; route: infer R }
    ? R
    : U extends {
        type: "parent";
        route: infer R;
        children: readonly (infer C)[];
    }
    ? R | (C extends { type: "item"; route: infer CR } ? CR : never)
    : never
    : never;

// Base types for navigation structure with multilingual support
export interface SidebarItem<TRoute = string> {
    type: "item";
    icon: React.ReactNode;
    title: MultilingualText;
    description: MultilingualText;
    route: TRoute;
    path: string;
    category: string;
    badge?: string;
    target?: "_blank" | "_self";
}

export interface SidebarParent<TRoute = string> {
    type: "parent";
    icon: React.ReactNode;
    title: MultilingualText;
    description: MultilingualText;
    route: TRoute;
    path: string;
    category: string;
    badge?: string;
    children: SidebarItem<TRoute>[];
}

export interface SidebarSection {
    type: "section";
    title: MultilingualText;
}

export type NavElement<TRoute = string> = SidebarItem<TRoute> | SidebarParent<TRoute> | SidebarSection;

// Brand configuration types
export interface BrandConfig {
    nameKey: string; // Translation key instead of hardcoded name
    icon: React.ReactNode;
    customBrand: React.ReactNode | null;
}
