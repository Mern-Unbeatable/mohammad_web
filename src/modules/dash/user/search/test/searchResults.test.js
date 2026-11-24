import { describe, expect, it } from "vitest";
import {
  filterSearchGroups,
  searchResultDisplay,
  searchResultHref,
  toSearchGroups,
} from "../utils/searchResults";

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

describe("searchResultHref", () => {
  it("links each type to its page", () => {
    expect(searchResultHref({ id: 7 }, "users")).toBe("/contacts/7");
    expect(searchResultHref({ id: 7 }, "jobs")).toBe("/recruitment/7");
    expect(searchResultHref({ id: 7, slug: "hplc-tips" }, "blogs")).toBe("/blogs/hplc-tips");
    expect(searchResultHref({ id: 7 }, "unknown")).toBe("#");
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
