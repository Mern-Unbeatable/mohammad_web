const locks = new Map();

/**
 * Sets `overflow: hidden` on `element` and returns a release function.
 * Locks are counted per element: the inline overflow that was present before
 * the first lock is restored only when the last holder releases, so stacked
 * overlays (drawer + modal, modal + nested modal) cannot unlock each other.
 */
export function acquireScrollLock(element) {
  if (!element) return () => {};

  const entry = locks.get(element);
  if (entry) {
    entry.count += 1;
  } else {
    locks.set(element, { count: 1, previous: element.style.overflow });
    element.style.overflow = 'hidden';
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    const current = locks.get(element);
    if (!current) return;
    current.count -= 1;
    if (current.count === 0) {
      element.style.overflow = current.previous;
      locks.delete(element);
    }
  };
}
