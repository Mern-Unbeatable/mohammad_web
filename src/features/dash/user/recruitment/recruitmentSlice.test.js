import { describe, expect, it } from "vitest";
import reducer, {
  invalidateJobsList,
  jobApplicationsSeen,
  selectNewApplicationTotal,
} from "./recruitmentSlice";
import {
  applyToJob,
  fetchJobDetails,
  fetchJobs,
  fetchMyApplications,
  fetchNewApplicationCounts,
  withdrawApplication,
} from "./recruitmentThunks";

describe("new application badge state", () => {
  const loaded = () =>
    reducer(
      undefined,
      fetchNewApplicationCounts.fulfilled({ total: 3, byJob: { a: 2, b: 1 } }, "r"),
    );

  it("stores the server counts", () => {
    const state = loaded();
    expect(selectNewApplicationTotal({ userRecruitment: state })).toBe(3);
    expect(state.newApplications.byJob).toEqual({ a: 2, b: 1 });
  });

  it("clears one job's count when its applicants are opened", () => {
    const state = reducer(loaded(), jobApplicationsSeen("a"));
    expect(state.newApplications).toEqual({ total: 1, byJob: { b: 1 } });
    expect(reducer(state, jobApplicationsSeen("missing")).newApplications.total).toBe(1);
  });
});

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

  it("drops a cancelled application and re-enables applying", () => {
    let state = reducer(undefined, { type: "@@init" });
    state = reducer(
      state,
      fetchJobDetails.fulfilled(
        { id: "j1", myApplication: { id: "a1", status: "APPLIED" } },
        "r",
        "j1",
      ),
    );
    state = reducer(
      state,
      fetchMyApplications.fulfilled(
        {
          data: [
            { id: "a1", job: { id: "j1" } },
            { id: "a2", job: { id: "j2" } },
          ],
          meta: {},
        },
        "r2",
      ),
    );
    state = reducer(state, withdrawApplication.fulfilled({ jobId: "j1" }, "r3", "j1"));
    expect(state.applications.map((app) => [app.id, app.status])).toEqual([
      ["a1", "CANCELLED"],
      ["a2", undefined],
    ]);
    expect(state.selectedJob.myApplication).toBeNull();
  });

  it("removes a cancelled application from the Applied tab", () => {
    let state = reducer(
      undefined,
      fetchMyApplications.fulfilled(
        {
          data: [
            { id: "a1", job: { id: "j1" } },
            { id: "a2", job: { id: "j2" } },
          ],
          meta: {},
        },
        "r",
        { status: "applied" },
      ),
    );
    state = reducer(state, withdrawApplication.fulfilled({ jobId: "j1" }, "r2", "j1"));
    expect(state.applications.map((app) => app.id)).toEqual(["a2"]);
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
