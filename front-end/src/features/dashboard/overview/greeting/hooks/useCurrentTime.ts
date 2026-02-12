import { useState, useEffect } from "react";

/**
 * Hook to manage current time state, updating every minute
 */
export function useCurrentTime(): Date {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    return currentTime;
}
