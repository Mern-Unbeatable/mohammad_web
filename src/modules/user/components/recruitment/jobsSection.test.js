import { describe, expect, it } from "vitest";
import {
  buildMyJobsQuery,
  jobCountLabel,
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

  it("labels counts", () => {
    expect(jobCountLabel(true, 3)).toBe("Loading…");
    expect(jobCountLabel(false, 1)).toBe("1 job post");
    expect(jobCountLabel(false, 4)).toBe("4 job posts");
  });
});
