import { useEffect, useState } from 'react';
import { generalApi, toGeneralPostModel } from '@/features/dash/user/general';
import { RELATED_POSTS_LIMIT } from '../constant/constants';
import { pickRelatedPosts } from '../utils/postDetail';

/**
 * Latest posts of the same type as `post`. Fetched outside the store so the
 * browse list in `userGeneral.posts` is left untouched.
 */
export const useRelatedGeneralPosts = (post) => {
  const postId = post?.id;
  const type = post?.type;
  const key = postId ? `${postId}:${type}` : null;
  const [result, setResult] = useState({ key: null, items: [] });

  useEffect(() => {
    if (!key) return undefined;
    let cancelled = false;
    generalApi
      .getPostsList({ page: 1, pageSize: RELATED_POSTS_LIMIT + 1, sort: 'desc', type })
      .then(({ data }) => {
        if (cancelled) return;
        const items = pickRelatedPosts(data, postId).map(toGeneralPostModel).filter(Boolean);
        setResult({ key, items });
      })
      .catch(() => {
        if (!cancelled) setResult({ key, items: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [key, postId, type]);

  const ready = result.key === key;
  return { loading: Boolean(key) && !ready, items: ready ? result.items : [] };
};
