import { RESEND_COOLDOWN_SECONDS } from '../constant/constants';

/** Timestamp (ms) when another email may be requested. */
export const cooldownEnd = (sentAt) => sentAt + RESEND_COOLDOWN_SECONDS * 1000;

/** Whole seconds until `cooldownUntil`, never negative. */
export const secondsUntil = (cooldownUntil, now) =>
  Math.max(0, Math.ceil((cooldownUntil - now) / 1000));

export const resendLabel = ({ loading, secondsLeft }) => {
  if (loading) return 'Sending...';
  if (secondsLeft > 0) return `resend the link in ${secondsLeft}s`;
  return 'resend the link';
};
