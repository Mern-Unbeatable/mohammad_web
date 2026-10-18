import { describe, expect, it } from "vitest";
import reducer, { jobLeftList } from "./recruitmentSlice";
import {
  fetchSupplierJobs,
  removeSupplierJob,
  updateSupplierJob,
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

  it("ignores removals of jobs that are not listed", () => {
    const state = reducer(loaded(["a"]), jobLeftList("zzz"));
    expect(state.jobsMeta.total).toBe(1);
  });
});
