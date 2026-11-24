import { describe, expect, it } from "vitest";
import { buildContactsQuery, totalPagesFrom } from "../utils/contactsQuery";
import { countLabel, emptyMessage, plural, statusLabel } from "../utils/contactsLabels";
import { CONTACTS_PAGE_SIZE, DEFAULT_COUNTRY } from "../constant/constants";

describe("buildContactsQuery", () => {
  it("sends only paging for the default People view", () => {
    expect(
      buildContactsQuery({ page: 1, search: " ", country: DEFAULT_COUNTRY, filter: "people" }),
    ).toEqual({ page: 1, pageSize: CONTACTS_PAGE_SIZE, sort: "desc" });
  });

  it.each([
    ["requests", { status: "pending", direction: "incoming" }],
    ["pending", { status: "pending", direction: "outgoing" }],
    ["connected", { status: "accepted" }],
  ])("maps the %s tab", (filter, expected) => {
    expect(buildContactsQuery({ page: 2, search: "", country: DEFAULT_COUNTRY, filter })).toMatchObject(
      expected,
    );
  });

  it("adds a trimmed search and a specific country", () => {
    expect(
      buildContactsQuery({ page: 1, search: " ann ", country: "France", filter: "people" }),
    ).toMatchObject({ search: "ann", country: "France" });
  });
});

describe("totalPagesFrom", () => {
  it("prefers totalPages, falls back to total, and is at least 1", () => {
    expect(totalPagesFrom({ totalPages: 4, total: 1 })).toBe(4);
    expect(totalPagesFrom({ total: CONTACTS_PAGE_SIZE + 1 })).toBe(2);
    expect(totalPagesFrom(undefined)).toBe(1);
  });
});

describe("contacts labels", () => {
  it("pluralises", () => {
    expect(plural(1, "member")).toBe("1 member");
    expect(plural(0, "member")).toBe("0 members");
  });

  it.each([
    ["people", 2, "2 members found"],
    ["connected", 1, "1 connection"],
    ["pending", 3, "3 requests sent"],
    ["requests", 1, "1 request to confirm"],
  ])("counts %s", (filter, total, label) => {
    expect(countLabel(filter, total)).toBe(label);
  });

  it("shows loading before the count", () => {
    expect(statusLabel({ loading: true, filter: "people", total: 1 })).toBe("Loading…");
    expect(statusLabel({ loading: false, filter: "people", total: 1 })).toBe("1 member found");
  });

  it("uses the filtered empty message when search or country narrows the list", () => {
    const base = { filter: "pending", search: "", country: DEFAULT_COUNTRY };
    expect(emptyMessage(base)).toBe("You have no pending sent requests.");
    expect(emptyMessage({ ...base, search: "ann" })).toBe("No sent requests match your search.");
    expect(emptyMessage({ ...base, country: "France" })).toBe("No sent requests match your search.");
  });
});
