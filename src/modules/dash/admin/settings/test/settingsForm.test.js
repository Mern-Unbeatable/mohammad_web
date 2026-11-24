import { describe, expect, it } from "vitest";
import {
  addUniqueCategory,
  parsePrice,
  priceText,
  saveLabel,
  toTierForm,
  toTierPayload,
} from "../utils/settingsForm";

describe("price helpers", () => {
  it("prints null / undefined as empty", () => {
    expect(priceText(null)).toBe("");
    expect(priceText(undefined)).toBe("");
    expect(priceText(0)).toBe("0");
  });

  it("parses non-negative numbers only", () => {
    expect(parsePrice(" 9.5 ")).toBe(9.5);
    expect(parsePrice("0")).toBe(0);
    expect(parsePrice("")).toBeNull();
    expect(parsePrice("-1")).toBeNull();
    expect(parsePrice("abc")).toBeNull();
  });
});

describe("sponsored tiers", () => {
  it("turns API tiers into editable rows", () => {
    expect(toTierForm([{ id: "d1", label: "1 day", price: 5 }])).toEqual([
      { id: "d1", label: "1 day", price: "5" },
    ]);
    expect(toTierForm(null)).toEqual([]);
  });

  it("builds the payload and reports the first invalid row", () => {
    const rows = [
      { id: "d1", label: "1 day", price: "5" },
      { id: "d7", label: "7 days", price: "x" },
    ];
    const { tiers, invalid } = toTierPayload(rows);
    expect(tiers).toEqual([
      { id: "d1", price: 5 },
      { id: "d7", price: null },
    ]);
    expect(invalid.label).toBe("7 days");
    expect(toTierPayload([rows[0]]).invalid).toBeUndefined();
  });
});

describe("addUniqueCategory", () => {
  it("adds trimmed new values only", () => {
    expect(addUniqueCategory(["A"], " B ")).toEqual(["A", "B"]);
    expect(addUniqueCategory(["A"], "A")).toEqual(["A"]);
    expect(addUniqueCategory(["A"], "  ")).toEqual(["A"]);
  });
});

describe("saveLabel", () => {
  it("shows Saving… while saving", () => {
    expect(saveLabel(true)).toBe("Saving…");
    expect(saveLabel(false)).toBe("Save");
    expect(saveLabel(false, "Save categories")).toBe("Save categories");
  });
});
