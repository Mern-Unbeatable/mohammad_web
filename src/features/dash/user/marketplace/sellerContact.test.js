import { describe, expect, it } from "vitest";
import { sellerContactLinks, toWhatsAppNumber } from "./sellerContact";

describe("toWhatsAppNumber", () => {
  it("keeps only the digits of an international number", () => {
    expect(toWhatsAppNumber("+33 6 12-34 56 78")).toBe("33612345678");
    expect(toWhatsAppNumber("(+880) 1712 345678")).toBe("8801712345678");
  });

  it("drops a leading 00 international prefix", () => {
    expect(toWhatsAppNumber("0033 6 12 34 56 78")).toBe("33612345678");
  });

  it("rejects missing, too short or too long numbers", () => {
    expect(toWhatsAppNumber(null)).toBeNull();
    expect(toWhatsAppNumber("")).toBeNull();
    expect(toWhatsAppNumber("12345")).toBeNull();
    expect(toWhatsAppNumber("1234567890123456")).toBeNull();
  });
});

describe("sellerContactLinks", () => {
  it("pre-fills email and WhatsApp with the listing title", () => {
    const { emailHref, whatsAppHref } = sellerContactLinks(
      { email: "ana@lab.io", phone: "+33 612345678" },
      "Benchtop Centrifuge",
    );
    expect(emailHref).toBe(
      "mailto:ana@lab.io?subject=Lab%20Unity%20listing%3A%20Benchtop%20Centrifuge" +
        "&body=Hi%2C%20I'm%20interested%20in%20your%20listing%20%22Benchtop%20Centrifuge%22%20on%20Lab%20Unity.",
    );
    expect(whatsAppHref).toBe(
      "https://wa.me/33612345678?text=Hi%2C%20I'm%20interested%20in%20your%20listing%20%22Benchtop%20Centrifuge%22%20on%20Lab%20Unity.",
    );
  });

  it("returns no links when the seller shared no contact details", () => {
    expect(sellerContactLinks({}, "X")).toEqual({ emailHref: null, whatsAppHref: null });
    expect(sellerContactLinks(undefined)).toEqual({ emailHref: null, whatsAppHref: null });
  });

  it("returns no email link for an invalid address", () => {
    expect(sellerContactLinks({ email: "not-an-email" }).emailHref).toBeNull();
  });
});
