import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  fetchBlogsList,
  removeBlogPost,
  toBlogCardModel,
} from "@/features/dash/admin/blogs";
import { BLOGS_PAGE_SIZE, NEW_BLOG_PATH } from "../constant/constants";

/** Blog list: paging, edit (via the editor with route state) and the delete flow. */
export const useAdminBlogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, blogsMeta, blogsLoading, deleting, error } = useSelector(
    (state) => state.adminBlogs,
  );

  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchBlogsList({ page, pageSize: BLOGS_PAGE_SIZE }));
  }, [dispatch, page]);

  const items = useMemo(() => (blogs || []).map(toBlogCardModel).filter(Boolean), [blogs]);

  const editBlog = (id) => {
    const article = items.find((entry) => entry.id === id);
    navigate(NEW_BLOG_PATH, { state: { article } });
  };

  const requestDelete = (id) => {
    if (deleting) return;
    const article = items.find((item) => item.id === id);
    if (article) setPendingDelete(article);
  };

  const cancelDelete = () => {
    if (!deleting) setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;
    const result = await dispatch(removeBlogPost(pendingDelete.id));
    if (removeBlogPost.fulfilled.match(result)) {
      toast.success("Blog deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete blog");
  };

  return {
    items,
    loading: blogsLoading && !items.length,
    error,
    page: blogsMeta?.page || page,
    totalPages: blogsMeta?.totalPages || 1,
    changePage: setPage,
    deleting,
    editBlog,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
