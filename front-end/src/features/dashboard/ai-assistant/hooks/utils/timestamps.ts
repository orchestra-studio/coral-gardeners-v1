import { useCallback, useRef } from "react";

/**
 * Hook for managing message timestamps
 */
export function useTimestamps() {
    const timestampsRef = useRef(new Map<string, Date>());

    const getTimestamp = useCallback((id: string) => {
        const existing = timestampsRef.current.get(id);
        if (existing) {
            return existing;
        }
        const created = new Date();
        timestampsRef.current.set(id, created);
        return created;
    }, []);

    const clearTimestamps = useCallback(() => {
        timestampsRef.current.clear();
    }, []);

    return {
        getTimestamp,
        clearTimestamps,
    };
}
