import { useState } from "react";

export function useFileActionsMenu() {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [visible, setVisible] = useState(false);

  const openAtCursor = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const x = e.clientX, y = e.clientY;
    const w = 200, h = 200;
    setPosition({
      left: x + w > window.innerWidth ? x - w : x,
      top: y + h > window.innerHeight ? y - h : y,
    });
    setVisible(true);
  };

  const openAtButton = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left, y = rect.bottom + 5;
    const w = 200, h = 200;
    setPosition({
      left: x + w > window.innerWidth ? x - w + rect.width : x,
      top: y + h > window.innerHeight ? rect.top - h - 5 : y,
    });
    setVisible(true);
  };

  return { position, visible, setVisible, openAtCursor, openAtButton };
}
