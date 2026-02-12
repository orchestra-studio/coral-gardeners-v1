/**
 * Card Component Types
 */

export interface CardProps {
    children?: React.ReactNode;
    className?: string;
    padding?: string;
    borderRadius?: string;

    // Glass effect options
    glass?: boolean;
    glassIntensity?: 'light' | 'medium' | 'strong';

    // Advanced glass customization
    blur?: number;
    brightness?: number;
    opacity?: number;
    saturation?: number;

    // Border customization
    borderWidth?: number;

    // Additional styles
    style?: React.CSSProperties;
}

export interface GlassConfig {
    blur: number;
    brightness: number;
    opacity: number;
    saturation: number;
    borderOpacity: number;
    shadowIntensity: number;
}
