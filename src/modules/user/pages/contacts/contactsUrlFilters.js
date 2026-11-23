import { COUNTRY_OPTIONS } from "@/features/user/contacts";
import {
  SEARCH_MAX_LENGTH,
  SEARCH_PARAM,
  createUrlFilters,
  parseOptionParam,
  parseSearchParam,
} from "@/shared/utils/urlFilters";

export { SEARCH_MAX_LENGTH, SEARCH_PARAM, parseSearchParam };

export const FILTER_PARAM = "filter";
export const COUNTRY_PARAM = "country";

/** `pending` = requests I sent; `requests` = requests to me (Confirm tab). */
export const FILTER_IDS = ["people", "connected", "pending", "requests"];
export const DEFAULT_FILTER = "people";
export const DEFAULT_COUNTRY = COUNTRY_OPTIONS[0];

export const parseFilterParam = (value) =>
  parseOptionParam(value, FILTER_IDS, DEFAULT_FILTER);

export const parseCountryParam = (value) =>
  parseOptionParam(value, COUNTRY_OPTIONS, DEFAULT_COUNTRY);

const contactsFilters = createUrlFilters({
  [FILTER_PARAM]: { parse: parseFilterParam, fallback: DEFAULT_FILTER },
  [COUNTRY_PARAM]: { parse: parseCountryParam, fallback: DEFAULT_COUNTRY },
  [SEARCH_PARAM]: { parse: parseSearchParam, fallback: "" },
});

export const applyFilterChanges = contactsFilters.apply;
export const withoutInvalidFilters = contactsFilters.normalize;

/** List API params; search and country narrow every filter, not just People. */
export const buildContactsQuery = ({ page, search, country, filter, pageSize }) => {
  const params = { page, pageSize, sort: "desc" };

  const q = search?.trim();
  if (q) params.search = q;
  if (country && country !== DEFAULT_COUNTRY) params.country = country;

  if (filter === "requests") {
    params.status = "pending";
    params.direction = "incoming";
  } else if (filter === "pending") {
    params.status = "pending";
    params.direction = "outgoing";
  } else if (filter === "connected") {
    params.status = "accepted";
  }
  return params;
};
