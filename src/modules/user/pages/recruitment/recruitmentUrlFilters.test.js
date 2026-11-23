import { describe, expect, it } from "vitest";
import { parseLevelParam, recruitmentFilters } from "./recruitmentUrlFilters";

const params = (query) => new URLSearchParams(query);

describe("recruitment URL filters", () => {
  it("reads level and search, falling back to defaults", () => {
    expect(recruitmentFilters.read(params("level=Senior&q=chemist"))).toEqual({
      level: "Senior",
      q: "chemist",
    });
    expect(recruitmentFilters.read(params(""))).toEqual({ level: "All", q: "" });
    expect(parseLevelParam("Director")).toBe("All");
  });

  it("sets a level and resets to page 1, keeping the search", () => {
    const next = recruitmentFilters.apply(params("page=3&q=qc"), { level: "Entry-level" });
    expect(Object.fromEntries(next)).toEqual({ page: "1", q: "qc", level: "Entry-level" });
  });

  it("drops default values so the URL stays minimal", () => {
    const next = recruitmentFilters.apply(params("page=2&level=Senior&q=qc"), {
      level: "All",
      q: "",
    });
    expect(next.toString()).toBe("page=1");
  });

  it("removes an unknown level and leaves valid ones alone", () => {
    expect(recruitmentFilters.normalize(params("page=2&level=Mid-level&q=ok"))).toBeNull();

    const fixed = recruitmentFilters.normalize(params("page=2&level=Director"));
    expect(fixed.toString()).toBe("page=2");
  });
});
