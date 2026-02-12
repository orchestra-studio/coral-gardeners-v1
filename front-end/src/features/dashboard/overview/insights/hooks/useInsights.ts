import { useState } from "react";

interface UseInsightsReturn {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function useInsights(): UseInsightsReturn {
    const [activeTab, setActiveTab] = useState<string>("performance");

    return {
        activeTab,
        setActiveTab,
    };
}

