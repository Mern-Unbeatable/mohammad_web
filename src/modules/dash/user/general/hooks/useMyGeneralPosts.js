import { useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  fetchGeneralPosts,
  createGeneralPost,
  updateGeneralPost,
  removeGeneralPost,
  clearGeneralError,
  invalidateGeneralPostsList,
  postToFormValues,
} from '@/features/dash/user/general';
import { buildPostsQuery } from '../utils/generalQueries';
import { buildPostPayload } from '../utils/postForm';
import { DEFAULT_CATEGORY } from '../constant/constants';
import { useGeneralPostsState } from './useGeneralPostsState';

/** My posts: category filter, paging, create / edit modal and delete flow. */
export const useMyGeneralPosts = () => {
  const dispatch = useDispatch();
  const { items, loading, totalPages, saving, deleting } = useGeneralPostsState();

  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useLayoutEffect(() => {
    dispatch(clearGeneralError());
    dispatch(fetchGeneralPosts(buildPostsQuery({ page, category, mine: true })));
  }, [dispatch, page, category]);

  const changeCategory = (next) => {
    if (next === category) return;
    dispatch(invalidateGeneralPostsList());
    setCategory(next);
    setPage(1);
  };

  const changePage = (next) => {
    if (next === page) return;
    dispatch(invalidateGeneralPostsList());
    setPage(next);
  };

  const openCreate = () => {
    setEditingPost(null);
    setModalOpen(true);
  };

  const openEdit = (postId) => {
    const post = items.find((item) => item.id === postId);
    if (!post) return;
    setEditingPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingPost(null);
  };

  const requestDelete = (postId) => {
    if (deleting) return;
    const post = items.find((item) => item.id === postId);
    if (!post) return;
    setPendingDelete(post);
  };

  const cancelDelete = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removeGeneralPost(pendingDelete.id));
    if (removeGeneralPost.fulfilled.match(result)) {
      toast.success('Post deleted');
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || 'Failed to delete post');
  };

  const submitPost = async (form) => {
    const isEdit = Boolean(editingPost?.id);
    const { error, payload } = buildPostPayload(form, { isEdit });
    if (error) {
      toast.error(error);
      return false;
    }

    if (isEdit) {
      const result = await dispatch(updateGeneralPost({ postId: editingPost.id, payload }));
      if (updateGeneralPost.fulfilled.match(result)) {
        toast.success('Post updated');
        setEditingPost(null);
        return true;
      }
      toast.error(result.payload || 'Failed to update post');
      return false;
    }

    const result = await dispatch(createGeneralPost(payload));
    if (createGeneralPost.fulfilled.match(result)) {
      toast.success('Post published');
      dispatch(invalidateGeneralPostsList());
      dispatch(fetchGeneralPosts(buildPostsQuery({ page: 1, category, mine: true })));
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
    changePage,
    totalPages,
    items,
    loading,
    saving,
    deleting,
    modalOpen,
    modalMode: editingPost ? 'edit' : 'create',
    modalInitialValues: editingPost ? postToFormValues(editingPost) : null,
    openCreate,
    openEdit,
    closeModal,
    submitPost,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
