import { useEffect, useState } from 'react';
import { loadGuestBaseList } from '@/modules/public/general/utils/guestBaseList';

const FOOTER_POSTS_LIMIT = 2;

/** Latest public General posts for the site footer. */
export const useFooterPopularPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const items = await loadGuestBaseList();
        if (!cancelled) setPosts((items || []).slice(0, FOOTER_POSTS_LIMIT));
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading };
};
