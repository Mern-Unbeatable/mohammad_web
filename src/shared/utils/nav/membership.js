import { DEFAULT_TRIAL_DAYS } from '@/components/navigation/constant/constants';

export const profileSubtitle = (profile) =>
  [profile?.title, profile?.company].filter(Boolean).join(' · ');

export const expiredOrUpgradeText = (membershipStatus) =>
  membershipStatus === 'expired'
    ? 'Your membership has expired.'
    : 'Upgrade for full Lab Unity access.';

/** Profile dropdown: `'trial'`, `'upgrade'` or null. */
export const dropdownMembershipBanner = (profile) => {
  if (profile?.membershipStatus === 'trial') return 'trial';
  if (
    !profile?.isActive ||
    profile?.membershipStatus === 'expired' ||
    profile?.membershipStatus === 'free'
  ) {
    return 'upgrade';
  }
  return null;
};

/** Left sidebar card: `'trial'`, `'upgrade'` or null. */
export const sidebarMembershipCard = (user) => {
  if (!user) return null;
  if (user.membershipStatus === 'trial') return 'trial';
  if (
    user.membershipStatus === 'expired' ||
    user.membershipStatus === 'free' ||
    (user.membershipStatus === 'cancelled' && !user.isActive)
  ) {
    return 'upgrade';
  }
  return null;
};

/** Trial days and the remaining-time bar width (percent). */
export const trialProgress = (user) => {
  const total = user.trialDaysTotal || DEFAULT_TRIAL_DAYS;
  const left = user.trialDaysLeft ?? 0;
  const progress = Math.min(100, Math.max(0, ((total - left) / total) * 100));
  return { total, left, remainingPercent: 100 - progress };
};
