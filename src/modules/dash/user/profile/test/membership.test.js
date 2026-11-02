import { describe, expect, it } from "vitest";
import { showsSubscriptionCard } from "../utils/membership";

describe("showsSubscriptionCard", () => {
  it("needs both a subscription and a paid status", () => {
    expect(showsSubscriptionCard({ subscription: {}, membershipStatus: "trial" })).toBe(true);
    expect(showsSubscriptionCard({ membershipStatus: "premium" })).toBe(false);
    expect(showsSubscriptionCard({ subscription: {}, isActive: true })).toBe(false);
  });
});
