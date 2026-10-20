import { describe, expect, it } from "vitest";
import { isPremiumMember, showsSubscriptionCard } from "../utils/membership";

describe("isPremiumMember", () => {
  it("is true for active accounts and paid, trial or cancelled memberships", () => {
    expect(isPremiumMember({ isActive: true, membershipStatus: "free" })).toBe(true);
    for (const membershipStatus of ["premium", "trial", "cancelled"]) {
      expect(isPremiumMember({ membershipStatus })).toBe(true);
    }
  });

  it("is false for free or missing users", () => {
    expect(isPremiumMember({ membershipStatus: "free" })).toBe(false);
    expect(isPremiumMember(null)).toBe(false);
  });
});

describe("showsSubscriptionCard", () => {
  it("needs both a subscription and a paid status", () => {
    expect(showsSubscriptionCard({ subscription: {}, membershipStatus: "trial" })).toBe(true);
    expect(showsSubscriptionCard({ membershipStatus: "premium" })).toBe(false);
    expect(showsSubscriptionCard({ subscription: {}, isActive: true })).toBe(false);
  });
});
