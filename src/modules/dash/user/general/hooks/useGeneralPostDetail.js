import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  fetchGeneralPostDetails,
  clearSelectedPost,
  clearGeneralError,
  toGeneralPostModel,
} from '@/features/dash/user/general';

const copyPageLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied');
  } catch {
    toast(window.location.href);
  }
};

export const useGeneralPostDetail = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { selectedPost, selectedPostLoading, error } = useSelector(
    (state) => state.userGeneral,
  );
  /** Post id whose fetch was rejected; any other id is not (yet) known to be missing. */
  const [missingId, setMissingId] = useState(null);

  useEffect(() => {
    if (!postId) return undefined;
    dispatch(clearGeneralError());
    dispatch(fetchGeneralPostDetails(postId)).then((result) => {
      if (fetchGeneralPostDetails.rejected.match(result)) setMissingId(postId);
    });
    return () => {
      dispatch(clearSelectedPost());
    };
  }, [dispatch, postId]);

  useEffect(() => {
    if (error && !selectedPostLoading) toast.error(error);
  }, [error, selectedPostLoading]);

  const loading = selectedPostLoading || (!selectedPost && !error);

  return {
    notFound: Boolean(postId) && missingId === postId,
    loading,
    post: loading ? null : toGeneralPostModel(selectedPost),
    share: copyPageLink,
  };
};
