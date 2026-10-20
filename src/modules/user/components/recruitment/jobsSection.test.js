import { describe, expect, it } from "vitest";
import {
  buildMyJobsQuery,
  jobCount,
  matchesStatusFilter,
  nextJobStatus,
} from "./jobsSection";

describe("buildMyJobsQuery", () => {
  it("always scopes to the caller's jobs with pagination", () => {
    expect(buildMyJobsQuery({ page: 2, pageSize: 5, status: "all" })).toEqual({
      page: 2,
      pageSize: 5,
      sort: "desc",
      mine: true,
    });
  });

  it("adds trimmed search, level and a concrete status", () => {
    expect(
      buildMyJobsQuery({
        page: 1,
        pageSize: 5,
        query: "  lab ",
        level: "SENIOR",
        status: "CLOSED",
      }),
    ).toMatchObject({ search: "lab", level: "SENIOR", status: "CLOSED" });
  });

  it("adds employment and workplace type when set", () => {
    expect(
      buildMyJobsQuery({
        page: 1,
        pageSize: 5,
        employmentType: "CONTRACT",
        workplaceType: "REMOTE",
      }),
    ).toMatchObject({ employmentType: "CONTRACT", workplaceType: "REMOTE" });
  });
});

describe("job status helpers", () => {
  it("toggles between open and closed", () => {
    expect(nextJobStatus({ status: "OPEN" })).toBe("CLOSED");
    expect(nextJobStatus({ status: "CLOSED" })).toBe("OPEN");
  });

  it("matches the active status tab", () => {
    expect(matchesStatusFilter("all", "CLOSED")).toBe(true);
    expect(matchesStatusFilter("OPEN", "OPEN")).toBe(true);
    expect(matchesStatusFilter("OPEN", "CLOSED")).toBe(false);
  });

  it("hides the title count while loading", () => {
    expect(jobCount(true, 3)).toBeNull();
    expect(jobCount(false, 4)).toBe(4);
    expect(jobCount(false, undefined)).toBe(0);
  });
});
