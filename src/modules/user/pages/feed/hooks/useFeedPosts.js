import { useCallback, useLayoutEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchFeed,
  fetchMoreFeed,
  invalidateFeedPosts,
  toFeedPostModel,
} from "@/features/user/feed";
import { FEED_PAGE_SIZE, FILTER_TO_API_TYPE } from "../constants";

/**
 * Toasts a failed list request. Requests skipped by a thunk `condition` are
 * not failures. Only this hook's own requests are reported: the slice-wide
 * `error` is also set by other pages' and actions' thunks, which toast for themselves.
 */
const toastIfFailed = (thunk, result, fallback) => {
  if (thunk.rejected.match(result) && !result.meta.condition) {
    toast.error(result.payload || fallback);
  }
};

/** Feed posts for `filter`: first page on filter change, "load more" paging and refresh. */
export function useFeedPosts(filter) {
  const dispatch = useDispatch();
  const { posts, postsMeta, postsLoading, postsLoadingMore, postsError } = useSelector(
    (state) => state.userFeed,
  );

  const query = useMemo(() => {
    const type = FILTER_TO_API_TYPE[filter];
    return {
      page: 1,
      pageSize: FEED_PAGE_SIZE,
      sort: "desc",
      ...(type ? { type } : {}),
    };
  }, [filter]);

  /** Re-fetch the first page without clearing what's on screen. */
  const refresh = useCallback(async () => {
    const result = await dispatch(fetchFeed(query));
    toastIfFailed(fetchFeed, result, "Failed to load feed");
  }, [dispatch, query]);

  const reload = useCallback(() => {
    dispatch(invalidateFeedPosts());
    return refresh();
  }, [dispatch, refresh]);

  const currentPage = postsMeta?.page ?? 1;
  const hasMore = currentPage < (postsMeta?.totalPages ?? 1);
  const loadMore = async () => {
    const result = await dispatch(fetchMoreFeed({ ...query, page: currentPage + 1 }));
    toastIfFailed(fetchMoreFeed, result, "Failed to load more posts");
  };

  useLayoutEffect(() => {
    reload();
  }, [reload]);

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
