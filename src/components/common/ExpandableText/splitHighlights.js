/** Splits `value` into plain and highlighted parts; `pattern` may omit the `g` flag. */
export const splitHighlights = (value, pattern) => {
  if (!pattern || !value) return value ? [{ text: value }] : [];
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
  const parts = [];
  let last = 0;
  for (const match of value.matchAll(new RegExp(pattern.source, flags))) {
    if (!match[0]) continue;
    if (match.index > last) parts.push({ text: value.slice(last, match.index) });
    parts.push({ text: match[0], highlight: true });
    last = match.index + match[0].length;
  }
  if (last < value.length) parts.push({ text: value.slice(last) });
  return parts;
};
