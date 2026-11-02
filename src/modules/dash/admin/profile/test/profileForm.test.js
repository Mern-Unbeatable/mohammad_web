import { describe, expect, it } from "vitest";
import { avatarFileError, passwordError, toPasswordPayload } from "../utils/profileForm";
import { MESSAGES } from "../constant/constants";

describe("avatarFileError", () => {
  it("accepts JPG, PNG and WebP only", () => {
    expect(avatarFileError({ type: "image/webp" })).toBeNull();
    expect(avatarFileError({ type: "image/gif" })).toBe(MESSAGES.BAD_IMAGE);
  });
});

describe("passwordError", () => {
  it("requires every field, then matching new passwords", () => {
    expect(passwordError({ current: "a", next: "", confirm: "b" })).toBe(MESSAGES.PASSWORDS_MISSING);
    expect(passwordError({ current: "a", next: "b", confirm: "c" })).toBe(MESSAGES.PASSWORDS_MISMATCH);
    expect(passwordError({ current: "a", next: "b", confirm: "b" })).toBeNull();
  });
});

describe("toPasswordPayload", () => {
  it("maps form keys to the API names", () => {
    expect(toPasswordPayload({ current: "a", next: "b", confirm: "b" })).toEqual({
      currentPassword: "a",
      newPassword: "b",
      confirmPassword: "b",
    });
  });
});
