import { describe, expect, it } from "vitest";
import {
  buildPublicJobsQuery,
  buildMyJobsQuery,
  jobCount,
  matchesStatusFilter,
  nextJobStatus,
} from "../utils/jobsSection";

describe("buildPublicJobsQuery", () => {
  it("sends nothing extra when every filter is All", () => {
    expect(
      buildPublicJobsQuery({
        page: 1,
        pageSize: 6,
        query: "  ",
        level: "All",
        employmentType: "All",
        workplaceType: "All",
      }),
    ).toEqual({ page: 1, pageSize: 6, sort: "desc" });
  });

  it("maps filter labels to API values", () => {
    expect(
      buildPublicJobsQuery({
        page: 2,
        pageSize: 6,
        query: " qc ",
        level: "Senior",
        employmentType: "Contract",
        workplaceType: "Remote",
      }),
    ).toEqual({
      page: 2,
      pageSize: 6,
      sort: "desc",
      search: "qc",
      level: "SENIOR",
      employmentType: "CONTRACT",
      workplaceType: "REMOTE",
    });
  });
});

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
