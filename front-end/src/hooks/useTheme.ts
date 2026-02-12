"use client";

import { useEffect, useState } from 'react';

/**
 * Hook to detect dark mode by observing the "dark" class on the <html> element
 */
export const useDarkMode = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const htmlElement = document.documentElement;

        // Set initial state
        setIsDark(htmlElement.classList.contains('dark'));

        // Create a MutationObserver to watch for class changes
        const observer = new MutationObserver(() => {
            setIsDark(htmlElement.classList.contains('dark'));
        });

        // Observe changes to the class attribute
        observer.observe(htmlElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return isDark;
};

/**
 * Hook to get CSS variable value with fallback
 */
export const useThemeColor = (cssVariable: string, fallback: string) => {
    const [color, setColor] = useState<string>(cssVariable);

    useEffect(() => {
        const updateThemeValues = () => {
            const rootStyles = getComputedStyle(document.documentElement);
            const value = rootStyles.getPropertyValue(cssVariable).trim();
            setColor(value || fallback);
        };

        updateThemeValues();

        const observer = new MutationObserver(updateThemeValues);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, [cssVariable, fallback]);

    return color;
};

/**
 * Hook to detect browser support for backdrop-filter
 */
export const useBackdropFilterSupport = () => {
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setSupported(CSS.supports('backdrop-filter', 'blur(10px)'));
    }, []);

    return supported;
};
