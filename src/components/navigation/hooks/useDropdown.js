import { useEffect, useRef, useState } from 'react';

/**
 * Open state for a click-toggled menu that closes on outside clicks and
 * Escape. While `locked` (e.g. logging out) it stays open.
 */
export function useDropdown({ locked = false } = {}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open || locked) return undefined;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, locked]);

  return {
    open,
    rootRef,
    toggle: () => setOpen((prev) => !prev),
    close: () => setOpen(false),
  };
}
