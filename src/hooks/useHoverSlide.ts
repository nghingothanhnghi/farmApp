// src/hooks/useHoverSlide.ts
import { useState, useCallback } from "react";

export function useHoverSlide() {
  const [isHovered, setIsHovered] = useState(false);

  const bind = {
    onMouseEnter: useCallback(() => setIsHovered(true), []),
    onMouseLeave: useCallback(() => setIsHovered(false), []),
  };

  return { isHovered, bind };
}
