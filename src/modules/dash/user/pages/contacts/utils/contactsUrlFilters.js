import { COUNTRY_OPTIONS } from '@/features/user/contacts';
import {
  SEARCH_PARAM,
  createUrlFilters,
  parseOptionParam,
  parseSearchParam,
} from '@/shared/utils/urlFilters';
import {
  COUNTRY_PARAM,
  DEFAULT_COUNTRY,
  DEFAULT_FILTER,
  FILTER,
  FILTER_IDS,
  FILTER_PARAM,
} from '../constant/constants';

export const parseFilterParam = (value) => parseOptionParam(value, FILTER_IDS, DEFAULT_FILTER);

export const parseCountryParam = (value) =>
  parseOptionParam(value, COUNTRY_OPTIONS, DEFAULT_COUNTRY);

const contactsFilters = createUrlFilters({
  [FILTER_PARAM]: { parse: parseFilterParam, fallback: DEFAULT_FILTER },
  [COUNTRY_PARAM]: { parse: parseCountryParam, fallback: DEFAULT_COUNTRY },
  [SEARCH_PARAM]: { parse: parseSearchParam, fallback: '' },
});

export const readContactsFilters = contactsFilters.read;
export const applyFilterChanges = contactsFilters.apply;
export const withoutInvalidFilters = contactsFilters.normalize;

/** List API params; search and country narrow every filter, not just People. */
export const buildContactsQuery = ({ page, search, country, filter, pageSize }) => {
  const params = { page, pageSize, sort: 'desc' };

  const q = search?.trim();
  if (q) params.search = q;
  if (country && country !== DEFAULT_COUNTRY) params.country = country;

  if (filter === FILTER.REQUESTS) {
    params.status = 'pending';
    params.direction = 'incoming';
  } else if (filter === FILTER.PENDING) {
    params.status = 'pending';
    params.direction = 'outgoing';
  } else if (filter === FILTER.CONNECTED) {
    params.status = 'accepted';
  }
  return params;
};
