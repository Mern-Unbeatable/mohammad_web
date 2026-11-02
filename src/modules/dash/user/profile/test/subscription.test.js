import { describe, expect, it } from "vitest";
import {
  canCancelSubscription,
  subscriptionRows,
  subscriptionStatusClass,
  subscriptionStatusKey,
  withSubscriptionDefaults,
} from "../utils/subscription";

describe("subscription helpers", () => {
  it("fills missing fields with a dash", () => {
    const details = withSubscriptionDefaults({ planName: "Pro" });
    expect(details.planName).toBe("Pro");
    expect(details.amount).toBe("—");
    expect(withSubscriptionDefaults(null).status).toBe("—");
  });

  it("prefers statusKey over the display status", () => {
    expect(subscriptionStatusKey({ statusKey: "trial", status: "Free trial" })).toBe("TRIAL");
    expect(subscriptionStatusKey({ status: "Active" })).toBe("ACTIVE");
  });

  it("allows cancelling active or trial plans that are not already ending", () => {
    expect(canCancelSubscription({ statusKey: "ACTIVE" })).toBe(true);
    expect(canCancelSubscription({ statusKey: "TRIAL" })).toBe(true);
    expect(canCancelSubscription({ statusKey: "ACTIVE", cancelAtPeriodEnd: true })).toBe(false);
    expect(canCancelSubscription({ statusKey: "CANCELLED" })).toBe(false);
  });

  it("falls back to the red pill for unknown statuses", () => {
    expect(subscriptionStatusClass("ACTIVE")).toContain("green");
    expect(subscriptionStatusClass("PAST_DUE")).toContain("#DC2626");
  });

  it("shows access end and no next payment once cancellation is scheduled", () => {
    const rows = subscriptionRows(
      withSubscriptionDefaults({
        cancelAtPeriodEnd: true,
        accessEndsAt: "1 Dec 2026",
        nextPayment: "1 Dec 2026",
      }),
    );
    expect(rows).toContainEqual(["Access Until", "1 Dec 2026"]);
    expect(rows).toContainEqual(["Next Payment", "—"]);
  });
});
