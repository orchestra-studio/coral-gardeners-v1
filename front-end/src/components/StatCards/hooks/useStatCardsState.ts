import { useState, useEffect, useCallback } from "react";
import { BaseCard } from "../types";
import { StatCardData } from "../types";
import { convertCardToStat } from "../utils";

/**
 * Hook to manage stat cards state and reordering
 */
export function useStatCardsState(
    data: StatCardData[],
    onReorder?: (newOrder: StatCardData[]) => void
) {
    const [stats, setStats] = useState<StatCardData[]>(data);

    // Update local state when data changes
    useEffect(() => {
        setStats(data);
    }, [data]);

    // Handle reordering of cards
    const handleReorder = useCallback(
        (newOrder: BaseCard[]) => {
            const updatedStats = newOrder.map(convertCardToStat);
            setStats(updatedStats);
            if (onReorder) {
                onReorder(updatedStats);
            }
        },
        [onReorder]
    );

    return { stats, handleReorder };
}
