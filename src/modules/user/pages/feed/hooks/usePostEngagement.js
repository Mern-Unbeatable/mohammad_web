import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { reactToPost } from "@/features/user/feed";
import {
  nextReactionTotal,
  normalizeReaction,
  reactionFromResponse,
  toApiReaction,
} from "../utils/reactions";

const engagementFrom = (post) => ({
  stats: post.stats,
  comments: post.comments ?? [],
  reactionCounts: post.reactionCounts || null,
  reactionId: normalizeReaction(post.myReaction),
});

/**
 * Optimistic per-card copy of a post's stats, comments and reaction.
 * Resets whenever the `post` object from the store changes.
 */
export function usePostEngagement(post) {
  const dispatch = useDispatch();
  const [syncedPost, setSyncedPost] = useState(post);
  const [state, setState] = useState(() => engagementFrom(post));

  if (post !== syncedPost) {
    setSyncedPost(post);
    setState(engagementFrom(post));
  }

  const setStats = (updater) =>
    setState((prev) => ({ ...prev, stats: updater(prev.stats) }));
  const setComments = (updater) =>
    setState((prev) => ({ ...prev, comments: updater(prev.comments) }));

  const react = async (id) => {
    const previous = state;
    const nextId = previous.reactionId === id ? null : id;
    setState((prev) => ({
      ...prev,
      reactionId: nextId,
      stats: {
        ...prev.stats,
        reactions: nextReactionTotal(prev.stats.reactions, prev.reactionId, nextId),
      },
    }));

    const result = await dispatch(
      reactToPost({
        postId: post.id,
        type: toApiReaction(nextId || previous.reactionId),
      }),
    );
    if (reactToPost.rejected.match(result)) {
      setState(previous);
      toast.error(result.payload || "Failed to update reaction");
      return;
    }

    const data = result.payload?.data;
    if (!data) return;
    const serverTotal = data.reactionCount ?? data.stats?.reactions;
    setState((prev) => ({
      ...prev,
      reactionId: reactionFromResponse(data) ?? null,
      stats: serverTotal != null ? { ...prev.stats, reactions: serverTotal } : prev.stats,
      reactionCounts: data.reactionCounts || prev.reactionCounts,
    }));
  };

  return { ...state, react, setStats, setComments };
}
