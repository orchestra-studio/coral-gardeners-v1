import { useCallback, useEffect } from "react";

export default function useLockXScroll() {
    const lock = useCallback(() => {
        try {
            const html = document.documentElement;
            const body = document.body;
            html.style.overflow = "hidden";
            body.style.overflow = "hidden";
        } catch { }
    }, []);

    const unlock = useCallback(() => {
        try {
            const html = document.documentElement;
            const body = document.body;
            html.style.overflow = "";
            body.style.overflow = "";
        } catch { }
    }, []);

    useEffect(() => {
        return () => {
            unlock();
        };
    }, [unlock]);

    return { lock, unlock };
}
