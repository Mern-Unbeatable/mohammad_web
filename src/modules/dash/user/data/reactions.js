/** Facebook-style reactions — `id` is the stable backend value (never store emoji). */
export const reactions = [
  { id: "like", emoji: "👍", label: "Like", color: "text-primary" },
  { id: "love", emoji: "❤️", label: "Love", color: "text-[#E0245E]" },
  { id: "haha", emoji: "😆", label: "Haha", color: "text-[#F7B928]" },
  { id: "wow", emoji: "😮", label: "Wow", color: "text-[#F7B928]" },
  { id: "sad", emoji: "😢", label: "Sad", color: "text-[#F7B928]" },
  { id: "angry", emoji: "😡", label: "Angry", color: "text-[#E0245E]" },
];

export const REACTION_IDS = reactions.map((r) => r.id);

export const getReaction = (id) =>
  reactions.find((r) => r.id === String(id || "").toLowerCase());
