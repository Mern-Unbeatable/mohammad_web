import { CONTACTS_PAGE_SIZE, DEFAULT_COUNTRY, FILTER } from "../constant/constants";

/** List API params; search and country narrow every filter, not just People. */
export const buildContactsQuery = ({ page, search, country, filter }) => {
  const params = { page, pageSize: CONTACTS_PAGE_SIZE, sort: "desc" };

  const q = search?.trim();
  if (q) params.search = q;
  if (country && country !== DEFAULT_COUNTRY) params.country = country;

  if (filter === FILTER.REQUESTS) {
    params.status = "pending";
    params.direction = "incoming";
  } else if (filter === FILTER.PENDING) {
    params.status = "pending";
    params.direction = "outgoing";
  } else if (filter === FILTER.CONNECTED) {
    params.status = "accepted";
  }
  return params;
};

export const totalPagesFrom = (meta) => {
  const total = meta?.total || 0;
  return Math.max(1, meta?.totalPages || Math.ceil(total / CONTACTS_PAGE_SIZE) || 1);
};
