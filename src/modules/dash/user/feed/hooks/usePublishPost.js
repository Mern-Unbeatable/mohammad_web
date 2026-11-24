import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { createPost } from "@/features/dash/user/feed";
import { toCreatePostPayload } from "../utils/postPayload";

/** Publishes a new feed post from CreatePostModal values; calls `onPublished` on success. */
export function usePublishPost(onPublished) {
  const dispatch = useDispatch();

  return useCallback(
    async (values) => {
      const result = await dispatch(createPost(toCreatePostPayload(values)));
      if (createPost.fulfilled.match(result)) {
        toast.success("Post published");
        onPublished?.();
        return;
      }
      toast.error(result.payload || "Failed to publish post");
    },
    [dispatch, onPublished],
  );
}
