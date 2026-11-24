import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { createSupplierGeneralPost } from "@/features/dash/supplier/general";
import { buildPostPayload } from "../utils/postForm";
import { useGeneralPostsState } from "./useGeneralPostsState";
import { usePostsListing } from "./usePostsListing";

/** Browse page: category filter, paging, and the create-post modal. */
export const useGeneralPosts = () => {
  const dispatch = useDispatch();
  const { items, loading, totalPages, saving } = useGeneralPostsState();
  const listing = usePostsListing();
  const [modalOpen, setModalOpen] = useState(false);

  const createPost = async (form) => {
    const { error, payload } = buildPostPayload(form);
    if (error) {
      toast.error(error);
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
    modalOpen,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),
    createPost,
  };
};
