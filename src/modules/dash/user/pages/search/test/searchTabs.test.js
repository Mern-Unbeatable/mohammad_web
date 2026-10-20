import { describe, expect, it } from "vitest";
import { buildSearchPath, isSearchTab, withSearchTab } from "../utils/searchTabs";

describe("buildSearchPath", () => {
  it("encodes the trimmed query and omits the default tab", () => {
    expect(buildSearchPath("  hplc & gc ")).toBe("/search?q=hplc+%26+gc");
    expect(buildSearchPath("hplc", "all")).toBe("/search?q=hplc");
  });

  it("keeps a valid category tab and drops unknown ones", () => {
    expect(buildSearchPath("hplc", "jobs")).toBe("/search?q=hplc&tab=jobs");
    expect(buildSearchPath("hplc", "posts")).toBe("/search?q=hplc");
  });

  it("round-trips through URLSearchParams", () => {
    const params = new URLSearchParams(
      buildSearchPath("Élise #1", "users").split("?")[1],
    );
    expect(params.get("q")).toBe("Élise #1");
    expect(params.get("tab")).toBe("users");
  });
});

describe("isSearchTab", () => {
  it("accepts only the tab ids", () => {
    expect(isSearchTab("listings")).toBe(true);
    expect(isSearchTab("posts")).toBe(false);
    expect(isSearchTab(null)).toBe(false);
  });
});

describe("withSearchTab", () => {
  it("sets a category tab and keeps the query", () => {
    const next = withSearchTab(new URLSearchParams("q=hplc"), "jobs");
    expect(next.toString()).toBe("q=hplc&tab=jobs");
  });

  it("removes the param for the default tab without touching the input", () => {
    const params = new URLSearchParams("q=hplc&tab=jobs");
    expect(withSearchTab(params, "all").toString()).toBe("q=hplc");
    expect(params.get("tab")).toBe("jobs");
  });
});
