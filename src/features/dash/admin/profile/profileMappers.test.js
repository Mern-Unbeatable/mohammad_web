import { describe, expect, it } from "vitest";
import { mapUserToForm, nameToProfilePayload } from "./profileMappers";

describe("nameToProfilePayload", () => {
  it("keeps a single-word name without duplicating it", () => {
    expect(nameToProfilePayload("Admin")).toEqual({ firstName: "Admin", lastName: "" });
  });

  it("splits the first word from the rest", () => {
    expect(nameToProfilePayload("  Claire  van Dubois ")).toEqual({
      firstName: "Claire",
      lastName: "van Dubois",
    });
  });
});

describe("mapUserToForm", () => {
  it("reads name, avatar and initials from the nested profile", () => {
    const form = mapUserToForm({
      email: "admin@lab.test",
      profile: { name: "Admin", avatar: "https://cdn.test/a.png", initials: "A" },
    });
    expect(form).toMatchObject({
      name: "Admin",
      displayName: "Admin",
      avatar: "https://cdn.test/a.png",
      initials: "A",
    });
  });
});
