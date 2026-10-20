import { Clock, Handshake, UserCheck, Users } from 'lucide-react';
import { COUNTRY_OPTIONS } from '@/features/dash/user/contacts';

export const CONTACTS_PATH = '/contacts';
export const contactProfilePath = (id) => `${CONTACTS_PATH}/${id}`;

export const FILTER_PARAM = 'filter';
export const COUNTRY_PARAM = 'country';

/** `pending` = requests I sent; `requests` = requests to me (Confirm tab). */
export const FILTER = {
  PEOPLE: 'people',
  CONNECTED: 'connected',
  PENDING: 'pending',
  REQUESTS: 'requests',
};
export const FILTER_IDS = Object.values(FILTER);
export const DEFAULT_FILTER = FILTER.PEOPLE;
export const DEFAULT_COUNTRY = COUNTRY_OPTIONS[0];

/** Three full rows on the four-column desktop grid. */
export const CONTACTS_PAGE_SIZE = 12;
export const CONTACTS_GRID_CLASS =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
export const SEARCH_DEBOUNCE_MS = 350;

/** Tab order as shown; differs from `FILTER_IDS`. */
export const FILTER_TABS = [
  { id: FILTER.PEOPLE, label: 'People', Icon: Users },
  { id: FILTER.PENDING, label: 'Pending', Icon: Clock },
  { id: FILTER.REQUESTS, label: 'Confirm', Icon: UserCheck },
  { id: FILTER.CONNECTED, label: 'Connected', Icon: Handshake },
];

export const EMPTY_MESSAGES = {
  [FILTER.PEOPLE]: 'No members match your search.',
  [FILTER.CONNECTED]: 'You have no connections yet.',
  [FILTER.PENDING]: 'You have no pending sent requests.',
  [FILTER.REQUESTS]: 'No requests waiting for you to confirm.',
};

/** Used when a search or country narrows the list. */
export const FILTERED_EMPTY_MESSAGES = {
  ...EMPTY_MESSAGES,
  [FILTER.CONNECTED]: 'No connections match your search.',
  [FILTER.PENDING]: 'No sent requests match your search.',
  [FILTER.REQUESTS]: 'No requests match your search.',
};
