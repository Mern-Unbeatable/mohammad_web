import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  createSupplierGeneralPost,
  updateSupplierGeneralPost,
  removeSupplierGeneralPost,
  postToFormValues,
} from "@/features/dash/supplier/general";
import { buildPostPayload } from "../utils/postForm";
import { useGeneralPostsState } from "./useGeneralPostsState";
import { usePostsListing } from "./usePostsListing";

/** My posts: category filter, paging, create / edit modal and delete flow. */
export const useMyGeneralPosts = () => {
  const dispatch = useDispatch();
  const { items, loading, totalPages, saving, deleting } = useGeneralPostsState();
  const listing = usePostsListing({ mine: true });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const openCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const openEdit = (postId) => {
    const post = items.find((item) => item.id === postId);
    if (!post) return;
    setEditingPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingPost(null);
  };

  const requestDelete = (postId) => {
    if (deleting) return;
    const post = items.find((item) => item.id === postId);
    if (!post) return;
    setPendingDelete(post);
  };

  const cancelDelete = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removeSupplierGeneralPost(pendingDelete.id));
    if (removeSupplierGeneralPost.fulfilled.match(result)) {
      toast.success("Post deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete post");
  };

  const submitPost = async (form) => {
    const isEdit = Boolean(editingPost?.id);
    const { error, payload } = buildPostPayload(form, { isEdit });
    if (error) {
      toast.error(error);
      return false;
    }

    if (isEdit) {
      const result = await dispatch(updateSupplierGeneralPost({ postId: editingPost.id, payload }));
      if (updateSupplierGeneralPost.fulfilled.match(result)) {
        toast.success("Post updated");
        setEditingPost(null);
        return true;
      }
      toast.error(result.payload || "Failed to update post");
      return false;
    }

    const result = await dispatch(createSupplierGeneralPost(payload));
    if (createSupplierGeneralPost.fulfilled.match(result)) {
      toast.success("Post published");
      listing.reloadFirstPage();
      return true;
    }
    toast.error(result.payload || "Failed to create post");
    return false;
  };

  return {
    category: listing.category,
    changeCategory: listing.changeCategory,
    page: listing.page,
    changePage: listing.changePage,
    totalPages,
    items,
    loading,
    saving,
    deleting,
    modalOpen,
    modalMode: editingPost ? "edit" : "create",
    modalInitialValues: editingPost ? postToFormValues(editingPost) : null,
    openCreate,
    openEdit,
    closeModal,
    submitPost,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
