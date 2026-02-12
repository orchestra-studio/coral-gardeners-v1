import React from "react";

/**
 * FloatingAnimations - CSS animations for decorative shapes
 */
export function FloatingAnimations() {
  return (
    <style jsx>{`
      @keyframes float {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-20px) rotate(5deg);
        }
      }

      @keyframes float-delayed {
        0%,
        100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-15px) rotate(-5deg);
        }
      }

      :global(.animate-float) {
        animation: float 6s ease-in-out infinite;
      }

      :global(.animate-float-delayed) {
        animation: float-delayed 8s ease-in-out infinite;
      }
    `}</style>
  );
}
