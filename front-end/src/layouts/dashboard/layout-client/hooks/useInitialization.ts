import { useLayoutEffect } from "react";
import { MOBILE_BREAKPOINT } from "../constants";
import { applyDomFlags } from "../utils/dom-helpers";

interface UseInitializationProps {
    isCollapsed: boolean;
    setIsInitialized: (value: boolean) => void;
    setIsMobile: (value: boolean) => void;
    handleCollapseChange: (collapsed: boolean) => void;
}

/**
 * Custom hook to handle component initialization and window resize
 */
export function useInitialization({
    isCollapsed,
    setIsInitialized,
    setIsMobile,
    handleCollapseChange,
}: UseInitializationProps) {
    useLayoutEffect(() => {
        applyDomFlags(isCollapsed);
        setIsInitialized(true);

        const handleResize = () => {
            const nowMobile = window.innerWidth < MOBILE_BREAKPOINT;
            setIsMobile(nowMobile);
            if (nowMobile && !isCollapsed) {
                handleCollapseChange(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
