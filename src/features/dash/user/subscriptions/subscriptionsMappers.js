/** Map subscription / plan API payloads onto billing UI props. */

export function toPlanModel(plan) {
  if (!plan) return null;
  const id = String(plan.id || plan.plan || plan.code || "").toLowerCase();
  const priceNum = Number(plan.price);
  const price =
    plan.priceLabel ||
    plan.displayPrice ||
    (Number.isFinite(priceNum) ? `€${priceNum.toFixed(2)}` : "");

  return {
    id: id || plan.id,
    label: plan.label || plan.name || id,
    price,
    period: plan.period || plan.interval || "",
    fullPrice:
      plan.fullPrice ||
      (price && plan.period ? `${price} / ${plan.period}` : price),
    subscribeLabel:
      plan.subscribeLabel ||
      (price ? `Subscribe — ${price}` : "Subscribe"),
    features: Array.isArray(plan.features) ? plan.features : [],
    raw: plan,
  };
}

export function toSubscriptionModel(subscription) {
  if (!subscription) return null;
  const status = String(subscription.status || "").toUpperCase();

  return {
    id: subscription.id || null,
    plan: subscription.plan || subscription.planId || null,
    status,
    amount: subscription.amount ?? null,
    billingCycle: subscription.billingCycle || null,
    startDate: subscription.startDate || null,
    renewalDate: subscription.renewalDate || null,
    nextPayment: subscription.nextPayment || null,
    paymentMethod: subscription.paymentMethod || null,
    trialDaysLeft: subscription.trialDaysLeft ?? 0,
    trialDaysTotal: subscription.trialDaysTotal ?? 90,
    isActive: Boolean(subscription.isActive),
    accessEndsAt: subscription.accessEndsAt || subscription.renewalDate || null,
    cancelAtPeriodEnd: Boolean(subscription.cancelAtPeriodEnd),
    raw: subscription,
  };
}

export function toPlansList(data) {
  if (Array.isArray(data)) return data.map(toPlanModel).filter(Boolean);
  if (Array.isArray(data?.plans))
    return data.plans.map(toPlanModel).filter(Boolean);
  if (data && typeof data === "object") {
    return Object.values(data).map(toPlanModel).filter(Boolean);
  }
  return [];
}

export function unwrapSubscribePayload(payload) {
  if (!payload) return { subscription: null, payment: null };
  if (payload.subscription) {
    return {
      subscription: payload.subscription,
      payment: payload.payment || null,
    };
  }
  return { subscription: payload, payment: null };
}
