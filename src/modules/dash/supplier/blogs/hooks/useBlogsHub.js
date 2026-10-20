import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchSupplierBlogs,
  fetchSupplierLatestBlogs,
  clearBlogsError,
} from "@/features/dash/supplier/blogs";
import { buildBlogsQuery, buildLatestBlogsQuery } from "../utils/blogQueries";
import { toBlogCards } from "../utils/blogCards";
import { SEARCH_DEBOUNCE_MS } from "../constant/constants";

/** Blogs hub: debounced search shared by the latest strip and the paged archive. */
export const useBlogsHub = () => {
  const dispatch = useDispatch();
  const { blogs, blogsMeta, latestBlogs, blogsLoading, latestLoading, error } = useSelector(
    (state) => state.supplierBlogs,
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === debouncedQuery) return;
      setDebouncedQuery(query);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery]);

  useEffect(() => {
    dispatch(clearBlogsError());
    dispatch(fetchSupplierLatestBlogs(buildLatestBlogsQuery(debouncedQuery)));
    dispatch(fetchSupplierBlogs(buildBlogsQuery({ page, query: debouncedQuery })));
  }, [dispatch, page, debouncedQuery]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const latestItems = useMemo(() => toBlogCards(latestBlogs), [latestBlogs]);
  const archiveItems = useMemo(() => toBlogCards(blogs), [blogs]);

  return {
    query,
    setQuery,
    latestItems,
    latestLoading: latestLoading && !latestItems.length,
    archiveItems,
    archiveLoading: blogsLoading && !archiveItems.length,
    page,
    totalPages: Math.max(1, blogsMeta?.totalPages || 1),
    changePage: setPage,
  };
};
