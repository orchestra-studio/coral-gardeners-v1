import { GlassConfig } from '../types';

/**
 * Glass effect configurations for different intensities
 */
export const GLASS_PRESETS: Record<'light' | 'medium' | 'strong', GlassConfig> = {
    light: {
        blur: 8,
        brightness: 1.05,
        opacity: 0.7,
        saturation: 1.2,
        borderOpacity: 0.2,
        shadowIntensity: 0.1,
    },
    medium: {
        blur: 12,
        brightness: 1.1,
        opacity: 0.75,
        saturation: 1.5,
        borderOpacity: 0.3,
        shadowIntensity: 0.15,
    },
    strong: {
        blur: 16,
        brightness: 1.15,
        opacity: 0.8,
        saturation: 1.8,
        borderOpacity: 0.4,
        shadowIntensity: 0.2,
    },
};

/**
 * Default card configuration
 */
export const DEFAULT_CARD_CONFIG = {
    padding: 'p-6',
    borderRadius: 'rounded-2xl',
    glassIntensity: 'medium' as const,
};
