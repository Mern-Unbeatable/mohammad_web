import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { invalidateJobsList } from "@/features/dash/supplier/recruitment";
import { DEFAULT_LEVEL, SEARCH_DEBOUNCE_MS } from "../constant/constants";

/**
 * Search box (debounced), level filter and page shared by both job lists.
 * Every change clears the current cards so skeletons show instead of stale jobs.
 */
export const useJobSearch = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === debouncedQuery) return;
      dispatch(invalidateJobsList());
      setDebouncedQuery(query);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery, dispatch]);

  const resetToFirstPage = () => {
    dispatch(invalidateJobsList());
    setPage(1);
  };

  const changeLevel = (next) => {
    if (next === level) return;
    resetToFirstPage();
    setLevel(next);
  };

  const changePage = (next) => {
    if (next === page) return;
    dispatch(invalidateJobsList());
    setPage(next);
  };

  return {
    query,
    setQuery,
    debouncedQuery,
    level,
    changeLevel,
    page,
    setPage,
    changePage,
    resetToFirstPage,
  };
};
