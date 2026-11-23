import { describe, expect, it } from "vitest";
import { parsePageParam } from "./usePageParam";

describe("parsePageParam", () => {
  it.each([
    ["1", 1],
    ["2", 2],
    [" 3 ", 3],
    ["007", 7],
  ])("reads %j as page %i", (value, page) => {
    expect(parsePageParam(value)).toBe(page);
  });

  it.each([null, undefined, "", "0", "-1", "abc", "2.5", "1e3", "2abc", "99999999999999999999"])(
    "falls back to page 1 for %j",
    (value) => {
      expect(parsePageParam(value)).toBe(1);
    },
  );
});
