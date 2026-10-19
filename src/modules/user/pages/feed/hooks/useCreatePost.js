import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { createPost } from "@/features/user/feed";
import { useFeedActions } from "@/modules/user/context/useFeedActions";
import { DEFAULT_POST_OPTION } from "../utils/postTypeOptions";
import { toCreatePostPayload } from "../utils/postPayload";

/**
 * Create-post modal state. Also registers the opener with the layout so
 * other shell entry points (e.g. mobile nav) can open it.
 */
export function useCreatePost({ onPublished } = {}) {
  const dispatch = useDispatch();
  const { registerOpenCreatePost } = useFeedActions();
  const [open, setOpen] = useState(false);
  const [option, setOption] = useState(DEFAULT_POST_OPTION);

  const openCreatePost = useCallback((nextOption = DEFAULT_POST_OPTION) => {
    setOption(nextOption);
    setOpen(true);
  }, []);

  const closeCreatePost = useCallback(() => setOpen(false), []);

  useEffect(
    () => registerOpenCreatePost(() => openCreatePost()),
    [registerOpenCreatePost, openCreatePost],
  );

  const publish = async (values) => {
    const result = await dispatch(createPost(toCreatePostPayload(values)));
    if (createPost.fulfilled.match(result)) {
      toast.success("Post published");
      setOpen(false);
      onPublished?.();
      return;
    }
    toast.error(result.payload || "Failed to publish post");
  };

  return { open, option, openCreatePost, closeCreatePost, publish };
}
