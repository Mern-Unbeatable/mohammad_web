import { describe, expect, it } from "vitest";
import {
  buildSearchPath,
  filterSearchGroups,
  isSearchTab,
  searchResultDisplay,
  toSearchGroups,
} from "./searchResults";

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

describe("toSearchGroups / filterSearchGroups", () => {
  const model = {
    users: [{ id: 1 }, { id: 2 }, { id: 3 }],
    jobs: [{ id: 4 }],
    listings: [],
    posts: [{ id: 5 }],
    blogs: undefined,
  };
  const groups = toSearchGroups(model);

  it("drops empty groups and keeps display order", () => {
    expect(groups.map((g) => g.type)).toEqual(["users", "jobs", "posts"]);
  });

  it("caps every group on the All tab", () => {
    const all = filterSearchGroups(groups, "all", 2);
    expect(all.map((g) => g.items.length)).toEqual([2, 1, 1]);
  });

  it("shows only the selected category in full", () => {
    const people = filterSearchGroups(groups, "users", 2);
    expect(people).toHaveLength(1);
    expect(people[0].items).toHaveLength(3);
    expect(filterSearchGroups(groups, "blogs", 2)).toEqual([]);
  });
});

describe("searchResultDisplay", () => {
  it("describes people with an avatar and title · company", () => {
    expect(
      searchResultDisplay(
        { name: "Ada", title: "Chemist", company: "Lab", avatar: "/a.png" },
        "users",
      ),
    ).toEqual({
      title: "Ada",
      subtitle: "Chemist · Lab",
      avatar: { src: "/a.png", name: "Ada", initials: undefined },
    });
  });

  it("describes listings with price and location", () => {
    const { subtitle, avatar } = searchResultDisplay(
      { title: "Balance", price: 2350, location: "Vienna" },
      "listings",
    );
    expect(subtitle).toMatch(/2,350.*· Vienna$/);
    expect(avatar).toBeUndefined();
  });
});
