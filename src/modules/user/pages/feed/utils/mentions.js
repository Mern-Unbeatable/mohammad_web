/**
 * "@" + one name word, as produced by `mentionFromName` (first name only, so a
 * second word is regular text). Unicode letters cover names like "@Élises";
 * the lookbehind skips e-mail addresses such as "name@lab.com".
 */
export const MENTION_PATTERN =
  /(?<![\p{L}\p{N}_])@\p{L}[\p{L}\p{M}]*(?:-\p{L}[\p{L}\p{M}]*)*/gu;

export const MENTION_HIGHLIGHT = {
  pattern: MENTION_PATTERN,
  className: 'cursor-pointer font-semibold text-blue-600 hover:underline',
};
