import { describe, expect, it } from "vitest";
import { buildListingsQuery, canContactSeller, listingImages } from "../utils/listings";

describe("buildListingsQuery", () => {
  it("sends no category for All", () => {
    expect(buildListingsQuery({ page: 3, category: "All" })).toEqual({ page: 3, pageSize: 8 });
  });

  it("maps the category label to the API value", () => {
    expect(buildListingsQuery({ page: 1, category: "Microscopy" })).toEqual({
      page: 1,
      pageSize: 8,
      category: "MICROSCOPY",
    });
  });
});

describe("listingImages", () => {
  it("prefers the gallery and falls back to the cover", () => {
    expect(listingImages({ images: ["a", "b"], image: "a" })).toEqual(["a", "b"]);
    expect(listingImages({ images: [], image: "c" })).toEqual(["c"]);
  });
});

describe("canContactSeller", () => {
  it("needs a known seller who is not the current user", () => {
    expect(canContactSeller({ seller: { id: "s1" } }, "me")).toBe(true);
    expect(canContactSeller({ seller: { id: "me" } }, "me")).toBe(false);
    expect(canContactSeller({ seller: {} }, "me")).toBe(false);
  });
});
