import { describe, expect, it, vi } from "vitest";
import { buildAdsQuery } from "../utils/adsQuery";
import { getAdRowActions, rejectDescription } from "../utils/adRowActions";
import { ADS_PAGE_SIZE } from "../constant/constants";

describe("buildAdsQuery", () => {
  it("sends only paging for All Status and a blank search", () => {
    expect(buildAdsQuery({ page: 1, statusFilter: "all", search: "  " })).toEqual({
      page: 1,
      pageSize: ADS_PAGE_SIZE,
    });
  });

  it("maps the status filter and trims the search", () => {
    expect(buildAdsQuery({ page: 2, statusFilter: "pending", search: " lab " })).toEqual({
      page: 2,
      pageSize: ADS_PAGE_SIZE,
      status: "PENDING",
      search: "lab",
    });
  });
});

describe("getAdRowActions", () => {
  const handlers = (busy = false) => ({
    busy,
    onDetails: vi.fn(),
    onReview: vi.fn(),
    onReject: vi.fn(),
  });

  it("lists details and the three review actions", () => {
    const actions = getAdRowActions({ id: "a1", status: "Pending" }, handlers());
    expect(actions.map((a) => a.id)).toEqual(["details", "active", "expired", "rejected"]);
    expect(actions.slice(1).map((a) => a.disabled())).toEqual([false, false, false]);
  });

  it("disables the ad's current status, and everything while busy", () => {
    const actions = getAdRowActions({ id: "a1", status: "Expired" }, handlers());
    expect(actions.slice(1).map((a) => a.disabled())).toEqual([false, true, false]);

    const busy = getAdRowActions({ id: "a1", status: "Pending" }, handlers(true));
    expect(busy.slice(1).every((a) => a.disabled())).toBe(true);
  });

  it("reviews by label and opens the reject modal with the row", () => {
    const h = handlers();
    const row = { id: "a2", status: "Pending" };
    const actions = getAdRowActions(row, h);
    actions[0].onClick();
    actions[1].onClick();
    actions[3].onClick();
    expect(h.onDetails).toHaveBeenCalledWith("a2");
    expect(h.onReview).toHaveBeenCalledWith("a2", "Active");
    expect(h.onReject).toHaveBeenCalledWith(row);
  });
});

describe("rejectDescription", () => {
  it("names the ad", () => {
    expect(rejectDescription("HPLC")).toBe(
      'Rejecting "HPLC" will remove it from active promotion.',
    );
  });
});
