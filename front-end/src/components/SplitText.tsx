import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = React.memo(
  ({
    text,
    className = "",
    delay = 100,
    duration = 0.6,
    ease = "power3.out",
    splitType = "chars",
    from = { opacity: 0, y: 40 },
    to = { opacity: 1, y: 0 },
    threshold = 0.1,
    rootMargin = "-100px",
    tag = "p",
    textAlign = "center",
    onLetterAnimationComplete,
  }) => {
    const ref = useRef<HTMLParagraphElement>(null);
    const animationCompletedRef = useRef(false);
    const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

    // Memoize from and to objects to prevent unnecessary re-renders
    const fromMemo = useMemo(() => from, [JSON.stringify(from)]);
    const toMemo = useMemo(() => to, [JSON.stringify(to)]);

    useEffect(() => {
      if (document.fonts.status === "loaded") {
        setFontsLoaded(true);
      } else {
        document.fonts.ready.then(() => {
          setFontsLoaded(true);
        });
      }
    }, []);

    useGSAP(
      () => {
        if (!ref.current || !text || !fontsLoaded) return;
        const el = ref.current as HTMLElement & {
          _rbsplitInstance?: GSAPSplitText;
        };

        if (el._rbsplitInstance) {
          try {
            el._rbsplitInstance.revert();
          } catch {
            // ignore revert errors
          }
          el._rbsplitInstance = undefined;
        }

        const startPct = (1 - threshold) * 100;
        const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(
          rootMargin
        );
        const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
        const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
        const sign =
          marginValue === 0
            ? ""
            : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
        const start = `top ${startPct}%${sign}`;
        let targets: Element[] = [];
        const assignTargets = (self: GSAPSplitText) => {
          if (
            splitType.includes("chars") &&
            (self as GSAPSplitText).chars?.length
          )
            targets = (self as GSAPSplitText).chars;
          if (
            !targets.length &&
            splitType.includes("words") &&
            self.words.length
          )
            targets = self.words;
          if (
            !targets.length &&
            splitType.includes("lines") &&
            self.lines.length
          )
            targets = self.lines;
          if (!targets.length) targets = self.chars || self.words || self.lines;
        };
        const splitInstance = new GSAPSplitText(el, {
          type: splitType,
          smartWrap: true,
          autoSplit: splitType === "lines",
          linesClass: "split-line",
          wordsClass: "split-word",
          charsClass: "split-char",
          reduceWhiteSpace: false,
          onSplit: (self: GSAPSplitText) => {
            assignTargets(self);
            return gsap.fromTo(
              targets,
              { ...fromMemo },
              {
                ...toMemo,
                duration,
                ease,
                stagger: delay / 1000,
                scrollTrigger: {
                  trigger: el,
                  start,
                  once: true,
                  fastScrollEnd: true,
                  anticipatePin: 0.4,
                },
                onComplete: () => {
                  animationCompletedRef.current = true;
                  onLetterAnimationComplete?.();
                },
                willChange: "transform, opacity",
                force3D: true,
              }
            );
          },
        });
        el._rbsplitInstance = splitInstance;
        return () => {
          ScrollTrigger.getAll().forEach((st) => {
            if (st.trigger === el) st.kill();
          });
          try {
            splitInstance.revert();
          } catch {
            // ignore revert errors
          }
          el._rbsplitInstance = undefined;
        };
      },
      {
        dependencies: [
          text,
          delay,
          duration,
          ease,
          splitType,
          fromMemo,
          toMemo,
          threshold,
          rootMargin,
          fontsLoaded,
        ],
        scope: ref,
      }
    );

    // Memoize style and classes to prevent recalculation
    const style: React.CSSProperties = useMemo(
      () => ({
        textAlign,
        wordWrap: "break-word",
        willChange: "transform, opacity",
      }),
      [textAlign]
    );

    const classes = useMemo(
      () =>
        `split-parent overflow-hidden inline-block whitespace-normal ${className}`,
      [className]
    );

    const renderTag = useCallback(() => {
      const props = {
        ref,
        style,
        className: classes,
      };

      switch (tag) {
        case "h1":
          return <h1 {...props}>{text}</h1>;
        case "h2":
          return <h2 {...props}>{text}</h2>;
        case "h3":
          return <h3 {...props}>{text}</h3>;
        case "h4":
          return <h4 {...props}>{text}</h4>;
        case "h5":
          return <h5 {...props}>{text}</h5>;
        case "h6":
          return <h6 {...props}>{text}</h6>;
        case "span":
          return <span {...props}>{text}</span>;
        default:
          return <p {...props}>{text}</p>;
      }
    }, [tag, text, style, classes]);

    return renderTag();
  }
);

SplitText.displayName = "SplitText";

export default SplitText;
