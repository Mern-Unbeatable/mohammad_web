import { describe, expect, it } from "vitest";
import {
  applyFilterChanges,
  buildContactsQuery,
  parseCountryParam,
  parseFilterParam,
  withoutInvalidFilters,
} from "../utils/contactsUrlFilters";
import { parseSearchParam } from "@/shared/utils/urlFilters";

const params = (query) => new URLSearchParams(query);

describe("contacts URL filters", () => {
  it("reads valid values and falls back to defaults", () => {
    expect(parseFilterParam("requests")).toBe("requests");
    expect(parseFilterParam("pending")).toBe("pending");
    expect(parseFilterParam("admins")).toBe("people");
    expect(parseFilterParam(null)).toBe("people");
    expect(parseCountryParam("France")).toBe("France");
    expect(parseCountryParam("Atlantis")).toBe("All countries");
    expect(parseSearchParam(null)).toBe("");
    expect(parseSearchParam("x".repeat(250))).toHaveLength(200);
  });

  it("sets a filter and resets to page 1, keeping other params", () => {
    const next = applyFilterChanges(params("page=3&country=France"), { filter: "connected" });
    expect(Object.fromEntries(next)).toEqual({
      page: "1",
      country: "France",
      filter: "connected",
    });
  });

  it("drops default values so the URL stays minimal", () => {
    const next = applyFilterChanges(params("page=2&filter=requests&country=France&q=anna"), {
      filter: "people",
      country: "All countries",
      q: "",
    });
    expect(next.toString()).toBe("page=1");
  });

  it("removes invalid filter values and leaves valid ones alone", () => {
    expect(withoutInvalidFilters(params("page=2&filter=connected&country=Italy&q=ok"))).toBeNull();

    const fixed = withoutInvalidFilters(params("page=2&filter=admins&country=Atlantis"));
    expect(fixed.toString()).toBe("page=2");
  });
});

describe("buildContactsQuery", () => {
  const base = { page: 2, pageSize: 8, search: "", country: "All countries" };

  it("requests accepted connections for the Connected filter", () => {
    expect(buildContactsQuery({ ...base, filter: "connected" })).toEqual({
      page: 2,
      pageSize: 8,
      sort: "desc",
      status: "accepted",
    });
  });

  it("requests incoming pending connections for the Confirm tab", () => {
    expect(buildContactsQuery({ ...base, filter: "requests" })).toMatchObject({
      status: "pending",
      direction: "incoming",
    });
  });

  it("requests outgoing pending connections for the Pending tab", () => {
    expect(buildContactsQuery({ ...base, filter: "pending" })).toMatchObject({
      status: "pending",
      direction: "outgoing",
    });
  });

  it("sends no status for People", () => {
    const query = buildContactsQuery({ ...base, filter: "people" });
    expect(query).not.toHaveProperty("status");
    expect(query).not.toHaveProperty("direction");
  });

  it.each(["people", "connected", "pending", "requests"])(
    "keeps search and country for %s",
    (filter) => {
      expect(
        buildContactsQuery({ ...base, filter, search: "  anna ", country: "France" }),
      ).toMatchObject({ search: "anna", country: "France" });
    },
  );

  it("omits a blank search and the All countries default", () => {
    const query = buildContactsQuery({ ...base, filter: "connected", search: "   " });
    expect(query).not.toHaveProperty("search");
    expect(query).not.toHaveProperty("country");
  });
});
