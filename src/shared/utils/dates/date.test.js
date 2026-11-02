import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatIsoDate,
  formatRelativeTime,
  formatTime,
  toDate,
} from "./date";

const OCT_20 = new Date(2026, 9, 20, 9, 5);
const NOW = OCT_20.getTime();
const minutesAgo = (n) => new Date(NOW - n * 60_000);

describe("toDate", () => {
  it("returns null for empty or invalid input", () => {
    expect(toDate(null)).toBeNull();
    expect(toDate("")).toBeNull();
    expect(toDate("not a date")).toBeNull();
  });

  it("accepts Dates, strings and timestamps", () => {
    expect(toDate(OCT_20)).toBe(OCT_20);
    expect(toDate(NOW).getTime()).toBe(NOW);
    expect(toDate("2026-10-20T00:00:00Z")).toBeInstanceOf(Date);
  });
});

describe("formatDate", () => {
  it("formats presets", () => {
    expect(formatDate(OCT_20, { format: "short" })).toBe("Oct 20, 2026");
    expect(formatDate(OCT_20, { format: "long" })).toBe("October 20, 2026");
    expect(formatDate(OCT_20, { format: "monthYear" })).toBe("October 2026");
    expect(formatDate(OCT_20, { format: "monthDay" })).toBe("Oct 20");
    expect(formatDate(OCT_20)).toBe("10/20/2026");
  });

  it("respects locale", () => {
    expect(formatDate(OCT_20, { format: "long", locale: "en-GB" })).toBe("20 October 2026");
    expect(formatDate(OCT_20, { locale: "en-GB" })).toBe("20/10/2026");
  });

  it("returns the fallback for empty or invalid input", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("nope", { fallback: "—" })).toBe("—");
  });
});

describe("formatDateTime / formatTime / formatIsoDate", () => {
  it("formats date and time", () => {
    expect(formatDateTime(OCT_20)).toBe("Oct 20, 2026, 9:05 AM");
    expect(formatTime(OCT_20, { format: { hour: "numeric", minute: "2-digit" } })).toBe("9:05 AM");
  });

  it("formats ISO dates in UTC", () => {
    expect(formatIsoDate("2026-10-20T12:00:00Z")).toBe("2026-10-20");
    expect(formatIsoDate(null, { fallback: "—" })).toBe("—");
  });
});

describe("formatRelativeTime", () => {
  const long = (date) => formatRelativeTime(date, { now: NOW });
  const short = (date) => formatRelativeTime(date, { now: NOW, style: "short" });

  it("long style", () => {
    expect(long(minutesAgo(0))).toBe("Just now");
    expect(long(minutesAgo(5))).toBe("5 min ago");
    expect(long(minutesAgo(60))).toBe("1 hour ago");
    expect(long(minutesAgo(180))).toBe("3 hours ago");
    expect(long(minutesAgo(24 * 60))).toBe("Yesterday");
    expect(long(minutesAgo(3 * 24 * 60))).toBe("3 days ago");
    expect(long(new Date(2026, 9, 1))).toBe("10/1/2026");
  });

  it("short style", () => {
    expect(short(minutesAgo(5))).toBe("5m");
    expect(short(minutesAgo(120))).toBe("2h");
    expect(short(minutesAgo(3 * 24 * 60))).toBe("3d");
    expect(short(new Date(2026, 9, 1))).toBe("Oct 1");
  });

  it("returns the fallback for invalid input", () => {
    expect(formatRelativeTime(undefined)).toBe("");
  });
});
