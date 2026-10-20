import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { toast } from "react-hot-toast";
import {
  fetchJobs,
  clearRecruitmentError,
  invalidateJobsList,
  toJobCardModel,
} from "@/features/user/recruitment";
import { usePageParam } from "@/shared/hooks/usePageParam";
import { SEARCH_PARAM } from "@/shared/utils/urlFilters";
import { PUBLIC_JOBS_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../constant/constants";
import { buildPublicJobsQuery } from "../utils/jobsSection";
import {
  EMPLOYMENT_PARAM,
  LEVEL_PARAM,
  WORKPLACE_PARAM,
  publicJobFilters,
} from "../utils/recruitmentUrlFilters";

/**
 * Public job list driven by the URL (`?page=&level=&type=&workplace=&q=`).
 * The search box is local state, debounced into `q`.
 */
export function usePublicJobs() {
  const dispatch = useDispatch();
  const { jobs, jobsMeta, jobsLoading, jobsError, error } = useSelector(
    (state) => state.userRecruitment,
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const {
    [LEVEL_PARAM]: level,
    [EMPLOYMENT_PARAM]: employmentType,
    [WORKPLACE_PARAM]: workplaceType,
    [SEARCH_PARAM]: search,
  } = publicJobFilters.read(searchParams);
  const [page, setPage] = usePageParam();

  const [query, setQuery] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  // Back/Forward can change `q`; mirror it into the search box.
  if (search !== syncedSearch) {
    setSyncedSearch(search);
    setQuery(search);
  }

  const updateFilters = useCallback(
    (changes, { replace = false } = {}) => {
      dispatch(invalidateJobsList());
      setSearchParams((prev) => publicJobFilters.apply(prev, changes), { replace });
    },
    [dispatch, setSearchParams],
  );

  useEffect(() => {
    const next = publicJobFilters.normalize(searchParams);
    if (next) setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = query.trim() ? query : "";
      if (nextSearch === search) return;
      updateFilters({ [SEARCH_PARAM]: nextSearch }, { replace: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, search, updateFilters]);

  const loadJobs = useCallback(() => {
    dispatch(clearRecruitmentError());
    dispatch(
      fetchJobs(
        buildPublicJobsQuery({
          page,
          pageSize: PUBLIC_JOBS_PAGE_SIZE,
          query: search,
          level,
          employmentType,
          workplaceType,
        }),
      ),
    );
  }, [dispatch, page, search, level, employmentType, workplaceType]);

  // Run before paint so skeletons replace stale cards immediately on filter/page change
  useLayoutEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const items = useMemo(
    () => (jobs || []).map(toJobCardModel).filter(Boolean),
    [jobs],
  );

  const totalPages = Math.max(1, jobsMeta?.totalPages || 1);
  // Only trust totalPages once it belongs to the page in the URL.
  const pageOutOfRange =
    !jobsLoading &&
    !jobsError &&
    Number(jobsMeta?.page) === page &&
    page > totalPages;

  useEffect(() => {
    if (pageOutOfRange) setPage(totalPages, { replace: true });
  }, [pageOutOfRange, totalPages, setPage]);

  const setFilter = (param, current) => (value) => {
    if (value === current) return;
    updateFilters({ [param]: value });
  };

  const changePage = (next) => {
    if (next === page) return;
    setPage(next);
  };

  return {
    items,
    total: jobsMeta?.total,
    page,
    totalPages,
    loading: jobsLoading || pageOutOfRange,
    error: jobsError,
    reload: loadJobs,
    changePage,
    query,
    setQuery,
    level,
    setLevel: setFilter(LEVEL_PARAM, level),
    employmentType,
    setEmploymentType: setFilter(EMPLOYMENT_PARAM, employmentType),
    workplaceType,
    setWorkplaceType: setFilter(WORKPLACE_PARAM, workplaceType),
  };
}
