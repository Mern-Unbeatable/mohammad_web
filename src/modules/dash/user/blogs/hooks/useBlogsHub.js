import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  fetchBlogs,
  fetchLatestBlogs,
  clearBlogsError,
  invalidateBlogsList,
} from '@/features/dash/user/blogs';
import { buildBlogsQuery, buildLatestBlogsQuery } from '../utils/blogQueries';
import { toBlogCards } from '../utils/blogCards';
import { SEARCH_DEBOUNCE_MS } from '../constant/constants';

/** Blogs hub: debounced search shared by the latest strip and the paged archive. */
export const useBlogsHub = () => {
  const dispatch = useDispatch();
  const { blogs, blogsMeta, latestBlogs, blogsLoading, latestLoading, error } = useSelector(
    (state) => state.userBlogs,
  );

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === debouncedQuery) return;
      dispatch(invalidateBlogsList());
      setDebouncedQuery(query);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery, dispatch]);

  useLayoutEffect(() => {
    dispatch(clearBlogsError());
    dispatch(fetchLatestBlogs(buildLatestBlogsQuery(debouncedQuery)));
    dispatch(fetchBlogs(buildBlogsQuery({ page, query: debouncedQuery })));
  }, [dispatch, page, debouncedQuery]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const latestItems = useMemo(() => toBlogCards(latestBlogs), [latestBlogs]);
  const archiveItems = useMemo(() => toBlogCards(blogs), [blogs]);

  const changePage = (next) => {
    if (next === page) return;
    dispatch(invalidateBlogsList());
    setPage(next);
  };

  return {
    query,
    setQuery,
    latestItems,
    latestLoading,
    archiveItems,
    archiveLoading: blogsLoading,
    page,
    totalPages: Math.max(1, blogsMeta?.totalPages || 1),
    changePage,
  };
};
