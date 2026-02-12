import { GlassConfig } from '../types';

/**
 * Generate glass effect styles based on dark mode and browser support
 */
export const getGlassStyles = (
    config: GlassConfig,
    isDark: boolean,
    supportsBackdrop: boolean
): React.CSSProperties => {
    const { blur, brightness, opacity, saturation, borderOpacity, shadowIntensity } = config;

    if (supportsBackdrop) {
        return {
            background: isDark
                ? `rgba(255, 255, 255, ${opacity * 0.1})`
                : `rgba(255, 255, 255, ${opacity * 0.25})`,
            backdropFilter: `blur(${blur}px) saturate(${saturation}) brightness(${brightness})`,
            WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}) brightness(${brightness})`,
            border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
            boxShadow: isDark
                ? `0 0 2px 1px rgba(255, 255, 255, ${shadowIntensity * 0.3}) inset,
           0 0 10px 4px rgba(255, 255, 255, ${shadowIntensity * 0.15}) inset,
           0px 4px 16px rgba(0, 0, 0, ${shadowIntensity}),
           0px 8px 24px rgba(0, 0, 0, ${shadowIntensity}),
           0px 16px 56px rgba(0, 0, 0, ${shadowIntensity})`
                : `0 2px 8px rgba(0, 0, 0, 0.06),
           0 4px 16px rgba(0, 0, 0, 0.04)`,
        };
    } else {
        // Fallback for browsers without backdrop-filter support
        return {
            background: isDark ? `rgba(0, 0, 0, ${opacity * 0.4})` : `rgba(255, 255, 255, ${opacity * 0.4})`,
            border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
            boxShadow: `inset 0 1px 0 0 rgba(255, 255, 255, ${borderOpacity}),
                  inset 0 -1px 0 0 rgba(255, 255, 255, ${borderOpacity * 0.5})`,
        };
    }
};

/**
 * Generate regular card styles (non-glass)
 */
export const getRegularStyles = (): React.CSSProperties => {
    return {
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    };
};
