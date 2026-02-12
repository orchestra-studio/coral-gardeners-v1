import { useEffect, RefObject, useRef } from "react";
import { gsap } from "gsap";

export function useWelcomeAnimation(
    sphereRef: RefObject<HTMLDivElement | null>,
    inputContainerRef: RefObject<HTMLDivElement | null>,
    hasMessages: boolean,
    onAnimationComplete?: () => void
) {
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        const sphereElement = sphereRef.current;
        const inputElement = inputContainerRef.current;

        if (!hasMessages && sphereElement && inputElement && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;

            // Set initial state with scale
            gsap.set(sphereElement, {
                scale: 0.4,
                opacity: 0,
                y: -20,
                transformOrigin: "center center",
            });

            gsap.set(inputElement, {
                opacity: 0,
                y: 30,
            });

            const tl = gsap.timeline({
                defaults: {
                    ease: "power3.out",
                },
                onComplete: () => {
                    // Trigger re-render of canvas after animation
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                },
            });

            // Animate with scale
            tl.to(sphereElement, {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1.4,
                ease: "back.out(1.4)",
                transformOrigin: "center center",
            }).to(
                inputElement,
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                },
                "-=0.6"
            );
        }

        // Reset animation flag when messages appear
        if (hasMessages) {
            hasAnimatedRef.current = false;
        }

        // Cleanup function to reset transforms when component unmounts or hasMessages changes
        return () => {
            if (sphereElement) {
                gsap.set(sphereElement, { clearProps: "all" });
            }
            if (inputElement) {
                gsap.set(inputElement, { clearProps: "all" });
            }
        };
    }, [hasMessages, sphereRef, inputContainerRef, onAnimationComplete]);
}
