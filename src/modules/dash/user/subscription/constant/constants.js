import { Check, Mail, RotateCcw, Shield } from 'lucide-react';
import { SUPPORT_CONTACT } from '@/shared/constants/support';

export const SUBSCRIPTION_PATH = '/subscription';
export const PROFILE_PATH = '/profile';

/** Stripe redirects back with `?checkout=success&session_id=…` or `?checkout=cancelled`. */
export const CHECKOUT_PARAM = 'checkout';
export const SESSION_ID_PARAM = 'session_id';
export const CHECKOUT_STATUS = { SUCCESS: 'success', CANCELLED: 'cancelled' };

export const SUBSCRIPTION_STATUS = {
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
};

export const CYCLE = { MONTHLY: 'monthly', YEARLY: 'yearly' };
export const DEFAULT_CYCLE = CYCLE.MONTHLY;
export const PLAN_API = {
  [CYCLE.MONTHLY]: 'MONTHLY',
  [CYCLE.YEARLY]: 'YEARLY',
};

export const BANNER_TONE_CLASSES = {
  warning: 'border-[#F5D78E] bg-[#FEF9E6] text-[#B8860B]',
  success: 'border-green-primary/30 bg-green-secondary text-green-primary',
  danger: 'border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]',
};

export const PLAN_PERKS = [
  { Icon: Shield, label: 'Secure payment' },
  { Icon: RotateCcw, label: 'Cancel anytime' },
  { Icon: Check, label: 'Invoice provided' },
  { Icon: Mail, label: SUPPORT_CONTACT.email },
];
