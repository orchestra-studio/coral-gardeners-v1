export const CHART_CONFIG = {
    height: 0, // Allow flex layouts on large viewports
    compactHeight: 260, // Fixed height for smaller screens to keep chart visible
    breakpoint: 1024, // Switch to flex height at this viewport width
    showGrid: true,
    showLegend: false,
    showTooltip: true,
    layout: "horizontal" as const,
    barRadius: [20, 20, 20, 20] as [number, number, number, number],
};

export const THEME_CONFIG = {
    colorVariable: "--chart-series-1",
    fallbackColor: "#e2e8f0",
};
