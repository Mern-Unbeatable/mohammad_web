import { useEffect, useState } from "react";
import { getPostReactions } from "@/features/dash/user/feed";

const EMPTY = { key: null, items: [], page: 0, totalPages: 1, error: false };

/** Paged list of who reacted to a post; `type` is a reaction id or `"all"`. */
export function usePostReactions(postId, type = "all") {
  const key = postId ? `${postId}:${type}` : null;
  const typeFilter = type === "all" ? undefined : type;
  const [result, setResult] = useState(EMPTY);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!key) return undefined;
    let cancelled = false;
    getPostReactions(postId, { page: 1, type: typeFilter })
      .then(({ items, meta }) => {
        if (cancelled) return;
        setResult({
          key,
          items,
          page: meta.page ?? 1,
          totalPages: meta.totalPages ?? 1,
          error: false,
        });
      })
      .catch(() => {
        if (!cancelled) setResult({ ...EMPTY, key, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [key, postId, typeFilter]);

  const ready = result.key === key;
  const hasMore = ready && !result.error && result.page < result.totalPages;

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const next = await getPostReactions(postId, { page: result.page + 1, type: typeFilter });
      setResult((prev) =>
        prev.key === key
          ? {
              ...prev,
              items: [...prev.items, ...next.items],
              page: next.meta.page ?? prev.page + 1,
              totalPages: next.meta.totalPages ?? prev.totalPages,
            }
          : prev,
      );
    } catch {
      setResult((prev) => (prev.key === key ? { ...prev, totalPages: prev.page } : prev));
    } finally {
      setLoadingMore(false);
    }
  };

  return {
    items: ready ? result.items : [],
    loading: Boolean(key) && !ready,
    error: ready && result.error,
    hasMore,
    loadingMore,
    loadMore,
  };
}
