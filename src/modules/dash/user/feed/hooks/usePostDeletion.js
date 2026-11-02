import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { removePost } from "@/features/dash/user/feed";

/** Ask-then-delete flow for a post; `pendingDelete` drives the confirm modal. */
export function usePostDeletion() {
  const dispatch = useDispatch();
  const deleting = useSelector((state) => state.userFeed.deleting);
  const [pendingDelete, setPendingDelete] = useState(null);

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
    pendingDelete,
    deleting,
    requestDelete: deleting ? undefined : setPendingDelete,
    cancelDelete,
    confirmDelete,
  };
}
