import { describe, expect, it } from "vitest";
import reducer, { invalidateJobsList } from "./recruitmentSlice";
import { applyToJob, fetchJobDetails, fetchJobs } from "./recruitmentThunks";

describe("applying to the open job", () => {
  it("marks the selected job as applied so the button disables", () => {
    let state = reducer(undefined, { type: "@@init" });
    state = reducer(
      state,
      fetchJobDetails.fulfilled({ id: "j1", myApplication: null }, "r", "j1"),
    );
    state = reducer(
      state,
      applyToJob.fulfilled(
        {
          jobId: "j1",
          application: { id: "a1", status: "APPLIED", createdAt: "2026-10-18" },
        },
        "r2",
        { jobId: "j1" },
      ),
    );
    expect(state.selectedJob.myApplication).toEqual({
      id: "a1",
      status: "APPLIED",
      appliedAt: "2026-10-18",
    });
  });
});

const initial = reducer(undefined, { type: "@@init" });
const page = (n) => ({
  data: [{ id: `p${n}` }],
  meta: { page: n, pageSize: 5, total: 12, totalPages: 3 },
});

describe("recruitment jobs pagination state", () => {
  it("shows the latest requested page even if an older response arrives last", () => {
    let state = reducer(initial, fetchJobs.pending("req-1", { page: 1 }));
    state = reducer(state, fetchJobs.pending("req-2", { page: 2 }));
    state = reducer(state, fetchJobs.fulfilled(page(2), "req-2", { page: 2 }));
    state = reducer(state, fetchJobs.fulfilled(page(1), "req-1", { page: 1 }));

    expect(state.jobs).toEqual([{ id: "p2" }]);
    expect(state.jobsMeta.page).toBe(2);
    expect(state.jobsLoading).toBe(false);
  });

  it("records list failures and clears them on the next request", () => {
    let state = reducer(initial, fetchJobs.pending("req-1", { page: 2 }));
    state = reducer(state, fetchJobs.rejected(null, "req-1", { page: 2 }, "Network Error"));
    expect(state.jobsError).toBe("Network Error");
    expect(state.jobsLoading).toBe(false);

    state = reducer(state, fetchJobs.pending("req-2", { page: 2 }));
    expect(state.jobsError).toBeNull();
  });

  it("ignores a failure from a request the user already left", () => {
    let state = reducer(initial, fetchJobs.pending("req-1", { page: 1 }));
    state = reducer(state, fetchJobs.pending("req-2", { page: 2 }));
    state = reducer(state, fetchJobs.rejected(null, "req-1", { page: 1 }, "Network Error"));

    expect(state.jobsError).toBeNull();
    expect(state.jobsLoading).toBe(true);
  });

  it("clears a list error when filters invalidate the list", () => {
    let state = reducer(initial, fetchJobs.pending("req-1", { page: 1 }));
    state = reducer(state, fetchJobs.rejected(null, "req-1", { page: 1 }, "Failed"));
    state = reducer(state, invalidateJobsList());
    expect(state.jobsError).toBeNull();
    expect(state.jobsLoading).toBe(true);
  });
});
