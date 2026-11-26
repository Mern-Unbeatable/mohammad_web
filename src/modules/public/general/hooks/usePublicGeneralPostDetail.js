import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-hot-toast';
import { toGeneralPostModel } from '@/features/dash/user/general';
import * as publicGeneralApi from '@/features/public/general/generalApi';
import { useAuth } from '@/modules/auth';
import {
  canGuestViewPost,
  isGuestViewLimitError,
  markGuestViewLimitReached,
  recordGuestPostView,
} from '../utils/guestViews';
import { RELATED_POSTS_LIMIT } from '../constant/constants';
import { pickRelatedPosts } from '../utils/relatedPosts';

const copyPageLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied');
  } catch {
    toast(window.location.href);
  }
};

export const usePublicGeneralPostDetail = () => {
  const { postId } = useParams();
  const { isAuthenticated, sessionReady, user } = useAuth();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [guestBlocked, setGuestBlocked] = useState(false);

  useEffect(() => {
    if (!sessionReady || !postId) return undefined;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setNotFound(false);
      setGuestBlocked(false);
      setPost(null);
      setRelated([]);

      if (!isAuthenticated && !canGuestViewPost(postId)) {
        if (!cancelled) {
          setGuestBlocked(true);
          setLoading(false);
        }
        return;
      }

      try {
        const raw = await publicGeneralApi.getPublicPostById(postId);
        if (cancelled) return;
        const model = toGeneralPostModel(raw);
        setPost(model);
        if (!isAuthenticated) recordGuestPostView(postId);

        try {
          const list = await publicGeneralApi.getPublicPostsList({
            page: 1,
            pageSize: RELATED_POSTS_LIMIT + 1,
            sort: 'desc',
            ...(model?.type ? { type: model.type } : {}),
          });
          if (!cancelled) {
            setRelated(
              pickRelatedPosts(list.data, postId)
                .map(toGeneralPostModel)
                .filter(Boolean),
            );
          }
        } catch {
          if (!cancelled) setRelated([]);
        }
      } catch (error) {
        if (cancelled) return;
        if (isGuestViewLimitError(error)) {
          markGuestViewLimitReached();
          setGuestBlocked(true);
          return;
        }
        setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [postId, isAuthenticated, sessionReady]);

  return {
    postId,
    loading: !sessionReady || loading,
    notFound,
    guestBlocked,
    post,
    related,
    share: copyPageLink,
    isAuthenticated,
    user,
  };
};
