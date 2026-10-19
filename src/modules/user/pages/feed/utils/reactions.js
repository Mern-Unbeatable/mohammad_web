/** UI reaction id → API reaction type; legacy LinkedIn-style ids map onto the current set. */
const REACTION_API = {
  like: "like",
  love: "love",
  haha: "haha",
  wow: "wow",
  sad: "sad",
  angry: "angry",
  celebrate: "haha",
  support: "wow",
  insightful: "sad",
  curious: "angry",
};

export const normalizeReaction = (value) => (value ? String(value).toLowerCase() : null);

export const toApiReaction = (id) => REACTION_API[id] || "like";

/** Viewer's reaction from a react response; `undefined` when the response doesn't say. */
export const reactionFromResponse = (data) => {
  if (!data) return undefined;
  if (data.myReaction !== undefined) return normalizeReaction(data.myReaction);
  return normalizeReaction(data.reacted ? data.type : null);
};

/** Total reactions after switching from `prevId` to `nextId` (adding, removing or changing). */
export const nextReactionTotal = (total, prevId, nextId) => {
  if (nextId && !prevId) return total + 1;
  if (!nextId && prevId) return Math.max(0, total - 1);
  return total;
};

/*
 * Engagement state transitions: `{ reactionId, stats, reactionCounts, ... }`.
 * Each returns a new state and leaves comments untouched.
 */

/**
 * Picking the current reaction again removes it. The server toggles the same
 * way, so the API type is the picked one, or the removed one when clearing.
 * `apiType` is null when there is nothing to change (clearing with no reaction).
 */
export const planReaction = (currentId, pickedId) => {
  const nextId = currentId === pickedId ? null : pickedId;
  const target = nextId || currentId;
  return { nextId, apiType: target ? toApiReaction(target) : null };
};

export const applyReaction = (state, nextId) => ({
  ...state,
  reactionId: nextId,
  stats: {
    ...state.stats,
    reactions: nextReactionTotal(state.stats?.reactions ?? 0, state.reactionId, nextId),
  },
});

/** Restores only the reaction fields, so other updates made meanwhile survive. */
export const rollbackReaction = (state, previous) => ({
  ...state,
  reactionId: previous.reactionId,
  stats: { ...state.stats, reactions: previous.stats?.reactions ?? 0 },
});

/** Takes the server's reaction, total and per-type counts when the response has them. */
export const reconcileReaction = (state, data) => {
  if (!data) return state;
  const serverTotal = data.reactionCount ?? data.stats?.reactions;
  const serverReaction = reactionFromResponse(data);
  return {
    ...state,
    reactionId: serverReaction === undefined ? state.reactionId : serverReaction,
    stats: serverTotal != null ? { ...state.stats, reactions: serverTotal } : state.stats,
    reactionCounts: data.reactionCounts || state.reactionCounts,
  };
};
