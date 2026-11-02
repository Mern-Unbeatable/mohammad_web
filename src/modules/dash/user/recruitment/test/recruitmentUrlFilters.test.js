import { describe, expect, it } from "vitest";
import { parseLevelParam, publicJobFilters } from "../utils/recruitmentUrlFilters";

const params = (query) => new URLSearchParams(query);

describe("public job URL filters", () => {
  it("reads every filter, falling back to defaults", () => {
    expect(
      publicJobFilters.read(params("level=Senior&type=Contract&workplace=Remote&q=chemist")),
    ).toEqual({ level: "Senior", type: "Contract", workplace: "Remote", q: "chemist" });
    expect(publicJobFilters.read(params(""))).toEqual({
      level: "All",
      type: "All",
      workplace: "All",
      q: "",
    });
    expect(parseLevelParam("Director")).toBe("All");
  });

  it("sets a filter and resets to page 1, keeping the others", () => {
    const next = publicJobFilters.apply(params("page=3&q=qc&type=Contract"), {
      level: "Entry-level",
    });
    expect(Object.fromEntries(next)).toEqual({
      page: "1",
      q: "qc",
      type: "Contract",
      level: "Entry-level",
    });
  });

  it("drops default values so the URL stays minimal", () => {
    const next = publicJobFilters.apply(
      params("page=2&level=Senior&type=Contract&workplace=Remote&q=qc"),
      { level: "All", type: "All", workplace: "All", q: "" },
    );
    expect(next.toString()).toBe("page=1");
  });

  it("removes unknown values and leaves valid ones alone", () => {
    expect(
      publicJobFilters.normalize(params("page=2&level=Mid-level&workplace=Hybrid&q=ok")),
    ).toBeNull();

    const fixed = publicJobFilters.normalize(params("page=2&level=Director&type=Freelance"));
    expect(fixed.toString()).toBe("page=2");
  });
});
