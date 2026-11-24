import { useCallback, useEffect, useState } from "react";
import { useCreatePostAction } from "@/shared/context/useCreatePostAction";
import { DEFAULT_POST_OPTION } from "../utils/postTypeOptions";
import { usePublishPost } from "./usePublishPost";

/**
 * Create-post modal state. Also registers the opener with the layout so
 * other shell entry points (e.g. mobile nav) can open it.
 */
export function useCreatePost({ onPublished } = {}) {
  const { registerOpenCreatePost } = useCreatePostAction();
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

  const handlePublished = useCallback(() => {
    setOpen(false);
    onPublished?.();
  }, [onPublished]);
  const publish = usePublishPost(handlePublished);

  return { open, option, openCreatePost, closeCreatePost, publish };
}
