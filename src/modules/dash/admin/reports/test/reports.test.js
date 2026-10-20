import { describe, expect, it, vi } from "vitest";
import { buildReportsQuery, getReportRowActions, reasonModalCopy } from "../utils/reports";

describe("buildReportsQuery", () => {
  it("omits the all filter and blank search", () => {
    expect(buildReportsQuery({ page: 1, statusFilter: "all", search: "  " })).toEqual({
      page: 1,
      pageSize: 10,
    });
  });

  it("maps the filter and trims the search", () => {
    expect(buildReportsQuery({ page: 2, statusFilter: "under review", search: " spam " })).toEqual({
      page: 2,
      pageSize: 10,
      status: "under_review",
      search: "spam",
    });
  });
});

describe("getReportRowActions", () => {
  it("lists details plus statuses and disables the current one", () => {
    const onDetails = vi.fn();
    const onStatus = vi.fn();
    const actions = getReportRowActions({ id: "r1", status: "Under Review" }, { onDetails, onStatus });

    expect(actions.map((a) => a.label)).toEqual(["See Details", "Pending", "Under Review", "Resolved"]);
    expect(actions.slice(1).map((a) => a.disabled())).toEqual([false, true, false]);

    actions[0].onClick();
    actions[3].onClick();
    expect(onDetails).toHaveBeenCalledWith("r1");
    expect(onStatus).toHaveBeenCalledWith("r1", "Resolved");
  });
});

describe("reasonModalCopy", () => {
  it("uses Ban wording only for BAN", () => {
    expect(reasonModalCopy("BAN")).toEqual({ title: "Ban User", submitLabel: "Ban" });
    expect(reasonModalCopy("SUSPEND")).toEqual({ title: "Suspend User", submitLabel: "Suspend" });
    expect(reasonModalCopy(null).submitLabel).toBe("Suspend");
  });
});
