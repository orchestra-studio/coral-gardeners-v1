"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

type PopoverContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
> & {
  fullScreen?: boolean;
};

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  PopoverContentProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      fullScreen = false,
      ...props
    },
    ref
  ) => {
    const localRef =
      React.useRef<React.ElementRef<typeof PopoverPrimitive.Content>>(null);

    const setRef = React.useCallback(
      (node: React.ElementRef<typeof PopoverPrimitive.Content>) => {
        localRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (
            ref as React.MutableRefObject<React.ElementRef<
              typeof PopoverPrimitive.Content
            > | null>
          ).current = node;
        }
      },
      [ref]
    );

    React.useEffect(() => {
      if (!fullScreen) return;
      const node = localRef.current;
      if (!node) return;
      const wrapper = node.parentElement;
      if (!wrapper) return;

      const trackedProperties = [
        "position",
        "inset",
        "top",
        "left",
        "right",
        "bottom",
        "width",
        "height",
        "transform",
        "z-index",
      ] as const;
      const previousStyles = new Map<string, string>();
      trackedProperties.forEach((prop) => {
        previousStyles.set(prop, wrapper.style.getPropertyValue(prop));
      });
      const previousDataAttr = wrapper.getAttribute("data-fullscreen-popover");

      let isApplying = false;

      const applyFullscreenStyles = () => {
        if (isApplying) return;
        isApplying = true;
        wrapper.setAttribute("data-fullscreen-popover", "true");
        wrapper.style.setProperty("position", "fixed", "important");
        wrapper.style.setProperty("inset", "0px", "important");
        wrapper.style.setProperty("top", "0px", "important");
        wrapper.style.setProperty("left", "0px", "important");
        wrapper.style.setProperty("right", "0px", "important");
        wrapper.style.setProperty("bottom", "0px", "important");
        wrapper.style.setProperty("width", "100vw", "important");
        wrapper.style.setProperty("height", "100dvh", "important");
        wrapper.style.setProperty("transform", "none", "important");
        wrapper.style.setProperty("z-index", "999999", "important");
        requestAnimationFrame(() => {
          isApplying = false;
        });
      };

      applyFullscreenStyles();

      const observer = new MutationObserver((mutations) => {
        if (!mutations.some((m) => m.attributeName === "style")) return;
        applyFullscreenStyles();
      });

      observer.observe(wrapper, {
        attributes: true,
        attributeFilter: ["style"],
      });

      return () => {
        observer.disconnect();
        trackedProperties.forEach((prop) => {
          const previous = previousStyles.get(prop) ?? "";
          if (previous) {
            wrapper.style.setProperty(prop, previous);
          } else {
            wrapper.style.removeProperty(prop);
          }
        });
        if (previousDataAttr === null) {
          wrapper.removeAttribute("data-fullscreen-popover");
        } else {
          wrapper.setAttribute("data-fullscreen-popover", previousDataAttr);
        }
      };
    }, [fullScreen]);

    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={setRef}
          data-slot="popover-content"
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
            fullScreen && "h-full w-full rounded-none border-0 p-0 shadow-none",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  }
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
