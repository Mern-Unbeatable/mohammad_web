import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';

export const PAGE_PARAM = 'page';

/** `?page=` as a positive integer; missing, malformed or < 1 falls back to 1. */
export function parsePageParam(value) {
  const text = typeof value === 'string' ? value.trim() : '';
  if (!/^\d+$/.test(text)) return 1;
  const page = Number(text);
  return Number.isSafeInteger(page) && page >= 1 ? page : 1;
}

/**
 * Current page from the URL plus a setter that keeps other query params.
 * Non-canonical values (e.g. `?page=abc`, `?page=0`) are rewritten in place.
 */
export function usePageParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get(PAGE_PARAM);
  const page = parsePageParam(raw);

  const setPage = useCallback(
    (next, { replace = false } = {}) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set(PAGE_PARAM, String(parsePageParam(String(next))));
          return params;
        },
        { replace },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (raw !== String(page)) setPage(page, { replace: true });
  }, [raw, page, setPage]);

  return [page, setPage];
}
