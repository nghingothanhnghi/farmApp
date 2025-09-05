// src/components/common/HoverSlideIn.tsx
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

interface HoverSlideInProps {
  children: ReactNode;
  isHovered: boolean;
  from?: "left" | "right" | "top" | "bottom";
  className?: string;
}

export function HoverSlideIn({
  children,
  isHovered,
  from = "right",
  className,
}: HoverSlideInProps) {
  const variants = {
    hidden: {
      opacity: 0,
      x: from === "left" ? -80 : from === "right" ? 80 : 0,
      y: from === "top" ? -80 : from === "bottom" ? 80 : 0,
    },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={variants}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
