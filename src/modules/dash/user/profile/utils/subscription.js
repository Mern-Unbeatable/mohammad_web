import {
  EMPTY_SUBSCRIPTION,
  SUBSCRIPTION_STATUS_CLASS,
  SUBSCRIPTION_STATUS_FALLBACK_CLASS,
} from "../constant/constants";

/** Subscription with "—" for every missing field. */
export const withSubscriptionDefaults = (subscription) => ({
  ...EMPTY_SUBSCRIPTION,
  ...(subscription || {}),
});

export const subscriptionStatusKey = (details) =>
  String(details.statusKey || details.status || "").toUpperCase();

/** Active or trial plans that are not already set to end. */
export const canCancelSubscription = (details) => {
  const key = subscriptionStatusKey(details);
  return (key === "ACTIVE" || key === "TRIAL") && !details.cancelAtPeriodEnd;
};

export const subscriptionStatusClass = (statusKey) =>
  SUBSCRIPTION_STATUS_CLASS[statusKey] || SUBSCRIPTION_STATUS_FALLBACK_CLASS;

/** `[label, value, isStatus]` rows for the details list. */
export const subscriptionRows = (details) => [
  ["Plan Name", details.planName],
  ["Status", details.status, true],
  ["Start Date", details.startDate],
  [
    details.cancelAtPeriodEnd ? "Access Until" : "Renewal Date",
    details.cancelAtPeriodEnd
      ? details.accessEndsAt || details.renewalDate
      : details.renewalDate,
  ],
  ["Amount", details.amount],
  ["Billing Cycle", details.billingCycle],
  ["Next Payment", details.cancelAtPeriodEnd ? "—" : details.nextPayment],
  ["Payment Method", details.paymentMethod],
];
