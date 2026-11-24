import { describe, expect, it } from "vitest";
import { chartYearOptions, displayNameOf } from "../utils/dashboardUtils";
import { FALLBACK_NAME } from "../constant/constants";

describe("chartYearOptions", () => {
  it("lists the current year and the two before it, newest first", () => {
    expect(chartYearOptions(2026)).toEqual(["2026", "2025", "2024"]);
  });
});

describe("displayNameOf", () => {
  it("prefers the profile name, then first + last, then the account name", () => {
    expect(displayNameOf({ profile: { name: "Novagen Labs" }, name: "x" })).toBe("Novagen Labs");
    expect(displayNameOf({ profile: { firstName: "Ana", lastName: "Silva" } })).toBe("Ana Silva");
    expect(displayNameOf({ profile: { firstName: "Ana" } })).toBe("Ana");
    expect(displayNameOf({ name: "acme" })).toBe("acme");
  });

  it("falls back when there is no user", () => {
    expect(displayNameOf(null)).toBe(FALLBACK_NAME);
  });
});
