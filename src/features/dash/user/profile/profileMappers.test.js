import { describe, expect, it } from "vitest";
import {
  emptyProfileForm,
  formToUpdatePayload,
  mapUserToForm,
  toProfilePageUser,
} from "./profileMappers";

const apiUser = (profile) => ({ id: "u1", email: "moe@example.com", profile });

describe("user profile location mapping", () => {
  it("loads the saved city and country into the edit form", () => {
    const form = mapUserToForm(
      apiUser({ city: "Munich", country: "Germany", location: "Munich, Germany" }),
    );
    expect(form).toMatchObject({ city: "Munich", country: "Germany" });
  });

  it("does not invent a country when none is saved", () => {
    expect(emptyProfileForm.country).toBe("");
    expect(mapUserToForm(apiUser({})).country).toBe("");
    expect(mapUserToForm(apiUser({})).city).toBe("");
  });

  it("sends the city with the country and never a raw location", () => {
    const payload = formToUpdatePayload({ ...emptyProfileForm, city: " Antwerp ", country: "Belgium" });
    expect(payload).toMatchObject({ city: "Antwerp", country: "Belgium" });
    expect(payload).not.toHaveProperty("location");
  });

  it("shows the server-composed location on the profile page", () => {
    const user = toProfilePageUser(
      apiUser({ city: "Antwerp", country: "Belgium", location: "Antwerp, Belgium" }),
    );
    expect(user).toMatchObject({ city: "Antwerp", country: "Belgium", location: "Antwerp, Belgium" });
  });
});
