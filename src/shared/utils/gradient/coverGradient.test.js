import { describe, expect, it } from "vitest";
import { COVER_GRADIENTS, coverGradientClass } from "./coverGradient";

describe("coverGradientClass", () => {
  it("gives the same member the same gradient every time", () => {
    const id = "792c8e2a-2fcf-4e7a-bea4-621faf1b8513";
    expect(coverGradientClass(id)).toBe(coverGradientClass(id));
  });

  it("always returns one of the palette gradients", () => {
    for (const seed of ["", undefined, null, "a", "Anna Berg", "f8e82337-f5b4-4176-9c23-a9aee20ce570"]) {
      expect(COVER_GRADIENTS).toContain(coverGradientClass(seed));
    }
  });

  it("spreads different members across several gradients", () => {
    const used = new Set(
      Array.from({ length: 40 }, (_, i) => coverGradientClass(`member-${i}`)),
    );
    expect(used.size).toBeGreaterThan(3);
  });
});
