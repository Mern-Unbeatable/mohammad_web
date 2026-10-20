import { describe, expect, it } from "vitest";
import { toAccountIdentity } from "../utils/accountIdentity";

describe("toAccountIdentity", () => {
  it("prefers the nested profile fields", () => {
    expect(
      toAccountIdentity({
        email: "a@b.c",
        profile: { name: "Jane Doe", initials: "JX", avatar: "/a.png" },
      }),
    ).toEqual({ name: "Jane Doe", initials: "JX", avatar: "/a.png" });
  });

  it("builds the name from first / last name and derives initials", () => {
    expect(
      toAccountIdentity({ profile: { firstName: "jane", lastName: "doe" } }),
    ).toEqual({ name: "jane doe", initials: "JD", avatar: null });
  });

  it("falls back to top-level name, then email", () => {
    expect(toAccountIdentity({ name: "Acme Ltd", avatar: "/x.png" })).toEqual({
      name: "Acme Ltd",
      initials: "AL",
      avatar: "/x.png",
    });
    expect(toAccountIdentity({ email: "me@site.com" }).name).toBe("me@site.com");
  });

  it("returns empty fields for a missing user", () => {
    expect(toAccountIdentity(null)).toEqual({ name: "", initials: "", avatar: null });
  });
});
