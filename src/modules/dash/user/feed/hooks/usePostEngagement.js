import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { reactToPost } from "@/features/dash/user/feed";
import {
  applyReaction,
  normalizeReaction,
  planReaction,
  reconcileReaction,
  rollbackReaction,
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
  /** The server toggles reactions, so overlapping requests could leave it out of sync with the UI. */
  const reacting = useRef(false);

  if (post !== syncedPost) {
    setSyncedPost(post);
    setState(engagementFrom(post));
  }

  const setStats = (updater) =>
    setState((prev) => ({ ...prev, stats: updater(prev.stats) }));
  const setComments = (updater) =>
    setState((prev) => ({ ...prev, comments: updater(prev.comments) }));

  const react = async (pickedId) => {
    const previous = state;
    const { nextId, apiType } = planReaction(previous.reactionId, pickedId);
    if (reacting.current || !apiType) return;
    reacting.current = true;
    setState((prev) => applyReaction(prev, nextId));

    try {
      const result = await dispatch(reactToPost({ postId: post.id, type: apiType }));
      if (reactToPost.rejected.match(result)) {
        setState((prev) => rollbackReaction(prev, previous));
        toast.error(result.payload || "Failed to update reaction");
        return;
      }
      setState((prev) => reconcileReaction(prev, result.payload?.data));
    } finally {
      reacting.current = false;
    }
  };

  return { ...state, react, setStats, setComments };
}
