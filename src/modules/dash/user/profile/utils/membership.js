import { PAID_MEMBERSHIP_STATUSES } from "../constant/constants";

export const showsSubscriptionCard = (user) =>
  Boolean(user?.subscription) && PAID_MEMBERSHIP_STATUSES.includes(user?.membershipStatus);
