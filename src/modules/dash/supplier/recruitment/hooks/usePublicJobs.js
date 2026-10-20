import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSupplierJobs, clearRecruitmentError } from "@/features/dash/supplier/recruitment";
import { jobCount } from "@/modules/dash/user/recruitment";
import { buildJobsQuery } from "../utils/jobsQuery";
import { useJobSearch } from "./useJobSearch";
import { useJobsList } from "./useJobsList";

/** Public Job Posts: search, level and page. */
export const usePublicJobs = () => {
  const dispatch = useDispatch();
  const search = useJobSearch();
  const { items, loading, rawTotal, totalPages } = useJobsList();
  const { page, debouncedQuery, level } = search;

  useLayoutEffect(() => {
    dispatch(clearRecruitmentError());
    dispatch(fetchSupplierJobs(buildJobsQuery({ page, query: debouncedQuery, level })));
  }, [dispatch, page, debouncedQuery, level]);

  return {
    query: search.query,
    setQuery: search.setQuery,
    level,
    changeLevel: search.changeLevel,
    page,
    changePage: search.changePage,
    totalPages,
    items,
    loading,
    count: jobCount(loading, rawTotal),
  };
};
