import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchMyPosts,
  fetchMoreMyPosts,
  removePost,
  toFeedPostModel,
} from "@/features/dash/user/feed";

/** The caller's posts for the activity tab: load, load more, report target and delete flow. */
export function useMyPosts() {
  const dispatch = useDispatch();
  const {
    myPosts,
    myPostsMeta,
    myPostsLoaded,
    myPostsLoadingMore,
    myPostsStale,
    myPostsError,
    deleting,
  } = useSelector((state) => state.userFeed);
  const [reportPost, setReportPost] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchMyPosts());
  }, [dispatch, myPostsStale]);

  useEffect(() => {
    if (myPostsError) toast.error(myPostsError);
  }, [myPostsError]);

  const posts = useMemo(
    () => (myPosts || []).map(toFeedPostModel).filter(Boolean),
    [myPosts],
  );

  const cancelDelete = () => {
    if (!deleting) setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;
    const result = await dispatch(removePost(pendingDelete.id));
    if (removePost.fulfilled.match(result)) {
      toast.success("Post deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete post");
  };

  return {
    posts,
    loading: !myPostsLoaded && !myPostsError,
    hasMore: (myPostsMeta?.page ?? 1) < (myPostsMeta?.totalPages ?? 1),
    loadingMore: myPostsLoadingMore,
    loadMore: () => dispatch(fetchMoreMyPosts()),
    reportPost,
    openReport: setReportPost,
    closeReport: () => setReportPost(null),
    deleting,
    pendingDelete,
    requestDelete: setPendingDelete,
    cancelDelete,
    confirmDelete,
  };
}
