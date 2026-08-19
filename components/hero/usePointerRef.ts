"use client";

import { useEffect, useRef } from "react";

export interface NormalizedPointer {
  x: number;
  y: number;
}

/**
 * Tracks the viewport-wide pointer position in normalized device coordinates
 * (-1..1, y-up), independent of any single DOM element. Used instead of R3F's
 * built-in `state.pointer` so parallax keeps tracking even while the canvas
 * sits behind pointer-events:none (letting clicks pass through to the CTAs).
 */
export function usePointerRef() {
  const pointer = useRef<NormalizedPointer>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return pointer;
}
