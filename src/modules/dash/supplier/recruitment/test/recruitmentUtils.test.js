import { describe, expect, it } from "vitest";
import { buildJobsQuery, isUnfiltered, pagesAfterRemoval } from "../utils/jobsQuery";
import { JOB_LEVEL_OPTIONS, emptyJobForm, jobPayloadError } from "../utils/jobForm";
import { JOBS_PAGE_SIZE } from "../constant/constants";

describe("buildJobsQuery", () => {
  it("sends only paging for a blank search and All levels", () => {
    expect(buildJobsQuery({ page: 2, query: "  ", level: "All" })).toEqual({
      page: 2,
      pageSize: JOBS_PAGE_SIZE,
      sort: "desc",
    });
  });

  it("adds a trimmed search", () => {
    expect(buildJobsQuery({ page: 1, query: " qc ", level: "All" }).search).toBe("qc");
  });
});

describe("isUnfiltered", () => {
  const base = { statusFilter: "all", query: "", level: "All" };

  it("is true only without status, search and level", () => {
    expect(isUnfiltered(base)).toBe(true);
    expect(isUnfiltered({ ...base, statusFilter: "OPEN" })).toBe(false);
    expect(isUnfiltered({ ...base, query: "lab" })).toBe(false);
    expect(isUnfiltered({ ...base, level: "Senior" })).toBe(false);
  });
});

describe("pagesAfterRemoval", () => {
  it("counts the pages left after removing one job, at least 1", () => {
    expect(pagesAfterRemoval(JOBS_PAGE_SIZE + 1)).toBe(1);
    expect(pagesAfterRemoval(JOBS_PAGE_SIZE + 2)).toBe(2);
    expect(pagesAfterRemoval(0)).toBe(1);
  });
});

describe("job form helpers", () => {
  const valid = {
    title: "QC Analyst",
    company: "Lab Co",
    location: "Ghent",
    about: "Run assays",
    requirements: ["BSc"],
  };

  it("offers levels without All and defaults new posts to the second level", () => {
    expect(JOB_LEVEL_OPTIONS).not.toContain("All");
    expect(emptyJobForm().level).toBe(JOB_LEVEL_OPTIONS[1] || JOB_LEVEL_OPTIONS[0]);
  });

  it("validates required fields and requirements", () => {
    expect(jobPayloadError(valid)).toBeNull();
    expect(jobPayloadError({ ...valid, company: "" })).toBe("Please fill in all required fields");
    expect(jobPayloadError({ ...valid, requirements: [] })).toBe("Add at least one requirement");
  });
});
