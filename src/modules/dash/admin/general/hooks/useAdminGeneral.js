import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchGeneralPosts,
  removeGeneralPost,
  toGeneralPostModel,
} from "@/features/dash/admin/general";
import { buildPostsQuery } from "../utils/generalPosts";
import { DEFAULT_CATEGORY } from "../constant/constants";

/** General post list: category filter, paging and the delete flow. */
export const useAdminGeneral = () => {
  const dispatch = useDispatch();
  const { posts, postsMeta, postsLoading, deleting, error } = useSelector(
    (state) => state.adminGeneral,
  );

  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchGeneralPosts(buildPostsQuery({ page, category })));
  }, [dispatch, page, category]);

  const items = useMemo(() => (posts || []).map(toGeneralPostModel).filter(Boolean), [posts]);

  const changeCategory = (next) => {
    setCategory(next);
    setPage(1);
  };

  const requestDelete = (postId) => {
    if (deleting) return;
    const post = items.find((item) => item.id === postId);
    if (post) setPendingDelete(post);
  };

  const cancelDelete = () => {
    if (!deleting) setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;
    const result = await dispatch(removeGeneralPost(pendingDelete.id));
    if (removeGeneralPost.fulfilled.match(result)) {
      toast.success("Post deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete post");
  };

  return {
    items,
    loading: postsLoading && !items.length,
    error,
    category,
    changeCategory,
    page: postsMeta?.page || page,
    totalPages: postsMeta?.totalPages || 1,
    changePage: setPage,
    deleting,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
