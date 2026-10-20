import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { toGeneralPostModel } from '@/features/dash/user/general';

/** General list state with posts mapped to card models; toasts store errors. */
export const useGeneralPostsState = () => {
  const { posts, postsMeta, postsLoading, saving, deleting, error } = useSelector(
    (state) => state.userGeneral,
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const items = useMemo(() => (posts || []).map(toGeneralPostModel).filter(Boolean), [posts]);

  return {
    items,
    loading: postsLoading,
    totalPages: Math.max(1, postsMeta?.totalPages || 1),
    saving,
    deleting,
  };
};
