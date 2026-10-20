import { maxWidthQuery, minWidthQuery } from '@/shared/constants/breakpoints';

export const CHAT_TAB = Object.freeze({
  MESSAGES: 'messages',
  GROUPS: 'groups',
});

export const CONVERSATION_TYPE = Object.freeze({
  DIRECT: 'direct',
  GROUP: 'group',
});

export const SEARCH_DEBOUNCE_MS = 300;
/** Fallback refresh while the realtime connection is down. */
export const POLL_INTERVAL_MS = 20000;
/** The messenger switches between full-viewport and inline layout at `xl`. */
export const DESKTOP_QUERY = minWidthQuery('xl');
export const MOBILE_QUERY = maxWidthQuery('xl');
/** Hides "typing..." if the sender's "stopped" event never arrives. */
export const TYPING_EXPIRY_MS = 6000;

export const MAX_ATTACHMENTS = 10;
export const START_CONVERSATION_MAX_LENGTH = 5000;

export const LISTING_UNAVAILABLE_MESSAGE = 'That listing is no longer available';
export const CONVERSATION_UNAVAILABLE_MESSAGE = 'That conversation is no longer available';
