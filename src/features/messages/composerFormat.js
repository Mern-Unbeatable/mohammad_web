/** Composer toolbar edits: wrap/unwrap the selection, or toggle list markers on the selected lines. */

const WRAPPERS = { bold: "**", italic: "_", strike: "~~", code: "`" };

export const MAX_MESSAGE_LENGTH = 5000;

/** Ctrl/Cmd + key -> format kind. */
export const FORMAT_SHORTCUTS = { b: "bold", i: "italic", e: "code" };

/** Format kind for a keydown event's Ctrl/Cmd shortcut, if any. */
export const formatShortcutFor = (e) =>
  (e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey
    ? FORMAT_SHORTCUTS[String(e.key).toLowerCase()] || null
    : null;
const BULLET = /^(\s*)[-*•]\s+/;
const NUMBERED = /^(\s*)\p{Nd}{1,3}[.)]\s+/u;

function toggleWrap(value, start, end, marker) {
  const len = marker.length;
  const wrapped =
    value.slice(start - len, start) === marker && value.slice(end, end + len) === marker;
  if (wrapped) {
    return {
      value: value.slice(0, start - len) + value.slice(start, end) + value.slice(end + len),
      selectionStart: start - len,
      selectionEnd: end - len,
    };
  }
  const selected = value.slice(start, end);
  // Keep surrounding spaces outside the marks so "**word **" never happens.
  const lead = selected.match(/^\s*/)[0];
  const trail = selected.slice(lead.length).match(/\s*$/)[0];
  const core = selected.slice(lead.length, selected.length - trail.length);
  const before = value.slice(0, start) + lead + marker;
  return {
    value: before + core + marker + trail + value.slice(end),
    selectionStart: before.length,
    selectionEnd: before.length + core.length,
  };
}

function toggleList(value, start, end, kind) {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = value.indexOf("\n", end > start && value[end - 1] === "\n" ? end - 1 : end);
  const lineEnd = nextBreak === -1 ? value.length : nextBreak;
  const lines = value.slice(lineStart, lineEnd).split("\n");
  const pattern = kind === "bullet" ? BULLET : NUMBERED;
  const content = lines.filter((line) => line.trim());
  const allMarked = content.length > 0 && content.every((line) => pattern.test(line));
  const markBlank = content.length === 0;

  let number = 0;
  const next = lines.map((line) => {
    const bare = line.replace(BULLET, "$1").replace(NUMBERED, "$1");
    if (allMarked) return bare;
    if (!line.trim() && !markBlank) return line;
    number += 1;
    const indent = bare.match(/^\s*/)[0];
    return `${indent}${kind === "bullet" ? "- " : `${number}. `}${bare.slice(indent.length)}`;
  });

  const block = next.join("\n");
  return {
    value: value.slice(0, lineStart) + block + value.slice(lineEnd),
    selectionStart: start === end ? lineStart + block.length : lineStart,
    selectionEnd: lineStart + block.length,
  };
}

const LIST_PREFIX = /^(\s*)([-*•]|(\p{Nd}{1,3})([.)]))\s+/u;

/**
 * New line inside a list item: continue the list ("- " / next number), or end it when the
 * current item is empty. Returns null when the caret line is not a list item.
 */
export function continueList(value, caret) {
  const text = String(value ?? "");
  const lineStart = text.lastIndexOf("\n", caret - 1) + 1;
  const line = text.slice(lineStart, caret);
  const match = line.match(LIST_PREFIX);
  if (!match) return null;

  if (!line.slice(match[0].length).trim()) {
    return { value: text.slice(0, lineStart) + text.slice(caret), caret: lineStart };
  }

  const [, indent, bullet, digits, punct] = match;
  const marker = !digits ? bullet : /^\d+$/.test(digits) ? `${Number(digits) + 1}${punct}` : `${digits}${punct}`;
  const insert = `\n${indent}${marker} `;
  return { value: text.slice(0, caret) + insert + text.slice(caret), caret: caret + insert.length };
}

/** @param {"bold"|"italic"|"strike"|"code"|"bullet"|"numbered"} kind */
export function applyComposerFormat(value, start, end, kind) {
  const text = String(value ?? "");
  const from = Math.min(start ?? text.length, end ?? text.length);
  const to = Math.max(start ?? text.length, end ?? text.length);
  if (kind === "bullet" || kind === "numbered") return toggleList(text, from, to, kind);
  return toggleWrap(text, from, to, WRAPPERS[kind]);
}
