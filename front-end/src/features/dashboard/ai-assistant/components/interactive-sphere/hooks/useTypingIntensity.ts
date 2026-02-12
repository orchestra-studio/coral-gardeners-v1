import { useRef, useEffect } from "react";
import { SPHERE_CONFIG } from "../config";

export function useTypingIntensity(typedText: string) {
    const lastTextRef = useRef<string>("");
    const lastTimeRef = useRef<number>(Date.now());
    const intensityRef = useRef<number>(0);

    useEffect(() => {
        const currentTime = Date.now();
        const timeDelta = currentTime - lastTimeRef.current;
        const textDelta = Math.abs(typedText.length - lastTextRef.current.length);

        let typingSpeed = 0;
        if (timeDelta > 0 && timeDelta < 5000) {
            typingSpeed = (textDelta / timeDelta) * 1000;
        }

        intensityRef.current = Math.min(
            typingSpeed / SPHERE_CONFIG.maxTypingSpeed,
            1
        );

        lastTextRef.current = typedText;
        lastTimeRef.current = currentTime;
    }, [typedText]);

    return intensityRef;
}
