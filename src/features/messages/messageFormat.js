/**
 * Lightweight chat formatting, parsed into a plain tree that is rendered as React elements
 * (never as HTML), so message text cannot inject markup.
 *
 * Blocks: paragraphs (line breaks kept), bullet lists ("- ", "* ", "• "), numbered lists ("1. ", "1) ").
 * Inline: `code`, **bold** / __bold__, *italic* / _italic_, ~~strike~~, and http(s)/www links.
 */

const BULLET_ITEM = /^\s*[-*•]\s+(.*)$/;
const NUMBERED_ITEM = /^\s*(\p{Nd}{1,3}[.)])\s+(.*)$/u;

const INLINE =
  /`([^`\n]+)`|\*\*(?=\S)(.+?)(?<=\S)\*\*|__(?=\S)(.+?)(?<=\S)__|~~(?=\S)(.+?)(?<=\S)~~|(?<![\w*])\*(?=[^\s*])(.+?)(?<=[^\s*])\*(?![\w*])|(?<![\w_])_(?=[^\s_])(.+?)(?<=[^\s_])_(?![\w_])|((?:https?:\/\/|www\.)[^\s<>]+)/g;

const TRAILING_PUNCTUATION = /[.,!?;:'")\]]$/;

const count = (text, char) => text.split(char).length - 1;

/** "https://a.com/x)." -> ["https://a.com/x", ")."]; keeps a ")" that closes a "(" in the URL. */
function splitTrailingPunctuation(raw) {
  let url = raw;
  let trail = "";
  while (TRAILING_PUNCTUATION.test(url)) {
    const last = url[url.length - 1];
    if (last === ")" && count(url, "(") >= count(url, ")")) break;
    trail = last + trail;
    url = url.slice(0, -1);
  }
  return [url, trail];
}

function safeHref(url) {
  try {
    const parsed = new URL(url.startsWith("www.") ? `https://${url}` : url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : null;
  } catch {
    return null;
  }
}

function pushText(nodes, text) {
  if (!text) return;
  if (typeof nodes[nodes.length - 1] === "string") nodes[nodes.length - 1] += text;
  else nodes.push(text);
}

/** Inline nodes: strings and `{ type: "code"|"bold"|"italic"|"strike", children }` / `{ type: "link", href, text }`. */
export function parseInline(text) {
  const source = String(text ?? "");
  const nodes = [];
  let cursor = 0;
  for (const match of source.matchAll(INLINE)) {
    pushText(nodes, source.slice(cursor, match.index));
    cursor = match.index + match[0].length;
    const [, code, bold, boldAlt, strike, italic, italicAlt, url] = match;

    if (code !== undefined) nodes.push({ type: "code", text: code });
    else if (bold !== undefined || boldAlt !== undefined)
      nodes.push({ type: "bold", children: parseInline(bold ?? boldAlt) });
    else if (strike !== undefined) nodes.push({ type: "strike", children: parseInline(strike) });
    else if (italic !== undefined || italicAlt !== undefined)
      nodes.push({ type: "italic", children: parseInline(italic ?? italicAlt) });
    else {
      const [link, trail] = splitTrailingPunctuation(url);
      const href = safeHref(link);
      if (href) nodes.push({ type: "link", href, text: link });
      else pushText(nodes, link);
      pushText(nodes, trail);
    }
  }
  pushText(nodes, source.slice(cursor));
  return nodes;
}

/**
 * Blocks: `{ type: "p", items }` (one item per line), `{ type: "ul", items }`, and
 * `{ type: "ol", items, markers }` where markers keep the number as typed ("2.", "৩)").
 */
export function parseMessage(text) {
  const blocks = [];
  for (const line of String(text ?? "").replace(/\r\n?/g, "\n").split("\n")) {
    const bullet = line.match(BULLET_ITEM);
    const numbered = bullet ? null : line.match(NUMBERED_ITEM);
    const type = bullet ? "ul" : numbered ? "ol" : "p";
    let block = blocks[blocks.length - 1];
    if (!block || block.type !== type) {
      block = numbered ? { type, items: [], markers: [] } : { type, items: [] };
      blocks.push(block);
    }
    if (numbered) block.markers.push(numbered[1]);
    block.items.push(parseInline(bullet ? bullet[1] : numbered ? numbered[2] : line));
  }
  return blocks;
}

const inlineText = (nodes) =>
  nodes
    .map((node) =>
      typeof node === "string" ? node : node.children ? inlineText(node.children) : node.text,
    )
    .join("");

/** One-line plain text without formatting marks, for conversation-list previews. */
export function stripFormatting(text) {
  return parseMessage(text)
    .flatMap((block) => block.items.map(inlineText))
    .filter((line) => line.trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
