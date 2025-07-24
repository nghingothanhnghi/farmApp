// src/components/common/Tooltip.tsx
import React, { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: ReactElement<any>; // child must be a single valid React element
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (visible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 8,
      });
    }
  }, [visible]);

  const cloned = React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      triggerRef.current = node;
      const { ref } = children as any;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    onMouseEnter: () => setVisible(true),
    onMouseLeave: () => setVisible(false),
    onFocus: () => setVisible(true),     // optional: for keyboard accessibility
    onBlur: () => setVisible(false),     // optional: for keyboard accessibility
  });

  return (
    <>
      {cloned}
      {visible &&
        createPortal(
          <div
            className="fixed z-50 px-2 py-1 text-xs text-white bg-zinc-900 rounded shadow transition-opacity duration-150 pointer-events-none"
            style={{ top: coords.top, left: coords.left, transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
