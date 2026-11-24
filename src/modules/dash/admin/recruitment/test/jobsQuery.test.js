import { describe, expect, it } from "vitest";
import { buildJobsQuery } from "../utils/jobsQuery";
import { DEFAULT_LEVEL_FILTER, DEFAULT_TIME_FILTER } from "../constant/constants";

describe("buildJobsQuery", () => {
  it("sends no filters for the defaults", () => {
    expect(
      buildJobsQuery({ page: 1, timeFilter: DEFAULT_TIME_FILTER, level: DEFAULT_LEVEL_FILTER }),
    ).toEqual({ page: 1, pageSize: 10 });
  });

  it("adds since and level when picked", () => {
    const params = buildJobsQuery({ page: 2, timeFilter: "Last 7 days", level: "Mid-level" });
    expect(params.page).toBe(2);
    expect(params.since).toBeTruthy();
    expect(params.level).toBeTruthy();
  });
});
