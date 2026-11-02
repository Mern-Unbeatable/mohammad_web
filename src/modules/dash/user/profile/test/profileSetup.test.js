import { describe, expect, it } from "vitest";
import { countryOptions, isProfileImage, profileFormError } from "../utils/profileSetup";

describe("profile setup helpers", () => {
  it("keeps a saved country that is not in the list, first", () => {
    expect(countryOptions("Narnia", ["Belgium", "France"])).toEqual([
      "Narnia",
      "Belgium",
      "France",
    ]);
    expect(countryOptions("France", ["Belgium", "France"])).toEqual(["Belgium", "France"]);
    expect(countryOptions("", ["Belgium"])).toEqual(["Belgium"]);
  });

  it("accepts only JPG, PNG and WebP images", () => {
    expect(isProfileImage({ type: "image/png" })).toBe(true);
    expect(isProfileImage({ type: "image/gif" })).toBe(false);
    expect(isProfileImage(null)).toBe(false);
  });

  it("requires first and last name", () => {
    expect(profileFormError({ firstName: "Ada", lastName: "Lovelace" })).toBeNull();
    expect(profileFormError({ firstName: " ", lastName: "Lovelace" })).toBe(
      "First and last name are required",
    );
    expect(profileFormError({ firstName: "Ada" })).toBe("First and last name are required");
  });
});
