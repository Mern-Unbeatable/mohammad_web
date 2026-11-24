import { useEffect } from 'react';
import { acquireScrollLock } from '@/shared/utils/dom/scrollLock';

/**
 * Locks page scrolling while `locked` is true. `includeRoot` also locks
 * `<html>`, which full-viewport surfaces (the mobile messenger) need on iOS.
 */
export function useBodyScrollLock(locked = true, { includeRoot = false } = {}) {
  useEffect(() => {
    if (!locked) return undefined;
    const releaseBody = acquireScrollLock(document.body);
    const releaseRoot = includeRoot ? acquireScrollLock(document.documentElement) : null;
    return () => {
      releaseRoot?.();
      releaseBody();
    };
  }, [locked, includeRoot]);
}
