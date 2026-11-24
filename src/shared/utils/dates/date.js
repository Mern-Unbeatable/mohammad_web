/**
 * Shared date formatting. Every helper accepts a Date, an ISO string or a
 * timestamp, and returns `fallback` for empty or invalid input.
 */

const DEFAULT_LOCALE = "en-US";
const MINUTE_MS = 60_000;

/** Intl presets; outputs shown for en-US (en-GB puts the day first). */
export const DATE_FORMATS = {
  /** Oct 20, 2026 */
  short: { year: "numeric", month: "short", day: "numeric" },
  /** October 20, 2026 */
  long: { year: "numeric", month: "long", day: "numeric" },
  /** October 2026 */
  monthYear: { year: "numeric", month: "long" },
  /** Oct 20 */
  monthDay: { month: "short", day: "numeric" },
  /** Oct 20, 2026, 9:05 AM */
  dateTime: { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" },
};

const resolveFormat = (format) =>
  typeof format === "string" ? DATE_FORMATS[format] : format;

/** Valid Date or null. */
export function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Date only. `format`: a DATE_FORMATS key or Intl options; omitted → numeric (10/20/2026). */
export function formatDate(value, { format, locale = DEFAULT_LOCALE, fallback = "" } = {}) {
  const date = toDate(value);
  return date ? date.toLocaleDateString(locale, resolveFormat(format)) : fallback;
}

/** Date and time. `format` defaults to `dateTime`. */
export function formatDateTime(
  value,
  { format = "dateTime", locale = DEFAULT_LOCALE, fallback = "" } = {},
) {
  const date = toDate(value);
  return date ? date.toLocaleString(locale, resolveFormat(format)) : fallback;
}

/** Time only, e.g. `formatTime(v, { format: { hour: "2-digit", minute: "2-digit" } })`. */
export function formatTime(value, { format, locale = DEFAULT_LOCALE, fallback = "" } = {}) {
  const date = toDate(value);
  return date ? date.toLocaleTimeString(locale, resolveFormat(format)) : fallback;
}

/** YYYY-MM-DD in UTC. */
export function formatIsoDate(value, { fallback = "" } = {}) {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : fallback;
}

/**
 * Time since `value`, falling back to a date after a week.
 * - `long`:  Just now · 5 min ago · 1 hour ago · Yesterday · 3 days ago · 10/20/2026
 * - `short`: Just now · 5m · 2h · 3d · Oct 20
 */
export function formatRelativeTime(
  value,
  { style = "long", now = Date.now(), fallback = "" } = {},
) {
  const date = toDate(value);
  if (!date) return fallback;

  const minutes = Math.floor((Number(now) - date.getTime()) / MINUTE_MS);
  if (minutes < 1) return "Just now";
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (style === "short") {
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return formatDate(date, { format: "monthDay" });
  }

  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(date);
}
