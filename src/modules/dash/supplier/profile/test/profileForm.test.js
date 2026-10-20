import { describe, expect, it } from "vitest";
import {
  countryOptions,
  isProfileImage,
  profileFormError,
  uploadSuccessMessage,
} from "../utils/profileForm";
import { IMAGE_FIELD } from "../constant/constants";

describe("supplier profile form helpers", () => {
  it("keeps a saved country that is not in the list, first", () => {
    expect(countryOptions("Narnia", ["Belgium", "France"])).toEqual(["Narnia", "Belgium", "France"]);
    expect(countryOptions("France", ["Belgium", "France"])).toEqual(["Belgium", "France"]);
    expect(countryOptions("", ["Belgium"])).toEqual(["Belgium"]);
  });

  it("accepts only JPG, PNG and WebP images", () => {
    expect(isProfileImage({ type: "image/webp" })).toBe(true);
    expect(isProfileImage({ type: "image/gif" })).toBe(false);
    expect(isProfileImage(null)).toBe(false);
  });

  it("requires first and last name", () => {
    expect(profileFormError({ firstName: "Ada", lastName: "Lovelace" })).toBeNull();
    expect(profileFormError({ firstName: "Ada", lastName: " " })).toBe(
      "First and last name are required",
    );
  });

  it("names the uploaded image in the success message", () => {
    expect(uploadSuccessMessage(IMAGE_FIELD.AVATAR)).toBe("Profile photo ready");
    expect(uploadSuccessMessage(IMAGE_FIELD.COVER)).toBe("Cover photo ready");
  });
});
