import { PAGE_PARAM } from '@/shared/hooks/usePageParam';

export const SEARCH_PARAM = 'q';
/** Matches the API's `search` max length. */
export const SEARCH_MAX_LENGTH = 200;

export const parseSearchParam = (value) =>
  typeof value === 'string' ? value.slice(0, SEARCH_MAX_LENGTH) : '';

/** `value` when it is one of `options`, otherwise `fallback`. */
export const parseOptionParam = (value, options, fallback) =>
  options.includes(value) ? value : fallback;

/**
 * Query-string filters for a list page.
 * `schema` maps each param to `{ parse, fallback }`, where `parse(raw)` returns
 * `fallback` for missing or invalid values.
 */
export function createUrlFilters(schema) {
  const keys = Object.keys(schema);

  /** Current filter values, keyed by param name. */
  const read = (params) =>
    Object.fromEntries(keys.map((key) => [key, schema[key].parse(params.get(key))]));

  /**
   * Apply filter changes and go back to page 1.
   * Fallback values are dropped so the plain `?page=1` URL stays canonical.
   */
  const apply = (params, changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (value == null || value === schema[key]?.fallback) next.delete(key);
      else next.set(key, value);
    });
    next.set(PAGE_PARAM, '1');
    return next;
  };

  /** Fix or drop invalid filter params; returns null when nothing changes. */
  const normalize = (params) => {
    const next = new URLSearchParams(params);
    let changed = false;
    keys.forEach((key) => {
      const raw = params.get(key);
      if (raw === null) return;
      const value = schema[key].parse(raw);
      if (value === raw) return;
      if (value === schema[key].fallback) next.delete(key);
      else next.set(key, value);
      changed = true;
    });
    return changed ? next : null;
  };

  return { read, apply, normalize };
}
