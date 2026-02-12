import { SelectOption } from "@/components/ui/input";

export interface FilterField {
    name: string;
    label: string;
    type: "text" | "number" | "select" | "date" | "search";
    placeholder?: string;
    options?: SelectOption[];
    className?: string;
}

export interface FilterProps {
    fields: FilterField[];
    onFilter: (data: Record<string, unknown>) => void;
    onReset: () => void;
    defaultValues?: Record<string, unknown>;
    className?: string;
    loading?: boolean;
    filterButtonLabel?: string;
    resetButtonLabel?: string;
    enableNoise?: boolean;
    enableLighting?: boolean;
}
