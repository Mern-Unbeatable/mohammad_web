/**
 * Central definition of which member features require an active subscription.
 * Mirrors the backend entitlement gate (`requireEntitlement`) applied to the
 * feed, marketplace, recruitment, general, search, contacts and messages
 * routers. The backend remains authoritative (it answers 403
 * SUBSCRIPTION_REQUIRED); this list only drives the UI gate so a locked user
 * sees the Subscription Limit card instead of feature errors.
 */

/** Where the "View Pricing Plans" action sends the user. */
export const PRICING_PATH = '/subscription';

/** Route prefixes that require an active subscription for USER accounts. */
export const PREMIUM_PATH_PREFIXES = Object.freeze([
  '/feed',
  '/search',
  '/contacts',
  '/marketplace',
  '/recruitment',
  '/general',
  '/chat',
  '/messages',
]);

/** True when `pathname` belongs to a subscription-gated feature. */
export const isPremiumPath = (pathname = '') =>
  PREMIUM_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
