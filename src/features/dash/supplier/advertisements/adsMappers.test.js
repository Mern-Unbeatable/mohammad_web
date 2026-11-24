import { describe, expect, it } from "vitest";
import { adToForm, formToCreatePayload } from "./adsMappers";

describe("supplier advertisement destination mapping", () => {
  it("maps API destination fields into form state", () => {
    const form = adToForm({
      category: "PRODUCT",
      destinationMode: "INTERNAL",
      destinationResourceId: "11111111-1111-1111-1111-111111111111",
      destinationUrl: null,
    });

    expect(form.destinationMode).toBe("INTERNAL");
    expect(form.destinationResourceId).toBe(
      "11111111-1111-1111-1111-111111111111",
    );
    expect(form.destinationUrl).toBe("");
  });

  it("includes destination fields in create payload", () => {
    const payload = formToCreatePayload({
      title: "Offer",
      categoryId: "promo",
      description: "desc",
      destinationMode: "EXTERNAL",
      destinationUrl: "https://example.com/offer",
    });

    expect(payload.destinationMode).toBe("EXTERNAL");
    expect(payload.destinationUrl).toBe("https://example.com/offer");
    expect(payload.destinationResourceId).toBeUndefined();
  });
});
