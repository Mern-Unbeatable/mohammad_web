import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { toUpdatePostPayload, updatePost } from "@/features/user/feed";

/** Edit-post modal state and save flow shared by the feed and profile pages. */
export function usePostEditor() {
  const dispatch = useDispatch();
  const saving = useSelector((state) => state.userFeed.saving);
  const [editingPost, setEditingPost] = useState(null);

  const openEditor = useCallback((post) => setEditingPost(post), []);

  const closeEditor = useCallback(() => {
    if (!saving) setEditingPost(null);
  }, [saving]);

  const saveEdit = useCallback(
    async (values) => {
      if (!editingPost?.id) return;
      const payload = toUpdatePostPayload(editingPost.raw, values);
      if (Object.keys(payload).length === 0) {
        setEditingPost(null);
        return;
      }

      const result = await dispatch(
        updatePost({ postId: editingPost.id, payload }),
      );
      if (updatePost.fulfilled.match(result)) {
        toast.success("Post updated");
        setEditingPost(null);
        return;
      }
      toast.error(result.payload || "Failed to update post");
    },
    [dispatch, editingPost],
  );

  return { editingPost, openEditor, closeEditor, saveEdit, saving };
}
