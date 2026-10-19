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
