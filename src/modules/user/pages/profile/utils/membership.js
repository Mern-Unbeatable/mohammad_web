import { PAID_MEMBERSHIP_STATUSES } from "../constant/constants";

/** Active accounts and paid / trial / cancelled-but-running memberships. */
export const isPremiumMember = (user) =>
  Boolean(user?.isActive) || PAID_MEMBERSHIP_STATUSES.includes(user?.membershipStatus);

export const showsSubscriptionCard = (user) =>
  Boolean(user?.subscription) && PAID_MEMBERSHIP_STATUSES.includes(user?.membershipStatus);
