import { useEffect, useState } from "react";

interface UseResponsiveChartHeightOptions {
    breakpoint?: number;
    compactHeight: number;
    expandedHeight?: number;
}

/**
 * Returns a chart height that switches between a fixed compact height on small screens
 * and a flexible height (typically zero for flex layouts) once the viewport exceeds
 * the provided breakpoint. This avoids ResponsiveContainer warnings when the parent
 * element has no intrinsic height on mobile layouts.
 */
export function useResponsiveChartHeight({
    breakpoint = 1024,
    compactHeight,
    expandedHeight = 0,
}: UseResponsiveChartHeightOptions) {
    const [useExpandedHeight, setUseExpandedHeight] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setUseExpandedHeight(window.innerWidth >= breakpoint);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return useExpandedHeight ? expandedHeight : compactHeight;
}
