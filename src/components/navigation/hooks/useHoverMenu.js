import { useEffect, useRef, useState } from 'react';
import { HOVER_CLOSE_DELAY_MS, HOVER_OPEN_DELAY_MS } from '../constant/constants';

/**
 * Delayed open/close for a hover or focus panel. `onOpen` runs each time the
 * panel opens so its content stays fresh.
 */
export function useHoverMenu(onOpen) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const show = () => {
    clearTimeout(timerRef.current);
    if (open) return;
    timerRef.current = setTimeout(() => {
      setOpen(true);
      onOpen?.();
    }, HOVER_OPEN_DELAY_MS);
  };

  const hide = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), HOVER_CLOSE_DELAY_MS);
  };

  const close = () => {
    clearTimeout(timerRef.current);
    setOpen(false);
  };

  return { open, show, hide, close };
}
