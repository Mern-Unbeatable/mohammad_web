import { parseMessage } from "@/features/messages/messageFormat";

const TONES = {
  me: {
    code: "bg-white/20 text-white",
    link: "text-white underline decoration-white/70 hover:decoration-white",
  },
  them: {
    code: "bg-white/80 text-[#0F172A]",
    link: "text-primary underline decoration-primary/40 hover:decoration-primary",
  },
  plain: {
    code: "bg-[#F2F4F7] text-[#0F172A]",
    link: "text-primary underline decoration-primary/40 hover:decoration-primary",
  },
};

const renderInline = (nodes, tone) =>
  nodes.map((node, index) => {
    if (typeof node === "string") return node;
    switch (node.type) {
      case "code":
        return (
          <code
            key={index}
            className={`rounded px-1 py-0.5 font-mono text-[12px] ${tone.code}`}
          >
            {node.text}
          </code>
        );
      case "bold":
        return (
          <strong key={index} className="font-semibold">
            {renderInline(node.children, tone)}
          </strong>
        );
      case "italic":
        return <em key={index}>{renderInline(node.children, tone)}</em>;
      case "strike":
        return <s key={index}>{renderInline(node.children, tone)}</s>;
      case "link":
        return (
          <a
            key={index}
            href={node.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`underline-offset-2 [overflow-wrap:anywhere] ${tone.link}`}
          >
            {node.text}
          </a>
        );
      default:
        return null;
    }
  });

const isBlankLine = (line) =>
  line.every((node) => typeof node === "string" && !node.trim());

/** Lines grouped into paragraphs at blank lines; runs of blank lines count once. */
const splitParagraphs = (lines) =>
  lines
    .reduce(
      (groups, line) => {
        if (isBlankLine(line)) groups.push([]);
        else groups[groups.length - 1].push(line);
        return groups;
      },
      [[]],
    )
    .filter((group) => group.length);

const renderLines = (lines, palette) =>
  lines.map((line, lineIndex) => (
    <span key={lineIndex}>
      {lineIndex > 0 ? "\n" : null}
      {renderInline(line, palette)}
    </span>
  ));

/**
 * Chat message text with lightweight formatting (see `messageFormat.js`).
 * `paragraphs` turns blank lines into separate `<p>`s, so the parent's spacing
 * sets the gap instead of a full empty line.
 */
const FormattedMessage = ({ text, tone = "them", paragraphs = false }) => {
  const palette = TONES[tone] || TONES.them;
  return parseMessage(text).flatMap((block, index) => {
    if (block.type === "ul") {
      return (
        <ul key={index} className="list-disc space-y-0.5 pl-5">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="whitespace-pre-wrap pl-0.5">
              {renderInline(item, palette)}
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === "ol") {
      return (
        <ol key={index} className="space-y-0.5">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="flex gap-1.5">
              <span className="min-w-[1.25rem] shrink-0 tabular-nums opacity-80">
                {block.markers[itemIndex]}
              </span>
              <span className="min-w-0 flex-1 whitespace-pre-wrap">
                {renderInline(item, palette)}
              </span>
            </li>
          ))}
        </ol>
      );
    }
    if (paragraphs) {
      return splitParagraphs(block.items).map((lines, groupIndex) => (
        <p key={`${index}-${groupIndex}`} className="whitespace-pre-wrap">
          {renderLines(lines, palette)}
        </p>
      ));
    }
    return (
      <p key={index} className="whitespace-pre-wrap">
        {renderLines(block.items, palette)}
      </p>
    );
  });
};

export default FormattedMessage;
