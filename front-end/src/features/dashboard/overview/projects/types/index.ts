/**
 * Type definitions for Projects Table Widget
 */

import { ReactNode } from "react";

export interface ProjectDisplay {
    id: string;
    name: string;
    description: string;
    status: "in-progress" | "ready" | "blocked";
    date: string;
    version: string;
    icon: ReactNode;
    image: string;
}

export type Locale = "en" | "ar";
