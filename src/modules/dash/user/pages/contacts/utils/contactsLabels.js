import {
  DEFAULT_COUNTRY,
  EMPTY_MESSAGES,
  FILTER,
  FILTERED_EMPTY_MESSAGES,
} from '../constant/constants';

export const plural = (total, word) => `${total} ${word}${total === 1 ? '' : 's'}`;

export const requestsToConfirmLabel = (total) => `${plural(total, 'request')} to confirm`;

export const countLabel = (filter, total) => {
  if (filter === FILTER.REQUESTS) return requestsToConfirmLabel(total);
  if (filter === FILTER.PENDING) return `${plural(total, 'request')} sent`;
  if (filter === FILTER.CONNECTED) return plural(total, 'connection');
  return `${plural(total, 'member')} found`;
};

/** Text above the grid: loading, unavailable, or the result count. */
export const statusLabel = ({ loading, error, filter, total }) => {
  if (loading) return 'Loading…';
  if (error) return 'Contacts unavailable';
  return countLabel(filter, total);
};

export const emptyMessage = ({ filter, search, country }) =>
  (search.trim() || country !== DEFAULT_COUNTRY ? FILTERED_EMPTY_MESSAGES : EMPTY_MESSAGES)[
    filter
  ];
