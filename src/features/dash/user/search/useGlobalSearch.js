import { useCallback, useEffect, useState } from "react";
import { globalSearch, getApiErrorMessage } from "./searchApi";

const EMPTY = { key: null, results: null, error: null };

/**
 * Page-level global search, kept out of the `userSearch` slice so the navbar
 * dropdown clearing its own results never wipes the page.
 * Previous results stay visible while a new query loads; late responses for
 * an outdated query are ignored.
 */
export function useGlobalSearch(query, { limit } = {}) {
  const q = query?.trim() ?? "";
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState(EMPTY);
  const requestKey = q ? `${q}\u0000${limit}\u0000${reloadCount}` : null;

  useEffect(() => {
    if (!requestKey) return undefined;
    let cancelled = false;
    globalSearch({ q, limit }).then(
      (results) => {
        if (!cancelled) setState({ key: requestKey, results, error: null });
      },
      (err) => {
        if (cancelled) return;
        setState((prev) => ({
          key: requestKey,
          results: prev.results,
          error: getApiErrorMessage(err, "Failed to search"),
        }));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [requestKey, q, limit]);

  const retry = useCallback(() => setReloadCount((count) => count + 1), []);

  if (!requestKey) return { results: null, loading: false, error: null, retry };
  return {
    results: state.results,
    loading: state.key !== requestKey,
    error: state.key === requestKey ? state.error : null,
    retry,
  };
}
