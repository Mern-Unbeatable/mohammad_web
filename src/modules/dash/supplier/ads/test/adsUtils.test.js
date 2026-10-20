import { describe, expect, it, vi } from "vitest";
import { buildAdsQuery } from "../utils/adsQuery";
import { getAdRowActions } from "../utils/adRowActions";
import { createLocalComment, toggleCommentLike } from "../utils/localComments";
import { ADS_PAGE_SIZE } from "../constant/constants";

describe("buildAdsQuery", () => {
  it("asks for the supplier's own ads, newest first, without status or search for defaults", () => {
    expect(buildAdsQuery({ page: 1, statusFilter: "all", sortFilter: "newest", search: "  " })).toEqual({
      page: 1,
      pageSize: ADS_PAGE_SIZE,
      sort: "desc",
      mine: true,
    });
  });

  it("maps status, oldest sort and a trimmed search", () => {
    expect(
      buildAdsQuery({ page: 3, statusFilter: "rejected", sortFilter: "oldest", search: " lab " }),
    ).toMatchObject({ page: 3, sort: "asc", status: "REJECTED", search: "lab" });
  });
});

describe("getAdRowActions", () => {
  const handlers = () => ({ onDetails: vi.fn(), onResubmit: vi.fn(), onRenew: vi.fn() });

  it("offers only details for active ads", () => {
    expect(getAdRowActions({ id: "a1", status: "Active" }, handlers()).map((a) => a.id)).toEqual([
      "details",
    ]);
  });

  it("adds resubmit for rejected ads and passes the row id", () => {
    const h = handlers();
    const actions = getAdRowActions({ id: "a2", status: "Rejected" }, h);
    expect(actions.map((a) => a.id)).toEqual(["details", "resubmit"]);
    actions[1].onClick();
    expect(h.onResubmit).toHaveBeenCalledWith("a2");
  });

  it("adds renew for expired ads, which starts a fresh create", () => {
    const h = handlers();
    const actions = getAdRowActions({ id: "a3", status: "Expired" }, h);
    expect(actions.map((a) => a.id)).toEqual(["details", "renew"]);
    actions[0].onClick();
    actions[1].onClick();
    expect(h.onDetails).toHaveBeenCalledWith("a3");
    expect(h.onRenew).toHaveBeenCalledWith();
  });
});

describe("local comments", () => {
  it("creates an unliked comment authored by the supplier", () => {
    expect(createLocalComment("Nice", 42)).toMatchObject({
      id: "c-42",
      content: "Nice",
      liked: false,
      replies: 0,
      author: { name: "You", subtitle: "Supplier" },
    });
  });

  it("toggles the like on one comment only", () => {
    const list = [createLocalComment("a", 1), createLocalComment("b", 2)];
    const next = toggleCommentLike(list, "c-2");
    expect(next.map((c) => c.liked)).toEqual([false, true]);
    expect(next[0]).toBe(list[0]);
  });
});
