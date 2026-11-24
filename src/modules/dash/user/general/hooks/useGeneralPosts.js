import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { fetchGeneralPosts, createGeneralPost, clearGeneralError } from '@/features/dash/user/general';
import { buildPostsQuery } from '../utils/generalQueries';
import { buildPostPayload } from '../utils/postForm';
import { DEFAULT_CATEGORY } from '../constant/constants';
import { useGeneralPostsState } from './useGeneralPostsState';

/** Browse page: category filter, paging, and the create-post modal. */
export const useGeneralPosts = () => {
  const dispatch = useDispatch();
  const { items, loading, totalPages, saving } = useGeneralPostsState();

  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(clearGeneralError());
    dispatch(fetchGeneralPosts(buildPostsQuery({ page, category })));
  }, [dispatch, page, category]);

  const changeCategory = (next) => {
    setCategory(next);
    setPage(1);
  };

  const createPost = async (form) => {
    const { error, payload } = buildPostPayload(form);
    if (error) {
      toast.error(error);
      return false;
    }

    const result = await dispatch(createGeneralPost(payload));
    if (createGeneralPost.fulfilled.match(result)) {
      toast.success('Post published');
      dispatch(fetchGeneralPosts(buildPostsQuery({ page: 1, category })));
      setPage(1);
      return true;
    }
    toast.error(result.payload || 'Failed to create post');
    return false;
  };

  return {
    category,
    changeCategory,
    page,
    setPage,
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
