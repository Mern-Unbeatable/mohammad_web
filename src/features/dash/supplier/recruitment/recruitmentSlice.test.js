import { describe, expect, it } from "vitest";
import reducer, {
  jobApplicationsSeen,
  jobLeftList,
  selectSupplierNewApplicationTotal,
} from "./recruitmentSlice";
import {
  applyToSupplierJob,
  fetchSupplierJobDetails,
  fetchSupplierJobs,
  fetchSupplierMyApplications,
  fetchSupplierNewApplicationCounts,
  removeSupplierJob,
  updateSupplierJob,
  withdrawSupplierApplication,
} from "./recruitmentThunks";

const initial = reducer(undefined, { type: "@@init" });
const listPage = (ids, meta = {}) => ({
  data: ids.map((id) => ({ id, status: "OPEN" })),
  meta: { page: 1, pageSize: 5, total: ids.length, totalPages: 1, ...meta },
});
const loaded = (ids, meta) => {
  const state = reducer(initial, fetchSupplierJobs.pending("req", {}));
  return reducer(state, fetchSupplierJobs.fulfilled(listPage(ids, meta), "req", {}));
};

describe("supplier recruitment list state", () => {
  it("keeps the latest section when an older response arrives last", () => {
    let state = reducer(initial, fetchSupplierJobs.pending("public", {}));
    state = reducer(state, fetchSupplierJobs.pending("mine", { mine: true }));
    state = reducer(
      state,
      fetchSupplierJobs.fulfilled(listPage(["mine1"]), "mine", { mine: true }),
    );
    state = reducer(
      state,
      fetchSupplierJobs.fulfilled(listPage(["public1"]), "public", {}),
    );

    expect(state.jobs.map((job) => job.id)).toEqual(["mine1"]);
    expect(state.jobsLoading).toBe(false);
  });

  it("updates a job's status in place", () => {
    const state = reducer(
      loaded(["a", "b"]),
      updateSupplierJob.fulfilled({ id: "b", status: "CLOSED" }, "u", {}),
    );
    expect(state.jobs[1]).toEqual({ id: "b", status: "CLOSED" });
    expect(state.saving).toBe(false);
  });

  it("drops a job that left the filter and keeps the totals in sync", () => {
    const state = reducer(
      loaded(["a", "b"], { total: 6, totalPages: 2 }),
      jobLeftList("a"),
    );
    expect(state.jobs.map((job) => job.id)).toEqual(["b"]);
    expect(state.jobsMeta).toMatchObject({ total: 5, totalPages: 1 });
  });

  it("decrements the total when a job is deleted", () => {
    const state = reducer(
      loaded(["a", "b"]),
      removeSupplierJob.fulfilled({ jobId: "a" }, "d", "a"),
    );
    expect(state.jobs.map((job) => job.id)).toEqual(["b"]);
    expect(state.jobsMeta.total).toBe(1);
  });

  it("marks the selected job as applied", () => {
    let state = reducer(initial, fetchSupplierJobDetails.fulfilled({ id: "j1" }, "d", "j1"));
    state = reducer(
      state,
      applyToSupplierJob.fulfilled(
        { jobId: "j1", application: { id: "a1", status: "APPLIED" } },
        "a",
        {},
      ),
    );
    expect(state.selectedJob.myApplication).toMatchObject({ id: "a1", status: "APPLIED" });
    expect(state.applying).toBe(false);
  });

  it("drops a withdrawn application from the Applied tab", () => {
    let state = reducer(
      initial,
      fetchSupplierMyApplications.fulfilled(
        { data: [{ id: "a1", jobId: "j1" }], meta: { total: 1 } },
        "m",
        { status: "applied" },
      ),
    );
    state = reducer(state, withdrawSupplierApplication.fulfilled({ jobId: "j1" }, "w", "j1"));
    expect(state.applications).toEqual([]);
    expect(state.applicationsMeta.total).toBe(0);
  });

  it("subtracts a job's unseen applications once they are seen", () => {
    let state = reducer(
      initial,
      fetchSupplierNewApplicationCounts.fulfilled({ total: 3, byJob: { a: 2, b: 1 } }, "c"),
    );
    state = reducer(state, jobApplicationsSeen("a"));
    expect(selectSupplierNewApplicationTotal({ supplierRecruitment: state })).toBe(1);
  });

  it("ignores removals of jobs that are not listed", () => {
    const state = reducer(loaded(["a"]), jobLeftList("zzz"));
    expect(state.jobsMeta.total).toBe(1);
  });
});
