import { useState, useEffect } from "react";
import { getMainContentMargin } from "../utils/margin-calculator";

/**
 * Custom hook to manage main content margin/padding
 * Recalculates when window resizes or sidebar collapse state changes
 */
export function useMainContentMargin(isCollapsed: boolean): string {
    const [margin, setMargin] = useState<string>(() =>
        getMainContentMargin(isCollapsed)
    );

    useEffect(() => {
        // Update margin when collapse state changes
        setMargin(getMainContentMargin(isCollapsed));
    }, [isCollapsed]);

    useEffect(() => {
        // Update margin when window resizes
        const handleResize = () => {
            setMargin(getMainContentMargin(isCollapsed));
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isCollapsed]);

    return margin;
}
