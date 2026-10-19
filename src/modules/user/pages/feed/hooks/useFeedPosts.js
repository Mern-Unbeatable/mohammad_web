import { useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchFeed,
  fetchMoreFeed,
  invalidateFeedPosts,
  toFeedPostModel,
} from "@/features/user/feed";
import { FEED_PAGE_SIZE, FILTER_TO_API_TYPE } from "../constants";

/** Feed posts for `filter`: first page on filter change, "load more" paging and refresh. */
export function useFeedPosts(filter) {
  const dispatch = useDispatch();
  const { posts, postsMeta, postsLoading, postsLoadingMore, postsError, error } =
    useSelector((state) => state.userFeed);

  const query = useMemo(() => {
    const type = FILTER_TO_API_TYPE[filter];
    return {
      page: 1,
      pageSize: FEED_PAGE_SIZE,
      sort: "desc",
      ...(type ? { type } : {}),
    };
  }, [filter]);

  const reload = useCallback(() => {
    dispatch(invalidateFeedPosts());
    dispatch(fetchFeed(query));
  }, [dispatch, query]);

  /** Re-fetch the first page without clearing what's on screen. */
  const refresh = useCallback(() => dispatch(fetchFeed(query)), [dispatch, query]);

  const currentPage = postsMeta?.page ?? 1;
  const hasMore = currentPage < (postsMeta?.totalPages ?? 1);
  const loadMore = () => dispatch(fetchMoreFeed({ ...query, page: currentPage + 1 }));

  useLayoutEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const items = useMemo(
    () => (posts || []).map(toFeedPostModel).filter(Boolean),
    [posts],
  );

  return {
    posts: items,
    loading: postsLoading,
    loadingMore: postsLoadingMore,
    failed: Boolean(postsError),
    hasMore,
    loadMore,
    reload,
    refresh,
  };
}
