import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toSearchResultsModel, useGlobalSearch } from "@/features/dash/user/search";
import {
  DEFAULT_SEARCH_TAB,
  PAGE_FETCH_LIMIT,
  QUERY_PARAM,
  TAB_PARAM,
} from "../constant/constants";
import { toSearchGroups } from "../utils/searchResults";
import { isSearchTab, withSearchTab } from "../utils/searchTabs";

/** `/search?q=&tab=`: reads the query and tab from the URL and fetches grouped results. */
export function useSearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get(QUERY_PARAM) ?? "").trim();
  const tabParam = searchParams.get(TAB_PARAM);
  const activeTab = isSearchTab(tabParam) ? tabParam : DEFAULT_SEARCH_TAB;

  const { results, loading, error, retry } = useGlobalSearch(query, {
    limit: PAGE_FETCH_LIMIT,
  });
  const groups = useMemo(() => toSearchGroups(toSearchResultsModel(results)), [results]);

  const setActiveTab = (tab) => {
    setSearchParams((prev) => withSearchTab(prev, tab), { replace: true });
  };

  const openResult = (href) => {
    if (href && href !== "#") navigate(href);
  };

  return { query, activeTab, setActiveTab, groups, loading, error, retry, openResult };
}
