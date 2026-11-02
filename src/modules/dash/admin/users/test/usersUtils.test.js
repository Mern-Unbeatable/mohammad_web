import { describe, expect, it } from "vitest";
import {
  applyParamChanges,
  applySearch,
  buildUsersQuery,
  getUserRowActions,
  readListParams,
  toStatusUpdate,
  toUserRow,
} from "../utils/usersList";
import { accountRows, accountStatus, contentKindsFor, isSupplierUser, statusText } from "../utils/userDetail";
import { buildActivityTabs, capitalize, formatPrice, ROW_DETAILS } from "../utils/activity";

describe("readListParams", () => {
  it("falls back to all / page 1 for unknown values", () => {
    expect(readListParams(new URLSearchParams("tab=x&page=-3&plan=gold&status=zzz"))).toEqual({
      tab: "all",
      page: 1,
      planFilter: "all",
      statusFilter: "all",
      search: "",
    });
  });

  it("reads valid values", () => {
    expect(
      readListParams(new URLSearchParams("tab=supplier&page=3&plan=yearly&status=suspend&q=ana")),
    ).toEqual({ tab: "supplier", page: 3, planFilter: "yearly", statusFilter: "suspend", search: "ana" });
  });
});

describe("applyParamChanges / applySearch", () => {
  it("drops all, empty and page 1, sets the rest", () => {
    const next = applyParamChanges(new URLSearchParams("tab=user&page=4&plan=free&q=x"), {
      tab: "supplier",
      page: 1,
      plan: "all",
      status: "banned",
    });
    expect(next.toString()).toBe("tab=supplier&q=x&status=banned");
  });

  it("sets or clears q and always resets the page", () => {
    expect(applySearch(new URLSearchParams("page=3"), "ana").toString()).toBe("q=ana");
    expect(applySearch(new URLSearchParams("q=ana&tab=user"), "").toString()).toBe("tab=user");
  });
});

describe("buildUsersQuery", () => {
  it("maps tab, status, plan and trimmed search", () => {
    expect(
      buildUsersQuery({ page: 2, tab: "supplier", statusFilter: "suspend", planFilter: "monthly", search: "  ana " }),
    ).toEqual({ page: 2, pageSize: 10, role: "supplier", status: "suspended", plan: "monthly", search: "ana" });
  });

  it("omits defaults", () => {
    expect(buildUsersQuery({ page: 1, tab: "all", statusFilter: "all", planFilter: "all", search: " " })).toEqual({
      page: 1,
      pageSize: 10,
    });
  });
});

describe("toUserRow", () => {
  it("maps an API user", () => {
    const row = toUserRow({
      id: "u1",
      email: "a@b.c",
      role: "SUPPLIER",
      status: "SUSPENDED",
      profile: { firstName: "Ana", lastName: "Lee", company: "BioLab" },
      subscription: { plan: "YEARLY" },
    });
    expect(row).toMatchObject({
      id: "u1",
      userName: "Ana Lee",
      avatar: "",
      userType: "Laboratory",
      company: "BioLab",
      role: "SUPPLIER",
      subscription: "Yearly",
      joinedDate: "N/A",
      status: "Suspend",
    });
  });

  it("falls back to email, USER, Free and Active", () => {
    expect(toUserRow({ id: "u2", email: "x@y.z", status: "BANNED" })).toMatchObject({
      userName: "x@y.z",
      company: "N/A",
      role: "USER",
      subscription: "Free",
      status: "Banned",
    });
    expect(toUserRow({ id: "u3", email: "x" }).status).toBe("Active");
  });
});

describe("toStatusUpdate", () => {
  it("suspends with the trimmed reason or none", () => {
    expect(toStatusUpdate("Suspend", "  spam ")).toEqual({ status: "SUSPENDED", reason: "spam" });
    expect(toStatusUpdate("Suspend", " ")).toEqual({ status: "SUSPENDED", reason: undefined });
  });

  it("activates with a default reason", () => {
    expect(toStatusUpdate("Active")).toEqual({ status: "ACTIVE", reason: "Account activated by admin" });
  });
});

describe("getUserRowActions", () => {
  it("disables actions that would not change anything", () => {
    const handlers = { onDetails: () => {}, onActivate: () => {}, onSuspend: () => {} };
    const [, active, suspend] = getUserRowActions({ id: "u1", status: "Active" }, handlers);
    expect(active.disabled()).toBe(true);
    expect(suspend.disabled()).toBe(false);
    const banned = getUserRowActions({ id: "u1", status: "Banned" }, handlers);
    expect(banned[1].disabled()).toBe(false);
    expect(banned[2].disabled()).toBe(true);
  });

  it("calls the handlers with the row", () => {
    const calls = [];
    const row = { id: "u1", status: "Suspend" };
    const actions = getUserRowActions(row, {
      onDetails: (id) => calls.push(["details", id]),
      onActivate: (id) => calls.push(["activate", id]),
      onSuspend: (r) => calls.push(["suspend", r]),
    });
    actions.forEach((action) => action.onClick());
    expect(calls).toEqual([["details", "u1"], ["activate", "u1"], ["suspend", row]]);
  });
});

describe("user detail utils", () => {
  it("detects suppliers and their content kinds", () => {
    expect(isSupplierUser({ role: "SUPPLIER" })).toBe(true);
    expect(isSupplierUser({ profileType: "SUPPLIER" })).toBe(true);
    expect(isSupplierUser({ role: "USER" })).toBe(false);
    expect(contentKindsFor(true)).toEqual(["advertisements", "listings", "jobs"]);
    expect(contentKindsFor(false)).toEqual(["jobs"]);
  });

  it("normalises the account status and rows", () => {
    expect(accountStatus({})).toBe("ACTIVE");
    expect(accountStatus({ status: "suspended" })).toBe("SUSPENDED");
    expect(statusText("SUSPENDED")).toBe("Suspended");
    const rows = accountRows({ role: "USER", warnings: 2 });
    expect(rows.map(([label]) => label)).toEqual(["Role", "Account type", "Joined", "Last login", "Warnings"]);
    expect(rows[1][1]).toBe("—");
    expect(rows[4][1]).toBe("2");
  });
});

describe("activity utils", () => {
  it("formats prices and labels", () => {
    expect(formatPrice(null)).toBe("");
    expect(formatPrice(1234.5)).toBe("€1,234.5");
    expect(capitalize("FOR_SALE")).toBe("For sale");
    expect(capitalize("")).toBe("");
  });

  it("links each kind to its admin detail page", () => {
    expect(ROW_DETAILS.advertisements({ id: "a1" }).href).toBe("/admin/advertisement/a1");
    expect(ROW_DETAILS.listings({ id: "l1" }).href).toBe("/admin/marketplace/l1");
    expect(ROW_DETAILS.jobs({ id: "j1", applicationsCount: 4 })).toMatchObject({
      href: "/admin/recruitment/j1",
      stats: [{ value: 4, label: "applicants" }],
    });
  });

  it("builds the posts tab plus one tab per kind", () => {
    const tabs = buildActivityTabs({
      postsTotal: 7,
      kinds: ["advertisements", "jobs"],
      content: { jobs: { total: 3 } },
      contentLoading: false,
    });
    expect(tabs.map((t) => [t.id, t.param, t.count])).toEqual([
      ["posts", "posts", 7],
      ["advertisements", "ads", 0],
      ["jobs", "jobs", 3],
    ]);
    expect(buildActivityTabs({ postsTotal: "…", kinds: ["jobs"], contentLoading: true })[1].count).toBe("…");
  });
});
