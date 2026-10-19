/**
 * Helpers for the two-level comment tree: top-level comments with `replies`.
 * All updates return new arrays so they can be used with setState.
 */

export const findComment = (comments, commentId) => {
  for (const item of comments || []) {
    if (item.id === commentId) return item;
    const nested = findComment(item.replies, commentId);
    if (nested) return nested;
  }
  return null;
};

/** Top-level comment that contains `commentId` (itself when it is top-level). */
export const findRootId = (comments, commentId) => {
  const root = (comments || []).find(
    (item) =>
      item.id === commentId || item.replies?.some((reply) => reply.id === commentId),
  );
  return root ? root.id : commentId;
};

export const updateComment = (comments, commentId, updater) =>
  (comments || []).map((item) => {
    if (item.id === commentId) return updater(item);
    if (!item.replies?.length) return item;
    return { ...item, replies: updateComment(item.replies, commentId, updater) };
  });

/** Removes a comment (and its replies); `removedCount` counts both. */
export const removeComment = (comments, commentId) => {
  const target = findComment(comments, commentId);
  const removedCount = target ? 1 + (target.replies?.length ?? 0) : 0;
  const next = (comments || [])
    .filter((item) => item.id !== commentId)
    .map((item) => {
      if (!item.replies?.some((reply) => reply.id === commentId)) return item;
      const replies = item.replies.filter((reply) => reply.id !== commentId);
      return { ...item, replies, replyCount: replies.length };
    });
  return { comments: next, removedCount };
};

/**
 * The oldest `limit` top-level comments, plus the newest `pinned` ones so a
 * comment just posted from the preview doesn't vanish past the cut.
 */
export const selectPreview = (comments, limit, pinned = 0) => {
  if (!limit || comments.length <= limit) return comments;
  const tailStart = Math.max(limit, comments.length - pinned);
  return [...comments.slice(0, limit), ...comments.slice(tailStart)];
};
