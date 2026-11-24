import { useCallback, useState } from 'react';

function readStored(key, fallback, isValid) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const value = JSON.parse(raw);
    return !isValid || isValid(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

/**
 * `useState` persisted to localStorage under `key`.
 * Stored values failing `isValid` (or unparsable JSON) fall back to `defaultValue`.
 */
export function useLocalStorageState(key, defaultValue, { isValid } = {}) {
  const [value, setValue] = useState(() => readStored(key, defaultValue, isValid));

  const setStored = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Storage can be unavailable (private mode, quota); keep in-memory state.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, setStored];
}
