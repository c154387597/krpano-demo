import React, { useRef, FC } from "react";

export interface MouseHoldViewProps {
  children?: React.ReactNode;
  onHold: () => void;
}

export const MouseHoldView: FC<MouseHoldViewProps> = ({ children, onHold }) => {
  const isMouseHeld = useRef(false);
  const requestIdRef = useRef<number | null>(null);

  const handleMouseDown = () => {
    isMouseHeld.current = true;
    requestAnimationFrame(checkMouseHold);
  };

  const handleMouseUp = () => {
    isMouseHeld.current = false;
    requestIdRef.current && cancelAnimationFrame(requestIdRef.current);
  };

  const checkMouseHold = () => {
    if (isMouseHeld.current) {
      onHold();
      requestIdRef.current = requestAnimationFrame(checkMouseHold);
    }
  };

  return (
    <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      {children}
    </div>
  );
};
