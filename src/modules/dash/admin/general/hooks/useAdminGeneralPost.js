import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
  clearSelectedPost,
  fetchGeneralPostDetails,
  toGeneralPostModel,
} from "@/features/dash/admin/general";

/** Loads the post from the route and clears it on leave. */
export const useAdminGeneralPost = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { selectedPost, selectedPostLoading, error } = useSelector(
    (state) => state.adminGeneral,
  );

  useEffect(() => {
    if (postId) dispatch(fetchGeneralPostDetails(postId));
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, postId]);

  const post = useMemo(() => toGeneralPostModel(selectedPost), [selectedPost]);

  return {
    loading: selectedPostLoading,
    notFound: (error && !selectedPost) || !post,
    post,
  };
};
