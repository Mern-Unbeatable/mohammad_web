/** Full class strings so Tailwind can see them when scanning sources. */
export const COVER_GRADIENTS = [
  "bg-gradient-to-br from-deep-blue via-[#0B4F8A] to-primary",
  "bg-gradient-to-br from-[#0F766E] via-[#0D9488] to-[#5EEAD4]",
  "bg-gradient-to-br from-[#4338CA] via-[#6366F1] to-[#A5B4FC]",
  "bg-gradient-to-br from-[#9D174D] via-[#DB2777] to-[#F9A8D4]",
  "bg-gradient-to-br from-[#B45309] via-[#F59E0B] to-[#FDE68A]",
  "bg-gradient-to-br from-[#166534] via-[#16A34A] to-[#86EFAC]",
  "bg-gradient-to-br from-[#6D28D9] via-[#8B5CF6] to-[#C4B5FD]",
  "bg-gradient-to-br from-[#0369A1] via-[#0EA5E9] to-[#7DD3FC]",
];

/**
 * Fallback cover background for members without a cover photo. Picked from
 * `seed` (user id or name) so each member keeps the same colours on every visit.
 */
export const coverGradientClass = (seed) => {
  const text = String(seed ?? "");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return COVER_GRADIENTS[hash % COVER_GRADIENTS.length];
};
