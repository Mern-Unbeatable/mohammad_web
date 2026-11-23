import {
  DEFAULT_SEARCH_TAB,
  QUERY_PARAM,
  SEARCH_PATH,
  SEARCH_TABS,
  TAB_PARAM,
} from "../constant/constants";

export const isSearchTab = (id) => SEARCH_TABS.some((tab) => tab.id === id);

export const searchTabLabel = (id) =>
  SEARCH_TABS.find((tab) => tab.id === id)?.label ?? "";

/** `/search?q=…&tab=…`; the default tab and unknown tabs are left out. */
export const buildSearchPath = (query, tab = DEFAULT_SEARCH_TAB) => {
  const params = new URLSearchParams({ [QUERY_PARAM]: query.trim() });
  if (tab && tab !== DEFAULT_SEARCH_TAB && isSearchTab(tab)) {
    params.set(TAB_PARAM, tab);
  }
  return `${SEARCH_PATH}?${params}`;
};

/** Copy of `params` with `tab` set; the default tab removes the param. */
export const withSearchTab = (params, tab) => {
  const next = new URLSearchParams(params);
  if (tab === DEFAULT_SEARCH_TAB) next.delete(TAB_PARAM);
  else next.set(TAB_PARAM, tab);
  return next;
};
